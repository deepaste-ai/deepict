# Deepict Deployment Guide

This guide covers multiple deployment options for Deepict, including web deployment, Docker containerization, and maintaining the existing Electron desktop application.

## 🚀 Deployment Options

### 1. Web Deployment (New)

Deploy Deepict as a web application that can be accessed through browsers.

#### Prerequisites
- Node.js 18+
- pnpm package manager
- Anthropic API key

#### Quick Start
```bash
# Install dependencies
pnpm install

# Build for web deployment
pnpm web:build

# Start production server
pnpm web:start
```

#### Environment Configuration
1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Configure your environment variables:
   ```env
   DEPLOYMENT_TARGET=web
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   NODE_ENV=production
   PORT=3000
   ```

#### Production Deployment
The web build creates a standalone Next.js application in `.next/standalone/` that can be deployed to any Node.js hosting platform:

- **Vercel**: Simply connect your repository
- **Netlify**: Use the Next.js build preset
- **Railway**: Deploy with automatic Docker detection
- **AWS/GCP/Azure**: Use the standalone build or Docker image

### 2. Docker Deployment (New)

Containerized deployment for easy scaling and management.

#### Using Docker Compose (Recommended)
```bash
# Start with Docker Compose
docker-compose up -d

# Or with build
docker-compose up --build
```

#### Manual Docker Build
```bash
# Build the image
docker build -t deepict:latest .

# Run the container
docker run -p 3000:3000 \
  -e ANTHROPIC_API_KEY=your_api_key_here \
  deepict:latest
```

#### Docker Configuration
The Docker setup includes:
- Multi-stage build for optimal image size
- Non-root user for security
- Health checks for monitoring
- Environment variable support
- Production optimizations

### 3. Electron Desktop (Existing)

The original desktop application deployment remains unchanged.

```bash
# Development
pnpm dev

# Build desktop app
pnpm build

# Create distributables
pnpm dist          # Current platform
pnpm dist:nsis     # Windows installer
pnpm dist:deb      # Linux package
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DEPLOYMENT_TARGET` | Deployment target (`web` or `electron`) | `web` | No |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key | - | Yes |
| `NODE_ENV` | Node.js environment | `development` | No |
| `PORT` | Server port | `3000` | No |
| `HOSTNAME` | Server hostname | `0.0.0.0` | No |

### Platform Detection

The application automatically detects the deployment environment:
- **Electron**: Full desktop features enabled
- **Web**: Browser-compatible features only

### Security Configuration

Web deployment includes additional security headers:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

## 📋 Deployment Scripts

### Automated Deployment Script

Use the provided deployment script for automated builds:

```bash
# Web deployment
./scripts/deploy.sh -t web

# Docker deployment
./scripts/deploy.sh -t docker -d v1.0.0

# Electron deployment
./scripts/deploy.sh -t electron

# With custom options
./scripts/deploy.sh -t docker -d v1.0.0 -p -r registry.example.com
```

### Script Options

| Option | Description |
|--------|-------------|
| `-t, --target` | Deployment target: `web`, `electron`, or `docker` |
| `-s, --skip-tests` | Skip running tests |
| `-l, --skip-lint` | Skip linting |
| `-d, --docker-tag` | Docker tag (default: latest) |
| `-p, --push` | Push Docker image to registry |
| `-r, --registry` | Docker registry URL |

## 🏗️ Architecture Changes

### Platform-Specific Features

#### Web Deployment
- Progressive Web App (PWA) support
- Service Worker for offline functionality
- Web-optimized file handling
- Browser security constraints

#### Electron Deployment
- Native file system access
- Desktop notifications
- System tray integration
- Native menus and shortcuts

### Shared Components

Both deployments share:
- Next.js application core
- React components
- API endpoints
- AI integration
- State management

## 🔍 Monitoring and Health Checks

### Health Check Endpoint

The application provides a health check endpoint at `/api/health`:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "0.1.0",
  "environment": "production",
  "platform": "web",
  "uptime": 1234.56,
  "features": {
    "anthropicAPI": true,
    "sse": true,
    "fileUpload": true
  }
}
```

### Docker Health Checks

Docker containers include built-in health checks:
- Endpoint: `curl -f http://localhost:3000/api/health`
- Interval: 30 seconds
- Timeout: 10 seconds
- Retries: 3

## 🚨 Troubleshooting

### Common Issues

#### 1. API Key Configuration
**Problem**: AI features not working
**Solution**: Ensure `ANTHROPIC_API_KEY` is properly set in environment variables

#### 2. Port Conflicts
**Problem**: Port 3000 already in use
**Solution**: Set `PORT` environment variable to a different port

#### 3. Docker Build Failures
**Problem**: Docker build fails with dependency errors
**Solution**: Clear Docker cache and rebuild:
```bash
docker system prune -a
docker build --no-cache -t deepict:latest .
```

#### 4. Memory Issues
**Problem**: Application crashes with out-of-memory errors
**Solution**: Increase container memory limits:
```bash
docker run -m 2g -p 3000:3000 deepict:latest
```

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true
```

## 📊 Performance Optimization

### Web Deployment
- Static asset optimization
- Image compression
- Code splitting
- CDN integration
- Caching strategies

### Docker Deployment
- Multi-stage builds
- Layer caching
- Minimal base images
- Resource limits
- Health monitoring

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy Deepict

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install -g pnpm
      - run: pnpm install
      - run: ./scripts/deploy.sh -t docker -d ${{ github.sha }}
```

## 🌐 Scaling Considerations

### Horizontal Scaling
- Stateless application design
- Load balancer configuration
- Database considerations
- Session management

### Vertical Scaling
- Memory optimization
- CPU utilization
- I/O performance
- Network bandwidth

## 📋 Migration Guide

### From Electron-Only to Multi-Platform

1. **Update Configuration**
   ```bash
   cp next.config.web.ts next.config.ts
   ```

2. **Set Environment Variables**
   ```bash
   export DEPLOYMENT_TARGET=web
   ```

3. **Build and Deploy**
   ```bash
   pnpm web:build
   pnpm web:start
   ```

### Platform-Specific Considerations

- **File Upload**: Web version uses browser APIs instead of native file system
- **Notifications**: Web version uses browser notifications instead of native
- **Storage**: Web version uses localStorage instead of native storage

## 🔐 Security Best Practices

### Web Deployment
- Environment variable security
- HTTPS enforcement
- Content Security Policy
- API rate limiting
- Input validation

### Docker Deployment
- Non-root user execution
- Minimal base images
- Security scanning
- Secret management
- Network isolation

## 📈 Monitoring and Observability

### Metrics Collection
- Application performance
- Error rates
- User interactions
- Resource usage
- API response times

### Logging
- Structured logging
- Error tracking
- Performance monitoring
- Audit trails
- Debug information

## 🆘 Support

For deployment issues:
1. Check the health endpoint: `/api/health`
2. Review application logs
3. Verify environment variables
4. Check Docker container status
5. Consult troubleshooting section

## 📝 Changelog

### Version 0.1.0
- ✅ Added web deployment support
- ✅ Added Docker containerization
- ✅ Added platform detection
- ✅ Added health check endpoint
- ✅ Added deployment scripts
- ✅ Added PWA support
- ✅ Maintained Electron compatibility