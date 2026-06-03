import { Fragment, useEffect, useRef } from 'react';
import { useOwnerDashboard } from '../hooks/useOwnerDashboard.js';
import { OwnerOrdersTab } from '../owner/OwnerOrderSection.jsx';
import { OwnerModals } from '../owner/OwnerModals.jsx';
import ProductImg from '../katalog/ProductImg.jsx';
import SalesChart from '../owner/SalesChart.jsx';
import '../styles/owner-dashboard.css';

function roleBadge(role) {
  const r = String(role || '').toUpperCase();
  if (r.includes('OWNER')) return <span className="role-badge">OWNER</span>;
  if (r.includes('ADMIN') || r.includes('KASIR') || r.includes('EMPLOYEE'))
    return <span className="role-badge" style={{ background: '#34d399' }}>ADMIN</span>;
  if (r.includes('GUDANG')) return <span className="role-badge" style={{ background: '#fbbf24', color: 'black' }}>GUDANG</span>;
  return <span className="role-badge" style={{ background: '#a78bfa' }}>{r}</span>;
}

const SIDEBAR_GROUPS = [
  {
    items: [{ id: 'dashboard', icon: 'fa-tachometer-alt', label: 'Dashboard' }],
  },
  {
    section: 'Master Data',
    items: [
      { id: 'manajemen-user', icon: 'fa-users', label: 'Manajemen User' },
      { id: 'kategori-produk', icon: 'fa-tags', label: 'Kategori Produk' },
      { id: 'produk', icon: 'fa-box', label: 'Produk' },
      { id: 'supplier', icon: 'fa-truck', label: 'Supplier' },
    ],
  },
  {
    section: 'Inventori & Gudang',
    items: [
      { id: 'inventaris', icon: 'fa-boxes', label: 'Inventaris Stok' },
      { id: 'barang-masuk', icon: 'fa-sign-in-alt', label: 'Barang Masuk' },
      { id: 'retur-barang', icon: 'fa-sign-out-alt', label: 'Retur Barang' },
      { id: 'audit-stok', icon: 'fa-history', label: 'Audit Stok' },
    ],
  },
  {
    section: 'Aplikasi',
    items: [
      { id: 'katalog-online', icon: 'fa-store', label: 'Katalog Online' },
      { id: 'order-konfirmasi', icon: 'fa-shopping-bag', label: 'Pesanan Online' },
    ],
  },
];

