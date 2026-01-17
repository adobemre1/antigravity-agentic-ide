import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="p-8 max-w-4xl mx-auto"
    >
      <h1 className="text-3xl font-bold mb-6 text-primary">{t('privacy.title', 'Privacy Policy')}</h1>
      
      <div className="prose prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-secondary">{t('privacy.analytics', 'Analytics')}</h2>
          <p className="text-text/80 leading-relaxed mb-4">
            We use <strong>Plausible Analytics</strong> to track overall trends in the usage of our website. 
            Plausible is a privacy-first analytics tool that:
          </p>
          <ul className="list-disc list-inside text-text/80 mb-4 space-y-2">
            <li>Does not use cookies.</li>
            <li>Does not collect personal data.</li>
            <li>Does not track you across other sites.</li>
          </ul>
          <p className="text-text/80 leading-relaxed">
            All data is aggregated and anonymous. We use this data solely to improve the user experience.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-secondary">{t('privacy.errors', 'Error Monitoring')}</h2>
          <p className="text-text/80 leading-relaxed">
            We use <strong>Sentry</strong> to monitor application stability. If the application crashes, 
            technical details (browser version, error stack trace) are sent securely to Sentry. 
            This data helps us identify and fix bugs quickly. No personally identifiable information (PII) is attached to these reports.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-secondary">{t('privacy.contact', 'Contact')}</h2>
          <p className="text-text/80 leading-relaxed">
            If you have any questions about this privacy policy, please contact us at: 
            <a href="mailto:destek@seyhan.bel.tr" className="text-primary hover:underline ml-1">destek@seyhan.bel.tr</a>
          </p>
        </section>
      </div>
    </motion.div>
  );
}
