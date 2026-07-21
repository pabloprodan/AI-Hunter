const FEEDS: Record<string, string> = {
  Upwork: 'https://www.upwork.com/ab/feed/jobs/rss?q=react&sort=recency&paging=0',
  RemoteOK: 'https://remoteok.io/remote-dev-jobs.rss',
  WFH: 'https://weworkremotely.com/categories/remote-programming-jobs.rss',
};

export async function fetchFeed(url: string): Promise<string> {
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  return res.text();
}

export function parseRSS(xml: string): Array<{ title: string; description: string; url: string }> {
  const items: Array<{ title: string; description: string; url: string }> = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  const titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/i;
  const descRegex = /<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/i;
  const linkRegex = /<link>(.*?)<\/link>/i;

  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const content = match[1];
    const titleMatch = titleRegex.exec(content);
    const descMatch = descRegex.exec(content);
    const linkMatch = linkRegex.exec(content);
    if (titleMatch) {
      items.push({
        title: (titleMatch[1] || titleMatch[2] || '').trim(),
        description: (descMatch?.[1] || descMatch?.[2] || '').trim(),
        url: (linkMatch?.[1] || '').trim(),
      });
    }
  }
  return items;
}

export function getFeedSources(): string[] {
  return Object.keys(FEEDS);
}
