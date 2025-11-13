# Quick Setup Guide

## Quick Install (Recommended)

### Windows
```powershell
cd streamdeck-plugins/cloudflare-analytics
.\install.ps1
```

### macOS
```bash
cd streamdeck-plugins/cloudflare-analytics
chmod +x install.sh
./install.sh
```

The installation script will handle everything automatically!

## Manual Setup

### Step 1: Install Dependencies

```bash
cd streamdeck-plugins/cloudflare-analytics
npm install
```

### Step 2: Get Cloudflare Credentials

#### API Token
1. Visit: https://dash.cloudflare.com/profile/api-tokens
2. Click "Create Token"
3. Use "Read Analytics" template
4. Select your zone
5. Copy the token

#### Zone ID
1. Visit: https://dash.cloudflare.com
2. Click on your domain
3. Scroll down on Overview page
4. Copy Zone ID from right sidebar (under API section)

### Step 3: Build the Plugin

```bash
npm run build
```

### Step 4: Install Stream Deck CLI (if not already installed)

```bash
npm install -g @elgato/cli
```

### Step 5: Link Plugin to Stream Deck

```bash
streamdeck link
```

Or manually copy the `com.milanese.cloudflare-analytics.sdPlugin` folder to:
- **Windows**: `%APPDATA%\Elgato\StreamDeck\Plugins\`
- **macOS**: `~/Library/Application Support/com.elgato.StreamDeck/Plugins/`

### Step 6: Restart Stream Deck

Close and reopen the Stream Deck application.

## Configure the Plugin

1. Open Stream Deck software
2. Find "Cloudflare Stats" in the actions list
3. Drag it to a button
4. Click the button to open settings
5. Enter your API Token and Zone ID
6. Choose your preferred metric
7. Set refresh interval

## Development Mode

For live development with auto-reload:

```powershell
npm run watch
```

This will automatically rebuild and restart the plugin when you save changes.

## Troubleshooting

### Plugin doesn't appear
- Make sure Stream Deck software is version 6.4+
- Restart Stream Deck completely
- Check the plugin folder exists in the correct location

### "Setup Required" on button
- Verify you entered both API Token and Zone ID
- Check that the API token has Analytics:Read permission

### "Error Fetching" on button
- Verify API token is valid and not expired
- Check Zone ID is correct
- Ensure internet connection is working
- Check Cloudflare API status

## Next Steps

Once configured, the button will display your chosen metric and auto-refresh based on your interval setting. Click the button to manually refresh the data.

You can add multiple buttons with different metrics to monitor various aspects of your site's performance!

