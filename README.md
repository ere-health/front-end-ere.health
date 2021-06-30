# front-end-ere.health

To run the local server :
* Ensure to have a recent stable version of nodeJS (14.x)
* run `npm install`
* Open a terminal and run the command `node srv/src/Server.mjs`
* Open a browser and go to : http://localhost:8888

To install node on windows : https://nodejs.org/en/download/  
To install node on linux   : https://nodejs.org/en/download/package-manager/


# Run the backend with docker
#### Build the image from the docker folder
```sh
docker build --pull --rm -f "docker\Dockerfile" -t frontendere:latest "docker"
```

#### Run the container
```sh
docker run --rm --name backend -p 8080:8080 frontendere 
```
When you see the Ascii logo, then the Quarkus backend is configured.
```sh
__  ____  __  _____   ___  __ ____  ______ 
 --/ __ \/ / / / _ | / _ \/ //_/ / / / __/
 -/ /_/ / /_/ / __ |/ , _/ ,< / /_/ /\ \
--\___\_\____/_/ |_/_/|_/_/|_|\____/___/
2021-05-26 04:53:31,054 INFO  [ca.uhn.fhi.uti.VersionUtil] (Quarkus Main Thread) HAPI FHIR version 5.3.0 - Rev 919c1dbddc
2021-05-26 04:53:31,055 INFO  [ca.uhn.fhi.con.FhirContext] (Quarkus Main Thread) Creating new FHIR context for FHIR version [R4]
2021-05-26 04:53:31,439 INFO  [io.und.websockets] (Quarkus Main Thread) UT026003: Adding annotated server endpoint class health.ere.ps.websocket.Websocket for path /websocket
2021-05-26 04:53:31,546 INFO  [hea.ere.ps.ser.fs.DirectoryWatcher] (Quarkus Main Thread) Creating directory for watching pdf muster 16 forms: watch-pdf
2021-05-26 04:53:31,636 INFO  [io.quarkus] (Quarkus Main Thread) ere-ps-app 1.0.0-SNAPSHOT on JVM (powered by Quarkus 1.13.1.Final) started in 2.742s. Listening on: http://0.0.0.0:8080
2021-05-26 04:53:31,637 INFO  [io.quarkus] (Quarkus Main Thread) Profile dev activated. Live Coding activated.
2021-05-26 04:53:31,637 INFO  [io.quarkus] (Quarkus Main Thread) Installed features: [cdi, rest-client, resteasy, resteasy-jsonb, scheduler, servlet, websockets]
```

#### Copy the frontend
```sh
docker cp ./app backend:/ere-ps-app/src/main/resources/META-INF/resources/frontend/app
```

#### Run the browser
Open the website on http://localhost:8080/frontend/app/src/index.html

#### Copy PDF
Just copy a valid PDF to the watch folder

```sh
docker cp {path-to-pdf-filder}/{pdf-file} backend:/ere-ps-app/target/watch-pdf/

#Ex: 

docker cp ./docker/cgm-z1-manuel-blechschmidt.pdf backend:/ere-ps-app/target/watch-pdf/
```

# Run the current modifications on the FE without docker
Assuming you have the cloned repositories front-end-ere.health and ere-ps-app in the same folder, go in ere-ps-app and run:
```sh
cp -r ../front-end-ere.health/* src/main/resources/META-INF/resources/frontend/ && mvn quarkus:dev
```
Then simply open the website on http://localhost:8080/frontend/app/src/index.html

# Selenium
You can use a selenium script to create a new prescription filled automatically, it resides in the folder selenium
