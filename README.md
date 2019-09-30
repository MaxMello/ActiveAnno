# ActiveAnno
ActiveAnno is a web-based, responsive, highly configurable open source document annotation tool.

<!-- TOC -->
- [Quick start](#quick-start)
- [Use cases](#use-cases)
- [API](#api)
- [Production setup](#production-setup)
- [Development setup](#development-setup)
- [Styling](#styling)
- [Backend](#backend)
- [Frontend](#frontend)
- [Roadmap](#roadmap)
- [Browser compatibility](#browser-compatibility)
- [Author](#author)
- [License](#license)

<!-- /TOC -->
## Quick start
Use `docker-compose` to start the application with frontend, backend and the database. Run the following command from the top
level directory of the project:
```
docker-compose -f ./deployments/local.docker-compose.yml up -d
```
By default, this will start 3 container: A MongoDB container, a Ktor backend service and an nginx server hosting a 
React application. Next, go to `localhost:3000` to open the web UI. You can modify the port by editing the `local.docker-compose.yml`
and changing the `activeannofrontend.ports` mapping. (Then, you also need to add the new URL to the `activeannobackend.CORS_HOSTS_LIST` env variable.)
#### Login
By default, the `local.docker-compose.yml` is configured for local run only, not for production purposes. Therefore, the authentication
mechanism is disabled so that any username will automatically generate a super user account. Once opening `localhost:3000`, you
will be redirected to `localhost:3000/login` and can provide any username you want (password can be empty / will be ignored).
If you want to instantly see an example project, chose the username `admin`. For this user, an existing project with a project
configuration as well as some example data is provided.

Login page on mobile

<img src="screenshots/login_xs_cropped.png" alt="Login" width="300"/>

#### Navigation / Usage
Overview page on desktop / tablet

<img src="screenshots/overview_md_cropped.png" alt="Overview Desktop" width="600"/> 

Overview page on mobile

<img src="screenshots/overview_xs_cropped.png" alt="Overview Mobile" width="300"/> 

* As a super user, you can see all areas of ActiveAnno. 

Manage page on desktop

<img src="screenshots/manage_md_cropped.png" alt="Manage Desktop" width="600"/>

* To get a feel about the types of projects that can be created, navigate to the `Manage` page and inspect the existing project or create a new one.
* After that, you can go to the `Annotate` page and annotate some documents. 


Annotate page on desktop / tablet (before annotating)

<img src="screenshots/annotate_md.png" alt="Annotate Desktop" width="600"/>

Annotate page on desktop / tablet (after annotating)

<img src="screenshots/annotate_selected_md.png" alt="Annotate Desktop selected" width="600"/> 

* When you are the annotator of a document, you won't be able to also be the curator. Therefore, 
for the example project, you won't be able to see any documents up for curation under the `Curate` page.
  * The example project has another user defined as a curator, names `testcurator`. 
  * Go to the User page and logout. Now, login with the username `testcurator`.

Curate page (Annotation result copied and modified)

<img src="screenshots/curate_sm.png" alt="Curate Tablet Portait" width="600"/> 

* The new user will now see the documents previously annotated under the Curate page (example project is configured 
to `ALWAYS_REQUIRE_CURATION`, this can be changed in the Manage section, so that no curator is necessary.)
* As a curator, you can either **accept** the annotation result of an annotator, **copy** that annotators result and change it, or just
annotate the document yourself.
  
## Use cases
- One-off projects (Create project, upload documents, annotate (and optionally curate) annotations and download results via UI)
- (Micro-)Service integration (Create project, push documents via REST interface, annotate (and optionally curate)), consume annotations via REST or send on finished via WebHooks
- Single user: One person is creator of project and uses the application to annotate the documents
- Multi user: Multiple annotators, optionally curators (or majority decision from annotators)
- Crowd sourcing: A lof of annotators with a few (or no) curators
- Algorithm only (future use case): Integrate multiple ML/NLP algorithms to annotate documents, build majorities through the application and curate differences with human in the loop (Active Learning)
- Multi user with algorithms (future use case): Treat ML/NLP algorithms as users, combine with annotators and curators to annotate documents and generate new training data for algorithms (Active Learning)

## API
Additionally to the endpoints of the backend used by the frontend, there are additional endpoints that are relevant, especially when
ActiveAnno is used in a microservice context. Here, the endpoints are documented together with screenshots from Postman as an example of how to call the API.
#### Importing documents into ActiveAnno
There are two ways to get documents to annotate into the application. Either create a One-off project and upload the documents inside the Manage UI,
or create a project for continuous annotation of streams of documents. For this, the Import API is available.
```
POST /api/v1/import
```
The endpoint is protected via `JWT` authentication and authorization. In a production setup, the user needs to have the role `activeanno_producer` (configurable via env variables).
Typical use cases would be another service pushing data to this endpoint, or pushing data manually via curl, Postman etc. For both cases a JWT with this role is required.
The endpoint accepts **all** json structures, json objects as well as json arrays of json objects. Therefore, it is even more important that only authorized users can push to that endpoint.
The application has no assumption about how the json objects are structured. For example, you could push a document of the following structure:
```json
{
  "comment": "some comment",
  "timestamp": 123456789000,
  "innerObject": {
     "innerKey": "some metadata"
  },
  "uniqueID": 1
}
```
This document will be assigned a unique ID and be stored in a mongoDB instance. If you want to annotate this document, you need to create a project that applies a filter such that
this document will be selected. Example filter for the document above
```json
{
  "operator": "eq",
  "key": "uniqueID",
  "value": 1
}
```
Now, any document with `unqiueID = 1` would be part of that project and will be shown to the annotators. You don't actually need to write that filter json yourself, it is possible to configure that
inside the manage UI. Under the hood, it is just a Mongo Query `{"uniqueID": {"$eq": 1}}`. The reason the filter json structure is not directly the mongo query is that we gain type safety by modeling
all allowed Mongo operations as classes in Kotlin. Also, the `operator` is used for polymorphic deserialization, making the transformation from JSON to the data structure inside the backend easy.

Screenshot Postman with POST to import endpoint - Authorization

<img src="screenshots/postman_import_1.png" alt="Postman import 1" width="600"/> 

Screenshot Postman with POST to import endpoint - POST body and response (201 Created)

<img src="screenshots/postman_import_2.png" alt="Postman import 2" width="600"/> 

In Postman, you need to set the Bearer Token to the Base64 encoded JWT. For testing purposes (with JWT verification disabled), go to [jwt.io](https://jwt.io) and create a JWT with the payload
```json
{
  "sub": "testproducer",
  "roles": [
      "activeanno_producer"
  ]
}
```
This will be enough to push to that endpoint (or you can disable role protection via enviroment variables all together).
#### Exporting documents and annotations
The other relevant API is for exporting documents with their created annotations. For this, there are three ways. You can download all documents with the annotations from the Manage UI, you can 
use the REST API or webhooks.
First, lets demonstrate the REST api.
```
GET /api/v1/export/config/{configID}            // configID, for example EXAMPLE_PROJECT_APP_REVIEWS
Optional get parameters:
includeUnfinished=true|false  // Include document that not yet have been fully annotated in the export
since=12345                   // UTC timestamp in millis, will include every document greater than or equal the timestamp (if includeUnfinished is true, will use the timestamp of the any existing annotation, if false, then from the officially chosen (by curator or algorithm) annotation 
documentIDs=ABC,DEF,GHI       // Ask for specific documents by their unqiue mongo ID. Comma separated string.
```
The authentication for this endpoint is configurable by the project. There is `None`, which means anybody can call this endpoint if they know the ID of the project. Then there is HTTP Basic Auth,
where a username and password can be specified in the project config. The last one is the JWT role, which will work the same as above for the import, but with role `activeanno_consumer` by default.

<img src="screenshots/postman_export_1.png" alt="Postman export 1" width="600"/> 

The full export result is stored under [example_export.json](./documentation/example_export.json). 

For **webhook** exports, we need to define the WebHook configuration inside the Manage UI. There, you define a list of URLs where any new finalized document annotation result will be posted to.
For this, you need to define a URL, a behavior how to handle a failure (retry on next finished or ignore), the export format and the kind of authentication required for the web hook. At 
the moment, no authentication and HTTP Basic Auth are supported, though an OAuth2 approach with clientID and clientSecret as well as token URL is planned to be supported in the future.

## Production setup
For an actual production setup, some more steps are required. The first and biggest one is that an external Authentication service
is necessary, if proper security is required. ActiveAnno uses `JWT` to authenticate and authorize users. Right now, no
built-in user authentication is provided, as ActiveAnno is supposed to be used in a (Micro-)Service context, where authentication
needs to work over multiple distributed services. 
#### Authentication service integration
* The authentication service needs an HTTP POST endpoint (which can be configured in the backend via an environment variable `JWT_VALIDATION_URL`). 
The request to the service will contain the header `Authorization: Bearer <Base64 encoded JWT>` and needs to return HTTP Status 200 
if the token is still valid (anything else otherwise, returning 401 would be appropriate)
* The service also needs an HTTP POST endpoint to generate the JWT. The URL can be set via an environment variable in the 
frontend application `REACT_APP_AUTHENTICATION_SERVICE_URL`. The body of the request will be a JSON with the keys `username` 
and `password`. Result should be a JSON with the key `token` and the value the already Base64 encoded JWT.
  * Sadly, the required format for the responses is not configurable. If your existing Authentication service does not match that 
  structure, the best thing would be to clone the project and adjust the relevant parts where the token is received from the
  authentication service.
* The frontend application will request a username/password if no JWT is stored in the frontend. The values will be sent to 
the authentication service and the JWT will be stored in the frontend. The token will be sent to the backend with each request, 
being validated by sending it to the authentication service. If the token expires, the backend will return a 401 and the
user will be logged out and asked to provide username and password again.
* Very important: By default, the backend environment variable `JWT_VALIDATION_ACCEPT_ALL_TOKENS` is set to true. Set this to `false` for a production scenario.
* To enable interoperability with existing authentication services, the backend can configure:
   * The JWT key for username (what is used for authentication and unique identification of a user): `JWT_USER_IDENTIFIER_KEY`
   * The JWT key for a display name for the user `JWT_USER_NAME` (if not available, can be the same as `JWT_USER_IDENTIFIER_KEY`)
   * The JWT key under which an array of roles can be found `JWT_ROLES_KEY` (if no role checks should be done, can be set `JWT_USE_ROLE_PROTECTION` to `false`)
   * The string value inside the array of roles for identifying a user 
        * as a basic user (`JWT_ROLE_USER`, can be annotator or curator), 
        * manager of projects (`JWT_ROLE_MANAGER`),
        * admin over all projects (`JWT_ROLE_ADMIN`), 
        * a producer of new documents (`JWT_ROLE_PRODUCER`, can access the import interface, should be given to JWT of another service if that service wants to push its data to ActiveAnno),
        * a consumer of documents (`JWT_ROLE_CONSUMER`, can call the REST interface. Only necessary if the REST interface should be authenticated)
        * or finally a user with global read-only access to all documents over all projects (`JWT_ROLE_GLOBAL_SEARCH`, normally search is restricted to the annotators, curators and managers of a project).
   * If your setup requires less fine grained control over roles, you could just have a single role value and set every role mentioned above to that value.
   
## Development setup
When developing inside the project, you probably want to run the MongoDB in a container (use `./deployments/dev.docker-compose.yml`), run the frontend via `npm run start` and the backend via `./gradlew run`. Especially 
for the backend project, using IntelliJ to run the Ktor application (as well as the docker-compose file) makes things a lot easier. 

To rebuild the backend docker image, first execute `./gradlew build` and then `docker build -t activeannobackend/v1 .`. This will then use the newly generated build files.

#### Re-building the react application
As a web application in the browser actually has no environment variables, the environment variables used in the project are set at build time, not at deploy time.
Therefore, if you want to change the default values of the environment variables, you need to rebuild the frontend yourself with the proper environment variable values.
The web app has the following environment variables:
```
REACT_APP_DATABASE=activeannodb
REACT_APP_GENERATE_SUPERUSER_ON_LOGIN=true
REACT_APP_AUTHENTICATION_SERVICE_URL=
REACT_APP_ACTIVE_ANNO_SERVICE_URL=http://localhost:8080/api/v1
```
These are the default values. For production purposes, you would want to set `REACT_APP_GENERATE_SUPERUSER_ON_LOGIN` to false, then provide the URL to the
authentication service by setting `REACT_APP_AUTHENTICATION_SERVICE_URL`. This is the endpoint that should return a JWT token for a username and password.
The `REACT_APP_ACTIVE_ANNO_SERVICE_URL` value only needs to be changed if other parts of the docker-compose file about how the backend is exposed are changed.
The `REACT_APP_DATABASE` name is the name of the web database and probably doesn't need to be changed.

To set the environment variables, edit the `./frontend/Dockerfile` and add `ENV key=value` entries. Then rebuild the image locally. When you rebuild the project
locally, you will also need to change the `image` reference inside the `docker-compose` file to the local rather than the remote image.

#### Configuring the backend service
Additionally to the environment variables related the authentication mentioned above, there are further ones that can be set inside the docker-compose file. Here is an overview:
```
PORT: 8080
HTTPS_REDIRECT: "false"
MONGO_CONNECTION_STRING: mongodb://user:password@activeannomongo:27017
MONGO_DATABASE_NAME: activeanno
LOGGING_LEVEL: DEBUG
GENERATE_EXAMPLE_PROJECT: "true"
CORS_HOSTS_LIST: 'localhost,localhost:3000,0.0.0.0,0.0.0.0:3000'
```
These are the default values. For production purposes, you would probably set `GENERATE_EXAMPLE_PROJECT` to false, increase the logging level, enable `HTTPS_REDIRECT`, and
potentially connect the service to an existing MongoDB. The CORS list might not always be necessary, but in the local deploy scenario,
the URLs of the web page (`localhost:3000`) and the backend (`localhost:8080`) differ and thus CORS is necessary.

## Styling
Actually, there are additional environment variables in the frontend for colorizing the web app.
```
REACT_APP_COLOR_PRIMARY_MAIN=#9A334F
REACT_APP_COLOR_PRIMARY_LIGHT=#C1607A
REACT_APP_COLOR_PRIMARY_MEDIUM_DARK=#74132D
REACT_APP_COLOR_PRIMARY_DARK=#4D0015
REACT_APP_COLOR_PRIMARY_CONTRAST_TEXT=#ffffff

REACT_APP_COLOR_SECONDARY_MAIN=#423075
REACT_APP_COLOR_SECONDARY_LIGHT=#625192
REACT_APP_COLOR_SECONDARY_MEDIUM_DARK=#281758
REACT_APP_COLOR_SECONDARY_DARK=#14063A
REACT_APP_COLOR_SECONDARY_CONTRAST_TEXT=#ffffff

REACT_APP_COLOR_SUCCESS_MAIN=#85BC5E
```
With this, you can customize the UI to fit your UI requirements. The primary color is used for the header, some buttons etc.
The secondary color is used to contrast the primary color, for example for buttons and icons where the background is in the primary color.
The contrast text color is just the color for text such that it is readable when the background of that text is in the primary / secondary color.
Lastly, there is the success color which is normally a kind of green.

## Backend
The backend is written in Kotlin using the Ktor framework.
The Dokka (JavaDoc equivalent) can be found on [Github pages](https://maxmello.github.io/ActiveAnno/activeannoservice/).
To update the Dokka documentation, execute `./gradlew dokka`. This will save the markdown files directly in the /docs path. Then commit the changes
inside the /docs folder and push to github to update the Github pages site.

### Project structure
The backend code is structured in the following packages
- `/api` contains all the routing endpoints
- `/application` contains the `Application` class, entry point to the application as well as the access to the application config
- `/common` contains utility code as well as the security code for JWT verification
- `/config` contains the `ProjectConfig`, different view data classes on it and the DAO for it
- `/document` contains the `Document` class with its DAO, and the models for storing the `AnnotationResult` for the documents
- `/user` contains the `User` model and DAO as well as the `Message` model and DAO for communication between users

## Frontend
The frontend is written in Javascript/ES6, React and Redux.

## Roadmap
ActiveAnno is under active development.

### New pages / views
* Search page: Find documents (annotated and not annotated) for some project + additional parameters (full text search, time range, etc.)
* Admin page: Global access to all configurations, users, documents. Might also move some application config that could be changed at runtime from the application.conf to an editable config in the UI.
* Messages: In-app communication between annotators and curators
  * Annotators can escalate a document straight to the curator and add a message (Ask what to do here, explain why they could not annotate themselves)
  * Curators can give feedback to annotators, e.g. if something was annotated incorrect, attached to a specific document as context

### Big features
* Span-level annotations: Additionally to document-level annotations, enable annotations for specifics parts of a document text. Also allow for hybrid annotations which can be defined either on document- or span-level.
* Hierarchical tag input: Right now, predefined tag inputs (like Sentiment scale, categories etc.) only allow one layer of depth. Hierarchical tag input would allow to specify a tag in a hierarchy like (Country > State > City)
* Machine Learning integration
  * Include predictions for labels as annotation results on the same level as if they were users (allowing for majority decision between algorithms and humans or multiple algorithms, curation of algorithms)
  * Show predictions for labels inside the UI
  * Pre-select buttons based on predictions inside the UI

### Smaller features
* User error protection: Configurable minimum required time to spent per annotation etc.
* Usability
  * Configurable UI preferences (font size for document texts)
  * Keyboard shortcuts (possibly configurable)
  * Swipe touch interactions (for limited cases, like spam / no spam)
  * Alert before logout / leaving the site if not all results are saved on server
* Easy setup of project pipelines. For example: Same kinds of documents, first get annotated for spam / no spam, and only in the no spam case, another project configuration will trigger and ask for additional labels like sentiment etc.
* Language based on browser + switch language button
* Better curation view with disagreement highlighting
* Performance optimization for queries, especially if the DB grows large (add indices)


## Browser compatibility 
WebAnno was mainly developed with Firefox (v69), but it was also tested in an up-to-date version of Chrome and Safari.


## Contributing

Please submit any issues as Github issues in this repository. You are invited to submit merge requests to contribute to this project.

## Author

* **Max Wiechmann** [Twitter](https://twitter.com/maxmello)

## License
MIT
