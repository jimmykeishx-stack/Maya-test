import type { Metadata } from "next";

type MetadataArgs = {
  title?: string;
  description?: string;
};

const defaultTitle = "Maya Haven | Luxury Nairobi Real Estate";
const defaultDescription =
  "Cinematic luxury real estate across Nairobi, from penthouses and curated residences to expat housing and investment properties.";

export function createMetadata({ title, description }: MetadataArgs = {}): Metadata {
  const resolvedTitle = title ? `${title} | Maya Haven` : defaultTitle;
  const resolvedDescription = description ?? defaultDescription;

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    metadataBase: new URL("https://maya-haven.example"),
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      type: "website",
      siteName: "Maya Haven"
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription
    }
  };
}
