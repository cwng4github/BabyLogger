# ForEunice Baby Tracker - S3 Distribution Package

This package contains the static files ready for deployment to AWS S3.

## Quick Deploy to AWS S3

### 1. Create S3 Bucket

```bash
aws s3 mb s3://your-baby-tracker-bucket
```

### 2. Upload Files

```bash
aws s3 sync . s3://your-baby-tracker-bucket --exclude "README.md" --exclude "DEPLOYMENT_INFO.txt"
```

### 3. Enable Static Website Hosting

```bash
aws s3 website s3://your-baby-tracker-bucket --index-document index.html --error-document error.html
```

### 4. Set Bucket Policy

Create a file named `bucket-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-baby-tracker-bucket/*"
    }
  ]
}
```

Apply the policy:

```bash
aws s3api put-bucket-policy --bucket your-baby-tracker-bucket --policy file://bucket-policy.json
```

### 5. Access Your Site

Your site will be available at:
```
http://your-baby-tracker-bucket.s3-website-[region].amazonaws.com
```

## Optional: CloudFront Setup

For better performance and HTTPS support:

1. Create a CloudFront distribution
2. Set the S3 bucket as the origin
3. Configure custom domain (optional)
4. Enable HTTPS with ACM certificate

## Features

- ✅ Fully static - no server required
- ✅ All data stored in browser localStorage
- ✅ Works offline after first load
- ✅ Mobile-optimized design
- ✅ Age-based baby care templates (0-12 months)
- ✅ CSV export functionality

## Browser Compatibility

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Mobile browsers: ✅

## Data Storage

All data is stored locally in the browser using localStorage:
- Baby birth date
- Reference feeding patterns
- Historical records
- Forecast predictions

**Important**: Data is device-specific and will be lost if browser data is cleared.

## Support

For issues or questions, refer to the main project repository.
