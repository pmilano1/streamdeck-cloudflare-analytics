# Cloudflare Analytics Stream Deck Plugin - Features

## Overview

This Stream Deck plugin displays real-time Cloudflare analytics for your website directly on your Stream Deck buttons. Monitor your website's performance at a glance!

## Key Features

### 📊 Multiple Metrics

Choose from 5 different metrics to display:

1. **Total Requests** - Total HTTP requests in the last 24 hours
2. **Bandwidth** - Total data transferred (auto-formatted: B/KB/MB/GB/TB)
3. **Threats Blocked** - Number of security threats stopped by Cloudflare
4. **Unique Visitors** - Number of unique IP addresses visiting your site
5. **Cache Hit Ratio** - Percentage of requests served from Cloudflare's cache

### 🔄 Auto-Refresh

- Configurable refresh intervals: 1, 5, 10, 15, 30, or 60 minutes
- Default: 5 minutes
- Manual refresh by clicking the button
- Efficient API usage to stay within Cloudflare limits

### 🎨 Clean Display

- Metric name on top line
- Formatted value on bottom line
- Compact number formatting (e.g., 1.5K, 2.3M)
- **Dynamic font sizing** - Automatically adjusts text size for large metrics
- Clear error states ("Setup Required", "Error Fetching")
- Dark background with high-contrast text

### ⚙️ Easy Configuration

- Simple web-based settings UI
- Secure API token storage
- Per-button configuration (add multiple buttons with different metrics)
- Helpful links to Cloudflare dashboard

### 🔒 Security

- API tokens stored securely in Stream Deck settings
- Password field for API token entry
- Read-only Analytics API permission required
- No data sent to third parties

## Technical Features

### Built With

- **TypeScript** - Type-safe development
- **Stream Deck SDK** - Official Elgato SDK
- **Cloudflare GraphQL API** - Real-time analytics data
- **Node.js 20+** - Modern JavaScript runtime

### Architecture

- **Singleton Action Pattern** - Efficient resource management
- **Shared Timer** - Single refresh timer for all buttons
- **Error Handling** - Graceful degradation on API errors
- **Modular Design** - Separate API client for easy testing

### Data Source

- Uses Cloudflare's GraphQL Analytics API
- Queries `httpRequests1hGroups` dataset
- Aggregates last 24 hours of data
- Efficient single-query design

## Use Cases

### Website Monitoring

- Keep an eye on traffic spikes
- Monitor security threats in real-time
- Track cache performance
- Verify bandwidth usage

### Content Publishing

- See immediate traffic response to new content
- Monitor visitor engagement
- Track unique visitor growth

### Performance Optimization

- Monitor cache hit ratio improvements
- Track bandwidth savings from optimization
- Verify CDN effectiveness

### Security Awareness

- Stay informed about threat activity
- Quick visibility into attack patterns
- Peace of mind with real-time monitoring

## Limitations

- Requires Cloudflare account with Analytics access
- 24-hour rolling window for metrics
- Refresh interval minimum: 1 minute
- Requires active internet connection
- Subject to Cloudflare API rate limits

## Future Enhancements (Potential)

- [ ] Support for multiple zones
- [ ] Historical trend graphs
- [ ] Alert thresholds with notifications
- [ ] Custom time ranges (1h, 6h, 7d, 30d)
- [ ] Additional metrics (status codes, countries, etc.)
- [ ] Export data to CSV
- [ ] Dark/light theme icons
- [ ] Encoder dial support for scrolling through metrics

## Compatibility

- **Stream Deck Software**: 6.4+
- **Operating Systems**: Windows 10+, macOS 10.15+
- **Node.js**: 20+
- **Cloudflare**: All plan types with Analytics access

## Support

For issues, questions, or feature requests:
- Check README.md for setup instructions
- Review SETUP.md for troubleshooting
- Verify Cloudflare API token permissions
- Ensure Zone ID is correct

## License

MIT License - Free to use and modify

