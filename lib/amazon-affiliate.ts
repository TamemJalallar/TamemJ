const DEFAULT_AMAZON_ASSOCIATE_TAG = "tamemj-20";

export function getAmazonAssociateTag(): string {
  const tag = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG?.trim();
  return tag || DEFAULT_AMAZON_ASSOCIATE_TAG;
}

export function buildAmazonSearchLink(query: string): string {
  const base = `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;
  const tag = getAmazonAssociateTag();
  return `${base}&tag=${encodeURIComponent(tag)}`;
}
