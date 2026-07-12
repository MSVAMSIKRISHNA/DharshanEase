import { FileText } from 'lucide-react';

const sections = [
  {
    id: 'acceptance', title: 'Acceptance of Terms',
    content: `By accessing or using DarshanEase, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our platform. We reserve the right to modify these terms at any time, and your continued use constitutes acceptance of any changes.`,
  },
  {
    id: 'account', title: 'User Accounts',
    content: `To use certain features, you must create an account with accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must be at least 18 years old to create an account. DarshanEase reserves the right to suspend or terminate accounts that violate these terms.`,
  },
  {
    id: 'bookings', title: 'Booking & Tickets',
    content: `Darshan bookings are subject to availability and temple-specific rules. Once confirmed and paid, you will receive a digital ticket with a QR code. Tickets are non-transferable and valid only for the specified date, time, and temple. Presenting fraudulent or duplicate tickets may result in denial of entry and account suspension.`,
  },
  {
    id: 'payments', title: 'Payments & Pricing',
    content: `All prices are displayed in Indian Rupees (INR) and include applicable taxes unless stated otherwise. Payments are processed through secure third-party payment gateways. DarshanEase is not responsible for payment failures caused by issues with your bank or payment provider. Convenience fees may apply to certain booking types.`,
  },
  {
    id: 'cancellation', title: 'Cancellation & Refund Policy',
    content: `Bookings can be cancelled up to 24 hours before the scheduled darshan time. Refunds are processed within 5–7 business days to the original payment method. A cancellation fee of up to ₹25 may be deducted depending on the temple's policy. No-show bookings are non-refundable. Special darshan and festival bookings may have stricter cancellation policies.`,
  },
  {
    id: 'conduct', title: 'User Conduct',
    content: `You agree not to: use the platform for any unlawful purpose; attempt to gain unauthorized access to other accounts or systems; submit false information or fraudulent bookings; use automated tools to scrape data or abuse the platform; post offensive, defamatory, or inappropriate content in reviews or feedback; resell or commercially exploit darshan tickets.`,
  },
  {
    id: 'ip', title: 'Intellectual Property',
    content: `All content on DarshanEase — including text, graphics, logos, icons, images, software, and design — is the property of DarshanEase or its content suppliers and is protected by Indian and international copyright laws. You may not reproduce, distribute, or create derivative works without our explicit written permission.`,
  },
  {
    id: 'liability', title: 'Limitation of Liability',
    content: `DarshanEase is a booking platform and does not operate or manage temples. We are not liable for: changes in temple schedules or closures; quality of darshan experience; loss or damage arising from use of our platform beyond the booking fee paid. Our total liability shall not exceed the amount paid for the specific booking in question.`,
  },
  {
    id: 'governing', title: 'Governing Law',
    content: `These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Hyderabad, Telangana, India.`,
  },
];

const TermsPage = () => {
  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(165deg, var(--deep-maroon) 0%, var(--dark-brown) 60%, #1a0a06 100%)',
        padding: 'var(--space-10) 0 var(--space-9)', textAlign: 'center',
      }}>
        <div className="container-custom">
          <span className="badge-spiritual badge-saffron" style={{ marginBottom: 'var(--space-4)', display: 'inline-block' }}>
            <FileText size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Legal
          </span>
          <h1 style={{ color: 'var(--white)', fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-3)' }}>
            Terms of <span className="gradient-text-gold">Service</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 500, margin: '0 auto' }}>
            Last updated: July 2026. Please read these terms carefully before using DarshanEase.
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
                  Sections
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
                  Welcome to DarshanEase. These Terms of Service (&quot;Terms&quot;) govern your use of the DarshanEase
                  platform, including our website and mobile applications. By using our services, you agree to
                  comply with and be bound by the following terms and conditions.
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
                  <h6 style={{ marginBottom: 'var(--space-2)' }}>Questions about these terms?</h6>
                  <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)', margin: 0 }}>
                    Contact our legal team at <a href="mailto:legal@darshanease.com" style={{ color: 'var(--saffron)' }}>legal@darshanease.com</a>
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

export default TermsPage;
