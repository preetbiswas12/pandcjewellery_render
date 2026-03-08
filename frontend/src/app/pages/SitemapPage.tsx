export default function SitemapPage() {
  const sitemapLinks = [
    {
      category: 'Main Pages',
      links: [
        { title: 'Home', href: '/' },
        { title: 'Shop', href: '/shop' },
        { title: 'About Us', href: '/about' },
        { title: 'Contact Us', href: '/contact' }
      ]
    },
    {
      category: 'Customer Service',
      links: [
        { title: 'FAQ', href: '/faq' },
        { title: 'Shipping Information', href: '/shipping' },
        { title: 'Returns & Exchanges', href: '/returns' },
        { title: 'Track Orders', href: '/track' }
      ]
    },
    {
      category: 'Products',
      links: [
        { title: 'All Fabrics', href: '/shop' },
        { title: 'Banarasi', href: '/shop/banarasi' },
        { title: 'Silk', href: '/shop/silk' },
        { title: 'Cotton', href: '/shop/cotton' }
      ]
    },
    {
      category: 'Community',
      links: [
        { title: 'Blog', href: '/blog' },
        { title: 'Testimonials', href: '/' },
        { title: 'New Collections', href: '/shop' }
      ]
    },
    {
      category: 'User Account',
      links: [
        { title: 'My Orders', href: '/orders' },
        { title: 'Wishlist', href: '/wishlist' },
        { title: 'Cart', href: '/cart' },
        { title: 'Profile', href: '/profile' }
      ]
    },
    {
      category: 'Legal',
      links: [
        { title: 'Terms of Service', href: '/terms' },
        { title: 'Privacy Policy', href: '/privacy' },
        { title: 'Cookie Settings', href: '/cookies' }
      ]
    }
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-magenta-50 to-golden-50 px-4 md:px-8 lg:px-[60px] py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Century Gothic', 'CenturyGothic', 'Apple Gothic', sans-serif" }}>
            Site Map
          </h1>
          <p className="text-lg text-gray-600">
            Navigation guide to all pages on P&C Jewellery.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-[60px] py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {sitemapLinks.map((section, index) => (
            <div key={index}>
              <h2 className="text-xl font-bold mb-4 text-magenta-600">
                {section.category}
              </h2>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-gray-700 hover:text-magenta-600 hover:underline transition-colors"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 bg-gray-50 p-8 rounded-lg border-2 border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Explore Collections</h2>
          <p className="text-gray-700 mb-4">
            Browse our complete collection of premium fabrics organized by type, category, and color. Each product page includes detailed information, pricing, and availability.
          </p>
          <a href="/shop" className="inline-block text-magenta-600 font-semibold hover:underline">
            View All Products →
          </a>
        </div>
      </div>
    </div>
  );
}
