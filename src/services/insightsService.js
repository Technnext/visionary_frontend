import api from './api';

export const getAllInsights   = (category) =>
  api.get('/insights', { params: category ? { category } : {} });

export const getFeaturedInsights = () => api.get('/insights/featured');
export const getInsightBySlug    = (slug) => api.get(`/insights/${slug}`);
export const getInsightCategories = () => api.get('/insights/categories');
