# ActiveAnno
ActiveAnno is a web-based, responsive, highly configurable open source document annotation tool.
## Quick start
Use `docker-compose` to start the application with frontend, backend and the database. Run the following command from the top
level directory of the project:
```
docker-compose -f ./deployments/local.docker-compose.yml up -d
```
By default, this will start 3 container: A MongoDB container, a Ktor backend service and an nginx server hosting a 
React application. Next, go to `localhost:3000` to open the web UI. You can modify the port by editing the `local.docker-compose.yml`
and changing the `activeannofrontend.ports` mapping.
#### Login
By default, the `local.docker-compose.yml` is configured for local run only, not for production purposes. Therefore, the authentication
mechanism is disabled so that any username will automatically generate a super user account. Once opening `localhost:3000`, you
will be redirected to `localhost:3000/login` and can provide any username you want (password can be empty / will be ignored).
If you want to instantly see an example project, chose the username `admin`. For this user, an existing project with a project
configuration as well as some example data is provided.

<img src="screenshots/login_xs.png" alt="Login" height="500"/>
Login page on mobile

#### Navigation / Usage
<img src="screenshots/overview_md.png" alt="Overview Desktop" height="500"/> 
Overview page on desktop / tablet
<img src="screenshots/overview_xs.png" alt="Overview Mobile " height="500"/> 
Overview page on mobile
* As a super user, you can see all areas of ActiveAnno. 
<img src="screenshots/manage_md.png" alt="Manage Desktop" height="500"/> 
* To get a feel about the types of projects that can be created, navigate to the `Manage` page and inspect the existing project or create a new one.
* After that, you can go to the `Annotate` page and annotate some documents. 
<img src="screenshots/annotate_md.png" alt="Annotate Desktop" height="500"/> 
Annotate page on desktop / tablet (nothing selected)
<img src="screenshots/annotate_selected_md.png" alt="Annotate Desktop selected" height="500"/> 
Annotate page on desktop / tablet (selected)
* When you are the annotator of a document, you won't be able to also be the curator. Therefore, 
for the example project, you won't be able to see any documents up for curation under the `Curate` page.
  * To be able to see the curate page content, go to `Manage` > `Edit project` and under the `Basic properties` section,
  add another username to the list of curators (just chose any name). Save the project.
  * Go to the User page and logout. Now, login with the previously set username.
  * The new user will now see the documents previously annotated under the `Curate` page. This is, because the example project
  is configured to `ALWAYS_REQUIRE_CURATION`. This can be changed in the `Manage` section as well, so that no curator is necessary.
  
# Use cases
- One-off projects (Create project, upload documents, annotate (and optionally curate) annotations and download results via UI)
- (Micro-)Service integration (Create project, push documents via REST interface, annotate (and optionally curate)), consume annotations via REST or send on finished via WebHooks
- Single user: One person is creator of project and uses the application to annotate the documents
- Multi user: Multiple annotators, optionally curators (or majority decision from annotators)
- Crowd sourcing: A lof of annotators with a few (or no) curators
- Algorithm only (future use case): Integrate multiple ML/NLP algorithms to annotate documents, build majorities through the application and curate differences with human in the loop (Active Learning)
- Multi user with algorithms: Treat ML/NLP algorithms as users, combine with annotators and curators to annotate documents and generate new training data for algorithms (Active Learning)


## Production setup
For an actual production setup, some more steps are required. The first and biggest one is that an external Authentication Service
is necessary, if proper security is required. ActiveAnno uses `JWT` to authenticate and authorize users. Right now, no
built-in user authentication is provided, as ActiveAnno is supposed to be uses in a (Micro-)Service context, where authentication
needs to work over multiple distributed services. 
#### Authentication service integration
* The authentication service needs an HTTP POST endpoint (which can be configured in the backend via an environment variable `JWT_VALIDATION_URL`). 
The request to the service will contain the header `Authorization: Bearer <Base64 encoded JWT>` and needs to return HTTP Status 200 
if the token is still valid (anything else otherwise, returning 401 would be appropriate)
* The service also needs an HTTP POST endpoint to generate the JWT. The URL can be set via an environment variable in the 
frontend application `REACT_APP_AUTHENTICATION_SERVICE_URL`. The body of the request will be a JSON with the keys `username` 
and `password`. Result should be a JSON with the key `token` and the value the already Base64 encoded JWT.
  * Sadly, the required format for the responses is not configurable. If your existing Authentication Service does not match that 
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

To rebuild the backend docker image, first execute `./gradlew build` and then `docker build -t activeannoservice/v1 .`. This will then use the newly generated build files.

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
```
These are the default values. For production purposes, you would probably set `GENERATE_EXAMPLE_PROJECT` to false, increase the logging level, enable `HTTPS_REDIRECT`, and
potentially connect the service to an existing MongoDB.

## Styling the application
Actually, there are additional environment variables for colorizing the web app.
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
With this, you can customize the UI to fit your corporate design. The primary color is used for the header, some buttons etc.
The secondary color is used to contrast the primary color, for example for buttons and icons where the background is in the primary color.
The contrast text color is just the color for text such that it is readable when the background of that text is in the primary / secondary color.
Lastly, there is the success color which is normally a kind of green.


# Licence
MIT