import { authApi } from '@/api/auth';

export default {
  namespaced: true,
  state: {
    user: null
  },
  getters: {
    isAuthenticated(state) {
      return !!state.user;
    },
    isAdmin(state) {
      return state.user?.role === 'ADMIN';
    },
    isManager(state) {
      return state.user?.role === 'MANAGER';
    },
    isClient(state) {
      return state.user?.role === 'USER';
    },
    userRole(state) {
      return state.user?.role || null;
    },
    currentUser(state) {
      return state.user;
    }
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem('token');
    }
  },
  actions: {
    async login({ commit }, { email, password }) {
      try {
        await authApi.login(email, password);
        const user = await authApi.getCurrentUser();
        commit('setUser', user);
      } catch (error) {
        throw new Error(error.message || 'Login failed');
      }
    },
    async register({ commit }, userData) {
      try {
        await authApi.register(userData);
        const user = await authApi.getCurrentUser();
        commit('setUser', user);
      } catch (error) {
        throw new Error(error.message || 'Registration failed');
      }
    },
    async initAuth({ commit }) {
      try {
        const user = await authApi.getCurrentUser();
        commit('setUser', user);
      } catch (error) {
        commit('logout');
      }
    },
    async logout({ commit }) {
      commit('logout');
    }
  }
};