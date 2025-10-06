# MindTrack Deployment Guide

## Production Deployment Checklist

### Pre-Deployment Security

- [ ] Change all secret keys in `.env`
- [ ] Enable HTTPS/SSL certificates
- [ ] Set `FLASK_ENV=production`
- [ ] Configure production database
- [ ] Set up proper CORS policies
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Set up logging and monitoring
- [ ] Configure backup strategy
- [ ] Review security headers

---

## Backend Deployment Options

### Option 1: Heroku

1. **Install Heroku CLI**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Create Heroku app**
   ```bash
   cd backend
   heroku create mindtrack-api
   ```

3. **Add Procfile**
   ```
   web: gunicorn app:app
   ```

4. **Set environment variables**
   ```bash
   heroku config:set SECRET_KEY=your-secret-key
   heroku config:set JWT_SECRET_KEY=your-jwt-secret
   heroku config:set FLASK_ENV=production
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 2: AWS EC2

1. **Launch EC2 instance** (Ubuntu 20.04 LTS)

2. **SSH into instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install dependencies**
   ```bash
   sudo apt update
   sudo apt install python3-pip python3-venv nginx
   ```

4. **Clone and setup application**
   ```bash
   git clone your-repo
   cd mindtrack/backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   pip install gunicorn
   ```

5. **Configure Gunicorn service**
   Create `/etc/systemd/system/mindtrack.service`:
   ```ini
   [Unit]
   Description=MindTrack API
   After=network.target

   [Service]
   User=ubuntu
   WorkingDirectory=/home/ubuntu/mindtrack/backend
   Environment="PATH=/home/ubuntu/mindtrack/backend/venv/bin"
   ExecStart=/home/ubuntu/mindtrack/backend/venv/bin/gunicorn -w 4 -b 0.0.0.0:5000 app:app

   [Install]
   WantedBy=multi-user.target
   ```

6. **Start service**
   ```bash
   sudo systemctl start mindtrack
   sudo systemctl enable mindtrack
   ```

7. **Configure Nginx**
   Create `/etc/nginx/sites-available/mindtrack`:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

8. **Enable site and restart Nginx**
   ```bash
   sudo ln -s /etc/nginx/sites-available/mindtrack /etc/nginx/sites-enabled/
   sudo systemctl restart nginx
   ```

### Option 3: DigitalOcean App Platform

1. **Connect GitHub repository**
2. **Configure build settings**
   - Build Command: `pip install -r requirements.txt`
   - Run Command: `gunicorn -w 4 app:app`
3. **Set environment variables**
4. **Deploy**

---

## Frontend Deployment Options

### Option 1: Netlify

1. **Build the application**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

3. **Or connect GitHub repository**
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Configure environment variables**
   - Add API endpoint URL

5. **Set up redirects** (create `public/_redirects`):
   ```
   /api/* https://your-backend-url.com/api/:splat 200
   /* /index.html 200
   ```

### Option 2: Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Configure in `vercel.json`**
   ```json
   {
     "rewrites": [
       { "source": "/api/(.*)", "destination": "https://your-backend-url.com/api/$1" }
     ]
   }
   ```

### Option 3: AWS S3 + CloudFront

1. **Build application**
   ```bash
   npm run build
   ```

2. **Create S3 bucket**
   - Enable static website hosting
   - Set bucket policy for public read

3. **Upload build files**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name
   ```

4. **Create CloudFront distribution**
   - Point to S3 bucket
   - Configure SSL certificate
   - Set up custom domain

---

## Database Options

### Development: SQLite (Current)
- File-based database
- Included in Python
- Good for development/demo

### Production Options:

#### PostgreSQL (Recommended)
```python
# Update config.py
DATABASE_URL = 'postgresql://user:password@host:5432/mindtrack'
```

Install psycopg2:
```bash
pip install psycopg2-binary
```

#### MySQL
```python
DATABASE_URL = 'mysql://user:password@host:3306/mindtrack'
```

Install MySQL connector:
```bash
pip install mysql-connector-python
```

#### MongoDB (Alternative)
For NoSQL approach, restructure data models.

---

## Environment Variables

### Backend (.env)
```env
FLASK_ENV=production
SECRET_KEY=generate-strong-random-key
JWT_SECRET_KEY=generate-strong-random-key
DATABASE_URL=your-database-url
CORS_ORIGINS=https://your-frontend-domain.com
ALERT_EMAIL_ENABLED=true
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email
SMTP_PASSWORD=your-password
```

### Frontend
Create `.env.production`:
```env
VITE_API_URL=https://your-backend-domain.com
```

Update axios base URL in frontend code.

---

## SSL/HTTPS Setup

### Using Let's Encrypt (Free)

1. **Install Certbot**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. **Obtain certificate**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

3. **Auto-renewal**
   ```bash
   sudo certbot renew --dry-run
   ```

---

## Monitoring & Logging

### Application Monitoring

1. **Set up logging**
   ```python
   import logging
   logging.basicConfig(
       filename='app.log',
       level=logging.INFO,
       format='%(asctime)s %(levelname)s: %(message)s'
   )
   ```

2. **Use monitoring services**
   - Sentry for error tracking
   - New Relic for performance
   - DataDog for infrastructure

### Health Check Endpoint

Add to `app.py`:
```python
@app.route('/health')
def health_check():
    return jsonify({'status': 'healthy'}), 200
```

---

## Backup Strategy

### Database Backups

**Automated backup script:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_FILE="mindtrack.db"

cp $DB_FILE $BACKUP_DIR/mindtrack_$DATE.db

# Keep only last 30 days
find $BACKUP_DIR -name "mindtrack_*.db" -mtime +30 -delete
```

**Schedule with cron:**
```bash
0 2 * * * /path/to/backup-script.sh
```

---

## Performance Optimization

### Backend
- Use connection pooling
- Implement caching (Redis)
- Optimize database queries
- Enable gzip compression
- Use CDN for static assets

### Frontend
- Code splitting
- Lazy loading
- Image optimization
- Bundle size optimization
- Browser caching

---

## Scaling Considerations

### Horizontal Scaling
- Load balancer (Nginx, AWS ELB)
- Multiple backend instances
- Session management (Redis)
- Database replication

### Vertical Scaling
- Increase server resources
- Optimize code performance
- Database indexing

---

## CI/CD Pipeline

### GitHub Actions Example

`.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "mindtrack-api"
          heroku_email: "your-email@example.com"

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: './frontend/dist'
          production-deploy: true
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## Compliance & Legal

### HIPAA Compliance (if handling PHI)
- Business Associate Agreement (BAA)
- Encryption at rest and in transit
- Access controls and audit logs
- Regular security assessments
- Incident response plan

### GDPR Compliance
- User consent mechanisms
- Data portability
- Right to be forgotten
- Privacy policy
- Data processing agreements

---

## Post-Deployment

- [ ] Test all features in production
- [ ] Monitor error logs
- [ ] Set up alerts for downtime
- [ ] Configure backup verification
- [ ] Document deployment process
- [ ] Train team on deployment
- [ ] Set up staging environment
- [ ] Create rollback plan

---

## Troubleshooting Production Issues

### Common Issues

**502 Bad Gateway**
- Check if backend service is running
- Verify Nginx configuration
- Check firewall rules

**Database Connection Errors**
- Verify database credentials
- Check network connectivity
- Ensure database is running

**CORS Errors**
- Update CORS_ORIGINS in config
- Check frontend API URL
- Verify request headers

---

## Support & Maintenance

### Regular Maintenance Tasks
- Update dependencies monthly
- Review security advisories
- Monitor disk space
- Analyze performance metrics
- Review user feedback
- Update documentation

### Emergency Contacts
- DevOps team
- Database administrator
- Security team
- Hosting provider support

---

**Remember**: Always test in a staging environment before deploying to production!
