#!/bin/bash

npm run build

docker buildx build --platform linux/arm64  -t ferlzc/agro-demo -f Dockerfile.nginx .

docker push ferlzc/agro-demo