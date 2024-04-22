#!/bin/bash

docker buildx build --platform linux/arm64 -t ferlzc/weston-vivante -f Dockerfile.weston .

docker buildx build --platform linux/arm64 -t ferlzc/demo-cog -f Dockerfile.cog .

docker push ferlzc/weston-vivante
docker push ferlzc/demo-cog
