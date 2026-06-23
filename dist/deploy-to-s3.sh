#!/bin/bash

# AWS S3 Deployment Script
# Usage: ./deploy-to-s3.sh your-bucket-name [aws-region]

if [ -z "$1" ]; then
  echo "❌ Error: Bucket name is required"
  echo "Usage: ./deploy-to-s3.sh your-bucket-name [aws-region]"
  exit 1
fi

BUCKET_NAME=$1
REGION=${2:-us-east-1}

echo "🚀 Deploying to S3 bucket: $BUCKET_NAME"
echo "📍 Region: $REGION"

# Check if bucket exists
if aws s3 ls "s3://$BUCKET_NAME" 2>&1 | grep -q 'NoSuchBucket'; then
  echo "📦 Creating bucket..."
  aws s3 mb "s3://$BUCKET_NAME" --region "$REGION"
fi

# Upload files
echo "📤 Uploading files..."
aws s3 sync . "s3://$BUCKET_NAME" \
  --exclude "*.sh" \
  --exclude "*.md" \
  --exclude "*.txt" \
  --exclude "bucket-policy.json" \
  --delete

# Enable static website hosting
echo "🌐 Enabling static website hosting..."
aws s3 website "s3://$BUCKET_NAME" \
  --index-document index.html \
  --error-document error.html

# Update bucket policy
echo "🔐 Updating bucket policy..."
cat > /tmp/bucket-policy.json << POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
    }
  ]
}
POLICY

aws s3api put-bucket-policy \
  --bucket "$BUCKET_NAME" \
  --policy file:///tmp/bucket-policy.json

rm /tmp/bucket-policy.json

# Get website URL
WEBSITE_URL="http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"

echo ""
echo "✅ Deployment complete!"
echo "🌍 Website URL: $WEBSITE_URL"
echo ""
echo "📝 Next steps:"
echo "   1. Visit the URL above to test your site"
echo "   2. (Optional) Set up CloudFront for HTTPS and better performance"
echo "   3. (Optional) Configure a custom domain"
