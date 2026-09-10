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
  const [uploadError, setUploadError] = useState('');
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
    setUploadError('');
    setFormData({
      name: '',
      description: '',
      price: '',
      quantity: '10',
      category: categories[0]?._id || '',
      status: 'active',
      image: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setUploadError('');
    setFormData({
      name: product.name,
      description: product.description,
      price: String(product.price),
      quantity: String(product.quantity),
      category: product.category?._id || product.category || '',
      status: product.status || 'active',
      image: product.images?.[0] || '',
    });
    setModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setUploadError('');

    // Supported formats: jpg, jpeg, png, webp, avif
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/avif',
    ];

    const fileName = file.name.toLowerCase();
    const hasValidExt = allowedExtensions.some((ext) => fileName.endsWith(ext));
    const hasValidMime = allowedMimeTypes.includes(file.type);

    if (!hasValidExt && !hasValidMime) {
      setUploadError('Invalid format. Please upload JPG, JPEG, PNG, WEBP, or AVIF.');
      return;
    }

    // Limit to 5MB
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setUploadError('Image size exceeds 5MB limit. Please choose a smaller file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setFormData((prev) => ({
        ...prev,
        image: uploadEvent.target.result,
      }));
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file from your PC.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: '' }));
    setUploadError('');
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
        const catObj = categories.find((c) => c._id === (res.product?.category?._id || res.product?.category));
        const updated = {
          ...res.product,
          category: catObj || res.product?.category,
        };
        setProducts((prev) =>
          prev.map((p) => (p._id === editingProduct._id ? updated : p))
        );
      } else {
        const res = await api.products.create(payload);
        if (res.newProduct) {
          const catObj = categories.find((c) => c._id === (res.newProduct?.category?._id || res.newProduct?.category));
          const created = {
            ...res.newProduct,
            category: catObj || res.newProduct?.category,
          };
          setProducts((prev) => [created, ...prev]);
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
                <label>Product Image (Upload from PC or enter URL)</label>

                {formData.image ? (
                  <div className="admin-layout__upload-preview">
                    <img src={formData.image} alt="Product Preview" />
                    <button
                      type="button"
                      className="admin-layout__upload-preview-remove"
                      onClick={handleRemoveImage}
                      title="Remove Image"
                      aria-label="Remove Image"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <label className="admin-layout__upload-dropzone">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.avif,image/jpeg,image/png,image/webp,image/avif"
                      onChange={handleFileChange}
                    />
                    <p>📁 Click to upload image from PC</p>
                    <span>Supports JPG, JPEG, PNG, WEBP, AVIF (Max 5MB)</span>
                  </label>
                )}

                {uploadError && (
                  <p style={{ color: '#b91c1c', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    {uploadError}
                  </p>
                )}

                <div style={{ marginTop: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {formData.image && formData.image.startsWith('data:image')
                      ? 'Image loaded from your PC (Base64). Click ✕ to change or remove.'
                      : 'Or enter image URL path directly:'}
                  </label>
                  {(!formData.image || !formData.image.startsWith('data:image')) && (
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="e.g. /assets/images/tshirt1.png"
                      style={{ marginTop: '0.25rem', fontSize: '0.8125rem' }}
                    />
                  )}
                </div>
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

