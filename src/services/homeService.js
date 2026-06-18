import api from './api';

export const getStats = () => api.get('/home/stats');
export const getStatsByContext = (context) => api.get('/stats', { params: { context } });
export const getClients = () => api.get('/home/clients');
export const getTestimonials = () => api.get('/home/testimonials');
export const getAwards = () => api.get('/home/awards');
export const getServices = () => api.get('/services');
export const getIndustries = () => api.get('/industries');
