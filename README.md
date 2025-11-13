# Cloudflare Analytics Stream Deck Plugin

Display real-time Cloudflare analytics for your website on your Stream Deck.

## Features

- **Real-time Analytics**: View Cloudflare statistics directly on your Stream Deck
- **Multiple Metrics**: Choose from:
  - Total Requests (24h)
  - Bandwidth Usage
  - Threats Blocked
  - Unique Visitors
  - Cache Hit Ratio
- **Auto-refresh**: Configurable refresh intervals (1-60 minutes)
- **Dynamic Font Sizing**: Automatically adjusts text size for large metrics
- **Easy Setup**: Simple configuration through Stream Deck UI
- **Cross-Platform**: Works on Windows and macOS

## Prerequisites

- Stream Deck software version 6.4 or higher
- Node.js version 20 or higher
- Cloudflare account with API access
- Stream Deck CLI (`npm install -g @elgato/cli`)

## Installation

### Quick Install (Recommended)

**Windows:**
```powershell
.\install.ps1
```

**macOS:**
```bash
chmod +x install.sh
./install.sh
```

The installation script will:
1. Check for Node.js 20+
2. Install dependencies
3. Build the plugin
4. Copy to Stream Deck plugins directory
5. Provide next steps

### Manual Installation

#### 1. Install Dependencies

```bash
cd streamdeck-plugins/cloudflare-analytics
npm install
```

#### 2. Build the Plugin

```bash
npm run build
```

#### 3. Install to Stream Deck

The plugin will be automatically installed to:
- **Windows**: `%APPDATA%\Elgato\StreamDeck\Plugins\`
- **macOS**: `~/Library/Application Support/com.elgato.StreamDeck/Plugins/`

Or use the Stream Deck CLI:

```bash
streamdeck link
```

#### 4. Restart Stream Deck

Restart the Stream Deck application to load the plugin.

## Configuration

### Get Cloudflare API Token

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Use the "Read Analytics" template or create a custom token with:
   - Permissions: `Zone > Analytics > Read`
   - Zone Resources: Include your zone
4. Copy the generated token

### Get Zone ID

1. Go to your [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your domain
3. Scroll down on the Overview page
4. Copy the Zone ID from the right sidebar

### Configure the Plugin

1. Drag the "Cloudflare Stats" action to a Stream Deck button
2. Click the button to open settings
3. Enter your:
   - **API Token**: Your Cloudflare API token
   - **Zone ID**: Your zone ID
   - **Display Metric**: Choose which metric to display
   - **Refresh Interval**: How often to update (default: 5 minutes)

## Development

### Watch Mode

For development with auto-reload:

```bash
npm run watch
```

This will automatically rebuild and restart the plugin when you make changes.

### Project Structure

```
cloudflare-analytics/
├── src/
│   ├── plugin.ts              # Main plugin entry point
│   ├── cloudflare-api.ts      # Cloudflare API integration
│   └── actions/
│       └── stats-action.ts    # Stream Deck action implementation
├── com.milanese.cloudflare-analytics.sdPlugin/
│   ├── manifest.json          # Plugin manifest
│   ├── bin/                   # Compiled output
│   ├── imgs/                  # Plugin icons
│   └── ui/
│       └── property-inspector.html  # Settings UI
├── package.json
├── tsconfig.json
└── rollup.config.mjs
```

## Metrics Explained

- **Total Requests**: Total HTTP requests in the last 24 hours
- **Bandwidth**: Total data transferred (formatted as B/KB/MB/GB)
- **Threats Blocked**: Number of threats stopped by Cloudflare
- **Unique Visitors**: Number of unique IP addresses
- **Cache Hit Ratio**: Percentage of requests served from cache

## Troubleshooting

### Plugin Not Showing

- Ensure Stream Deck software is version 6.4+
- Restart Stream Deck application
- Check that the plugin is in the correct directory

### "Setup Required" Message

- Verify your API token has Analytics:Read permission
- Confirm the Zone ID is correct
- Check that the API token hasn't expired

### "Error Fetching" Message

- Check your internet connection
- Verify API token is still valid
- Ensure Cloudflare API is accessible

## License

MIT License - See LICENSE file for details

## Author

Peter Milanese

