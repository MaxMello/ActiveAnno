"""djangoauth URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import os
import time
from pathlib import Path
import shutil
import fasttext
from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['sub'] = user.username
        token['name'] = user.name
        token['roles'] = user.roles.split(",")

        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data['refresh'] = str(refresh)
        data['token'] = str(refresh.access_token)
        del data['access']
        return data


class MyTokenObtainPairView(jwt_views.TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class VerifyFromHeaderView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        content = {
            "message": "Your token is valid"
        }
        return Response(content, status=200)


baseDir = str(Path(__file__).resolve().parent.parent)
dataDir = str(os.getenv("DATA_PATH", baseDir))


class PredictOffensEval(APIView):
    """
    For demo purposes, this service contains a fasttext wrapper for the OffensEval project
    This is the predict endpoint
    """
    permission_classes = ()

    def post(self, request):
        documents = request.data["documents"]
        version = request.data["modelVersion"]
        predict_data = list(map(lambda doc: doc["text"].lower(), documents))
        classifier = fasttext.load_model(dataDir + "/" + version + ".bin")
        predicted_labels, predicted_probabilities = classifier.predict(predict_data, 1, 0)
        response = list()
        for i, d in enumerate(documents):
            doc_prediction = {
                "text": d["text"],
                "id": d["id"]
            }
            predictions = []
            for j, l in enumerate(predicted_labels[i]):
                predictions.append(
                    {
                        "value": l.replace("__label__", ""),
                        "probability": round(predicted_probabilities[i][j].item(), 3)
                    }
                )
            doc_prediction["predictions"] = predictions
            response.append(doc_prediction)
        print("Predict result", response)
        return Response(response, status=200)


class TrainOffensEval(APIView):
    """
       For demo purposes, this service contains a fasttext wrapper for the OffensEval project
       This is the train endpoint
    """
    permission_classes = ()

    def post(self, request):
        data = request.data["data"]
        version = int(time.time())
        return Response(train_model(data, version), status=200)


def train_model(data, version):
    update_data = []
    for tweet in data:
        update_data.append("__label__" + tweet["labels"][0] + " " + tweet["text"].lower())
    file_name = dataDir + "/" + str(version) + "_train.txt"
    pretrained_data_file = baseDir + "/offenseval_train_lower.txt"
    with open(file_name, 'a') as f:
        with open(pretrained_data_file, 'r') as pdf:
            shutil.copyfileobj(pdf, f)
        for text in update_data:
            f.write(text + "\n")
    classifier = fasttext.train_supervised(file_name,
                                           loss="softmax",
                                           lr=0.1,
                                           dim=100,
                                           epoch=10,
                                           wordNgrams=2)
    classifier.save_model(dataDir + "/" + str(version) + ".bin")
    response = {
        "version": version,
        "trainNumberOfExamples": 1000 + len(data),
        "testNumberOfExamples": 0
    }
    print(str(time.time() - version) + " seconds for training version " + str(version))
    return response


initial_model_path = dataDir + "/1.bin"
if not os.path.exists(initial_model_path):
    print("Creating initial model 1")
    print("Created: ", str(train_model([], 1)))


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verifyToken/', jwt_views.TokenVerifyView.as_view(), name='token_verify'),
    path('api/token/verify/', VerifyFromHeaderView.as_view(), name='token_verify_header'),
    path('ml/offenseval/predict', PredictOffensEval.as_view(), name='predict_offens_eval'),
    path('ml/offenseval/train', TrainOffensEval.as_view(), name='train_offens_eval'),
]
