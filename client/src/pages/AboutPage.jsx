import { Heart, Users, Building2, Globe, Shield, Sparkles } from 'lucide-react';

const AboutPage = () => {
  const stats = [
    { value: '500+', label: 'Temples Listed', icon: Building2 },
    { value: '1M+', label: 'Happy Devotees', icon: Users },
    { value: '28', label: 'States Covered', icon: Globe },
    { value: '99.9%', label: 'Uptime Guarantee', icon: Shield },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Devotion First',
      desc: 'We believe every devotee deserves a peaceful, queue-free darshan experience that lets them focus purely on their spiritual connection.',
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      desc: 'Your data and transactions are protected with bank-grade encryption. We are committed to transparency and privacy at every step.',
    },
    {
      icon: Sparkles,
      title: 'Innovation',
      desc: 'From QR-coded digital tickets to real-time slot availability, we continuously innovate to make temple visits smoother for everyone.',
    },
  ];

  const team = [
    { name: 'Arun Venkatesh', role: 'Founder & CEO', emoji: '👨‍💼' },
    { name: 'Priya Sharma', role: 'Head of Operations', emoji: '👩‍💻' },
    { name: 'Karthik Rajan', role: 'Lead Engineer', emoji: '👨‍🔧' },
    { name: 'Meera Devi', role: 'Community Manager', emoji: '👩‍🎨' },
  ];

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(165deg, var(--deep-maroon) 0%, var(--dark-brown) 60%, #1a0a06 100%)',
        padding: 'var(--space-10) 0 var(--space-9)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-30%', right: '-15%', width: 500, height: 500,
           borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--saffron-rgb),0.08), transparent 70%)',
        }} />
        <div className="container-custom" style={{ position: 'relative', zIndex: 1 }}>
          <span className="badge-spiritual badge-saffron" style={{ marginBottom: 'var(--space-4)', display: 'inline-block' }}>
            🙏 About DarshanEase
          </span>
          <h1 style={{ color: 'var(--white)', fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-4)' }}>
            Bridging <span className="gradient-text-gold">Faith</span> & Technology
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.7)', fontSize: 'var(--fs-lg)',
            maxWidth: 640, margin: '0 auto',
          }}>
            DarshanEase is India&apos;s trusted platform for booking temple darshan tickets online.
            We make sacred journeys accessible, convenient, and spiritually fulfilling for millions of devotees.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ marginTop: '-48px', position: 'relative', zIndex: 2 }}>
        <div className="container-custom">
          <div className="row g-3">
            {stats.map((stat, i) => (
              <div className="col-6 col-md-3" key={i}>
                <div className="stats-card" style={{ textAlign: 'center' }}>
                  <div className="stats-card-icon saffron" style={{ margin: '0 auto var(--space-3)' }}>
                    <stat.icon size={24} />
                  </div>
                  <div className="stats-card-value">{stat.value}</div>
                  <div className="stats-card-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section">
        <div className="container-custom">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div style={{
                borderRadius: 'var(--radius-xl)', overflow: 'hidden',
                background: 'linear-gradient(135deg, hsl(25,60%,40%), hsl(35,50%,30%))',
                height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 120, opacity: 0.3 }}>🛕</span>
              </div>
            </div>
            <div className="col-lg-6">
              <span className="badge-spiritual badge-saffron" style={{ marginBottom: 'var(--space-3)' }}>Our Mission</span>
              <h2 className="section-title" style={{ textAlign: 'left' }}>
                Making <span className="gradient-text">Darshan</span> Accessible to All
              </h2>
              <div className="section-divider" />
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-4)' }}>
                Every year, millions of devotees travel across India to seek blessings at sacred temples.
                Long queues, uncertain availability, and lack of information often diminish the spiritual experience.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                DarshanEase was born from the vision of using technology to eliminate these barriers —
                allowing devotees to plan their visits with confidence, book their preferred time slots,
                and arrive at the temple ready for a peaceful, undisturbed darshan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section" style={{ background: 'var(--bg-card)' }}>
        <div className="container-custom">
          <div className="text-center mb-5">
            <h2 className="section-title">Our Core <span className="gradient-text">Values</span></h2>
            <div className="section-divider" style={{ margin: 'var(--space-3) auto var(--space-4)' }} />
          </div>
          <div className="row g-4">
            {values.map((v, i) => (
              <div className="col-md-4" key={i}>
                <div style={{
                  padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-light)', background: 'var(--bg-primary)',
                  height: '100%', textAlign: 'center',
                  transition: 'all var(--transition-base)',
                }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: 'var(--radius-lg)',
                    background: 'linear-gradient(135deg, rgba(var(--saffron-rgb),0.1), rgba(var(--deep-maroon-rgb),0.08))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto var(--space-4)',
                  }}>
                    <v.icon size={28} color="var(--saffron)" />
                  </div>
                  <h5 style={{ marginBottom: 'var(--space-2)' }}>{v.title}</h5>
                  <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)', margin: 0 }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-5">
            <h2 className="section-title">Meet Our <span className="gradient-text">Team</span></h2>
            <div className="section-divider" style={{ margin: 'var(--space-3) auto var(--space-4)' }} />
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Passionate individuals working to transform how India experiences darshan
            </p>
          </div>
          <div className="row g-4 justify-content-center">
            {team.map((member, i) => (
              <div className="col-6 col-md-3" key={i}>
                <div style={{
                  textAlign: 'center', padding: 'var(--space-5)',
                  borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)',
                  background: 'var(--bg-card)', transition: 'all var(--transition-base)',
                }}>
                  <div style={{
                    width: 80, height: 80, borderRadius: 'var(--radius-full)',
                    background: 'linear-gradient(135deg, rgba(var(--saffron-rgb),0.15), rgba(var(--deep-maroon-rgb),0.1))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto var(--space-3)', fontSize: 36,
                  }}>
                    {member.emoji}
                  </div>
                  <h6 style={{ marginBottom: 'var(--space-1)' }}>{member.name}</h6>
                  <span style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>{member.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: 'linear-gradient(135deg, var(--deep-maroon), var(--dark-brown))',
        padding: 'var(--space-9) 0', textAlign: 'center',
      }}>
        <div className="container-custom">
          <h2 style={{ color: 'var(--white)', fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-3)' }}>
            Join the <span style={{ color: 'var(--saffron)' }}>DarshanEase</span> Community
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 500, margin: '0 auto var(--space-6)' }}>
            Start your spiritual journey today with hassle-free temple darshan booking.
          </p>
          <a href="/register" className="btn btn-primary" style={{ padding: '14px 36px' }}>
            Create Free Account
          </a>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
