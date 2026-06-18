import api from './api';

export const submitContactForm  = (data)  => api.post('/contact', data);
export const getOfficeLocations = ()      => api.get('/contact/offices');
