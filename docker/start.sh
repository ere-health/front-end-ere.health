git clone https://github.com/ere-health/ere-ps-app/ /ere-ps-app
#rm -R -f /ere-ps-app/src/main/resources/META-INF/resources/frontend
#ln -s /v/frontend/app /ere-ps-app/src/main/resources/META-INF/resources/frontend/app
#ln -s /v/pdf /ere-ps-app/target/watch-pdf
cd /ere-ps-app
#git checkout -b ERE-348-Erixa-Stage-I origin/ERE-348-Erixa-Stage-I
#git checkout -b Medios-Demo-17-06 origin/Medios-Demo-17-06
mv -f /eRiXa.properties /ere-ps-app/src/main/resources/eRiXa.properties
mv /.env /ere-ps-app/.env
mkdir erixa-hotfolder
chmod 777 erixa-hotfolder
set QUARKUS_PROFILE=dev
mvn quarkus:dev
