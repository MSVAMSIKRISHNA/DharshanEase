import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import Loader from './components/common/Loader';

/* ── Lazy-loaded Pages ── */
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));
const TempleListingPage = lazy(() => import('./pages/temples/TempleListingPage'));
const TempleDetailsPage = lazy(() => import('./pages/temples/TempleDetailsPage'));
const BookingPage = lazy(() => import('./pages/booking/BookingPage'));
const PaymentPage = lazy(() => import('./pages/booking/PaymentPage'));
const BookingSuccessPage = lazy(() => import('./pages/booking/BookingSuccessPage'));
const BookingHistoryPage = lazy(() => import('./pages/booking/BookingHistoryPage'));
const TicketViewerPage = lazy(() => import('./pages/booking/TicketViewerPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const DonationsPage = lazy(() => import('./pages/DonationsPage'));
const FeedbackPage = lazy(() => import('./pages/FeedbackPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const UserDashboard = lazy(() => import('./pages/dashboard/UserDashboard'));
const OrganizerDashboard = lazy(() => import('./pages/dashboard/OrganizerDashboard'));
const OrganizerTemples = lazy(() => import('./pages/dashboard/OrganizerTemples'));
const OrganizerBookings = lazy(() => import('./pages/dashboard/OrganizerBookings'));
const OrganizerSlots = lazy(() => import('./pages/dashboard/OrganizerSlots'));
const OrganizerRevenue = lazy(() => import('./pages/dashboard/OrganizerRevenue'));
const OrganizerReports = lazy(() => import('./pages/dashboard/OrganizerReports'));
const AdminDashboard = lazy(() => import('./pages/dashboard/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/dashboard/AdminUsers'));
const AdminTemples = lazy(() => import('./pages/dashboard/AdminTemples'));
const AdminBookings = lazy(() => import('./pages/dashboard/AdminBookings'));
const AdminDonations = lazy(() => import('./pages/dashboard/AdminDonations'));
const AdminAnalytics = lazy(() => import('./pages/dashboard/AdminAnalytics'));
const AdminFeedback = lazy(() => import('./pages/dashboard/AdminFeedback'));
const AdminRatings = lazy(() => import('./pages/dashboard/AdminRatings'));
const AdminReports = lazy(() => import('./pages/dashboard/AdminReports'));
const AdminSettings = lazy(() => import('./pages/dashboard/AdminSettings'));
const AdminAudit = lazy(() => import('./pages/dashboard/AdminAudit'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<Loader fullPage text="Loading page..." />}>
    {children}
  </Suspense>
);

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <Routes>
              {/* ── Public Routes ── */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<SuspenseWrapper><LandingPage /></SuspenseWrapper>} />
                <Route path="/about" element={<SuspenseWrapper><AboutPage /></SuspenseWrapper>} />
                <Route path="/contact" element={<SuspenseWrapper><ContactPage /></SuspenseWrapper>} />
                <Route path="/faq" element={<SuspenseWrapper><FAQPage /></SuspenseWrapper>} />
                <Route path="/privacy" element={<SuspenseWrapper><PrivacyPage /></SuspenseWrapper>} />
                <Route path="/terms" element={<SuspenseWrapper><TermsPage /></SuspenseWrapper>} />
                <Route path="/login" element={<SuspenseWrapper><LoginPage /></SuspenseWrapper>} />
                <Route path="/register" element={<SuspenseWrapper><RegisterPage /></SuspenseWrapper>} />
                <Route path="/forgot-password" element={<SuspenseWrapper><ForgotPasswordPage /></SuspenseWrapper>} />
                <Route path="/reset-password/:token" element={<SuspenseWrapper><ResetPasswordPage /></SuspenseWrapper>} />
                <Route path="/temples" element={<SuspenseWrapper><TempleListingPage /></SuspenseWrapper>} />
                <Route path="/temples/:id" element={<SuspenseWrapper><TempleDetailsPage /></SuspenseWrapper>} />

                {/* Protected public layout pages */}
                <Route path="/booking/:templeId" element={<ProtectedRoute><SuspenseWrapper><BookingPage /></SuspenseWrapper></ProtectedRoute>} />
                <Route path="/payment/:bookingId" element={<ProtectedRoute><SuspenseWrapper><PaymentPage /></SuspenseWrapper></ProtectedRoute>} />
                <Route path="/booking-success/:bookingId" element={<ProtectedRoute><SuspenseWrapper><BookingSuccessPage /></SuspenseWrapper></ProtectedRoute>} />
                <Route path="/ticket/:bookingId" element={<ProtectedRoute><SuspenseWrapper><TicketViewerPage /></SuspenseWrapper></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><SuspenseWrapper><ProfilePage /></SuspenseWrapper></ProtectedRoute>} />
                <Route path="/wishlist" element={<ProtectedRoute><SuspenseWrapper><WishlistPage /></SuspenseWrapper></ProtectedRoute>} />
                <Route path="/donations" element={<ProtectedRoute><SuspenseWrapper><DonationsPage /></SuspenseWrapper></ProtectedRoute>} />
                <Route path="/feedback" element={<ProtectedRoute><SuspenseWrapper><FeedbackPage /></SuspenseWrapper></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><SuspenseWrapper><NotificationsPage /></SuspenseWrapper></ProtectedRoute>} />
                <Route path="/bookings" element={<ProtectedRoute><SuspenseWrapper><BookingHistoryPage /></SuspenseWrapper></ProtectedRoute>} />
              </Route>

              {/* ── User Dashboard ── */}
              <Route element={<ProtectedRoute roles={['user', 'organizer', 'admin']}><DashboardLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<SuspenseWrapper><UserDashboard /></SuspenseWrapper>} />
              </Route>

              {/* ── Organizer Dashboard ── */}
              <Route element={<ProtectedRoute roles={['organizer', 'admin']}><DashboardLayout /></ProtectedRoute>}>
                <Route path="/organizer/dashboard" element={<SuspenseWrapper><OrganizerDashboard /></SuspenseWrapper>} />
                <Route path="/organizer/temples" element={<SuspenseWrapper><OrganizerTemples /></SuspenseWrapper>} />
                <Route path="/organizer/slots" element={<SuspenseWrapper><OrganizerSlots /></SuspenseWrapper>} />
                <Route path="/organizer/bookings" element={<SuspenseWrapper><OrganizerBookings /></SuspenseWrapper>} />
                <Route path="/organizer/revenue" element={<SuspenseWrapper><OrganizerRevenue /></SuspenseWrapper>} />
                <Route path="/organizer/reports" element={<SuspenseWrapper><OrganizerReports /></SuspenseWrapper>} />
              </Route>

              {/* ── Admin Dashboard ── */}
              <Route element={<ProtectedRoute roles={['admin']}><DashboardLayout /></ProtectedRoute>}>
                <Route path="/admin/dashboard" element={<SuspenseWrapper><AdminDashboard /></SuspenseWrapper>} />
                <Route path="/admin/users" element={<SuspenseWrapper><AdminUsers /></SuspenseWrapper>} />
                <Route path="/admin/temples" element={<SuspenseWrapper><AdminTemples /></SuspenseWrapper>} />
                <Route path="/admin/bookings" element={<SuspenseWrapper><AdminBookings /></SuspenseWrapper>} />
                <Route path="/admin/donations" element={<SuspenseWrapper><AdminDonations /></SuspenseWrapper>} />
                <Route path="/admin/analytics" element={<SuspenseWrapper><AdminAnalytics /></SuspenseWrapper>} />
                <Route path="/admin/feedback" element={<SuspenseWrapper><AdminFeedback /></SuspenseWrapper>} />
                <Route path="/admin/ratings" element={<SuspenseWrapper><AdminRatings /></SuspenseWrapper>} />
                <Route path="/admin/reports" element={<SuspenseWrapper><AdminReports /></SuspenseWrapper>} />
                <Route path="/admin/settings" element={<SuspenseWrapper><AdminSettings /></SuspenseWrapper>} />
                <Route path="/admin/audit" element={<SuspenseWrapper><AdminAudit /></SuspenseWrapper>} />
              </Route>

              {/* ── 404 ── */}
              <Route path="*" element={<PublicLayout />}>
                <Route path="*" element={<SuspenseWrapper><NotFoundPage /></SuspenseWrapper>} />
              </Route>
            </Routes>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