export default function OwnerDashboardPage() {
  const rootRef = useRef(null);
  const welcomed = useRef(false);
  const {
    activeTab,
    switchTab,
    sidebarOpen,
    setSidebarOpen,
    toggleSidebar,
    toast,
    showToast,
    logout,
    ownerName,
    ownerInitials,
    products,
    categories,
    staffUsers,
    orders,
    lowStockProducts,
    dashboardStats,
    activeSuppliersCount,
    suppliers,
    goodsReceipts,
    returns,
    openModal,
    editItem,
    deleteItem,
    ownerUpdateOrderStatus,
    ownerVerifyPayment,
    ownerCancelOnlineOrder,
    openPesanStok,
    viewDetail,
    showNotifications,
    pageTitle,
    pageIcon,
    searchQuery,
    setSearchQuery,
    onSearchEnter,
    notifCount,
    getMinStock,
    modal,
    closeModal,
    saveKategori,
    saveProduk,
    saveSupplier,
    savePesanStok,
    saveBarangMasuk,
    saveRetur,
    salesChart,
    topProducts,
    priceSummary,
  } = useOwnerDashboard();

  useEffect(() => {
    if (welcomed.current) return;
    welcomed.current = true;
    showToast(`Selamat datang, ${ownerName}`);
  }, [ownerName, showToast]);

  useEffect(() => {
    const onDocClick = (event) => {
      if (window.innerWidth > 1024) return;
      const root = rootRef.current;
      if (!root) return;
      const sidebar = root.querySelector('.sidebar');
      const menuToggle = root.querySelector('.menu-toggle');
      if (
        sidebar &&
        !sidebar.contains(event.target) &&
        menuToggle &&
        !menuToggle.contains(event.target)
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [setSidebarOpen]);

  return (
    <div className="owner-dashboard-root" ref={rootRef}>
      <OwnerModals
        modal={modal}
        closeModal={closeModal}
        categories={categories}
        products={products}
        suppliers={suppliers}
        saveKategori={saveKategori}
        saveProduk={saveProduk}
        saveSupplier={saveSupplier}
        savePesanStok={savePesanStok}
        saveBarangMasuk={saveBarangMasuk}
        saveRetur={saveRetur}
      />
      <div className={`toast${toast.show ? ' show' : ''}`}>
        <i className="fas fa-check-circle" />
        <span>{toast.message}</span>
      </div>

      <div className="dashboard-container">
        <div className={`sidebar${sidebarOpen ? ' active' : ''}`}>
          
          {/* BAGIAN HEADER SIDEBAR (LOGO & NAMA) */}
          <div className="sidebar-header">
            <img src="/images/logo edja.png" alt="Logo Edja Corner" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
            <h3>Edja Corner</h3>
          </div>

          <div className="user-info">
            <div className="user-avatar">{ownerInitials}</div>
            <div>
              <div className="user-name">{ownerName}</div>
              <span className="role-badge">OWNER</span>
            </div>
          </div>

          <nav className="sidebar-menu">
            <ul>
              {SIDEBAR_GROUPS.map((group, gi) => (
                <Fragment key={gi}>
                  {group.section ? (
                    <li style={{ listStyle: 'none', marginBottom: 0 }}>
                      <div className="menu-section">{group.section}</div>
                    </li>
                  ) : null}
                  {group.items.map((item) => (
                    <li key={item.id} className={activeTab === item.id ? 'active' : ''}>
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          switchTab(item.id);
                        }}
                      >
                        <i className={`fas ${item.icon}`} /> {item.label}
                      </a>
                    </li>
                  ))}
                </Fragment>
              ))}
              <li style={{ marginTop: 16, borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
                <a
                  href="#logout"
                  onClick={(e) => {
                    e.preventDefault();
                    logout();
                  }}
                >
                  <i className="fas fa-sign-out-alt" /> Logout
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="main-content">
          <div className="top-bar">
            <button type="button" className="menu-toggle" onClick={toggleSidebar} aria-label="Menu">
              <i className="fas fa-bars" />
            </button>
            <div className="page-indicator">
              <h2>
                <i className={`fas ${pageIcon}`} /> {pageTitle}
              </h2>
            </div>
            <div className="search-bar">
              <i className="fas fa-search" />
              <input
                type="text"
                placeholder="Cari..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSearchEnter()}
              />
            </div>
            <button type="button" className="notification" onClick={showNotifications} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <i className="fas fa-bell" />
              {notifCount > 0 ? <span className="badge">{notifCount}</span> : null}
            </button>
          </div>

          <div className="content">
            {activeTab === 'dashboard' && (
              <div className="tab-content active">
                <div className="stat-cards">
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#e3f2fd' }}>
                      <i className="fas fa-shopping-cart" style={{ color: '#1976d2' }} />
                    </div>
                    <div className="stat-info">
                      <h3>Rp {dashboardStats.salesToday.toLocaleString('id-ID')}</h3>
                      <p>Total Penjualan (hari ini)</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#e8f5e8' }}>
                      <i className="fas fa-chart-line" style={{ color: '#2e7d32' }} />
                    </div>
                    <div className="stat-info">
                      <h3>Rp {dashboardStats.profitToday.toLocaleString('id-ID')}</h3>
                      <p>Total Profit / Laba (hari ini)</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#fff8e1' }}>
                      <i className="fas fa-tags" style={{ color: '#f9a825' }} />
                    </div>
                    <div className="stat-info">
                      <h3>Rp {dashboardStats.costToday.toLocaleString('id-ID')}</h3>
                      <p>HPP / Harga beli terjual (hari ini)</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#fce4e4' }}>
                      <i className="fas fa-exclamation-triangle" style={{ color: '#d32f2f' }} />
                    </div>
                    <div className="stat-info">
                      <h3>{dashboardStats.lowStockCount}</h3>
                      <p>Stok menipis</p>
                    </div>
                  </div>
                </div>

                <div className="card" style={{ marginBottom: 24 }}>
                  <div className="card-header">
                    <h3>Ringkasan Harga Beli &amp; Harga Jual Produk</h3>
                  </div>
                  <div className="card-body">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Produk</th>
                          <th>Harga Beli</th>
                          <th>Harga Jual</th>
                          <th>Margin</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(priceSummary || []).length === 0 ? (
                          <tr>
                            <td colSpan={4} style={{ textAlign: 'center', color: '#6b7280', padding: 16 }}>
                              Belum ada data produk
                            </td>
                          </tr>
                        ) : (
                          priceSummary.map((p) => {
                            const margin = (Number(p.sellPrice) || 0) - (Number(p.buyPrice) || 0);
                            return (
                              <tr key={p.id}>
                                <td>{p.name}</td>
                                <td>Rp {(Number(p.buyPrice) || 0).toLocaleString('id-ID')}</td>
                                <td>Rp {(Number(p.sellPrice) || 0).toLocaleString('id-ID')}</td>
                                <td>Rp {margin.toLocaleString('id-ID')}</td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="row">
                  <div className="col-6">
                    <div className="card">
                      <div className="card-header">
                        <h3>Grafik Penjualan 7 Hari Terakhir</h3>
                        <span className="orders-spa__muted">Data real-time</span>
                      </div>
                      <div className="card-body">
                        <SalesChart data={salesChart} height={250} />
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="card">
                      <div className="card-header">
                        <h3>Produk Terlaris</h3>
                        <span className="orders-spa__muted">{dashboardStats.txCount} pesanan hari ini</span>
                      </div>
                      <div className="card-body">
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>Produk</th>
                              <th>Terjual</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(topProducts || []).length === 0 ? (
                              <tr>
                                <td colSpan={3} style={{ textAlign: 'center', color: '#6b7280', padding: 16 }}>
                                  Belum ada penjualan tercatat
                                </td>
                              </tr>
                            ) : (
                              topProducts.map((p) => (
                                <tr key={p.productId}>
                                  <td>{p.name}</td>
                                  <td>{p.qty} pcs</td>
                                  <td>Rp {(p.total || 0).toLocaleString('id-ID')}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3>Produk dengan Stok Menipis</h3>
                    <a
                      href="#inv"
                      onClick={(e) => {
                        e.preventDefault();
                        switchTab('inventaris');
                      }}
                    >
                      Lihat Semua
                    </a>
                  </div>
                  <div className="card-body">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Produk</th>
                          <th>Kategori</th>
                          <th>Stok Saat Ini</th>
                          <th>Stok Minimum</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lowStockProducts.length === 0 ? (
                          <tr>
                            <td colSpan={5} style={{ textAlign: 'center', color: '#6b7280', padding: 24 }}>
                              Tidak ada stok menipis
                            </td>
                          </tr>
                        ) : (
                          lowStockProducts.slice(0, 8).map((p) => (
                            <tr key={p.id}>
                              <td>{p.name}</td>
                              <td>{p.category}</td>
                              <td>{p.stock}</td>
                              <td>{getMinStock(p)}</td>
                              <td>
                                <span className="stock-badge stock-warning">Menipis</span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'manajemen-user' && (
              <div className="tab-content active">
                <div className="card-header" style={{ marginBottom: 20, padding: 0 }}>
                  <h3>Manajemen User</h3>
                  <button type="button" className="btn-primary" onClick={() => openModal('tambah-user')}>
                    <i className="fas fa-plus" /> Tambah User
                  </button>
                </div>
                <div className="filter-section">
                  <div className="filter-item">
                    <label>Role</label>
                    <select defaultValue="">
                      <option value="">Semua Role</option>
                      <option>Owner</option>
                      <option>Admin</option>
                      <option>Gudang</option>
                    </select>
                  </div>
                  <div className="filter-item">
                    <label>Status</label>
                    <select defaultValue="">
                      <option value="">Semua Status</option>
                      <option>Aktif</option>
                      <option>Nonaktif</option>
                    </select>
                  </div>
                  <div className="filter-item">
                    <label>&nbsp;</label>
                    <button type="button" className="btn-secondary" style={{ width: '100%' }}>
                      Filter
                    </button>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Nama</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(staffUsers || []).length === 0 ? (
                          <tr>
                            <td colSpan={6} style={{ textAlign: 'center', color: '#6b7280', padding: 24 }}>
                              Belum ada staff
                            </td>
                          </tr>
                        ) : (
                          staffUsers.map((u) => (
                            <tr key={u.id}>
                              <td>#{String(u.id).padStart(3, '0')}</td>
                              <td>{u.name}</td>
                              <td>{u.email}</td>
                              <td>{roleBadge(u.role)}</td>
                              <td>
                                <span className={String(u.status || '').toLowerCase() === 'aktif' ? 'status-active' : 'status-inactive'}>
                                  {u.status || 'aktif'}
                                </span>
                              </td>
                              <td>
                                <button type="button" className="btn-secondary" style={{ padding: '4px 8px' }} onClick={() => editItem('user', u.id)}>
                                  <i className="fas fa-edit" />
                                </button>
                                <button type="button" className="btn-danger" style={{ padding: '4px 8px' }} onClick={() => deleteItem('user', u.id)}>
                                  <i className
