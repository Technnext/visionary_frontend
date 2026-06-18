import api from './api';

export const getNavLinks = (section) =>
  api.get('/navigation-links', { params: { section } });
