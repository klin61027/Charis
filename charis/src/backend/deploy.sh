#!/bin/bash
set -e

REGION="us-east-1"
REPO="charish-api"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
IMAGE_URI="$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$REPO:latest"

echo ">>> Creating ECR repo (skip if exists)..."
aws ecr create-repository --repository-name $REPO --region $REGION 2>/dev/null || true

echo ">>> Logging into ECR..."
aws ecr get-login-password --region $REGION | \
  docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"

echo ">>> Building image..."
docker build -t $REPO .

echo ">>> Pushing to ECR..."
docker tag $REPO:latest $IMAGE_URI
docker push $IMAGE_URI

echo ""
echo "✅ Done! Image URI:"
echo "$IMAGE_URI"
echo ""
echo "Next: Go to AWS Console → App Runner → Create service → Container registry → use the URI above"
