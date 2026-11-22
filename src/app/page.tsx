import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedSection from "@/components/home/FeaturedSection";
import HeroBanner from "@/components/home/HeroBanner";
import HowItWorks from "@/components/home/HowItWorks";
import ReviewsSection from "@/components/home/ReviewsSection";
import TrustedOwners from "@/components/home/TrustedOwners";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import { publicFetch } from "@/lib/public-api";
import type { PublicEquipment } from "@/types/equipment";
import type { CategoryCount, Review, TopOwner } from "@/types/home";

function valueOrEmpty<T>(result: PromiseSettledResult<T[]>): T[] {
  return result.status === "fulfilled" ? result.value : [];
}

export default async function HomePage() {
  // If the server is down, the page still loads with empty sections
  const [featured, categories, reviews, owners] = await Promise.allSettled([
    publicFetch<PublicEquipment[]>("/equipment/featured"),
    publicFetch<CategoryCount[]>("/equipment/categories"),
    publicFetch<Review[]>("/reviews"),
    publicFetch<TopOwner[]>("/equipment/owners"),
  ]);

  return (
    <>
      <HeroBanner />
      <FeaturedSection items={valueOrEmpty(featured)} />
      <CategoriesSection counts={valueOrEmpty(categories)} />
      <WhyChooseUs />
      <ReviewsSection reviews={valueOrEmpty(reviews)} />
      <HowItWorks />
      <TrustedOwners owners={valueOrEmpty(owners)} />
    </>
  );
}
