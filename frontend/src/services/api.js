const API_BASE_URL = 'http://localhost:5000/api';

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: token }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || 'Network request failed');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    throw err;
  }
};

export const api = {
  auth: {
    signup: (userData) => request('/auth/signup', { method: 'POST', body: JSON.stringify(userData) }),
    login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  },
  users: {
    getProfile: () => request('/users/profile'),
    updateProfile: (profileData) => request('/users/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
  },
  products: {
    getProducts: (params = {}) => {
      const query = new URLSearchParams();
      if (params.search) query.append('search', params.search);
      if (params.category) query.append('category', params.category);
      if (params.minimumPrice) query.append('minimumPrice', params.minimumPrice);
      if (params.maximumPrice) query.append('maximumPrice', params.maximumPrice);
      if (params.availability && params.availability !== 'all') query.append('availability', params.availability);
      if (params.sort) query.append('sort', params.sort);
      if (params.page) query.append('page', params.page);
      if (params.limit) query.append('limit', params.limit);

      const qs = query.toString();
      return request(`/products${qs ? `?${qs}` : ''}`);
    },
    getProductById: (id) => request(`/products/${id}`),
    create: (productData) => request('/products', { method: 'POST', body: JSON.stringify(productData) }),
    update: (id, productData) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(productData) }),
    delete: (id) => request(`/products/${id}`, { method: 'DELETE' }),
  },
  categories: {
    getAll: async () => {
      try {
        return await request('/categories');
      } catch (err) {
        if (err.status === 404) return { categories: [] };
        throw err;
      }
    },
    getById: (id) => request(`/categories/${id}`),
    create: (categoryData) => request('/categories', { method: 'POST', body: JSON.stringify(categoryData) }),
    update: (id, categoryData) => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(categoryData) }),
    delete: (id) => request(`/categories/${id}`, { method: 'DELETE' }),
  },
  orders: {
    checkout: (orderData) => request('/orders/checkout', { method: 'POST', body: JSON.stringify(orderData) }),
    getMyOrders: async () => {
      try {
        return await request('/orders/my-orders');
      } catch (err) {
        if (err.status === 404) return { orders: [] };
        throw err;
      }
    },
    getOrderById: (id) => request(`/orders/${id}`),
    getAllOrders: async () => {
      try {
        return await request('/orders');
      } catch (err) {
        if (err.status === 404) return { orders: [] };
        throw err;
      }
    },
    updateStatus: (id, orderStatus) =>
      request(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ orderStatus }) }),
  },
  admin: {
    getDashboard: () => request('/admin/dashboard'),
  },
};

