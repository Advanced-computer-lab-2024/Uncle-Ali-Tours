import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function TermsPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full"
      >
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Terms and Conditions</h1>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold mb-2">1. Introduction</h2>
            <p>
              Welcome to <strong>U A T</strong>. These Terms and Conditions govern your use of our website and services.
              By accessing or using our platform, you agree to be bound by these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">2. User Accounts</h2>
            <p>
              To access certain features of our services, you may be required to create an account. You agree to provide
              accurate and complete information during the registration process and to keep your account information up to date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">3. User Conduct</h2>
            <p>
              You agree to use our services in a lawful and respectful manner. You shall not engage in any activity that:
            </p>
            <ul className="list-disc list-inside ml-4">
              <li>Violates any law or regulation.</li>
              <li>Infringes on the rights of others.</li>
              <li>Harms or exploits minors.</li>
              <li>Distributes spam, malware, or harmful content.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">4. Privacy Policy</h2>
            <p>
              Your privacy is important to us. Please review our <a href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</a> to understand how we collect, use, and protect your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">5. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your account if you violate these Terms and Conditions or for any other reason at our discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">6. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, <strong>U A T</strong> shall not be liable for any damages arising out of your use of our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">7. Changes to Terms</h2>
            <p>
              We may update these Terms and Conditions from time to time. Changes will be posted on this page, and your continued use of our services constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">8. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at <a href="mailto:support@uat.com" className="text-blue-500 hover:underline">support@uat.com</a>.
            </p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="bg-orange-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-orange-600 transition-all"
          >
            Go Back
          </motion.button>
        </div>
      </motion.div>

      <footer className="absolute bottom-0 left-0 w-full bg-black text-white text-center py-3 text-sm">
        <p>© {new Date().getFullYear()} U A T. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default TermsPage;
