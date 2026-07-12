import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Calendar, TicketCheck, IndianRupee,
  FileText, Bell, Settings, Menu, X, Users, BarChart3, Shield,
  MessageSquare, Heart, Star, Gift
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import ToastContainer from '../components/common/ToastContainer';
import { useAuth } from '../context/AuthContext';

const sidebarConfig = {
  user: [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/bookings', icon: TicketCheck, label: 'My Bookings' },
    { path: '/wishlist', icon: Heart, label: 'Wishlist' },
    { path: '/donations', icon: Gift, label: 'Donations' },
    { path: '/feedback', icon: MessageSquare, label: 'Feedback' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
    { path: '/profile', icon: Settings, label: 'Settings' },
  ],
  organizer: [
    { path: '/organizer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/organizer/temples', icon: Building2, label: 'Temples' },
    { path: '/organizer/slots', icon: Calendar, label: 'Slot Management' },
    { path: '/organizer/bookings', icon: TicketCheck, label: 'Bookings' },
    { path: '/organizer/revenue', icon: IndianRupee, label: 'Revenue' },
    { path: '/organizer/reports', icon: FileText, label: 'Reports' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
  ],
  admin: [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/temples', icon: Building2, label: 'Temples' },
    { path: '/admin/bookings', icon: TicketCheck, label: 'Bookings' },
    { path: '/admin/donations', icon: Gift, label: 'Donations' },
    { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/admin/feedback', icon: MessageSquare, label: 'Feedback' },
    { path: '/admin/ratings', icon: Star, label: 'Ratings' },
    { path: '/admin/reports', icon: FileText, label: 'Reports' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
    { path: '/admin/audit', icon: Shield, label: 'Audit Logs' },
  ],
};

const DashboardLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role = user?.role || 'user';
  const navItems = sidebarConfig[role] || sidebarConfig.user;

  const roleLabels = {
    user: 'User Dashboard',
    organizer: 'Organizer Panel',
    admin: 'Admin Panel',
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--border-light)' }}>
            <span className="badge-spiritual badge-saffron">{roleLabels[role]}</span>
          </div>
          <nav style={{ padding: 'var(--space-3) 0' }}>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="d-lg-none"
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
              zIndex: 'calc(var(--z-sticky) - 1)',
            }}
          />
        )}

        {/* Main */}
        <div className="dashboard-main">
          {/* Mobile sidebar toggle */}
          <button
            className="btn btn-ghost d-lg-none mb-3"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            Menu
          </button>

          <Outlet />
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default DashboardLayout;
