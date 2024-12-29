# VoidBox Deployment Guide

## Prerequisites

1. Node.js and npm installed
2. Git repository set up
3. Vercel account created

## GitHub Setup

1. Create a GitHub repository:
```bash
# Initialize git (if not already done)
git init

# Add GitHub remote
git remote add github https://github.com/YOUR_USERNAME/voidbox.git

# Push code
git push -u github main
```

## Vercel Deployment

### First-Time Setup

1. Install Vercel CLI:
```bash
sudo npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Initial deployment:
```bash
vercel
```

This will:
- Link your GitHub repository
- Set up environment variables
- Create production deployment

### Environment Variables

Make sure these are set in Vercel:
```
ADMIN_PASSWORD=your_admin_password
WEBHOOK_URL=your_webhook_url
EMAIL_WEBHOOK_URL=your_email_webhook_url
```

### Vercel Configuration

The `vercel.json` file configures:
1. Node.js server
2. Static file serving
3. API routes
4. Build settings

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    },
    {
      "src": "public/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/images/(.*)",
      "dest": "/public/images/$1"
    },
    {
      "src": "/css/(.*)",
      "dest": "/public/css/$1"
    },
    {
      "src": "/js/(.*)",
      "dest": "/public/js/$1"
    },
    {
      "handle": "filesystem"
    },
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/public/index.html"
    }
  ]
}
```

### Subsequent Deployments

After initial setup, you can deploy:
1. Automatically via GitHub push
2. Manually via CLI:
```bash
vercel --prod
```

### Deployment Checks

After deployment, verify:
1. Frontend loads correctly
2. Theme switching works
3. Image generation functions
4. Email sending works
5. All API endpoints respond

### Troubleshooting

1. Check Vercel logs for errors
2. Verify environment variables
3. Test API endpoints
4. Check browser console
5. Verify webhook connections

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Test production build:
```bash
npm run test-build
```

## Backup and Recovery

The `update.sh` script handles:
1. Automatic backups
2. Version control
3. Changelog updates
4. Deployment process

Run it with:
```bash
./update.sh "v1.1.1: Your update message"
```
