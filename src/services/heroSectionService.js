import api from './api';

export const getHeroSection = (pageKey) =>
  api.get('/hero-sections', { params: { pageKey } });
