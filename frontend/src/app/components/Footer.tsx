import { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="w-full bg-black text-white mt-20 overflow-x-hidden">
      {/* Main Footer Content */}
      <div className="w-full px-4 md:px-8 lg:px-[60px] py-16 md:py-24">
        {/* Logo Section */}
        <div className="mb-12 pb-8 border-b border-white/10 flex justify-center">
          <img src="/logo.png" alt="P&C Jewellery" className="h-16 w-auto rounded-full shadow-lg" />
        </div>

        {/* Newsletter Section */}
        <div className="mb-16 pb-16 border-b border-white/10 flex justify-center">
          <div className="w-full max-w-2xl text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-3">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-gray-300 mb-8">
              Get exclusive updates on new fabric collections, special offers, and premium design inspiration delivered to your inbox.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 md:gap-3 justify-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 md:px-6 py-3 md:py-4 rounded-lg border-2 border-white/20 bg-white/5 text-sm md:text-base text-white placeholder:text-white/50 focus:outline-none focus:border-white/50 transition-colors"
                required
              />
              <button
                type="submit"
                className="bg-white text-magenta-950 px-6 md:px-8 py-3 md:py-4 rounded-lg text-sm md:text-base font-bold hover:bg-gray-200 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
            {subscribed && (
              <p className="text-green-400 text-xs md:text-sm mt-3">✓ Thank you for subscribing!</p>
            )}
          </div>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-16">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold tracking-wide mb-6">P&C Jewellery</h3>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6">
              Export quality organic clothing designed for conscious consumers. Sustainable fashion with premium craftsmanship.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin size={20} className="text-gray-500 flex-shrink-0" />
                <span className="text-gray-300 text-sm md:text-base">Kolkata, West Bengal, India</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-gray-500 flex-shrink-0" />
                <span className="text-gray-300 text-sm md:text-base">+91 7044457914</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-gray-500 flex-shrink-0" />
                <span className="text-gray-300 text-sm md:text-base">info@P&C Jewellery.com</span>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-base font-bold tracking-wider mb-6 uppercase">Shop</h4>
            <ul className="space-y-3">
              <li><a href="/shop" className="text-gray-400 text-sm md:text-base hover:text-white transition-colors">All Jewellery</a></li>
              <li><a href="/shop/dyeable-Jewellery" className="text-gray-400 text-sm md:text-base hover:text-white transition-colors">Dyeable Jewellery</a></li>
              <li><a href="/shop/printed-Jewellery" className="text-gray-400 text-sm md:text-base hover:text-white transition-colors">Printed Jewellery</a></li>
              <li><a href="/shop/embroidered-Jewellery" className="text-gray-400 text-sm md:text-base hover:text-white transition-colors">Embroidered Collections</a></li>
              <li><a href="/shop/lining-Jewellery" className="text-gray-400 text-sm md:text-base hover:text-white transition-colors">Lining Jewellery</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-base font-bold tracking-wider mb-6 uppercase">Support</h4>
            <ul className="space-y-3">
              <li><a href="/faq" className="text-gray-400 text-sm md:text-base hover:text-white transition-colors">FAQ</a></li>
              <li><a href="/shipping" className="text-gray-400 text-sm md:text-base hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="/returns" className="text-gray-400 text-sm md:text-base hover:text-white transition-colors">Returns & Exchanges</a></li>
              <li><a href="/contact" className="text-gray-400 text-sm md:text-base hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-base font-bold tracking-wider mb-6 uppercase">Legal</h4>
            <ul className="space-y-3">
              <li><a href="/terms" className="text-gray-400 text-sm md:text-base hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="/privacy" className="text-gray-400 text-sm md:text-base hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/cookies" className="text-gray-400 text-sm md:text-base hover:text-white transition-colors">Cookie Settings</a></li>
              <li><a href="/sitemap" className="text-gray-400 text-sm md:text-base hover:text-white transition-colors">Sitemap</a></li>
              <li><a href="/about" className="text-gray-400 text-sm md:text-base hover:text-white transition-colors">About Us</a></li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex gap-6 mb-12">
          <a href="#facebook" className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
            <Facebook size={24} />
          </a>
          <a href="#instagram" className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
            <Instagram size={24} />
          </a>
          <a href="#twitter" className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
            <Twitter size={24} />
          </a>
          <a href="#youtube" className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
            <Youtube size={24} />
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-black/80">
        <div className="w-full px-4 md:px-8 lg:px-[60px] py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm md:text-base">
            © 2024 P&C Jewellery. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#security" className="text-gray-400 text-sm md:text-base hover:text-white transition-colors">
              Security
            </a>
            <a href="#accessibility" className="text-gray-400 text-sm md:text-base hover:text-white transition-colors">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}