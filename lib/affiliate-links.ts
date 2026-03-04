export interface AffiliateLink {
  key: string;
  program: string;
  label: string;
  description: string;
  url: string;
  network: string;
  status: "Active" | "Applied";
  platform?: string;
}

export const affiliateLinks: AffiliateLink[] = [
  {
    key: "amazon-it-gear",
    program: "Amazon Associates",
    label: "Amazon IT Gear Picks",
    description:
      "Recommended keyboards, docks, adapters, and accessories for enterprise support and productivity setups.",
    url: "https://amzn.to/4b1Cr3z",
    network: "Amazon Associates",
    status: "Active",
    platform: "Amazon"
  },
  {
    key: "amazon-pick-raspberry-pi-5-starter-kit-pro",
    program: "Amazon Associates",
    label: "CanaKit Raspberry Pi 5 Starter Kit PRO",
    description: "Raspberry Pi 5 starter bundle for home lab and lightweight automation projects.",
    url: "https://www.amazon.com/CanaKit-Raspberry-Starter-Kit-PRO/dp/B0CRSNCJ6Y?crid=1LLP7M7OCD5TX&dib=eyJ2IjoiMSJ9.KmdhrY0pHCHs8fYFQTqAptyQwXZsZ7nh4LTOOXi47D8rZdCcYUQN65A2ldfHi0l7qMk-oMRssrZl3bqQNJU4xQEyeY4oziacycj2Wpm--G_UhiX50XLa36SJEbvPg58Ug1vmKlA9xu2SaMUqv6wiNqpWotjjev0gE8SEozLHaixfgAHkoJpjq7B5IWSomMMganHmSjYnidBqSjTOLlJp1RFNJUO7YD_JH-k3ZPbyD7Y.1Ok2wDLHf6ntUe3bllMuSzlg9LoxmgRnK_coW5o_pwE&dib_tag=se&keywords=raspberry%2Bpi%2B5&qid=1772475410&sprefix=rasp%2Caps%2C136&sr=8-3&th=1&linkCode=ll2&tag=tamemj-20&linkId=89ba42f169399e22a0b98bf632a07f96&language=en_US&ref_=as_li_ss_tl",
    network: "Amazon Associates",
    status: "Active",
    platform: "Amazon"
  },
  {
    key: "amazon-pick-brother-ptd210-label-maker-bundle",
    program: "Amazon Associates",
    label: "Brother P-touch PTD210 Label Maker Bundle",
    description: "Reliable label maker bundle for cable, device, and inventory labeling workflows.",
    url: "https://www.amazon.com/Brother-P-touch-PTD210-Bundle-included/dp/B09QXZ7ZRD?crid=19GWVXAARFH97&dib=eyJ2IjoiMSJ9.-7pmEozYE2wdswt_xiDEx-sA80Ez002-oSLZg3aHXLfnlf4FiAei2qEiK2spbhglCfNo362Fx-lmKJf2S3gEBuJDAk7g9N0XMWh5hxu6s47nt3ls_NCXg7rxfs0VdHdT7gon0UVJY7f7dFCk_0mG9Wly64GIfsgTy3bXy4pb_cVMgamTuXtbjjPBYd1tyQIABkPD4HBCp2AksbMa3vgsUFKJepKry9OFUhfL9nKd-eY.FGFOYAwOTBZHgTDvSd2QC8DbZkwNR36KvAvjmqsiItc&dib_tag=se&keywords=label%2Bmaker&qid=1772475485&sprefix=label%2Bmak%2Caps%2C123&sr=8-3&th=1&linkCode=ll2&tag=tamemj-20&linkId=6b9584c355248333b8753e07109aabdf&language=en_US&ref_=as_li_ss_tl",
    network: "Amazon Associates",
    status: "Active",
    platform: "Amazon"
  },
  {
    key: "amazon-pick-delamu-cable-management-raceway",
    program: "Amazon Associates",
    label: "Delamu Cable Management Raceway",
    description: "Clean desk and rack cable routing kit for support desks and workspace organization.",
    url: "https://www.amazon.com/Delamu-Premium-Management-Raceway-H0-55in/dp/B07GPFDL1K?crid=1BJE2AZI7OYMA&dib=eyJ2IjoiMSJ9.w3Loo7ElpCNRGxuVUOvKxXISA8To8gdqUzUWK74Q0zQyZu_5EjfoZKcIkHNDSmecBs8mjd0XWDI1mvuJcYw-19J9YCeHHBA_lzR4x9sUZ-L-MLyd175XA3zEjHaPxprUxEMFw_kOlFcZr8FI9tk9THaqinJYH0KwgCZ5esDJGJmUya1WNHN6g9E0VEf3syh0zvjBTzLhiyzYqB1lmo-sjVuua7zgXniOD8jhBzE6k3M.jKgtbXvUrXsoajzWv4GFKhKEMvaD6BkVoOq6PbaqJ-U&dib_tag=se&keywords=cable%2Bmanagement&qid=1772475538&sprefix=Cable%2Bm%2Caps%2C135&sr=8-4&th=1&linkCode=ll2&tag=tamemj-20&linkId=ccb7f794ae24f29f6aa6669936a3b876&language=en_US&ref_=as_li_ss_tl",
    network: "Amazon Associates",
    status: "Active",
    platform: "Amazon"
  },
  {
    key: "amazon-pick-samsung-gaming-monitor-ls27fg500snxza",
    program: "Amazon Associates",
    label: "Samsung High Refresh Rate Gaming Monitor",
    description: "High refresh display option suited for mixed productivity and testing setups.",
    url: "https://www.amazon.com/Samsung-Response-Compatible-FreeSyncTM-LS27FG500SNXZA/dp/B0FNQDNGXY?crid=21A51YSZA8QZS&dib=eyJ2IjoiMSJ9.OeC2qGb60QSVyQ8X7iIdqrliQHABVPlgrwMzgc-BMAKBJSmputYT_-6hEDN3gTLpQ1FWNlpbF1QWMamykNMK5JdVPuj-BAoqLANoGl8ziN0WFj6QqWXlW-jXMRhNMSJcqfDOZI_9cba31tPwg8Vnaz5x-gKrlL-kDTFe5twp2449koImZnygytgfoHyRZkEL_PSNc5rac3AbetOcrSukfrXJWEDh_vu7WoC15pdjKMc.3GdwxOHBqY6wnydG8SjNPShTBSzZN29VIC-BMQ92YRI&dib_tag=se&keywords=high+refresh+rate+gaming+monitor&qid=1772475572&sprefix=high+ref%2Caps%2C129&sr=8-4&linkCode=ll2&tag=tamemj-20&linkId=c7c977f1319d8466a59e71fc7ff04e25&language=en_US&ref_=as_li_ss_tl",
    network: "Amazon Associates",
    status: "Active",
    platform: "Amazon"
  },
  {
    key: "amazon-pick-cyberpowerpc-gxivr8060a40",
    program: "Amazon Associates",
    label: "CyberPowerPC Gaming Desktop (GXiVR8060A40)",
    description: "Prebuilt desktop option for users who want a ready-to-run gaming or creator setup.",
    url: "https://www.amazon.com/CyberPowerPC-i5-13400F-GeForce-Windows-GXiVR8060A40/dp/B0DW4BY993?crid=307FUPMKIFRB&dib=eyJ2IjoiMSJ9.WqYswoO68EEB8Wv7rU7S2OeGzcdP2g4fobCbwRM_rdM_42KuneU0hk-9XzXkkAwKhhgQv2xGHQUmOmEGDrpafTVt5EojhJ4AGrzDtUNMwTPuPcMB0XVJORavdIAGjxC7-MFIxpM5-QIWNbQlbJEmKzZqKAoWpnvDub3m944uajELF97KoCteiQV_SalZVoydnLbzzgXvmoO8H2RuzDUgSpdwgEDj1YW1FwXyWxP6zeY.PDGvsro4yV8lwi2VVD_KjQ9gdHmm6Kb2S1Vs-TKKvSE&dib_tag=se&keywords=high+refresh+rate+gaming+pc&qid=1772475599&sprefix=high+refresh+rate+gaming+pc%2Caps%2C108&sr=8-1&linkCode=ll2&tag=tamemj-20&linkId=9c92611413251b292f6080182483a0f1&language=en_US&ref_=as_li_ss_tl",
    network: "Amazon Associates",
    status: "Active",
    platform: "Amazon"
  },
  {
    key: "adobe-affiliate",
    program: "Adobe Affiliate",
    label: "Adobe Creative Cloud",
    description:
      "Creative Cloud and Acrobat offers for design, PDF, and enterprise collaboration workflows.",
    url: "https://www.adobe.com/affiliates.html",
    network: "Partnerize",
    status: "Applied",
    platform: "Adobe"
  },
  {
    key: "onepassword-affiliate",
    program: "1Password Affiliate",
    label: "1Password Business",
    description: "Enterprise password manager recommendations for identity and endpoint hygiene.",
    url: "https://1password.com/affiliate/",
    network: "CJ",
    status: "Applied",
    platform: "1Password"
  },
  {
    key: "malwarebytes-affiliate",
    program: "Malwarebytes Affiliate",
    label: "Malwarebytes",
    description: "Endpoint protection and remediation tools for malware and threat cleanup workflows.",
    url: "https://www.malwarebytes.com/affiliates",
    network: "Partnerize",
    status: "Applied",
    platform: "Malwarebytes"
  },
  {
    key: "grammarly-affiliate",
    program: "Grammarly Affiliate",
    label: "Grammarly",
    description: "Writing and communication productivity tooling for business documentation workflows.",
    url: "https://www.grammarly.com/affiliates",
    network: "Impact",
    status: "Applied",
    platform: "Grammarly"
  },
  {
    key: "surfshark-affiliate",
    program: "Surfshark Affiliate",
    label: "Surfshark VPN",
    description: "Consumer VPN offer for privacy, secure remote work, and safe browsing guidance.",
    url: "https://get.surfshark.net/aff_c?offer_id=926&aff_id=45089",
    network: "Impact",
    status: "Active",
    platform: "Surfshark"
  },
  {
    key: "surfshark-antivirus-affiliate",
    program: "Surfshark Affiliate",
    label: "Surfshark Antivirus",
    description: "Consumer antivirus offer for endpoint protection and malware defense guidance.",
    url: "https://get.surfshark.net/aff_c?offer_id=934&aff_id=45089",
    network: "Impact",
    status: "Active",
    platform: "Surfshark"
  },
  {
    key: "surfshark-adblock-affiliate",
    program: "Surfshark Affiliate",
    label: "Surfshark Adblock",
    description: "Ad and tracker blocking offer for cleaner browsing and privacy-focused workflows.",
    url: "https://get.surfshark.net/aff_c?offer_id=1498&aff_id=45089",
    network: "Impact",
    status: "Active",
    platform: "Surfshark"
  },
  {
    key: "proton-partners",
    program: "Proton Partners",
    label: "Proton",
    description: "Privacy-first email and security tools aligned with security-aware support audiences.",
    url: "https://proton.me/partners/affiliates",
    network: "Proton Partners",
    status: "Applied",
    platform: "Proton"
  },
  {
    key: "apple-performance-partners",
    program: "Apple Services Performance Partners",
    label: "Apple Services",
    description: "Apple services partner program for approved promotional placements and campaigns.",
    url: "https://performance-partners.apple.com/home",
    network: "Apple Services Performance Partners",
    status: "Applied",
    platform: "Apple"
  }
];

export function getAffiliateLinkByKey(key: string): AffiliateLink | undefined {
  return affiliateLinks.find((entry) => entry.key === key);
}

export function getAffiliateLinksByKeys(keys: string[]): AffiliateLink[] {
  const wanted = new Set(keys);
  const ordered = keys
    .map((key) => affiliateLinks.find((entry) => entry.key === key))
    .filter((entry): entry is AffiliateLink => Boolean(entry));

  if (ordered.length === keys.length) {
    return ordered;
  }

  return affiliateLinks.filter((entry) => wanted.has(entry.key));
}
