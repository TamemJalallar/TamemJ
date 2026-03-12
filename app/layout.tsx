import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import type { Organization, Person, SearchAction, WebSite, WithContext } from "schema-dts";
import "./globals.css";
import { AccountProvider } from "@/components/account/account-provider";
import { SentryBootstrap } from "@/components/monitoring/sentry-bootstrap";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { GlobalCommandPalette } from "@/components/support-portal/global-command-palette";
import { buildOpenGraph, buildTwitter, toAbsoluteUrl } from "@/lib/seo";
import { seoKeywords, siteConfig } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const googleAnalyticsId =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "G-ZJR5L6081Z";
const googleTagManagerId =
  process.env.NEXT_PUBLIC_GTM_CONTAINER_ID?.trim() || "GTM-W7XQ7KBV";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: "%s | TamemJ"
  },
  description: siteConfig.description,
  keywords: seoKeywords,
  applicationName: "tamemj.com",
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "Technology",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  alternates: {
    canonical: "/"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  openGraph: buildOpenGraph(siteConfig.title, siteConfig.description, "/"),
  twitter: buildTwitter(siteConfig.title, siteConfig.description),
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon", sizes: "48x48" },
      { url: "/icons/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icons/icon-512.png", type: "image/png", sizes: "512x512" }
    ],
    shortcut: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f8fafc"
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const websiteSchema: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.title,
    alternateName: siteConfig.tagline,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: `${toAbsoluteUrl("/support/tickets/")}?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    } as SearchAction
  };

  const organizationSchema: WithContext<Organization> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    description: siteConfig.description,
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.supportEmail,
      contactType: "customer support",
      url: toAbsoluteUrl("/support/")
    }
  };

  const personSchema: WithContext<Person> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    jobTitle: "IT Solutions Engineer",
    email: siteConfig.email,
    description: siteConfig.description,
    worksFor: {
      "@type": "Organization",
      name: siteConfig.name
    }
  };

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta
          name="impact-site-verification"
          {...({ value: "6f0bde00-6698-4a2c-9ce5-4830ca1e13b5" } as any)}
        />
        {googleTagManagerId ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${googleTagManagerId}');`
            }}
          />
        ) : null}
        {googleAnalyticsId ? (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${googleAnalyticsId}');`
              }}
            />
          </>
        ) : null}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8852243900182779"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans antialiased">
        {googleTagManagerId ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${googleTagManagerId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        ) : null}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme:dark)").matches))document.documentElement.classList.add("dark")}catch(e){}})();`
          }}
        />
        <AccountProvider>
          <SentryBootstrap />
          <div className="min-h-screen bg-mesh-soft">
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
          </div>
          <GlobalCommandPalette />
        </AccountProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}
