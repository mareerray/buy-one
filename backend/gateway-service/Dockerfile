FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy built JAR from target/
COPY target/*.jar app.jar

# Expose port (docker-compose overrides with SERVER_PORT)
EXPOSE 8080

# Use your existing start.sh + docker profile
ENTRYPOINT ["sh", "./docker-start.sh"]
