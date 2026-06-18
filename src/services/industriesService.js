import api from './api';

export const getAllIndustries = () => api.get('/industries');
export const getIndustryBySlug = (slug) => api.get(`/industries/${slug}`);
