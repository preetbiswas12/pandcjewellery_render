import { RotateCcw, Package, CheckCircle } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-magenta-50 to-golden-50 px-4 md:px-8 lg:px-[60px] py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Century Gothic', 'CenturyGothic', 'Apple Gothic', sans-serif" }}>
            Returns & Exchanges
          </h1>
          <p className="text-lg text-gray-600">
            Easy and hassle-free returns within 30 days of purchase.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-[60px] py-12 md:py-20 space-y-12">
        {/* Return Policy */}
        <section className="bg-green-50 border-2 border-green-200 p-8 md:p-12 rounded-lg">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            30-Day Money Back Guarantee
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            We want you to be completely satisfied with your purchase. If you're not happy with any item, you can return it within 30 days of purchase for a full refund or exchange.
          </p>
        </section>

        {/* Return Conditions */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Return Conditions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Unused & Unwashed', desc: 'Item must be in original condition' },
              { title: 'Original Tags', desc: 'All tags and labels must be attached' },
              { title: 'Original Packaging', desc: 'Item should be in original packaging if possible' },
              { title: 'No Damage', desc: 'No stains, tears, or damage to the fabric' }
            ].map((condition, i) => (
              <div key={i} className="border-2 border-gray-200 p-6 rounded-lg hover:border-magenta-300 transition-colors">
                <h3 className="text-lg font-bold text-magenta-600 mb-2">{condition.title}</h3>
                <p className="text-gray-700">{condition.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How to Return */}
        <section>
          <h2 className="text-3xl font-bold mb-8">How to Return</h2>
          <div className="space-y-6">
            {[
              { num: 1, title: 'Contact Support', desc: 'Email pandctexfab@gmail.com or call +91 7044457914' },
              { num: 2, title: 'Get Return Approval', desc: 'We\'ll provide you with a return authorization number and shipping label' },
              { num: 3, title: 'Ship Item Back', desc: 'Pack the item securely and ship it to our return address' },
              { num: 4, title: 'Receive Refund', desc: 'Once received and inspected, your refund will be processed within 5-7 business days' }
            ].map((step) => (
              <div key={step.num} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-magenta-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-700">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Exchanges */}
        <section className="bg-blue-50 border-2 border-blue-200 p-8 md:p-12 rounded-lg">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <RotateCcw className="w-8 h-8 text-blue-600" />
            Exchanges
          </h2>
          <p className="text-lg text-gray-700 mb-4 leading-relaxed">
            Want to exchange an item for a different size or color? No problem! We offer free exchanges within 30 days. Simply contact our support team with your order number and we'll arrange the exchange.
          </p>
          <a href="/contact" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors">
            Request Exchange
          </a>
        </section>

        {/* Refund Timeline */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Refund Timeline</h2>
          <div className="bg-gray-50 p-8 rounded-lg border-2 border-gray-200">
            <div className="space-y-4">
              {[
                { time: 'Within 48 hours', desc: 'We process your return request' },
                { time: '3-10 business days', desc: 'Item is in transit to us' },
                { time: '1-2 business days', desc: 'We receive and inspect your item' },
                { time: '5-7 business days', desc: 'Refund is processed to your account' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start pb-4 border-b border-gray-300 last:border-b-0">
                  <div className="flex-shrink-0 w-24 font-semibold text-magenta-600">{item.time}</div>
                  <div className="text-gray-700">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
