#!/bin/bash

# Cloudflare Analytics Stream Deck Plugin - Installation Script for macOS

# Colors for output
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
WHITE='\033[0;37m'
NC='\033[0m' # No Color

echo -e "${CYAN}==================================${NC}"
echo -e "${CYAN}Cloudflare Analytics Plugin Setup${NC}"
echo -e "${CYAN}==================================${NC}"
echo ""

# Check if Node.js is installed
echo -e "${YELLOW}Checking Node.js installation...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js $NODE_VERSION found${NC}"
else
    echo -e "${RED}✗ Node.js not found. Please install Node.js 20+ from https://nodejs.org${NC}"
    exit 1
fi

# Install dependencies
echo ""
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to install dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Build the plugin
echo ""
echo -e "${YELLOW}Building plugin...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Plugin built successfully${NC}"

# Install to Stream Deck
echo ""
echo -e "${YELLOW}Installing to Stream Deck...${NC}"

STREAM_DECK_PLUGINS_PATH="$HOME/Library/Application Support/com.elgato.StreamDeck/Plugins"
PLUGIN_NAME="com.milanese.cloudflare-analytics.sdPlugin"
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SOURCE_PATH="$SCRIPT_DIR/$PLUGIN_NAME"
DEST_PATH="$STREAM_DECK_PLUGINS_PATH/$PLUGIN_NAME"

# Create plugins directory if it doesn't exist
if [ ! -d "$STREAM_DECK_PLUGINS_PATH" ]; then
    mkdir -p "$STREAM_DECK_PLUGINS_PATH"
fi

# Remove old version if exists
if [ -d "$DEST_PATH" ]; then
    echo -e "${YELLOW}Removing old version...${NC}"
    rm -rf "$DEST_PATH"
fi

# Copy plugin
echo -e "${YELLOW}Copying plugin files...${NC}"
cp -R "$SOURCE_PATH" "$DEST_PATH"

echo -e "${GREEN}✓ Plugin installed to: $DEST_PATH${NC}"

# Final instructions
echo ""
echo -e "${CYAN}==================================${NC}"
echo -e "${GREEN}Installation Complete!${NC}"
echo -e "${CYAN}==================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "${WHITE}1. Restart Stream Deck application${NC}"
echo -e "${WHITE}2. Find 'Cloudflare Stats' in the actions list${NC}"
echo -e "${WHITE}3. Drag it to a button${NC}"
echo -e "${WHITE}4. Configure with your Cloudflare API token and Zone ID${NC}"
echo ""
echo -e "${CYAN}See SETUP.md for detailed configuration instructions${NC}"
echo ""

