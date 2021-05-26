git clone https://github.com/ere-health/ere-ps-app/
#rm -R -f /ere-ps-app/src/main/resources/META-INF/resources/frontend
#ln -s /v/frontend/app /ere-ps-app/src/main/resources/META-INF/resources/frontend/app
#ln -s /v/pdf /ere-ps-app/target/watch-pdf
cd /ere-ps-app
mvn quarkus:dev
