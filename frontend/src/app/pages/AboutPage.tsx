export default function AboutPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-magenta-50 to-golden-50 px-4 md:px-6 lg:px-[60px] py-6 md:py-10 lg:py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4" style={{ fontFamily: "'Century Gothic', 'CenturyGothic', 'Apple Gothic', sans-serif" }}>
            About P&C Jewellery
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-gray-600">
            Discover our story and commitment to quality Jewellery.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-[60px] py-6 md:py-10 lg:py-12 space-y-6 md:space-y-8 lg:space-y-12">
        {/* Our Story */}
        <section>
          <h2 className="text-lg md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 lg:mb-6">Our Story</h2>
          <p className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed mb-2 md:mb-4">
            P&C Jewellery was founded with a passion for bringing premium quality Jewellery to creative minds around the world. We believe that the right piece can transform any vision into reality.
          </p>
          <p className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed">
            What started as a small initiative has grown into a trusted platform where designers, crafters, and fashion enthusiasts find inspiration and quality materials for their projects.
          </p>
        </section>

        {/* Mission */}
        <section className="bg-magenta-50 p-4 md:p-6 lg:p-8 rounded-lg">
          <h2 className="text-lg md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 lg:mb-6">Our Mission</h2>
          <p className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed">
            To provide the finest quality Jewellery, exceptional customer service, and inspiration that empowers our customers to create beautiful pieces that matter. We're committed to sustainability, ethical sourcing, and supporting the creative community.
          </p>
        </section>

        {/* Values */}
        <section>
          <h2 className="text-lg md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 lg:mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {[
              { title: 'Quality', description: 'We source only the finest Jewellery from trusted suppliers worldwide.' },
              { title: 'Innovation', description: 'We constantly explore new designs and patterns to inspire creativity.' },
              { title: 'Sustainability', description: 'We\'re committed to eco-friendly practices and ethical production.' }
            ].map((value, i) => (
              <div key={i} className="border-2 border-magenta-200 p-4 md:p-6 rounded-lg">
                <h3 className="text-base md:text-lg lg:text-xl font-bold mb-2 md:mb-3 text-magenta-600">{value.title}</h3>
                <p className="text-xs md:text-sm lg:text-base text-gray-700">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section>
          <h2 className="text-lg md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 lg:mb-8">Why Choose Us?</h2>
          <ul className="space-y-2 md:space-y-3 lg:space-y-4">
            {[
              'Premium quality Jewellery from world-renowned suppliers',
              'Curated collections for every project and season',
              'Fast and reliable shipping worldwide',
              'Expert customer support and guidance',
              'Competitive pricing without compromising quality',
              '30-day satisfaction guarantee on all purchases'
            ].map((reason, i) => (
              <li key={i} className="flex gap-2 md:gap-3 items-start">
                <span className="text-magenta-600 font-bold text-lg md:text-xl flex-shrink-0">✓</span>
                <span className="text-xs md:text-sm lg:text-base text-gray-700">{reason}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
