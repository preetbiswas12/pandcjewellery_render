import { HeroSection } from '../components/HeroSection';
import { TrendingSection } from '../components/TrendingSection';
import { ColorExplorer } from '../components/ColorExplorer';
import { Testimonial } from '../components/Testimonial';
import { ServicesSection } from '../components/ServicesSection';
import { useApp } from '../context/AppContext';

export default function HomePage() {
  const { addToCart, wishlist, toggleWishlist } = useApp();

  return (
    <>
      <HeroSection />
      
      <TrendingSection
        onAddToCart={addToCart}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
      />
      
      <ColorExplorer />
      
      <Testimonial />
      
      <ServicesSection />
    </>
  );
}
