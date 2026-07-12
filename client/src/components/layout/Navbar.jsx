import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, ChevronDown, Bell, Moon, Sun, LayoutDashboard, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/dashboard';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'organizer') return '/organizer/dashboard';
    return '/dashboard';
  };

  return (
    <nav className={`navbar-spiritual ${scrolled ? 'scrolled' : ''}`}>
      <div className="container-custom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
        {/* Brand */}
        <Link to="/" className="navbar-brand-logo">
          <span className="brand-icon">🙏</span>
          <span>DarshanEase</span>
        </Link>

        {/* Desktop Nav */}
        <div className="d-none d-lg-flex align-items-center" style={{ gap: 'var(--space-1)' }}>
          <NavLink to="/" className={({ isActive }) => `nav-link-spiritual ${isActive ? 'active' : ''}`} end>
            Home
          </NavLink>
          <NavLink to="/temples" className={({ isActive }) => `nav-link-spiritual ${isActive ? 'active' : ''}`}>
            Temples
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link-spiritual ${isActive ? 'active' : ''}`}>
            About
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-link-spiritual ${isActive ? 'active' : ''}`}>
            Contact
          </NavLink>
        </div>

        {/* Right Actions */}
        <div className="d-none d-lg-flex align-items-center" style={{ gap: 'var(--space-2)' }}>
          <button className="btn-ghost" onClick={toggleTheme} aria-label="Toggle theme" style={{ display: 'flex', alignItems: 'center' }}>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isAuthenticated ? (
            <>
              <Link to="/notifications" className="btn-ghost" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Bell size={18} />
              </Link>
              <Link to="/wishlist" className="btn-ghost" style={{ display: 'flex', alignItems: 'center' }}>
                <Heart size={18} />
              </Link>

              {/* User Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  className="btn-ghost"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 'var(--radius-full)',
                      background: 'linear-gradient(135deg, var(--saffron), var(--temple-red))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--white)',
                      fontSize: 'var(--fs-sm)',
                      fontWeight: 'var(--fw-bold)',
                    }}
                  >
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} />
                </button>

                {dropdownOpen && (
                  <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setDropdownOpen(false)} />
                    <div
                      className="animate-fade-in-down"
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '100%',
                        marginTop: 8,
                        background: 'var(--bg-card)',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-xl)',
                        border: '1px solid var(--border-light)',
                        minWidth: 220,
                        padding: 'var(--space-2)',
                        zIndex: 100,
                      }}
                    >
                      <div style={{ padding: 'var(--space-2) var(--space-3)', borderBottom: '1px solid var(--border-light)', marginBottom: 'var(--space-1)' }}>
                        <div style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-sm)' }}>{user?.name}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-xs)' }}>{user?.email}</div>
                        <span className="badge-spiritual badge-saffron" style={{ marginTop: 4 }}>{user?.role}</span>
                      </div>

                      <Link to={getDashboardLink()} className="sidebar-nav-item" style={{ borderRadius: 'var(--radius-md)', padding: '8px 12px', fontSize: 'var(--fs-sm)' }}>
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                      <Link to="/profile" className="sidebar-nav-item" style={{ borderRadius: 'var(--radius-md)', padding: '8px 12px', fontSize: 'var(--fs-sm)' }}>
                        <User size={16} /> Profile
                      </Link>
                      <Link to="/bookings" className="sidebar-nav-item" style={{ borderRadius: 'var(--radius-md)', padding: '8px 12px', fontSize: 'var(--fs-sm)' }}>
                        <LayoutDashboard size={16} /> My Bookings
                      </Link>

                      <div style={{ borderTop: '1px solid var(--border-light)', marginTop: 'var(--space-1)', paddingTop: 'var(--space-1)' }}>
                        <button
                          className="sidebar-nav-item w-100"
                          onClick={handleLogout}
                          style={{ borderRadius: 'var(--radius-md)', padding: '8px 12px', fontSize: 'var(--fs-sm)', color: 'var(--danger)', background: 'none', border: 'none', textAlign: 'left' }}
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Link to="/login" className="btn btn-ghost" style={{ fontSize: 'var(--fs-sm)' }}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ fontSize: 'var(--fs-sm)' }}>
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="btn-ghost d-lg-none" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="d-lg-none animate-fade-in-down"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'var(--bg-card)',
            borderTop: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-lg)',
            padding: 'var(--space-4)',
            zIndex: 99,
          }}
        >
          <NavLink to="/" className="sidebar-nav-item" end>Home</NavLink>
          <NavLink to="/temples" className="sidebar-nav-item">Temples</NavLink>
          <NavLink to="/about" className="sidebar-nav-item">About</NavLink>
          <NavLink to="/contact" className="sidebar-nav-item">Contact</NavLink>
          <hr className="divider" />
          {isAuthenticated ? (
            <>
              <NavLink to={getDashboardLink()} className="sidebar-nav-item">Dashboard</NavLink>
              <NavLink to="/profile" className="sidebar-nav-item">Profile</NavLink>
              <NavLink to="/bookings" className="sidebar-nav-item">My Bookings</NavLink>
              <NavLink to="/notifications" className="sidebar-nav-item">Notifications</NavLink>
              <button className="sidebar-nav-item w-100" onClick={handleLogout} style={{ color: 'var(--danger)', background: 'none', border: 'none', textAlign: 'left' }}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
              <Link to="/login" className="btn btn-ghost flex-fill">Login</Link>
              <Link to="/register" className="btn btn-primary flex-fill">Register</Link>
            </div>
          )}
          <div style={{ marginTop: 'var(--space-3)', textAlign: 'center' }}>
            <button className="btn-ghost" onClick={toggleTheme}>
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
              <span style={{ marginLeft: 8, fontSize: 'var(--fs-sm)' }}>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
