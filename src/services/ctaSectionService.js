import api from './api';

export const getCtaSection = (pageKey) =>
  api.get('/cta-sections', { params: { pageKey } });
