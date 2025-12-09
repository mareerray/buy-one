#!/usr/bin/env bash
set -e
trap "echo 'Stopping all services...'; kill 0" EXIT

wait_for_http() {
  local url=$1
  local name=$2
  echo "Waiting for $name at $url ..."
  for i in {1..60}; do
    if curl -k -sSf "$url" >/dev/null 2>&1; then
      echo "$name is up."
      return 0
    fi
    sleep 1
  done
  echo "ERROR: $name did not start in time."
  return 1
}

start_service() {
  local service_dir=$1
  echo "Starting $service_dir ..."
  cd "$service_dir"
  ./mvnw spring-boot:run &
  cd - >/dev/null
}

cd backend

echo "discovery-service version: $(cd discovery-service && ./mvnw help:evaluate -Dexpression=project.version -q -DforceStdout)"
echo "gateway-service version:   $(cd gateway-service   && ./mvnw help:evaluate -Dexpression=project.version -q -DforceStdout)"
echo "media-service version:     $(cd media-service     && ./mvnw help:evaluate -Dexpression=project.version -q -DforceStdout)"
echo "product-service version:   $(cd product-service   && ./mvnw help:evaluate -Dexpression=project.version -q -DforceStdout)"
echo "user-service version:      $(cd user-service      && ./mvnw help:evaluate -Dexpression=project.version -q -DforceStdout)"

echo "============================"

# 1. discovery-service :8761
start_service discovery-service
wait_for_http "http://localhost:8761" "discovery-service" || exit 1

# 2. gateway-service :8080
start_service gateway-service
wait_for_http "https://localhost:8080/actuator/health" "gateway-service" || exit 1

# 3. user-service :8456
start_service user-service
wait_for_http "http://localhost:8456/actuator/health" "user-service" || exit 1

# 4. product-service :8567
start_service product-service
wait_for_http "http://localhost:8567/actuator/health" "product-service" || exit 1

# 5. media-service :8678
start_service media-service
wait_for_http "http://localhost:8678/actuator/health" "media-service" || \
  echo "media-service HTTP not healthy yet (maybe waiting for Kafka)."

cd ..

wait

# chmod +x start-backend.sh && ./start-backend.sh