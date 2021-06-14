FROM adoptopenjdk:11.0.11_9-jdk-hotspot
RUN apt update -y && \
  apt install -y maven git;

COPY ./.env /.env
COPY ./eRiXa.properties /eRiXa.properties
COPY ./start.sh /start.sh
RUN chmod u+x /start.sh

ENTRYPOINT "./start.sh" && /bin/bash