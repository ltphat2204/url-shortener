FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src/ ./src/

RUN mvn clean package -DskipTests

FROM openjdk:21-jdk-slim AS production
WORKDIR /app

COPY --from=build /app/target/UserService-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8083

ENTRYPOINT ["java", "-jar", "app.jar"]