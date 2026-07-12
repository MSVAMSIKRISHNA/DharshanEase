import { Shield } from 'lucide-react';

const sections = [
  {
    id: 'info-collection', title: 'Information We Collect',
    content: `We collect information that you provide directly to us when you create an account, make a booking, or contact us. This includes your name, email address, phone number, and payment information. We also automatically collect certain information when you use our platform, including your IP address, browser type, device information, and usage patterns.`,
  },
  {
    id: 'use-info', title: 'How We Use Your Information',
    content: `We use the information we collect to: process and manage your darshan bookings; send booking confirmations and digital tickets; communicate with you about your account and provide customer support; improve and personalize your experience on our platform; send promotional communications (with your consent); comply with legal obligations and resolve disputes.`,
  },
  {
    id: 'data-sharing', title: 'Information Sharing',
    content: `We do not sell your personal information to third parties. We may share your information with: temple authorities (limited booking details necessary for darshan management); payment processors (to complete transactions securely); service providers who assist us in operating our platform; law enforcement when required by applicable law.`,
  },
  {
    id: 'data-security', title: 'Data Security',
    content: `We implement industry-standard security measures including 256-bit SSL encryption, secure payment gateways (PCI-DSS compliant), and regular security audits. While we strive to protect your personal information, no method of transmission over the Internet is 100% secure. We encourage you to use strong passwords and keep your account credentials confidential.`,
  },
  {
    id: 'cookies', title: 'Cookies & Tracking',
    content: `We use cookies and similar technologies to enhance your experience, remember your preferences, and analyze platform usage. You can manage cookie preferences through your browser settings. Essential cookies required for platform functionality cannot be disabled.`,
  },
  {
    id: 'your-rights', title: 'Your Rights',
    content: `You have the right to: access and download your personal data; correct inaccurate information; request deletion of your account and associated data; opt out of promotional communications; withdraw consent for data processing. To exercise these rights, contact us at privacy@darshanease.com.`,
  },
  {
    id: 'children', title: 'Children\'s Privacy',
    content: `DarshanEase is not intended for children under 13 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.`,
  },
  {
    id: 'changes', title: 'Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice on our platform or sending you an email. Your continued use of DarshanEase after changes constitutes acceptance of the updated policy.`,
  },
];

const PrivacyPage = () => {
  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(165deg, var(--deep-maroon) 0%, var(--dark-brown) 60%, #1a0a06 100%)',
        padding: 'var(--space-10) 0 var(--space-9)', textAlign: 'center',
      }}>
        <div className="container-custom">
          <span className="badge-spiritual badge-saffron" style={{ marginBottom: 'var(--space-4)', display: 'inline-block' }}>
            <Shield size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Legal
          </span>
          <h1 style={{ color: 'var(--white)', fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-3)' }}>
            Privacy <span className="gradient-text-gold">Policy</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 500, margin: '0 auto' }}>
            Last updated: July 2026. Your privacy is important to us.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section">
        <div className="container-custom">
          <div className="row g-5">
            {/* TOC Sidebar */}
            <div className="col-lg-3 d-none d-lg-block">
              <div style={{
                position: 'sticky', top: 'calc(var(--navbar-height) + var(--space-5))',
                background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-5)', border: '1px solid var(--border-light)',
              }}>
                <h6 style={{
                  fontSize: 'var(--fs-xs)', textTransform: 'uppercase',
                  letterSpacing: '0.5px', color: 'var(--text-muted)',
                  marginBottom: 'var(--space-3)', fontWeight: 'var(--fw-semibold)',
                }}>
                  Table of Contents
                </h6>
                {sections.map((s) => (
                  <a
                    key={s.id} href={`#${s.id}`}
                    style={{
                      display: 'block', padding: '6px 0', fontSize: 'var(--fs-sm)',
                      color: 'var(--text-secondary)', textDecoration: 'none',
                      transition: 'color var(--transition-fast)',
                    }}
                  >
                    {s.title}
                  </a>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="col-lg-9">
              <div style={{
                background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-6) var(--space-7)', border: '1px solid var(--border-light)',
              }}>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-5)' }}>
                  At DarshanEase, we are committed to protecting your personal information and your right to privacy.
                  This Privacy Policy explains what information we collect, how we use it, and what rights you have in relation to it.
                </p>

                {sections.map((section, i) => (
                  <div key={section.id} id={section.id} style={{ marginBottom: 'var(--space-6)' }}>
                    <h4 style={{
                      fontSize: 'var(--fs-xl)', fontFamily: 'var(--font-heading)',
                      marginBottom: 'var(--space-3)', paddingBottom: 'var(--space-2)',
                      borderBottom: '1px solid var(--border-light)',
                    }}>
                      {i + 1}. {section.title}
                    </h4>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                      {section.content}
                    </p>
                  </div>
                ))}

                <div style={{
                  marginTop: 'var(--space-6)', padding: 'var(--space-5)',
                  background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-light)',
                }}>
                  <h6 style={{ marginBottom: 'var(--space-2)' }}>Questions about this policy?</h6>
                  <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)', margin: 0 }}>
                    Contact our privacy team at <a href="mailto:privacy@darshanease.com" style={{ color: 'var(--saffron)' }}>privacy@darshanease.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPage;
