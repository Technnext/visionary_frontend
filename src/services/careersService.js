import api from './api';

export const getAllJobs        = (params = {}) => api.get('/jobs', { params });
export const getJobsByDept     = (department) => api.get('/jobs', { params: { department } });
export const getJobsByLocation = (location)   => api.get('/jobs', { params: { location } });
export const getJobById        = (jobId)       => api.get(`/careers/${jobId}`);
export const applyForJob       = (formData)    => api.post('/careers/apply', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
