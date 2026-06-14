"use client";

import {
  CardTransformed,
  CardsContainer,
  ContainerScroll,
  ReviewStars
} from "@/components/blocks/animated-cards-stack";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { clientReviews } from "@/data/site";

export function ClientTestimonials() {
  return (
    <section className="section-space bg-[#12100f] px-3 text-white sm:px-4">
      <div className="site-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="quiet-label text-[var(--gold)]">What Our Clients Say</p>
          <h2 className="mt-4 font-display text-3xl leading-tight text-balance sm:text-4xl md:text-5xl">
          </h2>
        </div>
      </div>
      <ContainerScroll className="site-shell mt-10 min-h-[220svh] md:min-h-[280svh]">
        <div className="sticky left-0 top-0 h-[82svh] w-full py-6 sm:h-[86svh] sm:py-10 md:h-svh">
          <CardsContainer className="mx-auto h-[360px] w-[min(100%,320px)] sm:h-[400px] sm:w-[min(100%,340px)] md:h-[430px] md:w-[min(100%,360px)]">
            {clientReviews.map((review, index) => (
              <CardTransformed
                key={review.id}
                arrayLength={clientReviews.length}
                index={index + 2}
                variant="dark"
                role="article"
                aria-labelledby={`card-${review.id}-title`}
                aria-describedby={`card-${review.id}-content`}
              >
                <div className="flex flex-col items-center space-y-4 text-center">
                  <ReviewStars className="text-[var(--gold)]" rating={review.rating} />
                  <div className="mx-auto w-[88%] text-base leading-7 text-white/82 sm:text-lg sm:leading-8">
                    <blockquote id={`card-${review.id}-content`}>{review.quote}</blockquote>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar className="!size-12 border border-white/10">
                    <AvatarImage src={review.avatarUrl} alt={`Portrait of ${review.name}`} />
                    <AvatarFallback>
                      {review.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span id={`card-${review.id}-title`} className="block text-lg font-semibold tracking-tight md:text-xl">
                      {review.name}
                    </span>
                    <span className="block text-sm text-white/50">{review.role}</span>
                  </div>
                </div>
              </CardTransformed>
            ))}
          </CardsContainer>
        </div>
      </ContainerScroll>
    </section>
  );
}
