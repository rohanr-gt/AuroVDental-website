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

  const [tab, setTab] = useState('leads');

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  // Leads
  const [leads, setLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);

  // Gallery
  const [gallery, setGallery] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryCategory, setGalleryCategory] = useState('smile-designing');
  const [imageFile, setImageFile] = useState(null);
  const [galleryError, setGalleryError] = useState('');

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
    { id: 'leads', label: 'Leads' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'booking', label: 'Booking' }
  ];

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--txt)]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 py-4 lg:py-6 flex items-center justify-between">
          <h1 className="text-xl lg:text-3xl font-bold text-[color:var(--teal)] tracking-tight">AdminPanel</h1>
          <button
            onClick={logout}
            className="px-4 lg:px-6 py-2 lg:py-2.5 rounded-xl font-bold bg-[color:var(--soft)] text-[color:var(--dk)] hover:bg-[color:var(--teal)] hover:text-white transition text-sm lg:text-base"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="pt-[72px] lg:pt-[88px]">
        {/* Horizontal Navigation Bar (Always Visible) */}
        <div className="bg-white border-b border-black/5 sticky top-[72px] lg:top-[88px] z-40">
          <div className="max-w-7xl mx-auto px-4 lg:px-10">
            <div className="flex gap-4 lg:gap-8 overflow-x-auto no-scrollbar">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`whitespace-nowrap py-4 lg:py-6 px-2 font-bold text-sm lg:text-base border-b-2 transition-all ${
                    tab === item.id 
                      ? 'border-[color:var(--teal)] text-[color:var(--teal)]' 
                      : 'border-transparent text-[color:var(--muted)] hover:text-[color:var(--dk)]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="max-w-7xl mx-auto p-4 lg:p-10 text-[color:var(--txt)]">

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
                </div>
                <div className="p-6">
                  <p className="text-[color:var(--muted)]">Booking management coming soon...</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    );
}

