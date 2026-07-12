import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqData = [
  {
    category: 'Booking',
    items: [
      { q: 'How do I book a darshan ticket?', a: 'Simply browse temples, select your preferred date and time slot, enter devotee details, and complete payment. You\'ll receive a QR-coded digital ticket instantly.' },
      { q: 'Can I book tickets for multiple devotees?', a: 'Yes! During the booking process, you can add details for up to 10 devotees per booking. Each devotee will be listed on the shared ticket.' },
      { q: 'How far in advance can I book?', a: 'Booking windows vary by temple. Most temples allow bookings 30–90 days in advance. Check the specific temple page for availability.' },
      { q: 'Is there a limit on the number of bookings I can make?', a: 'There is no limit on overall bookings, but each darshan slot has limited capacity. Once a slot is full, it becomes unavailable for that date.' },
    ],
  },
  {
    category: 'Payment',
    items: [
      { q: 'What payment methods are accepted?', a: 'We accept UPI (GPay, PhonePe, Paytm), credit/debit cards (Visa, Mastercard, RuPay), net banking, and popular digital wallets.' },
      { q: 'Is my payment information secure?', a: 'Absolutely. All transactions are processed through PCI-DSS compliant payment gateways with 256-bit SSL encryption. We never store your card details.' },
      { q: 'Will I get a receipt for my payment?', a: 'Yes, a digital receipt is sent to your registered email upon successful payment. You can also download it from your booking history.' },
    ],
  },
  {
    category: 'Cancellation & Refund',
    items: [
      { q: 'Can I cancel my booking?', a: 'Yes, bookings can be cancelled up to 24 hours before the scheduled darshan time. Go to My Bookings → select the booking → Cancel.' },
      { q: 'How long does a refund take?', a: 'Refunds are processed within 5–7 business days to your original payment method. A cancellation fee of ₹25 may apply depending on the temple policy.' },
      { q: 'Can I reschedule my darshan?', a: 'Currently, direct rescheduling isn\'t supported. You can cancel the existing booking and create a new one for your preferred date and time.' },
    ],
  },
  {
    category: 'General',
    items: [
      { q: 'Do I need to create an account?', a: 'Yes, a free account is required to make bookings. This allows you to manage your bookings, download tickets, and receive updates.' },
      { q: 'How do I use the QR ticket at the temple?', a: 'Show the QR code on your phone (or printed ticket) at the temple entrance. The staff will scan it to verify and admit you.' },
      { q: 'What if I face issues at the temple?', a: 'Contact our 24/7 support at support@darshanease.com or call our toll-free helpline. You can also reach out to the temple administration.' },
      { q: 'Is the platform available in regional languages?', a: 'We are working on adding multi-language support including Tamil, Telugu, Hindi, Kannada, and more. Stay tuned for updates!' },
    ],
  },
];

const AccordionItem = ({ q, a, isOpen, onToggle }) => (
  <div style={{
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius-md)',
    marginBottom: 'var(--space-2)',
    overflow: 'hidden',
    background: isOpen ? 'var(--bg-card)' : 'transparent',
    transition: 'all var(--transition-base)',
  }}>
    <button
      onClick={onToggle}
      style={{
        width: '100%', padding: 'var(--space-4) var(--space-5)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'none', border: 'none', cursor: 'pointer',
        textAlign: 'left', fontWeight: 'var(--fw-medium)',
        color: isOpen ? 'var(--saffron)' : 'var(--text-primary)',
        fontSize: 'var(--fs-base)', gap: 'var(--space-3)',
      }}
    >
      <span>{q}</span>
      <ChevronDown
        size={18}
        style={{
          flexShrink: 0,
          transition: 'transform var(--transition-base)',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      />
    </button>
    {isOpen && (
      <div style={{
        padding: '0 var(--space-5) var(--space-4)',
        color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)', lineHeight: 1.7,
      }}>
        {a}
      </div>
    )}
  </div>
);

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState('Booking');
  const [openIndex, setOpenIndex] = useState(0);

  const currentFaq = faqData.find((c) => c.category === activeCategory);

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(165deg, var(--deep-maroon) 0%, var(--dark-brown) 60%, #1a0a06 100%)',
        padding: 'var(--space-10) 0 var(--space-9)', textAlign: 'center',
      }}>
        <div className="container-custom">
          <span className="badge-spiritual badge-saffron" style={{ marginBottom: 'var(--space-4)', display: 'inline-block' }}>
            <HelpCircle size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> FAQ
          </span>
          <h1 style={{ color: 'var(--white)', fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-3)' }}>
            Frequently Asked <span className="gradient-text-gold">Questions</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 500, margin: '0 auto' }}>
            Find answers to common questions about booking darshan, payments, and more.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="section">
        <div className="container-custom" style={{ maxWidth: 'var(--container-narrow)' }}>
          {/* Category Tabs */}
          <div style={{
            display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)',
            flexWrap: 'wrap', justifyContent: 'center',
          }}>
            {faqData.map((cat) => (
              <button
                key={cat.category}
                onClick={() => { setActiveCategory(cat.category); setOpenIndex(0); }}
                className={activeCategory === cat.category ? 'btn btn-primary' : 'btn btn-ghost'}
                style={{ borderRadius: 'var(--radius-full)', padding: '8px 24px', fontSize: 'var(--fs-sm)' }}
              >
                {cat.category}
              </button>
            ))}
          </div>

          {/* Accordion */}
          <div>
            {currentFaq?.items.map((item, i) => (
              <AccordionItem
                key={i} q={item.q} a={item.a}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
              />
            ))}
          </div>

          {/* Still have questions */}
          <div style={{
            textAlign: 'center', marginTop: 'var(--space-8)',
            padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(135deg, rgba(var(--saffron-rgb),0.06), rgba(var(--deep-maroon-rgb),0.04))',
            border: '1px solid var(--border-light)',
          }}>
            <h4 style={{ marginBottom: 'var(--space-2)' }}>Still have questions?</h4>
            <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
              Can&apos;t find what you&apos;re looking for? Our support team is happy to help.
            </p>
            <a href="/contact" className="btn btn-primary" style={{ padding: '12px 32px' }}>
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
