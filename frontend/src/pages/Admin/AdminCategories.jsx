import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Spinner from '../../components/common/Spinner/Spinner';

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [nameInput, setNameInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await api.categories.getAll();
      setCategories(res.categories || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setNameInput('');
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setNameInput(cat.name);
    setFormError('');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.categories.delete(id);
        setCategories((prev) => prev.filter((c) => c._id !== id));
      } catch (err) {
        alert(err.message || 'Failed to delete category');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!nameInput.trim()) {
      setFormError('Please fill in all fields.');
      return;
    }

    setSaving(true);
    try {
      if (editingCategory) {
        const res = await api.categories.update(editingCategory._id, { name: nameInput.trim() });
        setCategories((prev) =>
          prev.map((c) => (c._id === editingCategory._id ? res.updatedCategory : c))
        );
      } else {
        const res = await api.categories.create({ name: nameInput.trim() });
        if (res.createdCategory) {
          setCategories((prev) => [...prev, res.createdCategory]);
        }
      }
      setModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner message="Loading categories..." />;

  return (
    <div>
      <div className="admin-layout__top-actions">
        <h2>Categories Management ({categories.length})</h2>
        <button onClick={openAddModal}>+ Add New Category</button>
      </div>

      {error && <p className="admin-layout__error">{error}</p>}

      <div className="admin-layout__table-wrapper">
        <table className="admin-layout__table">
          <thead>
            <tr>
              <th>Category ID</th>
              <th>Category Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id}>
              <td className="admin-layout__table-id">{cat._id}</td>
              <td>
                <strong>{cat.name}</strong>
              </td>
              <td>
                <button
                  className="admin-layout__action-btn admin-layout__action-btn--edit"
                  onClick={() => openEditModal(cat)}
                >
                  Edit
                </button>
                <button
                  className="admin-layout__action-btn admin-layout__action-btn--delete"
                  onClick={() => handleDelete(cat._id)}
                >
                  Delete
                </button>
          </td>
        </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="admin-layout__modal-backdrop">
          <div className="admin-layout__modal">
            <h3>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
            <form onSubmit={handleSubmit} noValidate>
              <div className="admin-layout__form-field">
                <label>Category Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Shoes, Hoodies, Accessories"
                  value={nameInput}
                  onChange={(e) => {
                    setNameInput(e.target.value);
                    if (formError) setFormError('');
                  }}
                  onBlur={() => {
                    if (!nameInput.trim()) setFormError('Please fill this field');
                  }}
                  className={formError ? 'admin-layout__input--error' : ''}
                />
                {formError && (
                  <p className="admin-layout__field-error">
                    {formError}
                  </p>
                )}
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
                  {saving ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCategories;

