./gradlew clean
./gradlew build
echo "BUILD finished"
docker build -t maxmello/activeannoservice:2.0 .
echo "DOCKER BUILD FINISHED"
echo "Can redeploy via docker-compose now!"