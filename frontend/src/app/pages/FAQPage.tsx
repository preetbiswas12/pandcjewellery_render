import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy on all items. Products must be in original condition with tags attached. Please contact our support team to initiate a return."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 5-7 business days. Express shipping options available for 2-3 business days. International orders may take 10-15 business days."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location. Please check our shipping information page for more details."
    },
    {
      question: "How can I track my order?",
      answer: "You can track your order using the tracking number sent to your email after shipment. Visit our 'Track Orders' page or use the tracking link provided."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, and digital payment methods through Razorpay. All payments are secure and encrypted."
    },
    {
      question: "Can I modify or cancel my order?",
      answer: "Orders can be modified or cancelled within 2 hours of purchase. After that, the order enters processing and cannot be changed. Contact support for assistance."
    },
    {
      question: "Do you have a physical store?",
      answer: "Currently, we operate online only. However, we're working on opening physical locations. Follow us on social media for updates!"
    },
    {
      question: "How do I care for my fabrics?",
      answer: "Each fabric comes with detailed care instructions. Generally, hand wash or gentle machine wash in cold water is recommended. Avoid bleach and tumble drying."
    }
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-magenta-50 to-golden-50 px-4 md:px-8 lg:px-[60px] py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Century Gothic', 'CenturyGothic', 'Apple Gothic', sans-serif" }}>
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions about our products, shipping, returns, and more.
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-[60px] py-12 md:py-20">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-2 border-gray-200 rounded-lg overflow-hidden hover:border-magenta-300 transition-colors">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-left">
                  {faq.question}
                </h3>
                <ChevronDown
                  size={24}
                  className={`flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-gray-50 border-t-2 border-gray-200">
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-16 bg-magenta-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Didn't find your answer?</h2>
          <p className="text-gray-600 mb-6">Our support team is here to help!</p>
          <a
            href="/contact"
            className="inline-block bg-magenta-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-magenta-700 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
