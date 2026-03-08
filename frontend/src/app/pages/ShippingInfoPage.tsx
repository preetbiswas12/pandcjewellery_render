import { Truck, Clock, MapPin, AlertCircle } from 'lucide-react';

export default function ShippingInfoPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-magenta-50 to-golden-50 px-4 md:px-8 lg:px-[60px] py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Century Gothic', 'CenturyGothic', 'Apple Gothic', sans-serif" }}>
            Shipping Information
          </h1>
          <p className="text-lg text-gray-600">
            Fast, reliable delivery to your doorstep.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-[60px] py-12 md:py-20 space-y-12">
        {/* Shipping Options */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Shipping Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Standard Shipping', days: '5-7 business days', icon: Truck },
              { title: 'Express Shipping', days: '2-3 business days', icon: Clock },
              { title: 'International', days: '10-15 business days', icon: MapPin }
            ].map((option, i) => {
              const Icon = option.icon;
              return (
                <div key={i} className="border-2 border-magenta-200 p-6 rounded-lg text-center">
                  <Icon className="w-12 h-12 text-magenta-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">{option.title}</h3>
                  <p className="text-gray-600">{option.days}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Shipping Rates */}
        <section className="bg-gray-50 p-8 md:p-12 rounded-lg">
          <h2 className="text-3xl font-bold mb-6">Shipping Rates</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-3 px-4 font-semibold">Shipping Method</th>
                  <th className="text-left py-3 px-4 font-semibold">Domestic</th>
                  <th className="text-left py-3 px-4 font-semibold">International</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { method: 'Standard Shipping', domestic: '₹99', international: '₹1000' },
                  { method: 'Express Shipping', domestic: '₹199', international: '₹2000' },
                  { method: 'Free on Orders Above', domestic: '₹1000+', international: '₹10000+' }
                ].map((row, i) => (
                  <tr key={i} className="border-b border-gray-200">
                    <td className="py-3 px-4">{row.method}</td>
                    <td className="py-3 px-4">{row.domestic}</td>
                    <td className="py-3 px-4">{row.international}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Tracking */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Track Your Order</h2>
          <div className="bg-magenta-50 p-8 md:p-12 rounded-lg border-2 border-magenta-200">
            <p className="text-lg text-gray-700 mb-6">
              Once your order ships, you'll receive a tracking number via email. Use it to monitor your package every step of the way.
            </p>
            <a href="/track" className="inline-block bg-magenta-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-magenta-700 transition-colors">
              Track Order
            </a>
          </div>
        </section>

        {/* Important Notes */}
        <section className="flex gap-4 bg-yellow-50 border-2 border-yellow-200 p-6 md:p-8 rounded-lg">
          <AlertCircle className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-lg mb-3">Important Notes</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Transit times are estimates and subject to weather/traffic delays</li>
              <li>• Orders are processed within 1-2 business days</li>
              <li>• Customs clearance may apply to international shipments</li>
              <li>• Insurance available for high-value orders</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
