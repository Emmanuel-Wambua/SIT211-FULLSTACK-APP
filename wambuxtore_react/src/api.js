const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

export const API = {
  products: `${BASE_URL}/api/products/`,
  productsByCategory: (cat) => `${BASE_URL}/api/products/?category=${cat}`,
  productById: (id) => `${BASE_URL}/api/products/${id}/`,
  uploadImage: `${BASE_URL}/api/products/upload-image/`,
  contact: `${BASE_URL}/api/contact/`,
  orders: `${BASE_URL}/api/orders/`,
  register: `${BASE_URL}/api/auth/register/`,
  login: `${BASE_URL}/api/auth/login/`,
  refresh: `${BASE_URL}/api/auth/refresh/`,
  wishlist: (username) => `${BASE_URL}/api/wishlist/${username}/`,
};