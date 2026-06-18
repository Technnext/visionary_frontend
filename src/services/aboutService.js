import api from './api';

export const getLeaders = () => api.get('/leaders');
export const getAwards  = () => api.get('/home/awards');
