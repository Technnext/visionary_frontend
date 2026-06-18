import api from './api';

export const getMortgageServices = () => api.get('/mortgage-services');
export const getMortgageServiceBySlug = (slug) => api.get(`/mortgage-services/${slug}`);
