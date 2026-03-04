export type DonateProvider = {
  id: string;
  name: string;
  href: string;
  imgSrc: string;
  imgAlt: string;
  note?: string;
};

export const donateProviders: DonateProvider[] = [
  {
    id: "paypal",
    name: "PayPal",
    href: "https://www.paypal.com/ncp/payment/2DC76ZN8CMRAS",
    imgSrc: "/images/donate/paypal.svg",
    imgAlt: "PayPal logo",
    note: "One-time or recurring"
  },
  {
    id: "buymeacoffee",
    name: "Buy Me a Coffee",
    href: "https://buymeacoffee.com/tamemj",
    imgSrc: "/images/donate/buymeacoffee.svg",
    imgAlt: "Buy Me a Coffee logo",
    note: "Quick tip in seconds"
  }
];
