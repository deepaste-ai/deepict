#!/bin/bash

# Deepict Deployment Script
# This script handles both web and electron deployments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
DEPLOYMENT_TARGET="web"
SKIP_TESTS=false
SKIP_LINT=false
DOCKER_TAG="latest"
PUSH_TO_REGISTRY=false
DOCKER_REGISTRY=""

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -t, --target TARGET     Deployment target: web, electron, or docker (default: web)"
    echo "  -s, --skip-tests        Skip running tests"
    echo "  -l, --skip-lint         Skip linting"
    echo "  -d, --docker-tag TAG    Docker tag (default: latest)"
    echo "  -p, --push              Push Docker image to registry"
    echo "  -r, --registry URL      Docker registry URL"
    echo "  -h, --help              Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 -t web              # Deploy for web"
    echo "  $0 -t electron         # Deploy for electron"
    echo "  $0 -t docker -d v1.0.0 # Build Docker image with tag v1.0.0"
    echo "  $0 -t docker -p -r registry.example.com # Build and push to registry"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -t|--target)
            DEPLOYMENT_TARGET="$2"
            shift 2
            ;;
        -s|--skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        -l|--skip-lint)
            SKIP_LINT=true
            shift
            ;;
        -d|--docker-tag)
            DOCKER_TAG="$2"
            shift 2
            ;;
        -p|--push)
            PUSH_TO_REGISTRY=true
            shift
            ;;
        -r|--registry)
            DOCKER_REGISTRY="$2"
            shift 2
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Validate deployment target
if [[ ! "$DEPLOYMENT_TARGET" =~ ^(web|electron|docker)$ ]]; then
    print_error "Invalid deployment target: $DEPLOYMENT_TARGET"
    print_error "Valid targets: web, electron, docker"
    exit 1
fi

print_status "Starting deployment for target: $DEPLOYMENT_TARGET"

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    print_error "pnpm is not installed. Please install pnpm first."
    exit 1
fi

# Check if Docker is installed (for docker deployment)
if [[ "$DEPLOYMENT_TARGET" == "docker" ]] && ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Install dependencies
print_status "Installing dependencies..."
pnpm install

# Run linting
if [[ "$SKIP_LINT" != true ]]; then
    print_status "Running linting..."
    pnpm next:lint
    pnpm prettier:check
    print_success "Linting passed"
fi

# Run tests (placeholder for when tests are added)
if [[ "$SKIP_TESTS" != true ]]; then
    print_status "Running tests..."
    # pnpm test
    print_success "Tests passed"
fi

# Deploy based on target
case $DEPLOYMENT_TARGET in
    web)
        print_status "Building for web deployment..."
        export DEPLOYMENT_TARGET=web
        
        # Use web-specific config
        cp next.config.web.ts next.config.ts
        
        # Build the application
        pnpm web:build
        
        print_success "Web build completed!"
        print_status "You can now:"
        print_status "  - Run 'pnpm web:start' to start the production server"
        print_status "  - Deploy the .next/standalone directory to your server"
        print_status "  - Use the Dockerfile for containerized deployment"
        ;;
        
    electron)
        print_status "Building for Electron deployment..."
        export DEPLOYMENT_TARGET=electron
        
        # Build the application
        pnpm build
        
        # Create distribution
        pnpm dist
        
        print_success "Electron build completed!"
        print_status "Distribution files are available in the /dist directory"
        ;;
        
    docker)
        print_status "Building Docker image..."
        
        # Build Docker image
        FULL_TAG="deepict:${DOCKER_TAG}"
        if [[ -n "$DOCKER_REGISTRY" ]]; then
            FULL_TAG="${DOCKER_REGISTRY}/deepict:${DOCKER_TAG}"
        fi
        
        docker build -t "$FULL_TAG" .
        
        print_success "Docker image built: $FULL_TAG"
        
        # Push to registry if requested
        if [[ "$PUSH_TO_REGISTRY" == true ]]; then
            if [[ -z "$DOCKER_REGISTRY" ]]; then
                print_error "Registry URL is required for pushing. Use -r flag."
                exit 1
            fi
            
            print_status "Pushing image to registry..."
            docker push "$FULL_TAG"
            print_success "Image pushed to registry: $FULL_TAG"
        fi
        
        print_status "You can now run the container with:"
        print_status "  docker run -p 3000:3000 $FULL_TAG"
        ;;
esac

print_success "Deployment completed successfully!"