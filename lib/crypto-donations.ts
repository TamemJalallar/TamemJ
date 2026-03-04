export type CryptoDonationSymbol = "BTC" | "ETH" | "SHIB" | "BNB" | "SOL" | "LTC" | "XRP";

export interface CryptoDonationMethod {
  key: string;
  symbol: CryptoDonationSymbol;
  network: string;
  address: string;
  walletUri: string;
  explorerUrl: string;
  iconSrc: string;
  iconAlt: string;
}

interface CryptoDonationConfig {
  key: string;
  symbol: CryptoDonationSymbol;
  network: string;
  address: string;
  iconSrc: string;
  iconAlt: string;
}

function buildWalletUri(symbol: CryptoDonationSymbol, address: string): string {
  if (symbol === "BTC") return `bitcoin:${address}`;
  if (symbol === "ETH") return `ethereum:${address}`;
  if (symbol === "SHIB") return `ethereum:${address}`;
  if (symbol === "BNB") return `ethereum:${address}`;
  if (symbol === "SOL") return `solana:${address}`;
  if (symbol === "LTC") return `litecoin:${address}`;
  return `xrpl:${address}`;
}

function buildExplorerUrl(symbol: CryptoDonationSymbol, address: string): string {
  if (symbol === "BTC") return `https://www.blockchain.com/explorer/addresses/btc/${encodeURIComponent(address)}`;
  if (symbol === "ETH") return `https://etherscan.io/address/${encodeURIComponent(address)}`;
  if (symbol === "SHIB") return `https://etherscan.io/address/${encodeURIComponent(address)}`;
  if (symbol === "BNB") return `https://bscscan.com/address/${encodeURIComponent(address)}`;
  if (symbol === "SOL") return `https://solscan.io/account/${encodeURIComponent(address)}`;
  if (symbol === "LTC") return `https://blockchair.com/litecoin/address/${encodeURIComponent(address)}`;
  return `https://xrpscan.com/account/${encodeURIComponent(address)}`;
}

export function getCryptoDonationMethods(): CryptoDonationMethod[] {
  const configs: CryptoDonationConfig[] = [
    {
      key: "btc",
      symbol: "BTC",
      network: "Bitcoin",
      address: process.env.NEXT_PUBLIC_DONATION_BTC_ADDRESS?.trim() ?? "",
      iconSrc: "/images/crypto/btc.svg",
      iconAlt: "Bitcoin icon"
    },
    {
      key: "eth",
      symbol: "ETH",
      network: "Ethereum",
      address: process.env.NEXT_PUBLIC_DONATION_ETH_ADDRESS?.trim() ?? "",
      iconSrc: "/images/crypto/eth.svg",
      iconAlt: "Ethereum icon"
    },
    {
      key: "shib",
      symbol: "SHIB",
      network: "Shiba Inu (ERC-20)",
      address:
        process.env.NEXT_PUBLIC_DONATION_SHIB_ADDRESS?.trim() ??
        process.env.NEXT_PUBLIC_DONATION_ETH_ADDRESS?.trim() ??
        "",
      iconSrc: "/images/crypto/shib.svg",
      iconAlt: "Shiba Inu icon"
    },
    {
      key: "bnb",
      symbol: "BNB",
      network: "BNB Smart Chain",
      address: process.env.NEXT_PUBLIC_DONATION_BNB_ADDRESS?.trim() ?? "",
      iconSrc: "/images/crypto/bnb.svg",
      iconAlt: "BNB icon"
    },
    {
      key: "sol",
      symbol: "SOL",
      network: "Solana",
      address: process.env.NEXT_PUBLIC_DONATION_SOL_ADDRESS?.trim() ?? "",
      iconSrc: "/images/crypto/sol.svg",
      iconAlt: "Solana icon"
    },
    {
      key: "ltc",
      symbol: "LTC",
      network: "Litecoin",
      address: process.env.NEXT_PUBLIC_DONATION_LTC_ADDRESS?.trim() ?? "",
      iconSrc: "/images/crypto/ltc.svg",
      iconAlt: "Litecoin icon"
    },
    {
      key: "xrp",
      symbol: "XRP",
      network: "XRP Ledger",
      address: process.env.NEXT_PUBLIC_DONATION_XRP_ADDRESS?.trim() ?? "",
      iconSrc: "/images/crypto/xrp.svg",
      iconAlt: "XRP icon"
    }
  ];

  return configs
    .filter((entry) => entry.address.length > 0)
    .map((entry) => ({
      key: entry.key,
      symbol: entry.symbol,
      network: entry.network,
      address: entry.address,
      walletUri: buildWalletUri(entry.symbol, entry.address),
      explorerUrl: buildExplorerUrl(entry.symbol, entry.address),
      iconSrc: entry.iconSrc,
      iconAlt: entry.iconAlt
    }));
}
