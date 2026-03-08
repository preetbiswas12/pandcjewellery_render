export default function PrivacyPolicyPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-magenta-50 to-golden-50 px-4 md:px-8 lg:px-[60px] py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Century Gothic', 'CenturyGothic', 'Apple Gothic', sans-serif" }}>
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: February 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-[60px] py-12 md:py-20 space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold mb-4">Introduction</h2>
          <p>
            P&C Jewellery ("Company", "we", "our", or "us") operates the website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our website and the choices you have associated with that data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">1. Types of Data Collected</h2>
          <h3 className="text-lg font-semibold mt-4 mb-2">Personal Data</h3>
          <p>While using our website, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include, but is not limited to:</p>
          <ul className="list-disc list-inside space-y-2 ml-4 my-3">
            <li>Email address</li>
            <li>First name and last name</li>
            <li>Phone number</li>
            <li>Address, State, Province, ZIP/Postal code, City</li>
            <li>Cookies and Usage Data</li>
          </ul>

          <h3 className="text-lg font-semibold mt-4 mb-2">Usage Data</h3>
          <p>
            We may also collect information on how the website is accessed and used ("Usage Data"). This may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, pages you visit, time and date of your visit, time spent on those pages, and other diagnostic data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. Use of Data</h2>
          <p>P&C Jewellery uses the collected data for various purposes:</p>
          <ul className="list-disc list-inside space-y-2 ml-4 my-3">
            <li>To provide and maintain our website</li>
            <li>To notify you about changes to our website</li>
            <li>To allow you to participate in interactive features</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information so that we can improve our website</li>
            <li>To monitor the usage of our website</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. Security of Data</h2>
          <p>
            The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "effective date" at the top of this Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <div className="mt-4 bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
            <p className="font-semibold">P&C Jewellery</p>
            <p>Email: pandctexfab@gmail.com</p>
            <p>Phone: +91 (555) 123-4567</p>
            <p>P&C Jewellery, India</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. Cookies Policy</h2>
          <p>
            We use cookies to enhance your experience while using our website. A cookie is a small file of letters and numbers stored on your device. These may include session-based or persistent cookies.
          </p>
          <p className="mt-3">
            Most web browsers allow some control of most cookies through the browser settings. If you wish to disable cookies, please refer to your browser help section. However, disabling cookies may affect your ability to use certain features of our website.
          </p>
        </section>

        <section className="bg-magenta-50 p-6 rounded-lg mt-8">
          <p className="text-sm">
            By using P&C Jewellery, you consent to our Privacy Policy.
          </p>
        </section>
      </div>
    </div>
  );
}
