export const companyContact = {
  primaryEmail: "info@mayahaven.com",
  secondaryEmail: "mayahavenhomes@gmail.com",
  whatsappDisplay: "+254 720 584 744",
  whatsappNumber: "254720584744",
  whatsappHref: "https://wa.me/254720584744",
  officeLabel: "Riverside Drive, Nairobi"
} as const;

export const clientReviews = [
  {
    id: "client-01",
    name: "James S.",
    role: "International Property Investor",
    rating: 5,
    quote: "The process felt discreet, professional, and genuinely protective of our capital from the first consultation.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "client-02",
    name: "Jessica H.",
    role: "Relocation Client",
    rating: 4.5,
    quote: "Virtual viewings were thorough, the documentation was clear, and the team made a Kenya move feel far less risky.",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "client-03",
    name: "Lisa M.",
    role: "Landlord Client",
    rating: 5,
    quote: "Maya Haven helped us source the right tenant profile quickly while keeping communication polished and practical.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "client-04",
    name: "David K.",
    role: "Buyer Representation Client",
    rating: 5,
    quote: "Their due diligence support and market honesty gave us the confidence to complete the purchase from abroad.",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80"
  }
];

export const serviceCards = [
  {
    title: "Property Sourcing",
    description: "Targeted sourcing of homes and investment stock aligned with location, budget, risk profile, and lifestyle goals.",
    icon: "search"
  },
  {
    title: "Sourcing Buyers",
    description: "Mandate-driven buyer outreach for owners seeking qualified purchasers, cleaner negotiations, and better presentation.",
    icon: "users"
  },
  {
    title: "Sourcing Tenants",
    description: "Tenant placement support with screening, fit assessment, and practical occupancy planning for landlords.",
    icon: "key"
  },
  {
    title: "Consultation Services",
    description: "Private advisory sessions for investors abroad, first-time buyers, and clients structuring the next move carefully.",
    icon: "message"
  },
  {
    title: "Vetting Developers",
    description: "Project, developer, and seller screening designed to reduce avoidable risk before money or time is committed.",
    icon: "shield"
  },
  {
    title: "Property Management",
    description: "Hands-on coordination for owners who need local tenant, maintenance, reporting, and rent-management support.",
    icon: "building"
  }
];

export const trustIndicators = [
  {
    title: "EARB Credential Section",
    description: "A dedicated compliance block designed to present EARB credential references, practice standards, and client-facing due diligence signals.",
    eyebrow: "Professional Standards"
  },
  {
    title: "Diaspora-Ready Guidance",
    description: "Processes built for global investors who need clarity, verification, and trusted local coordination across every transaction stage.",
    eyebrow: "Client Confidence"
  },
  {
    title: "Discreet Representation",
    description: "A measured, confidential style of buyer, seller, and landlord support that prioritizes trust over pressure.",
    eyebrow: "Relationship-Led"
  }
];

export const aboutStats = [
  { value: "KES 2.4B+", label: "Property opportunities reviewed" },
  { value: "6", label: "Core service lines" },
  { value: "Priority", label: "response times" },
  { value: "100%", label: "Consultation-led approach" }
];

export const timeline = [
  { year: "2021", title: "Advisory Foundation", description: "Maya Haven begins as a relationship-led property advisory focused on clarity, sourcing, and trust." },
  { year: "2023", title: "Global Investor Expansion", description: "The platform expands to support investors abroad with virtual viewings, purchase guidance, and management coordination." },
  { year: "2025", title: "Premium Marketplace Evolution", description: "Residential, commercial, and affordable housing services converge into a more structured digital property platform." }
];

export const insightCategories = [
  "All",
  "Market Intelligence",
  "Investor Guidance",
  "Owner Insights",
  "Diaspora Connect",
  "Lifestyle"
] as const;

export type InsightCategory = (typeof insightCategories)[number];

export interface InsightPost {
  id: string;
  slug: string;
  title: string;
  category: InsightCategory | "MAYA HAVEN INSIGHT";
  image: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  date: string;
  readingTime: number;
  featured: boolean;
}

export const insightPosts: InsightPost[] = [];

export const diasporaProcess = [
  {
    step: "01",
    title: "Brief & Consultation",
    description: "We understand your goals, budget, timing, risk concerns, and whether the focus is home ownership, rental income, or long-term investment."
  },
  {
    step: "02",
    title: "Sourcing & Verification",
    description: "Suitable opportunities are shortlisted and screened, with seller or developer checks and supporting document review before viewings progress."
  },
  {
    step: "03",
    title: "Virtual Viewings & Negotiation",
    description: "You receive guided virtual tours, comparative feedback, and on-ground representation during pricing and term discussions."
  },
  {
    step: "04",
    title: "Completion & Management Support",
    description: "We help coordinate the final purchase journey and can connect you to vetted professionals and post-purchase management support."
  }
];

export const diasporaFaqs = [
  {
    question: "Can Maya Haven help if I am buying from outside Kenya?",
    answer: "Yes. Diaspora Connect is designed for investors abroad who need sourcing, virtual viewings, local verification, and support through completion."
  },
  {
    question: "Do you vet developers and property owners?",
    answer: "Yes. Our process includes screening counterparties, reviewing documentation, and helping surface obvious risk signals before a client commits further."
  },
  {
    question: "Can you help after purchase?",
    answer: "Yes. We can support property management coordination, tenant sourcing, maintenance workflows, and introductions to legal or professional referrals."
  },
  {
    question: "Do you work with commercial and affordable housing clients too?",
    answer: "Yes. The marketplace now includes residential, commercial, and affordable housing opportunities depending on client goals and budget."
  }
];

export const virtualViewingFeatures = [
  "Scheduled live walkthroughs with commentary and neighborhood context",
  "Recorded video recaps for later review with family or investment partners",
  "Room-by-room practical observations, not only marketing highlights",
  "Support comparing multiple options before travel or commitment",
  "Prioritized response times with dedicated investor support during active searches"
];

export const eventsGalleryItems: { title: string; category: string; image: string; excerpt: string }[] = [];
