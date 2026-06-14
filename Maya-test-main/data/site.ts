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

export const insightPosts: InsightPost[] = [
  {
    id: "post-01",
    slug: "investors-abroad-reduce-risk-before-deposit",
    title: "How Investors Abroad Can Reduce Risk Before Paying a Deposit",
    category: "Investor Guidance",
    image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1400&q=80",
    excerpt: "A practical guide to viewing verification, developer vetting, legal review, and on-ground representation before funds move.",
    content: `
      <p>Investing in international real estate can be rewarding, but the distance introduces unique risks that careful preparation can significantly reduce. Before committing capital to a Nairobi property from overseas, experienced investors follow a disciplined verification process.</p>
      
      <h2>1. Engage Independent On-Ground Representation</h2>
      <p>Never rely solely on developer's or seller's representations. Engage a licensed independent property consultant who has no financial interest in the transaction. Their role is to represent your interests, not the seller's.</p>
      <p>At Maya Haven, we act exclusively as buyer representatives. This means our guidance is structured around your objectives, not commission arrangements.</p>
      
      <h2>2. Verify Developer Track Record</h2>
      <p>Request documented evidence of previous completions. Visit or commission a visit to previous developments. Speak directly with prior buyers if possible. Look for:</p>
      <ul>
        <li>Time of delivery versus promised completion dates</li>
        <li>Quality of finishes in completed units</li>
        <li>Any legal disputes or title complications</li>
        <li>Actual rental yields versus projected figures</li>
      </ul>
      
      <h2>3. Legal Due Diligence is Non-Negotiable</h2>
      <p>Before any deposit, your lawyer should verify:</p>
      <ul>
        <li>Clear title and ownership structure</li>
        <li>No encumbrances or charges on the property</li>
        <li>Zoning compliance and permitted use</li>
        <li>Outstanding rates, taxes, or service charges</li>
        <li>Building permits and compliance certificates</li>
      </ul>
      
      <h2>4. Understand Your Payment Structure</h2>
      <p>Carefully review the payment schedule against construction milestones. Avoid structures that require large upfront payments before meaningful progress. Legitimate developers will accept staged payments tied to verified progress.</p>
      
      <h2>5. Virtual Viewing Protocol</h2>
      <p>For off-plan purchases, establish a structured viewing protocol. Commission a professional videographer to document the site, surrounding neighborhood, and comparable properties. Request drone footage of the development site and surrounding area.</p>
      
      <h2>The Bottom Line</h2>
      <p>These steps add cost and time, but they protect against the much larger losses that come from unverified commitments. The most successful international investors treat due diligence as an investment, not an expense.</p>
    `,
    author: {
      name: "Amara Okonkwo",
      avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80",
      role: "Senior Investment Advisor"
    },
    date: "2026-05-28",
    readingTime: 8,
    featured: true
  },
  {
    id: "post-02",
    slug: "good-address-versus-good-investment",
    title: "The Difference Between a Good Address and a Good Investment",
    category: "Market Intelligence",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80",
    excerpt: "Location prestige matters, but rental depth, management realism, and product quality matter even more over time.",
    content: `
      <p>In Nairobi's property market, the distinction between a prestigious address and a sound investment is often overlooked. New buyers frequently confuse premium zip codes with reliable returns. The reality is more nuanced.</p>
      
      <h2>Beyond the Postcode</h2>
      <p>A Kilimani address carries cachet, but if comparable units saturate the rental market, capital growth remains constrained. Conversely, emerging neighborhoods with strong infrastructure commitments may offer superior risk-adjusted returns.</p>
      
      <h2>Rental Depth Analysis</h2>
      <p>Before purchasing for investment purposes, map the rental landscape thoroughly:</p>
      <ul>
        <li>Current vacancy rates by neighborhood</li>
        <li>Typical days on market for rentals</li>
        <li>Rental yield trends over five years</li>
        <li>Tenant demand drivers (schools, employment hubs, transport)</li>
      </ul>
      
      <h2>Product-Quality Matters More Than Ever</h2>
      <p>In a market where supply increasingly outpaces demand in certain segments, quality differentiates. Properties with superior finishes, thoughtful layouts, and contemporary amenities command premium rents and maintain value better during market corrections.</p>
      
      <h2>The Management Variable</h2>
      <p>Even the best-located property underperforms with poor management. Factor in management costs realistically. Professional property management typically costs 8-12% of rental income but delivers occupancy consistency and tenant quality that self-management rarely achieves.</p>
    `,
    author: {
      name: "David Mwangi",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
      role: "Market Analyst"
    },
    date: "2026-05-21",
    readingTime: 6,
    featured: true
  },
  {
    id: "post-03",
    slug: "landlords-prepare-before-listing",
    title: "What Landlords Should Prepare Before Listing a Property",
    category: "Owner Insights",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80",
    excerpt: "The documentation, pricing discipline, imagery, and operational details that help attract better tenants and buyers.",
    content: `
      <p>Premium tenants and serious buyers have choices. Properties that present professionally, price competitively, and demonstrate operational clarity command disproportionate interest. Here's what serious landlords prepare before listing.</p>
      
      <h2>Documentation Package</h2>
      <p>Assemble complete documentation before viewings commence:</p>
      <ul>
        <li>Title deed or lease documentation</li>
        <li>Rate clearance certificates</li>
        <li>Building insurance documentation</li>
        <li>Recent professional valuation</li>
        <li>Service charge accounts and forecasts</li>
        <li>Maintenance history and schedules</li>
      </ul>
      
      <h2>Pricing Discipline</h2>
      <p>Emotional pricing—anchoring to purchase price, renovation costs, or neighbor's achieved prices—consistently prolongs vacancy. Work with advisors who present market data objectively, not just price expectations that secure your listing.</p>
      
      <h2>Professional Imagery</h2>
      <p>Photography matters enormously. Every viewing begins online. Budget for a professional property photographer who understands how to capture spaces in their best light. For luxury properties, consider videography and virtual tours.</p>
      
      <h2>Pre-Listing Maintenance</h2>
      <p>Address deferred maintenance before viewings. Leaking taps, worn fixtures, and peeling paint signal to tenants that ongoing issues won't be addressed. A property in move-in condition attracts tenants who maintain it accordingly.</p>
    `,
    author: {
      name: "Grace Wanjiku",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      role: "Property Management Lead"
    },
    date: "2026-05-14",
    readingTime: 5,
    featured: false
  },
  {
    id: "post-04",
    slug: "nairobi-kenya-2026-market-outlook",
    title: "Nairobi Property Market Outlook: What the Data Signals for 2026",
    category: "Market Intelligence",
    image: "https://images.unsplash.com/photo-1611348524140-53c9a25263d6?auto=format&fit=crop&w=1400&q=80",
    excerpt: "Transaction volumes, pricing trends, and rental yields across Nairobi's key neighborhoods point to a market finding its footing.",
    content: `
      <p>Nairobi's property market has navigated significant headwinds over the past three years. Interest rate pressures, currency volatility, and economic uncertainty have reshaped transaction patterns and pricing dynamics. Here's what the data suggests for the year ahead.</p>
      
      <h2>Transaction Volume Recovery</h2>
      <p>Q1 2026 data shows transaction volumes recovering at approximately 12% above Q1 2025 levels, driven primarily by renewed interest from East African regional buyers and diaspora investors taking advantage of favorable exchange rates.</p>
      
      <h2>Pricing: Stability Emerging</h2>
      <p>Prime residential areas including Kilimani, Kileleshwa, and Riverside have shown pricing stabilization after two years of adjustment. The adjustment has been uneven—some oversupplied segments (particularly mid-market apartments) continue to see modest corrections, while well-located standalone homes have held value.</p>
      
      <h2>Rental Market Resilience</h2>
      <p>Rental markets have proven more resilient than sales markets. Professional tenant demand remains strong in employment corridors near Westlands, Upper Hill, and Gigiri. Gross rental yields of 5-7% remain achievable for well-presented properties in good locations.</p>
      
      <h2>Emerging Opportunity Zones</h2>
      <p>Karen's residential expansion, accessibility improvements along Southern Bypass corridors, and redevelopment activity in Eastlands point to emerging opportunity zones where infrastructure investment precedes significant residential development.</p>
    `,
    author: {
      name: "James Kariuki",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      role: "Head of Research"
    },
    date: "2026-05-07",
    readingTime: 7,
    featured: false
  },
  {
    id: "post-05",
    slug: "diaspora-property-purchase-guide",
    title: "The Complete Guide to Purchasing Property in Kenya as a Diaspora Investor",
    category: "Diaspora Connect",
    image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=1400&q=80",
    excerpt: "From Power of Attorney to currency considerations, here is what overseas buyers need to understand before committing.",
    content: `
      <p>Purchasing property from overseas introduces procedural complexity that local buyers don't encounter. Understanding these requirements in advance prevents delays, additional costs, and transaction failures.</p>
      
      <h2>Power of Attorney Structures</h2>
      <p>Most diaspora buyers cannot travel to Kenya for every transaction milestone. A properly structured Power of Attorney (PoA) allows a trusted representative to execute documents on your behalf. The PoA must be:</p>
      <ul>
        <li>Executed before a Kenyan consul or notary public in your jurisdiction</li>
        <li>Authenticated (apostilled in most jurisdictions)</li>
        <li>Limited in scope and duration</li>
        <li>Registered with the Kenyan authorities</li>
      </ul>
      
      <h2>Currency and Transfer Considerations</h2>
      <p>Funds transfers from international accounts require documentation for CBK reporting. Work with banks experienced in diaspora property transfers. Build 2-3 weeks lead time for international wire processing and ensure transfer documentation clearly identifies the purpose (property purchase) to avoid compliance delays.</p>
      
      <h2>Tax Obligations</h2>
      <p>Non-resident sellers face Withholding Tax obligations on gains. As a buyer, you may be required to withhold and remit 20% of the purchase price to KRA. Structure transactions with tax advisors who understand non-resident obligations.</p>
      
      <h2>Virtual Due Diligence Protocol</h2>
      <p>Establish a systematic due diligence approach before committing. This includes document verification through your lawyer, independent property inspection (commission a trusted agent), and title search at the Land Registry.</p>
    `,
    author: {
      name: "Amara Okonkwo",
      avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80",
      role: "Senior Investment Advisor"
    },
    date: "2026-04-30",
    readingTime: 9,
    featured: false
  },
  {
    id: "post-06",
    slug: "luxury-living-nairobi-neighborhoods",
    title: "Living Luxuriously in Nairobi: Neighborhoods That Define Premium Living",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1400&q=80",
    excerpt: "From Karen's tree-lined estates to Gigiri's diplomatic character, a guide to Nairobi's most sought-after residential addresses.",
    content: `
      <p>Nairobi offers a remarkable range of residential environments within a compact metropolitan area. Understanding the character of each neighborhood helps buyers align lifestyle preferences with property investment.</p>
      
      <h2>Karen: The Classic Choice</h2>
      <p>Named after Karen Blixen, this suburb embodies Nairobi's colonial heritage with large plots, mature indigenous trees, and a village-like atmosphere. Properties range from restored colonial homes to contemporary interpretations. The area attracts families seeking space, privacy, and established community.</p>
      
      <h2>Kilimani and Kileleshwa: Urban Sophistication</h2>
      <p>These adjacent neighborhoods offer the highest density of modern apartments and townhouses. Kilimani particularly appeals to professionals who prioritize walkability to restaurants, gyms, and entertainment. Expect premium pricing for quality apartments with amenities.</p>
      
      <h2>Gigiri: Diplomatic Character</h2>
      <p>Home to most foreign embassies, Gigiri offers an established international atmosphere. The United Nations complex anchors employment demand. Properties tend toward generous gardens and mature landscaping. The Two Rivers Mall provides retail convenience without compromising residential character.</p>
      
      <h2>Riverside: Business Adjacent</h2>
      <p>Positioned between Westlands business district and Kilimani, Riverside attracts professionals who prioritize commute convenience. The neighborhood offers good value relative to pure prestige addresses while maintaining accessibility to major employment centers.</p>
      
      <h2>Muthaiga: Established Prestige</h2>
      <p> Nairobi's oldest and most exclusive suburb, Muthaiga features large stands, strict architectural guidelines, and an established golf club community. Property in Muthaiga represents the pinnacle of Nairobi residential status, with corresponding pricing.</p>
    `,
    author: {
      name: "Sophie Njeri",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      role: "Luxury Property Specialist"
    },
    date: "2026-04-23",
    readingTime: 6,
    featured: false
  },
  {
    id: "post-07",
    slug: "property-management-remote-landlords",
    title: "Managing Your Nairobi Property from Overseas: A Practical Framework",
    category: "Owner Insights",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1400&q=80",
    excerpt: "Remote property ownership requires structured systems. Here's how absentee landlords maintain value and generate consistent returns.",
    content: `
      <p>Distance creates information gaps that can erode property value and rental income if not addressed through systematic management approaches. Successful remote landlords build structures that compensate for physical absence.</p>
      
      <h2>Management Company Selection</h2>
      <p>The foundation of successful remote ownership is a competent property management partner. Evaluate management companies on:</p>
      <ul>
        <li>Reporting frequency and format (monthly minimum, weekly preferred)</li>
        <li>Tenant screening rigor and criteria</li>
        <li>Maintenance response times and contractor relationships</li>
        <li>Financial transparency and separate client accounts</li>
        <li>Fee structure and what services are included</li>
      </ul>
      
      <h2>Financial Oversight</h2>
      <p>Establish a Kenyan bank account for the property separate from personal accounts. Set up automated reporting. Review monthly statements without exception. Consider appointing an independent accountant for quarterly reviews to verify management company accuracy.</p>
      
      <h2>Maintenance Reserves</h2>
      <p>Budget 1-1.5% of property value annually for maintenance reserves, even if no immediate repairs are needed. This accumulates a fund for major maintenance and prevents emergency expenditure that coincides with vacancy periods.</p>
      
      <h2>Technology Leverage</h2>
      <p>Smart home technology enables remote monitoring. Basic installations—smart locks, security cameras, water leak detectors—provide visibility and control that physical distance otherwise denies. Modern property management software provides tenant portals, maintenance tracking, and financial reporting accessible from any timezone.</p>
    `,
    author: {
      name: "Grace Wanjiku",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      role: "Property Management Lead"
    },
    date: "2026-04-16",
    readingTime: 7,
    featured: false
  },
  {
    id: "post-08",
    slug: "off-plan-versus-ready-properties",
    title: "Off-Plan vs. Ready Properties: Which Delivers Better Value?",
    category: "Investor Guidance",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80",
    excerpt: "Understanding the risk-return profile of each approach helps investors align purchase strategy with objectives and risk tolerance.",
    content: `
      <p>The Nairobi market offers both off-plan opportunities from developers and completed properties from individual sellers. Each approach carries distinct risk-return characteristics that suit different investor profiles.</p>
      
      <h2>Off-Plan Advantages</h2>
      <p>Buying from plan typically offers 10-20% discount versus completed equivalent. Developers need pre-sales capital for construction, which they discount to secure. For investors with longer time horizons and higher risk tolerance, this discount can translate to meaningful capital gains at completion.</p>
      
      <h2>Off-Plan Risks</h2>
      <p>Completion delays are common in the Nairobi market. Some projects never complete. Quality rarely matches show unit presentation. Exit options are limited—you're committed before the asset exists. The discount must compensate for these risks and opportunity cost during extended construction periods.</p>
      
      <h2>Ready Property Advantages</h2>
      <p>Completed properties offer immediate rental income. What you see is what you get—no quality surprises. Easier financing through traditional mortgages. Faster capital recovery. Suitable for risk-averse investors or those needing current income.</p>
      
      <h2>Making the Choice</h2>
      <p>Off-plan suits investors with 3-5 year horizons, adequate reserves to weather delays, and higher risk tolerance. Ready properties suit those needing immediate returns, risk-averse investors, or buyers who prefer tangible assets before committing capital.</p>
    `,
    author: {
      name: "David Mwangi",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
      role: "Market Analyst"
    },
    date: "2026-04-09",
    readingTime: 6,
    featured: false
  },
  {
    id: "post-09",
    slug: "sustainable-real-estate-investment",
    title: "The Rise of Sustainable Real Estate: Why Green Features Matter for Nairobi Investors",
    category: "Market Intelligence",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1400&q=80",
    excerpt: "Energy efficiency, water conservation, and sustainable materials are moving from premium features to market expectations.",
    content: `
      <p>Sustainability in Nairobi real estate has evolved from niche premium to mainstream expectation, particularly among international buyers and professional tenant demographics. Understanding this shift helps investors position properties for future demand.</p>
      
      <h2>Energy Efficiency</h2>
      <p>Solar water heating has been standard in new construction for years. The next frontier is photovoltaic systems for electricity. Properties with solar installations benefit from reduced operating costs and appeal to environmentally conscious tenants willing to pay premium rents for sustainable features.</p>
      
      <h2>Water Management</h2>
      <p>Nairobi's periodic water insecurity makes water-efficient properties more resilient. Rainwater harvesting, grey water recycling, and drought-tolerant landscaping reduce dependence on municipal supply. Properties with autonomous water systems command rental premiums and experience shorter vacancy periods.</p>
      
      <h2>Materials and Construction Quality</h2>
      <p>Thermal insulation, double glazing, and cross-ventilation design reduce cooling costs while improving comfort. These features were rare in Nairobi construction but are increasingly specified in quality developments. When evaluating older properties, renovation investments in thermal performance offer strong returns through reduced utility costs and rental premiums.</p>
      
      <h2>Market Implications</h2>
      <p>Buildings account for approximately 40% of global carbon emissions. Regulatory pressure for energy efficiency standards will increase. Properties built to current sustainability standards face lower retrofitting costs when regulations tighten. Forward-looking investors factor sustainability credentials into long-term value retention.</p>
    `,
    author: {
      name: "James Kariuki",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      role: "Head of Research"
    },
    date: "2026-04-02",
    readingTime: 5,
    featured: false
  },
  {
    id: "post-10",
    slug: "negotiating-property-purchase-kenya",
    title: "The Art of Negotiation: Securing Favorable Terms in Nairobi Property Transactions",
    category: "Investor Guidance",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1400&q=80",
    excerpt: "Understanding local negotiation norms helps buyers achieve better outcomes without appearing disrespectful or creating adversarial relationships.",
    content: `
      <p>Property negotiation in Nairobi operates differently from formal auction markets. Understanding cultural context and local norms helps buyers achieve better terms while maintaining relationships that serve long-term interests.</p>
      
      <h2>Understanding Seller Psychology</h2>
      <p>Individual sellers often price based on emotional attachment rather than market data. Developers price with margin flexibility they rarely disclose initially. Approach each transaction with research on comparable sales to establish objective value anchors before entering negotiations.</p>
      
      <h2>Information Leverage</h2>
      <p>Revealing your research signals sophistication. Mentioning comparable properties, recent sales data, or identified defects demonstrates market knowledge that sellers cannot easily dismiss. Information asymmetry benefits whoever holds it—acquire it before negotiating.</p>
      
      <h2>Beyond Price</h2>
      <p>Sophisticated negotiation considers the complete transaction structure. Payment terms, included fixtures, completion timelines, and included warranties often matter more than headline price. A slightly higher price with favorable terms may outperform a lower price with unfavorable conditions.</p>
      
      <h2>Relationship Preservation</h2>
      <p>Nairobi's property market operates through networks. Aggressive negotiation tactics that burn bridges limit future market access. The best negotiators achieve favorable terms while leaving parties willing to transact again. Maya Haven's role includes managing negotiation dynamics to protect client relationships and future market access.</p>
      
      <h2>When to Walk Away</h2>
      <p>Set maximum terms before negotiating. If sellers won't meet minimum acceptable conditions, walking away preserves resources for better opportunities. Desperation signals weakness. Willingness to walk away often brings reluctant sellers back with better terms.</p>
    `,
    author: {
      name: "Amara Okonkwo",
      avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80",
      role: "Senior Investment Advisor"
    },
    date: "2026-03-26",
    readingTime: 6,
    featured: false
  }
];

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

export const eventsGalleryItems = [
  {
    title: "Private Buyer Briefing",
    category: "Investor Event",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=80",
    excerpt: "An intimate client briefing focused on Nairobi residential pricing, due diligence, and emerging demand patterns."
  },
  {
    title: "Curated Property Tour",
    category: "Viewing Experience",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80",
    excerpt: "A premium multi-stop viewing day designed for overseas clients narrowing a shortlist quickly and carefully."
  },
  {
    title: "Completed Handover Gallery",
    category: "Client Milestone",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1400&q=80",
    excerpt: "A visual archive section for completed transactions, furnished setups, and management-ready handovers."
  }
];
