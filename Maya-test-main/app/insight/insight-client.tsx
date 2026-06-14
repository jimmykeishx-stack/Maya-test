"use client";

import { useState, useMemo } from "react";
import { ArticleCard } from "@/components/insight/article-card";
import { CategoryFilter } from "@/components/insight/category-filter";
import { SearchBar } from "@/components/insight/search-bar";
import { ArticleSkeleton } from "@/components/insight/article-skeleton";
import { SectionHeading } from "@/components/site/section-heading";
import { CTASection } from "@/components/site/cta-section";
import { insightPosts, insightCategories, type InsightPost } from "@/data/site";
import { Search, BookOpen } from "lucide-react";

const POSTS_PER_PAGE = 6;

export function InsightClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const featuredPost = useMemo(() => insightPosts.find((post) => post.featured), []);

  const filteredPosts = useMemo(() => {
    let posts = insightPosts.filter((post) => !post.featured);

    if (selectedCategory !== "All") {
      posts = posts.filter((post) => post.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.author.name.toLowerCase().includes(query) ||
          post.category.toLowerCase().includes(query)
      );
    }

    return posts;
  }, [selectedCategory, searchQuery]);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Featured post is imported separately to avoid it appearing in the filtered list
  const { FeaturedArticleHero } = require("@/components/insight/featured-article-hero");

  return (
    <>
      {/* Featured Hero - only render if we have a featured post */}
      {featuredPost && <FeaturedArticleHero post={featuredPost} />}

      {/* Search and Filter Section */}
      <section className="section-space">
        <div className="site-shell space-y-8">
          <SectionHeading
            eyebrow="MAYA HAVEN INSIGHT"
            title="Market guidance for buyers, international property investors, landlords, and owners."
            description="A cleaner editorial layer for the questions clients actually ask before they buy, rent, list, or move capital."
          />

          {/* Search and Filter */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full sm:max-w-sm">
              <SearchBar
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search articles..."
              />
            </div>
            <div className="w-full overflow-x-auto sm:w-auto">
              <CategoryFilter
                categories={insightCategories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-muted-foreground">
            {filteredPosts.length === 0
              ? "No articles found"
              : `Showing ${paginatedPosts.length} of ${filteredPosts.length} articles`}
          </p>

          {/* Articles Grid */}
          {filteredPosts.length === 0 ? (
            <EmptyState
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              onClearFilters={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
            />
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {paginatedPosts.map((post, index) => (
                  <ArticleCard key={post.id} post={post} priority={index < 3} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-8">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/70 text-sm font-medium text-muted-foreground transition-all duration-300 hover:border-[var(--gold)]/30 hover:bg-[var(--gold)]/5 hover:text-[#12100f] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    ←
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`flex h-10 min-w-[40px] items-center justify-center rounded-full px-3 text-sm font-medium transition-all duration-300 ${
                        currentPage === page
                          ? "bg-[#12100f] text-[var(--gold)]"
                          : "border border-black/10 bg-white/70 text-muted-foreground hover:border-[var(--gold)]/30 hover:bg-[var(--gold)]/5 hover:text-[#12100f]"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/70 text-sm font-medium text-muted-foreground transition-all duration-300 hover:border-[var(--gold)]/30 hover:bg-[var(--gold)]/5 hover:text-[#12100f] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <CTASection
        primaryHref="/contact"
        primaryLabel="Speak With Us"
        secondaryHref="/properties"
        secondaryLabel="View Listings"
      />
    </>
  );
}

function EmptyState({
  searchQuery,
  selectedCategory,
  onClearFilters
}: {
  searchQuery: string;
  selectedCategory: string;
  onClearFilters: () => void;
}) {
  const hasFilters = searchQuery || selectedCategory !== "All";

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[1.8rem] border border-black/6 bg-white/55 py-16 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--gold)]/10">
        {hasFilters ? (
          <Search className="h-8 w-8 text-[var(--gold)]" />
        ) : (
          <BookOpen className="h-8 w-8 text-[var(--gold)]" />
        )}
      </div>

      <h3 className="font-display text-xl text-[#12100f] sm:text-2xl">
        {hasFilters ? "No matching articles" : "No articles yet"}
      </h3>

      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {hasFilters
          ? "Try adjusting your search terms or category filter to find what you're looking for."
          : "Check back soon for new insights and market intelligence from Maya Haven."}
      </p>

      {hasFilters && (
        <button
          onClick={onClearFilters}
          className="mt-6 rounded-full border border-[var(--gold)]/30 bg-[var(--gold)]/5 px-6 py-2.5 text-sm font-medium text-[#12100f] transition-all duration-300 hover:bg-[var(--gold)]/10"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
