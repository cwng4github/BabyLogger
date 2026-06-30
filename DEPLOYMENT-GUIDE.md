# Baby Logger - Production Deployment Guide

## 📦 Build Artifacts

Two deployment packages have been created:

1. **babylogger-deployment.tar.gz** (4.7 MB) - For Linux/Unix servers
2. **babylogger-deployment.zip** (5.6 MB) - For Windows servers or general use
3. **dist/** directory - Uncompressed deployment files

## 🚀 Quick Start Deployment

### Step 1: Upload to Your Server

Choose one of the deployment packages and upload it to your web server:

```bash
# Using SCP (Linux/Mac)
scp babylogger-deployment.tar.gz user@yourserver.com:/var/www/

# Or using SFTP/FTP client
# Upload babylogger-deployment.zip to your server
```

### Step 2: Extract the Package

On your server:

```bash
# For .tar.gz
cd /var/www/
tar -xzf babylogger-deployment.tar.gz -C babylogger
cd babylogger

# For .zip
cd /var/www/
unzip babylogger-deployment.zip -d babylogger
cd babylogger
```

### Step 3: Install Dependencies

```bash
npm install --production
```

### Step 4: Start the Application

```bash
# Simple start
node server.js

# Or use the provided start script
./start.sh

# Or with custom port
PORT=8080 node server.js
```

## 🔧 Production Deployment Options

### Option 1: PM2 (Recommended)

PM2 keeps your application running and restarts it automatically if it crashes.

```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start server.js --name babylogger

# Save the PM2 process list
pm2 save

# Set PM2 to start on system boot
pm2 startup

# Monitor the application
pm2 monit

# View logs
pm2 logs babylogger
```

### Option 2: Systemd Service (Linux)

Create a systemd service file:

```bash
sudo nano /etc/systemd/system/babylogger.service
```

Add the following content:

```ini
[Unit]
Description=Baby Logger Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/babylogger
ExecStart=/usr/bin/node server.js
Restart=on-failure
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl enable babylogger
sudo systemctl start babylogger
sudo systemctl status babylogger
```

### Option 3: Docker Deployment

Create a `Dockerfile` in the deployment directory:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install --production
EXPOSE 3000
CMD ["node", "server.js"]
```

Build and run:

```bash
docker build -t babylogger .
docker run -d -p 3000:3000 --name babylogger babylogger
```

## 🌐 Nginx Reverse Proxy Setup

To serve the application through Nginx on port 80/443:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

For HTTPS with Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## 🗄️ Database Configuration

### SQLite (Default)

The application uses SQLite by default. Ensure proper permissions:

```bash
chmod 755 db
chmod 644 db/baby_tracker.db
```

### PostgreSQL (Optional)

To use PostgreSQL instead:

1. Create a `.env.local` file:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/babylogger
```

2. Update the database connection in the application code if needed.

## 🔒 Security Recommendations

1. **Firewall Configuration**
   ```bash
   sudo ufw allow 22    # SSH
   sudo ufw allow 80    # HTTP
   sudo ufw allow 443   # HTTPS
   sudo ufw enable
   ```

2. **Environment Variables**
   - Never commit `.env.local` to version control
   - Use strong database passwords
   - Set `NODE_ENV=production`

3. **File Permissions**
   ```bash
   chmod 755 dist
   chmod 644 dist/server.js
   chmod 755 dist/start.sh
   ```

4. **Regular Updates**
   ```bash
   npm audit
   npm update
   ```

## 📊 Monitoring & Logs

### PM2 Monitoring

```bash
pm2 monit                    # Real-time monitoring
pm2 logs babylogger          # View logs
pm2 logs babylogger --lines 100  # Last 100 lines
```

### Systemd Logs

```bash
sudo journalctl -u babylogger -f    # Follow logs
sudo journalctl -u babylogger -n 100  # Last 100 lines
```

## 🔄 Updates & Maintenance

To update the application:

1. Stop the current instance:
   ```bash
   pm2 stop babylogger
   # or
   sudo systemctl stop babylogger
   ```

2. Backup the database:
   ```bash
   cp db/baby_tracker.db db/baby_tracker.db.backup
   ```

3. Upload and extract the new version

4. Install dependencies:
   ```bash
   npm install --production
   ```

5. Restart the application:
   ```bash
   pm2 restart babylogger
   # or
   sudo systemctl start babylogger
   ```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000
# or
netstat -tulpn | grep 3000

# Kill the process
kill -9 <PID>
```

### Permission Denied

```bash
# Fix ownership
sudo chown -R www-data:www-data /var/www/babylogger

# Fix permissions
chmod -R 755 /var/www/babylogger
```

### Database Locked

```bash
# Check database file
ls -la db/baby_tracker.db

# Ensure no other process is using it
lsof db/baby_tracker.db
```

## 📞 Support

For issues or questions:
- Check the logs first
- Verify all dependencies are installed
- Ensure proper file permissions
- Check firewall settings

## 📝 Deployment Checklist

- [ ] Server has Node.js 18+ installed
- [ ] Deployment package uploaded and extracted
- [ ] Dependencies installed (`npm install --production`)
- [ ] Database file exists and has proper permissions
- [ ] Environment variables configured (if needed)
- [ ] Firewall rules configured
- [ ] Application starts successfully
- [ ] Nginx reverse proxy configured (optional)
- [ ] SSL certificate installed (optional)
- [ ] PM2 or systemd service configured
- [ ] Monitoring and logging set up
- [ ] Backup strategy in place

## 🎉 Success!

Once deployed, your Baby Logger application will be accessible at:
- Direct: `http://yourserver:3000`
- With Nginx: `http://yourdomain.com`
- With SSL: `https://yourdomain.com`