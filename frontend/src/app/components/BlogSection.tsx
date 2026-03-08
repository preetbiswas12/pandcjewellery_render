import { useEffect, useRef } from 'react';
import imgImage25 from "../../assets/ff3c0bb419ab7a36a466902e4bb611c667f4c3c4.png";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NoiseButton } from '@/components/ui/noise-button';

gsap.registerPlugin(ScrollTrigger);

export function BlogSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image scale animation
      gsap.from(imageRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        },
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });

      // Content slide animation
      if (contentRef.current) {
        const elements = contentRef.current.children;
        gsap.from(elements, {
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          },
          x: 80,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out'
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="w-full px-4 md:px-8 lg:px-[60px] py-8 md:py-12 lg:pb-[120px]">
      <h2 className="text-2xl md:text-3xl tracking-tight mb-6 md:mb-8">From The Blog</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto] gap-6 lg:gap-12 items-center">
        <div ref={imageRef} className="relative h-[300px] md:h-[367px] rounded-3xl overflow-hidden group">
          <img 
            src={imgImage25} 
            alt="Style Guide" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
        
        <div ref={contentRef} className="max-w-full lg:max-w-[606px]">
          <h3 className="text-3xl md:text-4xl lg:text-[60px] leading-tight lg:leading-[65px] tracking-[-2px] lg:tracking-[-3px] mb-4 md:mb-6">
            How to combine your daily outfit to looks fresh and cool.
          </h3>
          <p className="text-sm md:text-base lg:text-lg opacity-80 mb-6 md:mb-8">
            Maybe you don't need to buy new clothes to have nice, cool, fresh looking outfit everyday. Maybe what you need is to combine your clothes collections. Mix and match is the key.
          </p>
          <NoiseButton containerClassName="w-fit">
            READ MORE
          </NoiseButton>
        </div>
      </div>
    </div>
  );
}