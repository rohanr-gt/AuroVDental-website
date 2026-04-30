import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
const TOKEN_KEY = 'adminToken';

function formatDate(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');

  const [tab, setTab] = useState(() => localStorage.getItem('adminActiveTab') || 'leads');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('adminActiveTab', tab);
  }, [tab]);

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  // Leads
  const [leads, setLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);

  // Bookings
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  // Fetch bookings
  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/appointments`, { headers });
      setBookings(res.data?.appointments || []);
    } catch (e) {
      setBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  };

  // Gallery
  const [gallery, setGallery] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryCategory, setGalleryCategory] = useState('smile-designing');
  const [imageFile, setImageFile] = useState(null);
  const [galleryError, setGalleryError] = useState('');

  // Reviews
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/admin/reviews`, { headers });
      setReviews(res.data?.reviews || []);
    } catch (e) {
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const updateReviewStatus = async (id, status) => {
    try {
      await axios.patch(`${API_BASE}/api/admin/reviews/${id}`, { status }, { headers });
      await fetchReviews();
    } catch {
      // ignore
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await axios.delete(`${API_BASE}/api/admin/reviews/${id}`, { headers });
      await fetchReviews();
    } catch {
      // ignore
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken('');
    setAuthError('');
  };

  const login = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/admin/login`, { username, password });
      const t = res.data?.token;
      if (!t) throw new Error('No token returned');
      localStorage.setItem(TOKEN_KEY, t);
      setToken(t);
      setPassword('');
    } catch (err) {
      setAuthError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async () => {
    setLeadsLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/leads`, { headers });
      setLeads(res.data?.leads || []);
    } catch (e) {
      setLeads([]);
    } finally {
      setLeadsLoading(false);
    }
  };

  const updateLeadStatus = async (id, status) => {
    try {
      await axios.patch(`${API_BASE}/api/leads/${id}`, { status }, { headers });
      await fetchLeads();
    } catch {
      // ignore
    }
  };

  const fetchGallery = async () => {
    setGalleryLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/gallery`);
      setGallery(res.data?.gallery || []);
    } catch (e) {
      setGallery([]);
    } finally {
      setGalleryLoading(false);
    }
  };

  const uploadGallery = async (e) => {
    e.preventDefault();
    setGalleryError('');
    if (!galleryTitle.trim() || !imageFile) {
      setGalleryError('Please provide title + an image.');
      return;
    }
    try {
      const fd = new FormData();
      fd.append('title', galleryTitle.trim());
      fd.append('category', galleryCategory);
      fd.append('image', imageFile);

      await axios.post(`${API_BASE}/api/admin/gallery`, fd, {
        headers: { ...headers, 'Content-Type': 'multipart/form-data' }
      });
      setGalleryTitle('');
      setImageFile(null);
      await fetchGallery();
    } catch (err) {
      setGalleryError('Upload failed. Please try again.');
    }
  };

  const deleteGallery = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/admin/gallery/${id}`, { headers });
      await fetchGallery();
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchLeads();
    fetchGallery();
    fetchBookings();
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (!token) {
    return (
      <div className="min-h-screen pt-20 lg:pt-32 pb-20 px-4 bg-gradient-to-b from-[color:var(--soft)] to-white">
        <div className="max-w-md mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-[color:var(--muted)] hover:text-[color:var(--teal)] font-bold mb-8 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Website
          </Link>

          <div className="bg-white border border-black/5 rounded-3xl shadow-2xl p-8 lg:p-10">
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[color:var(--dk)] mb-2">Admin Login</h1>
            <p className="text-[color:var(--muted)] mb-8">Enter admin credentials to continue.</p>

            <form onSubmit={login} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)] mb-2">
                  Username
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[color:var(--bg)] border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[color:var(--teal)]"
                  autoComplete="username"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)] mb-2">
                  Password
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="w-full bg-[color:var(--bg)] border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[color:var(--teal)]"
                  autoComplete="current-password"
                />
              </div>

              {authError && <div className="text-sm font-bold text-red-600">{authError}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[color:var(--teal)] text-white py-3 rounded-xl font-bold hover:bg-[color:var(--dk)] transition disabled:opacity-50"
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { 
      id: 'leads', 
      label: 'Leads',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    },
    { 
      id: 'gallery', 
      label: 'Gallery',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    },
    { 
      id: 'booking', 
      label: 'Booking',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    },
    { 
      id: 'reviews', 
      label: 'Reviews',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
    }
  ];

  return (
    <div className="flex h-screen bg-[color:var(--bg)] text-[color:var(--txt)] overflow-hidden">
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-black/5 px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[color:var(--teal)] tracking-tight">AdminPanel</h1>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="text-[color:var(--dk)] focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        >
          <aside 
            className="w-64 h-full bg-white flex flex-col shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 py-6 border-b border-black/5 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-[color:var(--teal)] tracking-tight">AdminPanel</h1>
              <button onClick={() => setIsSidebarOpen(false)} className="text-[color:var(--muted)]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setTab(item.id); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${tab === item.id
                      ? 'bg-[color:var(--teal)] text-white'
                      : 'text-[color:var(--muted)] hover:bg-[color:var(--soft)] hover:text-[color:var(--dk)]'
                    }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="p-4 border-t border-black/5">
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold bg-red-50 text-red-600 hover:bg-red-100 transition text-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-black/5 z-30">
        <div className="px-6 py-8 border-b border-black/5">
          <h1 className="text-2xl font-bold text-[color:var(--teal)] tracking-tight">AdminPanel</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${tab === item.id
                  ? 'bg-[color:var(--teal)] text-white shadow-md shadow-teal-500/20'
                  : 'text-[color:var(--muted)] hover:bg-[color:var(--soft)] hover:text-[color:var(--dk)]'
                }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-black/5">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold bg-red-50 text-red-600 hover:bg-red-100 transition text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-[72px] md:pt-0 p-4 lg:p-10">

          {tab === 'leads' && (
            <div className="bg-white border border-black/5 rounded-3xl shadow-xl overflow-hidden">
              <div className="p-6 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[color:var(--dk)] text-lg">Leads</div>
                  <div className="text-sm text-[color:var(--muted)]">Generated from booking submissions.</div>
                </div>
                <button
                  onClick={fetchLeads}
                  className="px-4 py-2 rounded-xl font-bold bg-[color:var(--soft)] text-[color:var(--dk)] hover:bg-white border border-black/5 transition"
                >
                  Refresh
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-[color:var(--soft)] text-[color:var(--dk)]">
                    <tr>
                      <th className="text-left px-4 lg:px-6 py-4 font-bold">Name</th>
                      <th className="text-left px-4 lg:px-6 py-4 font-bold">Phone</th>
                      <th className="text-left px-6 py-4 font-bold hidden md:table-cell">Email</th>
                      <th className="text-left px-6 py-4 font-bold hidden lg:table-cell">Service</th>
                      <th className="text-left px-6 py-4 font-bold hidden lg:table-cell">Source</th>
                      <th className="text-left px-6 py-4 font-bold hidden xl:table-cell">Created</th>
                      <th className="text-left px-4 lg:px-6 py-4 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leadsLoading ? (
                      <tr>
                        <td className="px-6 py-6 text-[color:var(--muted)]" colSpan={7}>
                          Loading…
                        </td>
                      </tr>
                    ) : leads.length === 0 ? (
                      <tr>
                        <td className="px-6 py-6 text-[color:var(--muted)]" colSpan={7}>
                          No leads yet.
                        </td>
                      </tr>
                    ) : (
                      leads.map((l) => (
                        <tr key={l.id} className="border-t border-black/5 hover:bg-gray-50 transition-colors">
                          <td className="px-4 lg:px-6 py-4 font-bold text-[color:var(--dk)]">{l.name}</td>
                          <td className="px-4 lg:px-6 py-4">{l.phone}</td>
                          <td className="px-6 py-4 hidden md:table-cell">{l.email || '-'}</td>
                          <td className="px-6 py-4 hidden lg:table-cell">{l.service || '-'}</td>
                          <td className="px-6 py-4 hidden lg:table-cell">{l.source}</td>
                          <td className="px-6 py-4 hidden xl:table-cell">{formatDate(l.createdAt)}</td>
                          <td className="px-4 lg:px-6 py-4">
                            <select
                              value={l.status || 'new'}
                              onChange={(e) => updateLeadStatus(l.id, e.target.value)}
                              className="bg-white border border-black/10 rounded-xl px-2 lg:px-3 py-1 lg:py-2 font-bold text-[color:var(--dk)] text-xs lg:text-sm"
                            >
                              <option value="new">new</option>
                              <option value="contacted">contacted</option>
                              <option value="won">won</option>
                              <option value="lost">lost</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'gallery' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white border border-black/5 rounded-3xl shadow-xl p-8">
                <div className="font-bold text-[color:var(--dk)] text-lg mb-1">Upload Gallery Item</div>
                <div className="text-sm text-[color:var(--muted)] mb-6">
                  Upload an image and assign a category.
                </div>

                <form onSubmit={uploadGallery} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)] mb-2">
                      Category
                    </label>
                    <select
                      value={galleryCategory}
                      onChange={(e) => setGalleryCategory(e.target.value)}
                      className="w-full bg-[color:var(--bg)] border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[color:var(--teal)] font-bold text-[color:var(--dk)]"
                    >
                      <option value="smile-designing">Smile Designing</option>
                      <option value="aligners">Braces & Aligners</option>
                      <option value="implants">Dental Implants</option>
                      <option value="our-work">Our Works</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)] mb-2">
                      Title
                    </label>
                    <input
                      value={galleryTitle}
                      onChange={(e) => setGalleryTitle(e.target.value)}
                      className="w-full bg-[color:var(--bg)] border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[color:var(--teal)]"
                      placeholder="e.g. Smile Design Transformation"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)] mb-2">
                      Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      className="w-full"
                    />
                  </div>

                  {galleryError && <div className="text-sm font-bold text-red-600">{galleryError}</div>}

                  <button
                    type="submit"
                    className="w-full bg-[color:var(--teal)] text-white py-3 rounded-xl font-bold hover:bg-[color:var(--dk)] transition"
                  >
                    Upload
                  </button>
                </form>
              </div>

              <div className="bg-white border border-black/5 rounded-3xl shadow-xl overflow-hidden">
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[color:var(--dk)] text-lg">Gallery Items</div>
                    <div className="text-sm text-[color:var(--muted)]">Shown on the public Results/Gallery views.</div>
                  </div>
                  <button
                    onClick={fetchGallery}
                    className="px-4 py-2 rounded-xl font-bold bg-[color:var(--soft)] text-[color:var(--dk)] hover:bg-white border border-black/5 transition"
                  >
                    Refresh
                  </button>
                </div>

                <div className="divide-y divide-black/5">
                  {galleryLoading ? (
                    <div className="p-6 text-[color:var(--muted)]">Loading…</div>
                  ) : gallery.length === 0 ? (
                    <div className="p-6 text-[color:var(--muted)]">No gallery items yet.</div>
                  ) : (
                    gallery.map((g) => (
                      <div key={g.id} className="p-4 lg:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="w-full sm:w-16 h-40 sm:h-16 rounded-2xl overflow-hidden bg-[color:var(--soft)] border border-black/5 flex-shrink-0">
                          <img
                            src={`${API_BASE}${g.image}`}
                            alt={g.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-[color:var(--dk)] truncate">{g.title}</div>
                          <div className="text-sm text-[color:var(--muted)]">{g.category}</div>
                        </div>
                        <button
                          onClick={() => deleteGallery(g.id)}
                          className="w-full sm:w-auto px-4 py-2 rounded-xl font-bold bg-white border border-black/10 text-red-600 hover:bg-red-50 transition"
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === 'booking' && (
            <div className="bg-white border border-black/5 rounded-3xl shadow-xl overflow-hidden">
              <div className="p-6 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[color:var(--dk)] text-lg">Booking</div>
                  <div className="text-sm text-[color:var(--muted)]">Manage appointment bookings.</div>
                </div>
                <button
                  onClick={fetchBookings}
                  className="px-4 py-2 rounded-xl font-bold bg-[color:var(--soft)] text-[color:var(--dk)] hover:bg-white border border-black/5 transition"
                >
                  Refresh
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-[color:var(--soft)] text-[color:var(--dk)]">
                    <tr>
                      <th className="text-left px-4 lg:px-6 py-4 font-bold">Name</th>
                      <th className="text-left px-4 lg:px-6 py-4 font-bold">Phone</th>
                      <th className="text-left px-4 lg:px-6 py-4 font-bold">Email</th>
                      <th className="text-left px-4 lg:px-6 py-4 font-bold">Service</th>
                      <th className="text-left px-4 lg:px-6 py-4 font-bold">Date</th>
                      <th className="text-left px-4 lg:px-6 py-4 font-bold">Time</th>
                      <th className="text-left px-4 lg:px-6 py-4 font-bold">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingsLoading ? (
                      <tr><td colSpan={7} className="px-4 py-6 text-center">Loading...</td></tr>
                    ) : bookings.length === 0 ? (
                      <tr><td colSpan={7} className="px-4 py-6 text-center text-[color:var(--muted)]">No bookings yet.</td></tr>
                    ) : bookings.map((b) => (
                      <tr key={b.id || b._id} className="border-b border-black/5">
                        <td className="px-4 lg:px-6 py-3">{b.name}</td>
                        <td className="px-4 lg:px-6 py-3">{b.phone}</td>
                        <td className="px-4 lg:px-6 py-3">{b.email}</td>
                        <td className="px-4 lg:px-6 py-3">{b.service}</td>
                        <td className="px-4 lg:px-6 py-3">{b.date}</td>
                        <td className="px-4 lg:px-6 py-3">{b.time}</td>
                        <td className="px-4 lg:px-6 py-3">{formatDate(b.created_at || b.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'reviews' && (
            <div className="bg-white border border-black/5 rounded-3xl shadow-xl overflow-hidden">
              <div className="p-6 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[color:var(--dk)] text-lg">Reviews</div>
                  <div className="text-sm text-[color:var(--muted)]">Manage patient experiences and testimonials.</div>
                </div>
                <button
                  onClick={fetchReviews}
                  className="px-4 py-2 rounded-xl font-bold bg-[color:var(--soft)] text-[color:var(--dk)] hover:bg-white border border-black/5 transition"
                >
                  Refresh
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-[color:var(--soft)] text-[color:var(--dk)]">
                    <tr>
                      <th className="text-left px-4 lg:px-6 py-4 font-bold">Name</th>
                      <th className="text-left px-4 lg:px-6 py-4 font-bold hidden md:table-cell">Contact</th>
                      <th className="text-left px-4 lg:px-6 py-4 font-bold">Rating</th>
                      <th className="text-left px-4 lg:px-6 py-4 font-bold">Comment</th>
                      <th className="text-left px-4 lg:px-6 py-4 font-bold">Created</th>
                      <th className="text-left px-4 lg:px-6 py-4 font-bold">Status/Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviewsLoading ? (
                      <tr><td colSpan={6} className="px-4 py-6 text-center">Loading...</td></tr>
                    ) : reviews.length === 0 ? (
                      <tr><td colSpan={6} className="px-4 py-6 text-center text-[color:var(--muted)]">No reviews yet.</td></tr>
                    ) : reviews.map((r) => (
                      <tr key={r.id} className="border-b border-black/5">
                        <td className="px-4 lg:px-6 py-3 font-bold text-[color:var(--dk)]">{r.name || 'Anonymous'}</td>
                        <td className="px-4 lg:px-6 py-3 hidden md:table-cell text-[color:var(--muted)]">{r.email}<br/>{r.phone}</td>
                        <td className="px-4 lg:px-6 py-3 text-yellow-400">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</td>
                        <td className="px-4 lg:px-6 py-3 max-w-xs truncate" title={r.comment}>{r.comment}</td>
                        <td className="px-4 lg:px-6 py-3">{formatDate(r.createdAt)}</td>
                        <td className="px-4 lg:px-6 py-3 flex gap-2 items-center">
                          <select
                            value={r.status || 'pending'}
                            onChange={(e) => updateReviewStatus(r.id, e.target.value)}
                            className={`bg-white border rounded-xl px-2 py-1 font-bold text-xs lg:text-sm ${
                              r.status === 'published' ? 'border-green-500 text-green-700' : 
                              r.status === 'rejected' ? 'border-red-500 text-red-700' : 'border-yellow-500 text-yellow-700'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="published">Published</option>
                            <option value="rejected">Rejected</option>
                          </select>
                          <button
                            onClick={() => deleteReview(r.id)}
                            className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-bold px-3 py-1 rounded-xl transition text-xs lg:text-sm"
                            title="Delete Review"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
    </div>
  );
}

