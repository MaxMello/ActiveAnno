FROM adoptopenjdk/openjdk10 AS jdkBuilder

RUN $JAVA_HOME/bin/jlink \
    --module-path /opt/jdk/jmods \
    --verbose \
    --add-modules java.base,java.se.ee \
    --output /opt/jdk-minimal \
    --compress 2 \
    --no-header-files

# final image
FROM debian:9-slim
COPY --from=jdkBuilder /opt/jdk-minimal /opt/jdk-minimal

ENV JAVA_HOME=/opt/jdk-minimal
COPY ./build/libs/activeannoservice.jar /opt/

# https://stackoverflow.com/questions/54292282/clarification-of-meaning-new-jvm-memory-parameters-initialrampercentage-and-minr
# https://medium.com/adorsys/jvm-memory-settings-in-a-container-environment-64b0840e1d9e
CMD $JAVA_HOME/bin/java -server -XX:MaxRAMPercentage=75.0 -XX:MinRAMPercentage=75.0 -XX:InitialRAMPercentage=70.0 -jar /opt/activeannoservice.jar