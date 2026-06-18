import api from './api';

export const subscribe = (email) =>
  api.post('/newsletter/subscribe', { email });
