import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Star, Filter, X, SlidersHorizontal } from 'lucide-react';
import { templeAPI } from '../../services/api';
import Loader from '../../components/common/Loader';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import { getImageUrl } from '../../utils/helpers';

const TempleListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    state: searchParams.get('state') || '',
    darshanType: searchParams.get('darshanType') || '',
    sort: searchParams.get('sort') || '-totalBookings',
    page: parseInt(searchParams.get('page')) || 1,
  });

  const states = ['Andhra Pradesh', 'Gujarat', 'Karnataka', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand'];
  const darshanTypes = ['General Darshan', 'VIP Darshan', 'Special Entry', 'Seva Darshan', 'Aarti Darshan'];
  const sortOptions = [
    { value: '-totalBookings', label: 'Most Popular' },
    { value: '-averageRating', label: 'Highest Rated' },
    { value: '-createdAt', label: 'Newest First' },
    { value: 'name', label: 'Name (A-Z)' },
  ];

  /* ── Fallback Temple Data (used when DB is empty) ── */
  const fallbackTemples = [
    {
      _id: 'temp_tirupati_001',
      name: 'Sri Tirumala Tirupati Devasthanam',
      description: 'One of the most famous and richest temples in the world, dedicated to Lord Venkateswara.',
      address: { line: 'Tirumala Hills', district: 'Tirupati', state: 'Andhra Pradesh', pincode: '517504' },
      timings: { openTime: '03:00', closeTime: '22:00' },
      darshanTypes: [
        { name: 'General Darshan', price: 300, duration: '2-3 hours', description: 'Free darshan through general queue' },
        { name: 'VIP Darshan', price: 500, duration: '45 mins', description: 'Special entry with priority access' },
        { name: 'Special Entry', price: 300, duration: '1 hour', description: 'Special entry darshan ticket' },
      ],
      heroBanner: 'tirumala.jpg',
      averageRating: 4.8, totalRatings: 1250, totalBookings: 50000, isFeatured: true, isActive: true,
    },
    {
      _id: 'temp_varanasi_002',
      name: 'Varanasi Kashi Vishwanath Temple',
      description: 'One of the twelve Jyotirlingas dedicated to Lord Shiva, located on the western bank of the holy river Ganga.',
      address: { line: 'Lahori Tola', district: 'Varanasi', state: 'Uttar Pradesh', pincode: '221001' },
      timings: { openTime: '03:00', closeTime: '23:00' },
      darshanTypes: [
        { name: 'General Darshan', price: 0, duration: '30 mins', description: 'Regular darshan' },
        { name: 'Special Entry', price: 200, duration: '20 mins', description: 'Priority darshan' },
        { name: 'Aarti Darshan', price: 500, duration: '45 mins', description: 'Attend the divine Ganga Aarti' },
      ],
      heroBanner: 'kashi.jpg',
      averageRating: 4.6, totalRatings: 890, totalBookings: 35000, isFeatured: true, isActive: true,
    },
    {
      _id: 'temp_madurai_003',
      name: 'Meenakshi Amman Temple',
      description: 'A historic Hindu temple dedicated to Goddess Meenakshi and Lord Sundareswarar with stunning Dravidian architecture.',
      address: { line: 'Temple Area', district: 'Madurai', state: 'Tamil Nadu', pincode: '625001' },
      timings: { openTime: '05:00', closeTime: '21:30' },
      darshanTypes: [
        { name: 'General Darshan', price: 0, duration: '1 hour', description: 'Regular entry darshan' },
        { name: 'VIP Darshan', price: 200, duration: '30 mins', description: 'Priority darshan' },
        { name: 'Special Entry', price: 100, duration: '45 mins', description: 'Skip-the-line entry' },
      ],
      heroBanner: 'meenakshi_temple.jpg',
      averageRating: 4.7, totalRatings: 670, totalBookings: 28000, isFeatured: true, isActive: true,
    },
    {
      _id: 'temp_puri_004',
      name: 'Jagannath Temple Puri',
      description: 'One of the Char Dhams, dedicated to Lord Jagannath. Famous for the annual Rath Yatra festival.',
      address: { line: 'Grand Road', district: 'Puri', state: 'Odisha', pincode: '752001' },
      timings: { openTime: '05:00', closeTime: '22:00' },
      darshanTypes: [
        { name: 'General Darshan', price: 0, duration: '1-2 hours', description: 'Regular darshan' },
        { name: 'Special Entry', price: 200, duration: '30 mins', description: 'Quick darshan' },
      ],
      heroBanner: 'jaganath.jpg',
      averageRating: 4.5, totalRatings: 520, totalBookings: 22000, isFeatured: false, isActive: true,
    },
    {
      _id: 'temp_amritsar_005',
      name: 'Golden Temple (Harmandir Sahib)',
      description: 'The holiest Gurdwara and the most important pilgrimage site of Sikhism with stunning gold-plated architecture.',
      address: { line: 'Golden Temple Road', district: 'Amritsar', state: 'Punjab', pincode: '143006' },
      timings: { openTime: '02:00', closeTime: '22:00' },
      darshanTypes: [
        { name: 'General Darshan', price: 0, duration: '1-2 hours', description: 'Open to all, no ticket required' },
        { name: 'Seva Darshan', price: 0, duration: '3 hours', description: 'Participate in community service' },
      ],
      heroBanner: 'golden_temple.jpg',
      averageRating: 4.9, totalRatings: 2100, totalBookings: 60000, isFeatured: true, isActive: true,
    },
    {
      _id: 'temp_somnath_006',
      name: 'Somnath Temple',
      description: 'The first among the twelve Aadi Jyotirlingas of Lord Shiva, located at the shore of the Arabian Sea.',
      address: { line: 'Somnath Mandir Road', district: 'Gir Somnath', state: 'Gujarat', pincode: '362268' },
      timings: { openTime: '06:00', closeTime: '21:00' },
      darshanTypes: [
        { name: 'General Darshan', price: 0, duration: '30 mins', description: 'Free darshan for all' },
        { name: 'Aarti Darshan', price: 100, duration: '45 mins', description: 'Attend the evening aarti' },
      ],
      heroBanner: 'somnath.jpg',
      averageRating: 4.4, totalRatings: 380, totalBookings: 15000, isFeatured: false, isActive: true,
    },
  ];

  useEffect(() => {
    fetchTemples();
  }, [filters.page, filters.sort]);

  const fetchTemples = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.state) params.state = filters.state;
      if (filters.darshanType) params.darshanType = filters.darshanType;
      params.sort = filters.sort;
      params.page = filters.page;
      params.limit = 9;

      const res = await templeAPI.getAll(params);
      const apiTemples = res.data.data || [];
      if (apiTemples.length > 0) {
        setTemples(apiTemples);
        setPagination(res.data.pagination || { page: 1, pages: 1, total: apiTemples.length });
      } else {
        /* Use fallback data when API returns empty */
        let filtered = [...fallbackTemples];
        if (filters.search) {
          const q = filters.search.toLowerCase();
          filtered = filtered.filter(t =>
            t.name.toLowerCase().includes(q) ||
            t.address.district.toLowerCase().includes(q) ||
            t.address.state.toLowerCase().includes(q)
          );
        }
        if (filters.state) {
          filtered = filtered.filter(t => t.address.state === filters.state);
        }
        if (filters.darshanType) {
          filtered = filtered.filter(t => t.darshanTypes.some(dt => dt.name === filters.darshanType));
        }
        setTemples(filtered);
        setPagination({ page: 1, pages: 1, total: filtered.length });
      }
    } catch {
      /* On network error, still show fallback temples */
      setTemples(fallbackTemples);
      setPagination({ page: 1, pages: 1, total: fallbackTemples.length });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters((p) => ({ ...p, page: 1 }));
    fetchTemples();
  };

  const handleFilterChange = (key, value) => {
    setFilters((p) => ({ ...p, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ search: '', state: '', darshanType: '', sort: '-totalBookings', page: 1 });
    setTimeout(fetchTemples, 0);
  };

  const activeFilterCount = [filters.state, filters.darshanType].filter(Boolean).length;

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="container-custom">
          <h1>Explore Sacred Temples</h1>
          <p>Discover and book darshan at India&apos;s most revered temples</p>
        </div>
      </div>

      <div className="container-custom" style={{ marginTop: 'calc(-1 * var(--space-6))' }}>
        {/* Search Bar */}
        <div className="animate-fade-in-up" style={{
          background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4) var(--space-5)',
          boxShadow: 'var(--shadow-lg)', marginBottom: 'var(--space-5)',
        }}>
          <form onSubmit={handleSearch} className="d-flex gap-3 align-items-center flex-wrap">
            <div className="search-bar-spiritual flex-grow-1">
              <Search className="search-icon" size={18} />
              <input type="text" className="form-control" placeholder="Search by temple name, city, state..." value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
            <button type="button" className="btn btn-ghost position-relative" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal size={18} />
              <span className="d-none d-md-inline ms-1">Filters</span>
              {activeFilterCount > 0 && (
                <span style={{
                  position: 'absolute', top: 0, right: 0, width: 18, height: 18, borderRadius: '50%',
                  background: 'var(--saffron)', color: '#fff', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{activeFilterCount}</span>
              )}
            </button>
          </form>

          {/* Filters Panel */}
          {showFilters && (
            <div className="animate-fade-in-down" style={{ borderTop: '1px solid var(--border-light)', marginTop: 'var(--space-3)', paddingTop: 'var(--space-3)' }}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">State</label>
                  <select className="form-select" value={filters.state} onChange={(e) => handleFilterChange('state', e.target.value)}>
                    <option value="">All States</option>
                    {states.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Darshan Type</label>
                  <select className="form-select" value={filters.darshanType} onChange={(e) => handleFilterChange('darshanType', e.target.value)}>
                    <option value="">All Types</option>
                    {darshanTypes.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Sort By</label>
                  <select className="form-select" value={filters.sort} onChange={(e) => handleFilterChange('sort', e.target.value)}>
                    {sortOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="d-flex justify-content-between mt-3">
                <button className="btn btn-ghost btn-sm" onClick={clearFilters} style={{ fontSize: 'var(--fs-sm)' }}>
                  <X size={14} /> Clear All
                </button>
                <button className="btn btn-primary btn-sm" onClick={fetchTemples}>Apply Filters</button>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div style={{ marginBottom: 'var(--space-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)', margin: 0 }}>
            {pagination.total > 0 ? `Showing ${temples.length} of ${pagination.total} temples` : ''}
          </p>
        </div>

        {loading ? (
          <Loader fullPage text="Discovering temples..." />
        ) : temples.length === 0 ? (
          <EmptyState title="No Temples Found" description="Try adjusting your search or filters to find temples." actionText="Clear Filters" action={clearFilters} />
        ) : (
          <>
            <div className="row g-4">
              {temples.map((temple, i) => (
                <div className="col-md-6 col-lg-4" key={temple._id}>
                  <Link to={`/temples/${temple._id}`} style={{ textDecoration: 'none' }}>
                    <div className={`temple-card animate-fade-in-up delay-${(i % 3) + 1}`}>
                      <div className="temple-card-img-wrapper" style={{
                        background: `linear-gradient(135deg, hsl(${(i * 40) % 360 + 10}, 50%, 35%), hsl(${(i * 40 + 20) % 360}, 40%, 25%))`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {temple.heroBanner ? (
                          <img src={getImageUrl(temple.heroBanner)} alt={temple.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: 64, opacity: 0.4 }}>🛕</span>
                        )}
                        {temple.isFeatured && <span className="temple-card-badge badge-spiritual badge-saffron">Featured</span>}
                      </div>
                      <div className="temple-card-body">
                        <h6 className="temple-card-title">{temple.name}</h6>
                        <div className="temple-card-location">
                          <MapPin size={13} />
                          <span>{temple.address?.district}, {temple.address?.state}</span>
                        </div>
                        <div className="temple-card-meta">
                          <span className="temple-card-price">
                            {temple.darshanTypes?.[0]?.price > 0 ? `₹${temple.darshanTypes[0].price}` : 'Free'}
                            <small> /person</small>
                          </span>
                          <span className="temple-card-rating">
                            <Star size={14} fill="var(--soft-gold)" stroke="var(--soft-gold)" />
                            {temple.averageRating || 0} ({temple.totalRatings || 0})
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))} />
          </>
        )}
      </div>

      <div style={{ height: 'var(--space-9)' }} />
    </div>
  );
};

export default TempleListingPage;
