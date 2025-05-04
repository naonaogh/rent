import api from '@/api/axios';

const getRecentRequests = async () => {
  try {
    const response = await api.get('/rental_application/recent');
    return response.data;
  } catch (error) {
    console.error('Error fetching recent requests:', error);
    throw error;
  }
};

const getActiveContracts = async () => {
  try {
    const response = await api.get('/contract/active');
    return response.data;
  } catch (error) {
    console.error('Error fetching active contracts:', error);
    throw error;
  }
};

const getStats = async () => {
  try {
    const response = await api.get('/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

export default {
  getRecentRequests,
  getActiveContracts,
  getStats
};