import { Star } from "lucide-react";
import type { Review } from "@/types/home";
import { RevealGroup, RevealItem } from "@/components/home/Reveal";
import SectionHeading from "@/components/home/SectionHeading";

function Stars({ rating }: { rating: number }) {
  return (
    <div
      className="flex gap-0.5 text-primary"
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={16}
          className={index < rating ? "fill-current" : "text-base-300"}
        />
      ))}
    </div>
  );
}

export default function ReviewsSection({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  return (
    <section className="bg-base-200/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Customer reviews"
          title="What our customers say"
          description="Real renters share how RentGear worked for their projects."
        />

        <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <RevealItem key={review._id} className="h-full">
              <figure className="flex h-full flex-col gap-4 rounded-box border border-base-300 bg-base-100 p-6">
                <Stars rating={review.rating} />
                <blockquote className="flex-1 text-sm leading-relaxed text-base-content/80">
                  {review.comment}
                </blockquote>
                <figcaption className="flex items-center gap-3 border-t border-base-300 pt-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-content">
                    {review.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold">
                      {review.name}
                    </span>
                    <span className="block truncate text-xs text-base-content/60">
                      {review.title}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
