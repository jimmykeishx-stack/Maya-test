export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Enums: {
      app_role: "user" | "agent" | "admin";
      blog_status: "draft" | "published" | "archived";
      lead_status: "new" | "contacted" | "viewing_scheduled" | "negotiating" | "converted" | "closed_lost";
      property_listing_type: "sale" | "rent";
      property_mandate_type: "exclusive" | "open";
      property_status: "available" | "sold" | "rented" | "archived";
      property_segment: "residential" | "commercial" | "affordable_housing";
    };
    Tables: {
      admins: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["admins"]["Insert"]>;
        Relationships: [];
      };
      agents: {
        Row: {
          id: string;

          full_name: string | null;
          title: string | null;
          email: string | null;
          phone_number: string | null;
          whatsapp_number: string | null;
          bio: string | null;
          image_url: string | null;
          license_number: string | null;
          earb_registration_number: string | null;
          territory: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id?: string | null;
          full_name?: string | null;
          title?: string | null;
          email?: string | null;
          phone_number?: string | null;
          whatsapp_number?: string | null;
          bio?: string | null;
          image_url?: string | null;
          license_number?: string | null;
          earb_registration_number?: string | null;
          territory?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["agents"]["Insert"]>;
        Relationships: [];
      };
      amenities: {
        Row: {
          id: string;
          slug: string;
          label: string;
          category: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          label: string;
          category?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["amenities"]["Insert"]>;
        Relationships: [];
      };
      blog_posts: {
        Row: {
          id: string;
          author_profile_id: string | null;
          slug: string;
          title: string;
          excerpt: string;
          body: string;
          status: Database["public"]["Enums"]["blog_status"];
          category: string;
          tags: string[];
          featured_image_url: string | null;
          seo_title: string | null;
          seo_description: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_profile_id?: string | null;
          slug: string;
          title: string;
          excerpt: string;
          body: string;
          status?: Database["public"]["Enums"]["blog_status"];
          category: string;
          tags?: string[];
          featured_image_url?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["blog_posts"]["Insert"]>;
        Relationships: [];
      };
      event_gallery_items: {
        Row: {
          id: string;
          title: string;
          category: string;
          excerpt: string;
          image_url: string;
          status: Database["public"]["Enums"]["blog_status"];
          event_date: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          category: string;
          excerpt: string;
          image_url: string;
          status?: Database["public"]["Enums"]["blog_status"];
          event_date?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["event_gallery_items"]["Insert"]>;
        Relationships: [];
      };
      inquiries: {
        Row: {
          id: string;
          property_id: string | null;
          profile_id: string | null;
          source: string;
          full_name: string;
          email: string;
          phone_number: string;
          message: string;
          lead_status: Database["public"]["Enums"]["lead_status"];
          assigned_agent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          property_id?: string | null;
          profile_id?: string | null;
          source: string;
          full_name: string;
          email: string;
          phone_number: string;
          message: string;
          lead_status?: Database["public"]["Enums"]["lead_status"];
          assigned_agent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["inquiries"]["Insert"]>;
        Relationships: [];
      };
      properties: {
        Row: {
          id: string;
          legacy_id: string | null;
          slug: string;
          title: string;
          description: string;
          property_type: string;
          listing_type: Database["public"]["Enums"]["property_listing_type"];
          status: Database["public"]["Enums"]["property_status"];
          segment: Database["public"]["Enums"]["property_segment"];
          mandate_type: Database["public"]["Enums"]["property_mandate_type"];
          price: number;
          location: string | null;
          currency: string;
          negotiable: boolean;
          featured: boolean;
          price_suffix: string | null;
          area_sqft: number | null;
          lot_area_sqft: number | null;
          bedrooms: number | null;
          bathrooms: number | null;
          parking_spaces: number | null;
          furnished: boolean | null;
          year_built: number | null;
          floor_number: number | null;
          highlight: string | null;
          blurb: string | null;
          agent_note: string | null;
          cover_image: string | null;
          gallery_images: string[];
          amenities: string[];
          youtube_video_id: string | null;
          metrics: Json | null;
          features: string[];
          virtual_tour_url: string | null;
          meta_title: string | null;
          meta_description: string | null;
          og_image_url: string | null;
          location_id: string | null;
          agent_id: string | null;
          owner_profile_id: string | null;
          created_by: string | null;
          created_at: string | null;
          archived_at: string | null;
          soft_deleted_at: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          legacy_id?: string | null;
          slug: string;
          title: string;
          description: string;
          property_type: string;
          listing_type: Database["public"]["Enums"]["property_listing_type"];
          status?: Database["public"]["Enums"]["property_status"];
          segment?: Database["public"]["Enums"]["property_segment"];
          mandate_type?: Database["public"]["Enums"]["property_mandate_type"];
          price: number;
          location?: string | null;
          currency?: string;
          negotiable?: boolean;
          featured?: boolean;
          price_suffix?: string | null;
          area_sqft?: number | null;
          lot_area_sqft?: number | null;
          bedrooms?: number | null;
          bathrooms?: number | null;
          parking_spaces?: number | null;
          furnished?: boolean | null;
          year_built?: number | null;
          floor_number?: number | null;
          highlight?: string | null;
          blurb?: string | null;
          agent_note?: string | null;
          cover_image?: string | null;
          gallery_images?: string[];
          amenities?: string[];
          youtube_video_id?: string | null;
          metrics?: Json | null;
          features?: string[];
          virtual_tour_url?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          og_image_url?: string | null;
          location_id?: string | null;
          agent_id?: string | null;
          owner_profile_id?: string | null;
          created_by?: string | null;
          created_at?: string | null;
          archived_at?: string | null;
          soft_deleted_at?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["properties"]["Insert"]>;
        Relationships: [];
      };
      property_agents: {
        Row: {
          property_id: string;
          agent_id: string;
          role: string;
          created_at: string;
        };
        Insert: {
          property_id: string;
          agent_id: string;
          role?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["property_agents"]["Insert"]>;
        Relationships: [];
      };
      property_videos: {
        Row: {
          id: string;
          property_id: string;
          provider: string;
          embed_url: string;
          title: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          provider: string;
          embed_url: string;
          title?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["property_videos"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
