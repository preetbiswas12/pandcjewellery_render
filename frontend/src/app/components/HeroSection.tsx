import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { convertGoogleDriveLink } from '../../lib/googleDriveUtils';
import { NoiseButton } from '../../components/ui/noise-button';
import imgImage3 from "../../assets/3071b1fc729091cd0452fb9d0b89106ceec16368.png";
import imgImage5 from "../../assets/17aa3a2f29a85f64d93c41afa6b64d31b3a88038.png";
import imgImage7 from "../../assets/837e11f00233936f837e7b69d6a545511b1ba132.png";
import imgImage10 from "../../assets/5e143183ca0df25c3d226a223269e70541e09760.png";
import imgImage12 from "../../assets/b0b782c02a24c60e5479cec788203caf906828d8.png";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const { banners } = useApp();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const mainHeroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const sideCardsRef = useRef<HTMLDivElement>(null);
  const inspirationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main hero animation
      gsap.from(mainHeroRef.current, {
        scale: 0.95,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.5
      });

      // Title animation with stagger
      if (titleRef.current) {
        const lines = titleRef.current.querySelectorAll('h2');
        gsap.from(lines, {
          x: -50,
          opacity: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          delay: 0.8
        });
      }

      // Side cards stagger animation
      if (sideCardsRef.current) {
        const cards = sideCardsRef.current.querySelectorAll('.hero-card');
        gsap.from(cards, {
          y: 80,
          opacity: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          delay: 0.7
        });
      }

      // Casual Inspirations section with scroll trigger
      if (inspirationRef.current) {
        gsap.from(inspirationRef.current.children, {
          scrollTrigger: {
            trigger: inspirationRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          },
          y: 100,
          opacity: 0,
          duration: 1,
          stagger: 0.3,
          ease: 'power3.out'
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Get banners by type
  const activeBanners = banners.filter(b => b.isActive).sort((a, b) => a.order - b.order);
  const heroMainBanner = activeBanners.find(b => b.type === 'hero-main');
  const heroSideBanners = activeBanners.filter(b => b.type === 'hero-side').slice(0, 2);
  const casualBanners = activeBanners.filter(b => b.type === 'casual-inspiration').slice(0, 2);

  // Default fallback data
  const defaultHeroMain = {
    title: 'Color of\nSummer\nOutfit',
    subtitle: '100+ Collections for your outfit inspirations in this summer',
    image: imgImage3,
    link: '/shop',
    buttonText: 'VIEW COLLECTIONS'
  };

  const defaultHeroSide = [
    { title: 'Outdoor\nActive', image: imgImage5, link: '/shop' },
    { title: 'Casual\nComfort', image: imgImage7, link: '/shop' }
  ];

  const defaultCasual = [
    { title: 'Say it\nwith Shirt', image: imgImage10, link: '/shop' },
    { title: 'Funky never\nget old', image: imgImage12, link: '/shop' }
  ];

  return (
    <div ref={heroRef} className="w-full py-8 md:py-12">
      {/* Main Hero */}
      <div className="px-4 md:px-8 lg:px-14 xl:px-24 2xl:px-32 flex flex-col lg:flex-row justify-start items-stretch gap-2.5 w-full max-w-[2000px] mx-auto">
        <div ref={mainHeroRef} className="relative w-full lg:w-1/2 xl:w-3/5 h-[300px] sm:h-[400px] md:h-[600px] lg:h-[650px] xl:h-[770px] rounded-[40px] overflow-hidden bg-zinc-300 flex-shrink-0">
          <img 
            src={convertGoogleDriveLink(heroMainBanner?.image || defaultHeroMain.image)} 
            alt="Summer Outfit" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
          <div ref={titleRef} className="absolute top-[20px] md:top-[40px] lg:top-[50px] xl:top-[60px] left-[20px] md:left-[40px] lg:left-[40px] xl:left-[60px] w-64 md:w-80 lg:w-72 xl:w-80 inline-flex flex-col justify-start items-start gap-5 lg:gap-6 xl:gap-7">
            <div className="self-stretch flex flex-col justify-start items-start gap-3 lg:gap-4 xl:gap-5">
              <h2 className="text-white text-3xl md:text-5xl lg:text-6xl xl:text-8xl font-normal leading-tight lg:leading-[65px] xl:leading-[75px]">
                {(heroMainBanner?.title || defaultHeroMain.title).split('\\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < (heroMainBanner?.title || defaultHeroMain.title).split('\\n').length - 1 && <br />}
                  </span>
                ))}
              </h2>
              <p className="self-stretch opacity-80 text-white text-xs md:text-sm lg:text-base xl:text-lg font-normal leading-5 lg:leading-5 xl:leading-6">
                {heroMainBanner?.subtitle || defaultHeroMain.subtitle}
              </p>
            </div>
            <Link to={heroMainBanner?.link || defaultHeroMain.link} className="w-48 md:w-64 lg:w-60 xl:w-72">
              <NoiseButton className="text-xs lg:text-xs xl:text-sm">
                {heroMainBanner?.buttonText || defaultHeroMain.buttonText}
              </NoiseButton>
            </Link>
          </div>
        </div>

        <div ref={sideCardsRef} className="w-full lg:w-1/2 xl:w-2/5 inline-flex flex-row lg:flex-col justify-start items-start gap-2.5 flex-shrink-0">
          {(heroSideBanners.length > 0 ? heroSideBanners : defaultHeroSide).slice(0, 2).map((banner, index) => {
            const isDefault = heroSideBanners.length === 0;
            const data = isDefault ? banner : heroSideBanners[index];
            return (
              <Link key={index} to={data.link} className="hero-card flex-1 lg:flex-none lg:w-full h-[240px] md:h-[300px] lg:h-[318px] xl:h-96 relative overflow-hidden rounded-[40px] group">
                <div className="h-full w-full left-0 top-0 absolute bg-zinc-300" />
                <img src={convertGoogleDriveLink(data.image)} alt={data.title.replace(/\\n/g, ' ')} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <h3 className="absolute top-[15px] md:top-[25px] lg:top-[25px] xl:top-[30px] left-[15px] md:left-[25px] lg:left-[25px] xl:left-[30px] justify-start text-neutral-900 text-xl md:text-3xl lg:text-2xl xl:text-4xl font-normal leading-8 lg:leading-8 xl:leading-10">
                  {data.title.split('\\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < data.title.split('\\n').length - 1 && <br />}
                    </span>
                  ))}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Casual Inspirations */}
      <div ref={inspirationRef} className="px-4 md:px-8 lg:px-14 xl:px-24 2xl:px-32 flex flex-col lg:flex-row justify-start items-stretch gap-2.5 w-full mt-6 md:mt-10 lg:mt-12 max-w-[2000px] mx-auto">
        <div className="w-full lg:w-[35%] h-auto lg:h-[450px] xl:h-[500px] bg-white rounded-[40px] p-[20px] md:p-[40px] lg:p-[50px] xl:p-[60px] flex flex-col justify-center flex-shrink-0">
          <h2 className="text-[28px] md:text-[45px] lg:text-[55px] xl:text-[65px] leading-[32px] md:leading-[50px] lg:leading-[60px] xl:leading-[65px] tracking-[-1px] md:tracking-[-2px] lg:tracking-[-3px] xl:tracking-[-4px] mb-3 md:mb-5 lg:mb-6 font-normal">
            Casual<br />Inspirations
          </h2>
          <p className="text-xs md:text-sm lg:text-sm xl:text-base opacity-80 mb-4 md:mb-8 lg:mb-10 xl:mb-12 leading-5 lg:leading-5 xl:leading-6">
            Our favorite combinations for casual outfit that can inspire you to apply on your daily activity.
          </p>
          <NoiseButton>
            BROWSE INSPIRATIONS
          </NoiseButton>
        </div>

        <div className="w-full lg:flex-1 flex flex-col sm:flex-row justify-start items-stretch gap-2.5">
          {(casualBanners.length > 0 ? casualBanners : defaultCasual).slice(0, 2).map((banner, index) => {
            const isDefault = casualBanners.length === 0;
            const data = isDefault ? banner : casualBanners[index];
            return (
              <Link key={index} to={data.link} className="flex-1 h-[200px] sm:h-[240px] md:h-[300px] lg:h-[318px] xl:h-96 relative overflow-hidden rounded-[40px] group">
                <div className="h-full w-full left-0 top-0 absolute bg-zinc-300" />
                <img src={data.image} alt={data.title.replace(/\\n/g, ' ')} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute bottom-4 md:bottom-5 lg:bottom-5 xl:bottom-6 left-4 md:left-5 lg:left-5 xl:left-6 right-4 md:right-5 lg:right-5 xl:right-6 bg-white/30 backdrop-blur-md rounded-full px-4 md:px-5 lg:px-5 xl:px-6 py-2 md:py-2.5 lg:py-2.5 xl:py-3 inline-flex items-center justify-center">
                  <h3 className="text-neutral-900 text-sm md:text-base lg:text-base xl:text-lg font-semibold leading-5 lg:leading-5 xl:leading-6 text-center">
                    {data.title.split('\\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < data.title.split('\\n').length - 1 && <br />}
                      </span>
                    ))}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}