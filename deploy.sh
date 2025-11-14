#!/bin/bash

# EPIC Website Deployment Script
# Usage: ./deploy.sh <username> <password>

set -e  # Exit on any error

# Check arguments
if [ -z "$1" ]; then
    echo "Usage: ./deploy.sh <username> <password>"
    echo "Example: ./deploy.sh es1230842 mypassword"
    exit 1
fi

# Configuration
REMOTE_USER="$1"
REMOTE_HOST="epic.iitd.ac.in"
REMOTE_PATH="/var/www/epic/https"
BUILD_DIR="dist"
ARCHIVE_NAME="dist.zip"
PASSWORD="$2"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting EPIC Website Deployment${NC}"
echo -e "${GREEN}📡 User: ${REMOTE_USER}@${REMOTE_HOST}${NC}\n"

# Check if sshpass is available for passwordless deployment
if command -v sshpass &> /dev/null && [ -n "$PASSWORD" ]; then
    USE_SSHPASS=true
    echo -e "${GREEN}✓ Using automated password authentication${NC}\n"
else
    USE_SSHPASS=false
    if [ -n "$PASSWORD" ]; then
        echo -e "${YELLOW}⚠ sshpass not found. Install it with: sudo pacman -S sshpass${NC}"
        echo -e "${YELLOW}⚠ Falling back to manual password entry${NC}\n"
    fi
fi

# Step 1: Clean previous build
echo -e "${YELLOW}📦 Cleaning previous build...${NC}"
rm -rf ${BUILD_DIR}
rm -f ${ARCHIVE_NAME}

# Step 2: Build the project
echo -e "${YELLOW}🔨 Building the project...${NC}"
npm run build

if [ ! -d "${BUILD_DIR}" ]; then
    echo -e "${RED}❌ Build failed! ${BUILD_DIR} directory not found.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}\n"

# Step 3: Create zip archive
echo -e "${YELLOW}📦 Creating zip archive...${NC}"
zip -r ${ARCHIVE_NAME} ${BUILD_DIR}
echo -e "${GREEN}✅ Archive created!${NC}\n"

# Step 4: Upload to server
echo -e "${YELLOW}📤 Uploading to server...${NC}"
if [ "$USE_SSHPASS" = true ]; then
    echo -e "${GREEN}Using saved password...${NC}"
    sshpass -p "$PASSWORD" scp ${ARCHIVE_NAME} ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/
else
    echo -e "${YELLOW}(You will be prompted for your password)${NC}"
    scp ${ARCHIVE_NAME} ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/
fi

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Upload failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Upload successful!${NC}\n"

# Step 5: Deploy on server
echo -e "${YELLOW}🔄 Deploying on server...${NC}"
if [ "$USE_SSHPASS" = false ]; then
    echo -e "${YELLOW}(You will be prompted for your password again)${NC}"
fi

if [ "$USE_SSHPASS" = true ]; then
    sshpass -p "$PASSWORD" ssh ${REMOTE_USER}@${REMOTE_HOST} << 'ENDSSH'
cd /var/www/epic/https/

# Backup existing html directory
if [ -d "html" ]; then
    echo "Creating backup of existing deployment..."
    BACKUP_NAME="html_backup_$(date +%Y%m%d_%H%M%S)"
    mv html $BACKUP_NAME
    echo "Backup created: $BACKUP_NAME"
fi

# Extract new build
echo "Extracting new build..."
unzip -q dist.zip

# Replace html directory
mv dist html

# Clean up
rm dist.zip

echo "Deployment complete!"
ENDSSH
else
    ssh ${REMOTE_USER}@${REMOTE_HOST} << 'ENDSSH'
cd /var/www/epic/https/

# Backup existing html directory
if [ -d "html" ]; then
    echo "Creating backup of existing deployment..."
    BACKUP_NAME="html_backup_$(date +%Y%m%d_%H%M%S)"
    mv html $BACKUP_NAME
    echo "Backup created: $BACKUP_NAME"
fi

# Extract new build
echo "Extracting new build..."
unzip -q dist.zip

# Replace html directory
mv dist html

# Clean up
rm dist.zip

echo "Deployment complete!"
ENDSSH
fi

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Deployment failed!${NC}"
    exit 1
fi

# Step 6: Clean up local files
echo -e "${YELLOW}🧹 Cleaning up local files...${NC}"
rm ${ARCHIVE_NAME}

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Your website should now be live at https://epic.iitd.ac.in${NC}"
