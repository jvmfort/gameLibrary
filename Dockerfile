# Estágio de Build
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# Copia os arquivos do backend
COPY gamelibray-backend/ .

# Garante permissão e compila
RUN chmod +x mvnw && ./mvnw clean package -DskipTests

# Estágio de Execução
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]