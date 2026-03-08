import { Heart, Phone, RefreshCw } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: Heart,
    title: 'Take care with love',
    description: "We take care your package with full of attention and of course full of love. We want to make sure you'll receive your package like you receive your birthday gift."
  },
  {
    icon: Phone,
    title: 'Friendly Customer Service',
    description: 'You do not need to worry when you want to check your package. We will always answer whatever your questions. Just click on the chat icon and we will talk.'
  },
  {
    icon: RefreshCw,
    title: 'Refund Process',
    description: "Refund is a such bad experience and we don't want that thing happen to you. But when it's happen we will make sure you will through smooth and friendly process."
  }
];

export function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });

      // Services cards stagger animation
      if (servicesRef.current) {
        const cards = servicesRef.current.children;
        gsap.from(cards, {
          scrollTrigger: {
            trigger: servicesRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          },
          y: 100,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out'
        });

        // Icon rotation animation
        Array.from(cards).forEach((card) => {
          const icon = card.querySelector('.service-icon');
          if (icon) {
            gsap.from(icon, {
              scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
              },
              rotation: -180,
              scale: 0,
              duration: 0.8,
              ease: 'back.out(1.7)'
            });
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="w-full px-4 md:px-8 lg:px-[60px] py-8 md:py-12 lg:py-16 border-t border-[rgba(0,0,0,0.1)]">
      <h2 ref={titleRef} className="text-3xl md:text-4xl lg:text-[60px] leading-tight lg:leading-[65px] tracking-[-2px] lg:tracking-[-3px] mb-8 md:mb-12 lg:mb-14 max-w-3xl mx-auto text-center">
        Why you'll love to shop on our website
      </h2>
      
      <div ref={servicesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12 max-w-6xl mx-auto justify-items-center">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <div key={index} className="flex flex-col items-center group w-full max-w-xs">
              <div className="service-icon w-20 h-20 md:w-28 md:h-28 lg:w-[120px] lg:h-[120px] bg-[#121212] rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Icon className="text-white" size={window.innerWidth >= 1024 ? 48 : window.innerWidth >= 768 ? 40 : 32} />
              </div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-medium mb-2 md:mb-3 text-center">{service.title}</h3>
              <p className="text-sm md:text-base lg:text-lg opacity-80 leading-relaxed text-center">{service.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}