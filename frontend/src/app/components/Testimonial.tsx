import { useEffect, useRef } from 'react';
import imgImage23 from "../../assets/57cd86eaec4b399b54263e873dd87745943b8f88.png";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Testimonial() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax effect on the image
      gsap.to(containerRef.current?.querySelector('img'), {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        },
        y: -50,
        ease: 'none'
      });

      // Content animation
      if (contentRef.current) {
        const elements = contentRef.current.children;
        gsap.from(elements, {
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          },
          x: -80,
          opacity: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out'
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full px-4 md:px-8 lg:px-[60px] py-8 md:py-12">
      <div ref={containerRef} className="relative h-[400px] md:h-[500px] lg:h-[556px] rounded-3xl overflow-hidden">
        <img 
          src={imgImage23} 
          alt="Customer Testimonial" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
        
        <div ref={contentRef} className="absolute inset-0 p-6 md:p-12 lg:p-20 flex flex-col justify-center max-w-2xl">
          <p className="text-white text-xl md:text-2xl lg:text-3xl opacity-50 mb-4 md:mb-6">What people said</p>
          <h3 className="text-white text-3xl md:text-4xl lg:text-[65px] leading-tight lg:leading-[65px] tracking-[-2px] lg:tracking-[-4px] mb-4 md:mb-6">
            Love the way they handle the order.
          </h3>
          <p className="text-white text-sm md:text-base lg:text-lg opacity-80 mb-6 md:mb-8 lg:mb-12">
            Very professional and friendly at the same time. They packed the order on schedule and the detail of their wrapping is top notch. One of my best experience for buying online items. Surely will come back for another purchase.
          </p>
          <div>
            <p className="text-white text-lg md:text-xl lg:text-2xl font-semibold mb-1">Samantha William</p>
            <p className="text-white text-xs md:text-sm opacity-50">Fashion Enthusiast</p>
          </div>
        </div>
      </div>
    </div>
  );
}