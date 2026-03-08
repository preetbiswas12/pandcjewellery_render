import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const colors = [
  { name: 'RED PASTEL', color: '#E25F5F' },
  { name: 'LIME GREEN', color: '#B8E25F' },
  { name: 'NAVY BLUE', color: '#233C6B' },
  { name: 'CLEAN WHITE', color: '#FFFFFF', border: true },
  { name: 'BLUE SKY', color: '#5FABE2' },
  { name: 'PURPLE', color: '#B54EF4' },
  { name: 'PINK', color: '#F44E8A' },
  { name: 'YELLOW', color: '#F4CF4E' },
  { name: 'DARK GREEN', color: '#44936D' },
];

export function ColorExplorer() {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const colorsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Temporarily disable animations to debug visibility issue
    // Will re-enable once content is visible
    return () => {};
  }, []);

  const handleColorClick = (colorName: string) => {
    setSelectedColor(colorName);
    
    // Add a pulse animation on selection
    const button = document.querySelector(`[data-color="${colorName}"]`);
    if (button) {
      gsap.fromTo(button,
        { scale: 1 },
        { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.inOut' }
      );
    }

    // Navigate to shop page with color filter
    navigate(`/shop?color=${encodeURIComponent(colorName)}`);
  };

  return (
    <div ref={sectionRef} className="w-full px-4 md:px-8 lg:px-[60px] py-6 md:py-8">
      {/* Colors Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-12">
        <h2 ref={titleRef} className="text-3xl md:text-4xl lg:text-[48px] leading-tight lg:leading-[1.2] tracking-[-1px] lg:tracking-[-2px]">
          Explore<br />by Colors
        </h2>
        
        <div ref={colorsRef} className="flex flex-wrap gap-2 md:gap-3 flex-1">
          {colors.map((colorItem, index) => (
            <button
              key={colorItem.name}
              data-color={colorItem.name}
              onClick={() => handleColorClick(colorItem.name)}
              className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-2.5 rounded-full border border-[#121212] transition-all hover:bg-gray-50 hover:scale-105 active:scale-95 ${
                selectedColor === colorItem.name ? 'bg-gray-100 scale-105' : ''
              }`}
            >
              <div 
                className="w-5 h-5 md:w-6 md:h-6 rounded-full flex-shrink-0" 
                style={{ 
                  backgroundColor: colorItem.color,
                  border: colorItem.border ? '1px solid #DEDEDE' : 'none'
                }}
              />
              <span className="font-semibold text-xs md:text-sm tracking-wide">
                {colorItem.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}