import type { Metadata } from "next";

type MetadataArgs = {
  title?: string;
  description?: string;
  image?: string;
};

const defaultTitle = "Maya Haven | Luxury Nairobi Real Estate";
const defaultDescription =
  "Cinematic luxury real estate across Nairobi, from penthouses and curated residences to expat housing and investment properties.";

export function createMetadata({ title, description, image }: MetadataArgs = {}): Metadata {
  const resolvedTitle = title ? `${title} | Maya Haven` : defaultTitle;
  const resolvedDescription = description ?? defaultDescription;
  const images = image ? [{ url: image, width: 1200, height: 630, alt: resolvedTitle }] : undefined;

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    metadataBase: new URL("https://maya-haven.example"),
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      images,
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
