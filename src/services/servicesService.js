import api from './api';

export const getAllServices = () => api.get('/services');
export const getServiceBySlug = (slug) => api.get(`/services/${slug}`);
