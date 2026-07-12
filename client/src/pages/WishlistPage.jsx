import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Star, Trash2 } from 'lucide-react';
import { wishlistAPI } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

const WishlistPage = () => {
  const { addNotification } = useNotification();
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await wishlistAPI.getAll();
      setTemples(res.data.data || []);
    } catch {
      setTemples([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWishlist(); }, []);

  const handleRemove = async (templeId) => {
    try {
      await wishlistAPI.toggle(templeId);
      setTemples((prev) => prev.filter((t) => t._id !== templeId));
      addNotification('Removed from wishlist', 'success');
    } catch {
      addNotification('Failed to remove', 'error');
    }
  };

  if (loading) return <Loader fullPage text="Loading wishlist..." />;

  return (
    <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-1)' }}>
            My <span className="gradient-text">Wishlist</span>
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            {temples.length} temple{temples.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        <Link to="/temples" className="btn btn-secondary-custom" style={{ padding: '10px 24px' }}>
          Browse Temples
        </Link>
      </div>

      {temples.length === 0 ? (
        <EmptyState
          icon="💖"
          title="Your wishlist is empty"
          message="Browse temples and tap the heart icon to save your favorites here."
          actionText="Explore Temples"
          actionLink="/temples"
        />
      ) : (
        <div className="row g-4">
          {temples.map((temple) => (
            <div className="col-md-6 col-lg-4" key={temple._id}>
              <div className="temple-card" style={{ position: 'relative' }}>
                <button
                  onClick={() => handleRemove(temple._id)}
                  className="temple-card-wishlist active"
                  title="Remove from wishlist"
                >
                  <Heart size={16} fill="var(--temple-red)" stroke="var(--temple-red)" />
                </button>
                <Link to={`/temples/${temple._id}`} style={{ textDecoration: 'none' }}>
                  <div className="temple-card-img-wrapper" style={{
                    background: `linear-gradient(135deg, hsl(25, 60%, 40%), hsl(45, 50%, 30%))`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {temple.images?.[0] ? (
                      <img src={temple.images[0]} alt={temple.name} />
                    ) : (
                      <span style={{ fontSize: 64, opacity: 0.4 }}>🛕</span>
                    )}
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
                        {temple.averageRating || 0}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
