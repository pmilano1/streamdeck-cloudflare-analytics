import streamDeck, {
  action,
  KeyDownEvent,
  SingletonAction,
  WillAppearEvent,
  WillDisappearEvent,
  DidReceiveSettingsEvent,
  JsonObject,
} from '@elgato/streamdeck';

import { CloudflareAPI } from '../cloudflare-api';

/**
 * Settings for the Cloudflare Analytics action.
 */
interface Settings extends JsonObject {
  /** Cloudflare API token with Analytics:Read permission */
  apiToken?: string;
  /** Cloudflare Zone ID for the domain */
  zoneId?: string;
  /** Refresh interval in minutes */
  refreshInterval?: number;
  /** Metric to display on the button */
  displayMetric?: 'requests' | 'bandwidth' | 'threats' | 'visitors' | 'cache';
}

/**
 * Stream Deck action that displays Cloudflare analytics metrics.
 */
@action({ UUID: 'com.milanese.cloudflare-analytics.stats' })
export class StatsAction extends SingletonAction<Settings> {
  private cloudflareAPI?: CloudflareAPI;
  private refreshTimer?: NodeJS.Timeout;
  private contexts: Map<string, Settings> = new Map();

  override async onWillAppear(ev: WillAppearEvent<Settings>): Promise<void> {
    const settings = ev.payload.settings;
    const context = ev.action.id;
    this.contexts.set(context, settings);

    streamDeck.logger.info('onWillAppear - Settings:', JSON.stringify(settings));

    // Set dark background and disable title
    await ev.action.setImage('data:image/svg+xml;base64,' + Buffer.from(`
      <svg xmlns="http://www.w3.org/2000/svg" width="144" height="144">
        <rect width="144" height="144" fill="#1a1a1a"/>
      </svg>
    `).toString('base64'));

    await ev.action.setTitle('');

    if (settings.apiToken && settings.zoneId) {
      streamDeck.logger.info('Initializing CloudflareAPI...');
      this.cloudflareAPI = new CloudflareAPI(settings.apiToken, settings.zoneId);
      await this.updateDisplay(context, settings);
      this.startRefreshTimer(context, settings);
    } else {
      streamDeck.logger.warn('Missing apiToken or zoneId');
      await ev.action.setTitle('Setup\nRequired');
    }
  }

  override async onWillDisappear(ev: WillDisappearEvent<Settings>): Promise<void> {
    const context = ev.action.id;
    this.contexts.delete(context);
    if (this.contexts.size === 0 && this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = undefined;
    }
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<Settings>): Promise<void> {
    const settings = ev.payload.settings;
    const context = ev.action.id;

    streamDeck.logger.info('onDidReceiveSettings - Settings:', JSON.stringify(settings));

    this.contexts.set(context, settings);

    if (settings.apiToken && settings.zoneId) {
      streamDeck.logger.info('Settings received, initializing CloudflareAPI...');
      this.cloudflareAPI = new CloudflareAPI(settings.apiToken, settings.zoneId);
      await this.updateDisplay(context, settings);
      this.startRefreshTimer(context, settings);
    } else {
      streamDeck.logger.warn('Settings incomplete - missing apiToken or zoneId');
      await ev.action.setTitle('Setup\nRequired');
    }
  }

  override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
    const settings = ev.payload.settings;
    const context = ev.action.id;
    streamDeck.logger.info('onKeyDown - Manual refresh triggered');
    if (settings.apiToken && settings.zoneId) {
      await this.updateDisplay(context, settings);
    }
  }

  private startRefreshTimer(context: string, settings: Settings): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }

    const interval = (settings.refreshInterval || 5) * 60 * 1000; // Convert minutes to ms
    
    this.refreshTimer = setInterval(async () => {
      for (const [ctx, ctxSettings] of this.contexts.entries()) {
        await this.updateDisplay(ctx, ctxSettings);
      }
    }, interval);
  }

  private async updateDisplay(context: string, settings: Settings): Promise<void> {
    if (!this.cloudflareAPI) {
      streamDeck.logger.warn('updateDisplay: cloudflareAPI not initialized');
      return;
    }

    try {
      streamDeck.logger.info('Fetching analytics from Cloudflare...');
      const analytics = await this.cloudflareAPI.getAnalytics(24);
      streamDeck.logger.info('Analytics received:', JSON.stringify(analytics));

      const metric = settings.displayMetric || 'requests';
      streamDeck.logger.info('Display metric:', metric);

      let title = '';
      let value = '';

      switch (metric) {
        case 'requests':
          title = 'Requests';
          value = this.cloudflareAPI.formatNumber(analytics.requests);
          break;
        case 'bandwidth':
          title = 'Bandwidth';
          value = this.cloudflareAPI.formatBytes(analytics.bandwidth);
          break;
        case 'threats':
          title = 'Threats';
          value = this.cloudflareAPI.formatNumber(analytics.threats);
          break;
        case 'visitors':
          title = 'Visitors';
          value = this.cloudflareAPI.formatNumber(analytics.uniqueVisitors);
          break;
        case 'cache':
          title = 'Cache Hit';
          value = `${analytics.cacheHitRatio}%`;
          break;
      }

      streamDeck.logger.info(`Setting display to: ${title} = ${value}`);
      const action = streamDeck.actions.getActionById(context);
      if (action) {
        // Dynamically adjust font size based on value length
        let fontSize = 52;
        const valueLength = value.length;

        if (valueLength > 8) {
          fontSize = 32;
        } else if (valueLength > 6) {
          fontSize = 40;
        } else if (valueLength > 4) {
          fontSize = 48;
        }

        // Create SVG with dark background and dynamically sized text
        const svg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="144" height="144">
            <rect width="144" height="144" fill="#1a1a1a"/>
            <text x="72" y="50" font-family="Arial, sans-serif" font-size="24" fill="#aaaaaa" text-anchor="middle">${title}</text>
            <text x="72" y="105" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" fill="#ffffff" text-anchor="middle">${value}</text>
          </svg>
        `;

        await action.setImage('data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64'));
        streamDeck.logger.info('Display updated successfully');
      } else {
        streamDeck.logger.error('Action not found for context:', context);
      }
    } catch (error) {
      streamDeck.logger.error('Error updating display:', error);
      const action = streamDeck.actions.getActionById(context);
      if (action) {
        const errorSvg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="144" height="144">
            <rect width="144" height="144" fill="#1a1a1a"/>
            <text x="72" y="60" font-family="Arial, sans-serif" font-size="18" fill="#ff4444" text-anchor="middle">Error</text>
            <text x="72" y="90" font-family="Arial, sans-serif" font-size="14" fill="#ff4444" text-anchor="middle">Fetching</text>
          </svg>
        `;
        await action.setImage('data:image/svg+xml;base64,' + Buffer.from(errorSvg).toString('base64'));
      }
    }
  }
}

