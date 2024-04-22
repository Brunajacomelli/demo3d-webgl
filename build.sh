#!/bin/bash
docker buildx build --platform linux/arm64  -t ferlzc/agro-demo -f Dockerfile.nginx .

docker push ferlzc/agro-demo