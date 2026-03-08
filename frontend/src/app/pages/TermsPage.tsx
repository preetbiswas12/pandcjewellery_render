export default function TermsPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-magenta-50 to-golden-50 px-4 md:px-8 lg:px-[60px] py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Century Gothic', 'CenturyGothic', 'Apple Gothic', sans-serif" }}>
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: February 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-[60px] py-12 md:py-20 space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
          <p>
            By accessing and using P&C Jewellery, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
          <p className="mb-3">
            Permission is granted to temporarily download one copy of the materials (information or software) on P&C Jewellery website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Modifying or copying the materials</li>
            <li>Using the materials for any commercial purpose or for any public display</li>
            <li>Attempting to decompile or reverse engineer any software contained on the website</li>
            <li>Removing any copyright or other proprietary notations from the materials</li>
            <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. Disclaimer</h2>
          <p>
            The materials on P&C Jewellery website are provided on an 'as is' basis. P&C Jewellery makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. Limitations</h2>
          <p>
            In no event shall P&C Jewellery or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on P&C Jewellery website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. Accuracy of Materials</h2>
          <p>
            The materials appearing on P&C Jewellery website could include technical, typographical, or photographic errors. P&C Jewellery does not warrant that any of the materials on the website are accurate, complete, or current. P&C Jewellery may make changes to the materials contained on the website at any time without notice.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. Links</h2>
          <p>
            P&C Jewellery has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by P&C Jewellery of the site. Use of any such linked website is at the user's own risk.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">7. Modifications</h2>
          <p>
            P&C Jewellery may revise these terms of service for the website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">8. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </p>
        </section>

        <section className="bg-magenta-50 p-6 rounded-lg mt-8">
          <p className="text-sm">
            If you have any questions about these Terms of Service, please contact us at pandctexfab@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
}
