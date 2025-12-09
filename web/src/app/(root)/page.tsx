import {
  CategoriesSection,
  FeaturedProductsSection,
  FlashSaleSection,
  NewArrivalsSection,
  BrandsSection,
  NewsletterSection,
  HeroSection,
} from "./_components/home";
import { getHomepageDataAction } from "@/actions/homepage.actions";
import { MOCK_PRODUCTS } from "@/lib/constants";
import { IHomePage } from "@/interfaces";

const HomePage = async () => {
  const result = await getHomepageDataAction();

  let homepageData: IHomePage;
  if (result.success && result.data) {
    homepageData = result.data;
  } else {
    homepageData = {
      categories: [],
      featuredProducts: MOCK_PRODUCTS.slice(0, 8),
      flashSale: [],
      newArrivals: MOCK_PRODUCTS.slice(0, 8),
      brands: [],
    };
  }

  return (
    <>
      <HeroSection
        products={
          homepageData.featuredProducts.length > 0
            ? homepageData.featuredProducts.slice(0, 5)
            : MOCK_PRODUCTS.slice(0, 5)
        }
      />

      {homepageData.categories.length > 0 && (
        <CategoriesSection categories={homepageData.categories} />
      )}

      {homepageData.featuredProducts.length > 0 && (
        <FeaturedProductsSection products={homepageData.featuredProducts} />
      )}

      {homepageData.flashSale.length > 0 && (
        <FlashSaleSection products={homepageData.flashSale} />
      )}

      {homepageData.newArrivals.length > 0 && (
        <NewArrivalsSection products={homepageData.newArrivals} />
      )}

      {homepageData.brands.length > 0 && (
        <BrandsSection brands={homepageData.brands} />
      )}

      <NewsletterSection />
    </>
  );
};

export default HomePage;
