import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Spinner from '../../components/common/Spinner/Spinner';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    status: 'active',
    image: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        api.products.getProducts({ limit: 100 }),
        api.categories.getAll(),
      ]);
      setProducts(prodRes.products || []);
      setCategories(catRes.categories || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch product data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      quantity: '10',
      category: categories[0]?._id || '',
      status: 'active',
      image: '/assets/images/tshirt1.png',
    });
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: String(product.price),
      quantity: String(product.quantity),
      category: product.category?._id || product.category || '',
      status: product.status || 'active',
      image: product.images?.[0] || '/assets/images/tshirt1.png',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.products.delete(id);
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } catch (err) {
        alert(err.message || 'Failed to delete product');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        category: formData.category,
        status: formData.status,
        images: [formData.image.trim() || '/assets/images/tshirt1.png'],
      };

      if (editingProduct) {
        const res = await api.products.update(editingProduct._id, payload);
        setProducts((prev) =>
          prev.map((p) => (p._id === editingProduct._id ? res.product : p))
        );
      } else {
        const res = await api.products.create(payload);
        if (res.newProduct) {
          setProducts((prev) => [res.newProduct, ...prev]);
        }
      }

      setModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner message="Loading products list..." />;

  return (
    <div>
      <div className="admin-layout__top-actions">
        <h2>Products Management ({products.length})</h2>
        <button onClick={openAddModal}>+ Add New Product</button>
      </div>

      {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

      <div className="admin-layout__table-wrapper">
        <table className="admin-layout__table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock Qty</th>
              <th>Inventory Status</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => {
              const isOut = prod.quantity === 0;
              const isLow = prod.quantity > 0 && prod.quantity <= 10;
              const img = prod.images?.[0] || '/assets/images/tshirt1.png';

              return (
                <tr key={prod._id}>
                  <td>
                    <img
                      src={img}
                      alt={prod.name}
                      style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain', borderRadius: '0.25rem', backgroundColor: '#f0eeed' }}
                    />
                  </td>
                  <td>
                    <strong>{prod.name}</strong>
                  </td>
                  <td>{prod.category?.name || 'Unassigned'}</td>
                  <td>${prod.price}</td>
                  <td>
                    <strong>{prod.quantity}</strong>
                  </td>
                  <td>
                    {isOut ? (
                      <span style={{ color: '#b91c1c', fontWeight: 700, backgroundColor: '#fee2e2', padding: '0.2rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem' }}>
                        OUT OF STOCK
                      </span>
                    ) : isLow ? (
                      <span style={{ color: '#b45309', fontWeight: 700, backgroundColor: '#fef3c7', padding: '0.2rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem' }}>
                        LOW STOCK (≤ 10)
                      </span>
                    ) : (
                      <span style={{ color: '#047857', fontWeight: 600, fontSize: '0.75rem' }}>
                        In Stock
                      </span>
                    )}
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>{prod.status}</td>
                  <td>
                    <button
                      className="admin-layout__action-btn admin-layout__action-btn--edit"
                      onClick={() => openEditModal(prod)}
                    >
                      Edit
                    </button>
                    <button
                      className="admin-layout__action-btn admin-layout__action-btn--delete"
                      onClick={() => handleDelete(prod._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal for Add / Edit */}
      {modalOpen && (
        <div className="admin-layout__modal-backdrop">
          <div className="admin-layout__modal">
            <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="admin-layout__form-field">
                <label>Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="admin-layout__form-field">
                <label>Description *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="admin-layout__form-field">
                  <label>Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>

                <div className="admin-layout__form-field">
                  <label>Stock Quantity *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="admin-layout__form-field">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-layout__form-field">
                  <label>Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="admin-layout__form-field">
                <label>Image URL Path</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/assets/images/tshirt1.png"
                />
              </div>

              <div className="admin-layout__modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={saving}>
                  {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;

