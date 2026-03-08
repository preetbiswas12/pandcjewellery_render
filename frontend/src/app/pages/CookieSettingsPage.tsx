import { useState } from 'react';
import { Shield, BarChart3, Heart } from 'lucide-react';

export default function CookieSettingsPage() {
  const [cookies, setCookies] = useState({
    necessary: true,
    analytics: false,
    marketing: false
  });

  const handleToggle = (type: keyof typeof cookies) => {
    setCookies(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleAcceptAll = () => {
    setCookies({
      necessary: true,
      analytics: true,
      marketing: true
    });
  };

  const handleSavePreferences = () => {
    alert('Cookie preferences saved!');
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-magenta-50 to-golden-50 px-4 md:px-8 lg:px-[60px] py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Century Gothic', 'CenturyGothic', 'Apple Gothic', sans-serif" }}>
            Cookie Settings
          </h1>
          <p className="text-lg text-gray-600">
            Manage your cookie preferences and learn how we use them.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-[60px] py-12 md:py-20 space-y-12">
        {/* Info Section */}
        <section>
          <h2 className="text-3xl font-bold mb-6">About Cookies</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Cookies are small text files stored on your device that help us provide a better experience on our website. We use different types of cookies for different purposes. You can choose which types of cookies you want to accept.
          </p>
        </section>

        {/* Cookie Types */}
        <section className="space-y-6">
          {/* Necessary Cookies */}
          <div className="border-2 border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Necessary Cookies</h3>
                <p className="text-gray-700 mb-4">
                  These cookies are essential for our website to function properly. They enable core functionality such as security, authentication, and compliance with legal requirements.
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-600">Always Active</span>
                  <div className="relative inline-flex w-12 h-6 bg-green-600 rounded-full">
                    <div className="absolute inset-1 bg-white rounded-full w-4 h-4 right-0.5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Cookies */}
          <div className="border-2 border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <BarChart3 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Analytics Cookies</h3>
                <p className="text-gray-700 mb-4">
                  These cookies help us understand how you use our website. They collect anonymous information about pages visited, time spent, and interactions to improve our services.
                </p>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cookies.analytics}
                      onChange={() => handleToggle('analytics')}
                      className="w-5 h-5"
                    />
                    <span className="text-sm font-semibold text-gray-600">
                      {cookies.analytics ? 'Enabled' : 'Disabled'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Marketing Cookies */}
          <div className="border-2 border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <Heart className="w-6 h-6 text-magenta-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Marketing Cookies</h3>
                <p className="text-gray-700 mb-4">
                  These cookies track your preferences and activities to serve you personalized content and advertisements that match your interests.
                </p>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cookies.marketing}
                      onChange={() => handleToggle('marketing')}
                      className="w-5 h-5"
                    />
                    <span className="text-sm font-semibold text-gray-600">
                      {cookies.marketing ? 'Enabled' : 'Disabled'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="bg-gray-50 p-8 rounded-lg border-2 border-gray-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleAcceptAll}
              className="bg-magenta-600 text-white py-3 rounded-lg font-semibold hover:bg-magenta-700 transition-colors"
            >
              Accept All Cookies
            </button>
            <button
              onClick={handleSavePreferences}
              className="border-2 border-magenta-600 text-magenta-600 py-3 rounded-lg font-semibold hover:bg-magenta-50 transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </section>

        {/* More Information */}
        <section>
          <h2 className="text-2xl font-bold mb-4">More Information</h2>
          <p className="text-gray-700 mb-4">
            For more details about how we use cookies and your personal data, please read our{' '}
            <a href="/privacy" className="text-magenta-600 font-semibold hover:underline">
              Privacy Policy
            </a>.
          </p>
          <p className="text-gray-700">
            You can also manage cookie settings in your browser. Most browsers allow you to refuse cookies or alert you when a cookie is being set.
          </p>
        </section>
      </div>
    </div>
  );
}
