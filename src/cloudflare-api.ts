import fetch from 'node-fetch';

/**
 * Cloudflare analytics data structure.
 */
export interface CloudflareAnalytics {
  /** Total number of requests */
  requests: number;
  /** Total bandwidth in bytes */
  bandwidth: number;
  /** Number of threats blocked */
  threats: number;
  /** Number of unique visitors */
  uniqueVisitors: number;
  /** Number of page views */
  pageViews: number;
  /** Number of cached requests */
  cachedRequests: number;
  /** Cache hit ratio as a percentage */
  cacheHitRatio: number;
}

/**
 * Client for interacting with the Cloudflare GraphQL Analytics API.
 */
export class CloudflareAPI {
  private apiToken: string;
  private zoneId: string;
  private endpoint = 'https://api.cloudflare.com/client/v4/graphql';

  /**
   * Creates a new Cloudflare API client.
   * @param apiToken - Cloudflare API token with Analytics:Read permission
   * @param zoneId - Cloudflare Zone ID for the domain
   */
  constructor(apiToken: string, zoneId: string) {
    this.apiToken = apiToken;
    this.zoneId = zoneId;
  }

  /**
   * Fetches analytics data from Cloudflare for the specified time period.
   * @param hours - Number of hours of data to fetch (default: 24)
   * @returns Promise resolving to aggregated analytics data
   */
  async getAnalytics(hours: number = 24): Promise<CloudflareAnalytics> {
    const now = new Date();
    const past = new Date(now.getTime() - hours * 60 * 60 * 1000);

    const query = `
      query {
        viewer {
          zones(filter: { zoneTag: "${this.zoneId}" }) {
            httpRequests1hGroups(
              limit: ${hours}
              filter: {
                datetime_geq: "${past.toISOString()}"
                datetime_leq: "${now.toISOString()}"
              }
            ) {
              sum {
                requests
                bytes
                threats
                pageViews
                cachedRequests
              }
              uniq {
                uniques
              }
            }
          }
        }
      }
    `;

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Cloudflare API error: ${response.statusText}`);
      }

      const data: any = await response.json();
      
      if (data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
      }

      const groups = data.data?.viewer?.zones?.[0]?.httpRequests1hGroups || [];
      
      // Aggregate the data
      const totals = groups.reduce((acc: any, group: any) => {
        return {
          requests: acc.requests + (group.sum.requests || 0),
          bytes: acc.bytes + (group.sum.bytes || 0),
          threats: acc.threats + (group.sum.threats || 0),
          pageViews: acc.pageViews + (group.sum.pageViews || 0),
          cachedRequests: acc.cachedRequests + (group.sum.cachedRequests || 0),
          uniques: Math.max(acc.uniques, group.uniq.uniques || 0),
        };
      }, { requests: 0, bytes: 0, threats: 0, pageViews: 0, cachedRequests: 0, uniques: 0 });

      const cacheHitRatio = totals.requests > 0 
        ? (totals.cachedRequests / totals.requests) * 100 
        : 0;

      return {
        requests: totals.requests,
        bandwidth: totals.bytes,
        threats: totals.threats,
        uniqueVisitors: totals.uniques,
        pageViews: totals.pageViews,
        cachedRequests: totals.cachedRequests,
        cacheHitRatio: Math.round(cacheHitRatio * 10) / 10,
      };
    } catch (error) {
      console.error('Error fetching Cloudflare analytics:', error);
      throw error;
    }
  }

  /**
   * Formats bytes into a human-readable string.
   * @param bytes - Number of bytes to format
   * @returns Formatted string (e.g., "1.5 MB")
   */
  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Formats a number into a compact string with K/M suffix.
   * @param num - Number to format
   * @returns Formatted string (e.g., "1.5K", "2.3M")
   */
  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
}

