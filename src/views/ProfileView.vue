<template>
  <div class="profile-view container">
    <div class="profile-header">
      <h1>Личный кабинет</h1>
      <div class="user-info">
        <div class="user-avatar">
          <i class="fas fa-user-circle"></i>
        </div>
        <div class="user-details">
          <h2>{{ currentUser.organization_name }}</h2>
          <p class="user-role">{{ userRole }}</p>
        </div>
      </div>
    </div>

    <div class="profile-content">
      <div class="profile-section">
        <h3>Контактная информация</h3>
        <div class="info-grid">
          <div class="info-item">
            <i class="fas fa-envelope"></i>
            <span>{{ currentUser.email }}</span>
          </div>
          <div class="info-item">
            <i class="fas fa-phone"></i>
            <span>{{ currentUser.phone_number }}</span>
          </div>
          <div class="info-item" v-if="currentUser.info">
            <i class="fas fa-info-circle"></i>
            <span>{{ currentUser.info }}</span>
          </div>
        </div>
      </div>

      <!-- Для клиентов -->
      <template v-if="isUser">
        <div class="profile-section">
          <h3>Последние заявки</h3>
          <div v-if="loading" class="loading">
            <i class="fas fa-spinner fa-spin"></i> Загрузка...
          </div>
          <div v-else-if="recentRequests.length === 0" class="empty-state">
            У вас пока нет заявок
          </div>
          <div v-else class="requests-list">
            <div v-for="request in recentRequests" :key="request.id" class="request-item">
              <div class="request-header">
                <span class="request-number">Заявка #{{ request.id }}</span>
                <span :class="['request-status', request.status.toLowerCase()]">
                  {{ requestStatusText(request.status) }}
                </span>
              </div>
              <div class="request-details">
                <p><strong>Техника:</strong> {{ request.machinery_name }}</p>
                <p><strong>Дата:</strong> {{ formatDate(request.filing_date) }}</p>
              </div>
              <button class="view-button" @click="viewRequest(request.id)">
                Просмотреть
              </button>
            </div>
          </div>
        </div>

        <div class="profile-section">
          <h3>Активные договоры</h3>
          <div v-if="loading" class="loading">
            <i class="fas fa-spinner fa-spin"></i> Загрузка...
          </div>
          <div v-else-if="activeContracts.length === 0" class="empty-state">
            У вас пока нет активных договоров
          </div>
          <div v-else class="contracts-list">
            <div v-for="contract in activeContracts" :key="contract.id" class="contract-item">
              <div class="contract-header">
                <span class="contract-number">Договор #{{ contract.contract_number }}</span>
                <span :class="['contract-status', contract.status.toLowerCase()]">
                  {{ contractStatusText(contract.status) }}
                </span>
              </div>
              <div class="contract-details">
                <p><strong>Техника:</strong> {{ contract.machinery_name }}</p>
                <p><strong>Срок:</strong> {{ formatDate(contract.start_date) }} - {{ formatDate(contract.end_date) }}</p>
              </div>
              <button class="view-button" @click="viewContract(contract.id)">
                Просмотреть
              </button>
            </div>
          </div>
        </div>
      </template>

      <!-- Для менеджеров и админов -->
      <template v-if="isManager || isAdmin">
        <div class="profile-section">
          <h3>Статистика</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <i class="fas fa-file-alt"></i>
              <div class="stat-info">
                <span class="stat-value">{{ stats.totalRequests }}</span>
                <span class="stat-label">Всего заявок</span>
              </div>
            </div>
            <div class="stat-item">
              <i class="fas fa-file-signature"></i>
              <div class="stat-info">
                <span class="stat-value">{{ stats.activeContracts }}</span>
                <span class="stat-label">Активных договоров</span>
              </div>
            </div>
            <div class="stat-item">
              <i class="fas fa-users"></i>
              <div class="stat-info">
                <span class="stat-value">{{ stats.totalClients }}</span>
                <span class="stat-label">Клиентов</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import profileService from '@/services/profileService';  // Make sure this is the correct path for your service

export default {
  name: 'ProfileView',
  
  data() {
    return {
      loading: false,
      recentRequests: [],
      activeContracts: [],
      stats: {
        totalRequests: 0,
        activeContracts: 0,
        totalClients: 0
      }
    };
  },
  
  computed: {
    ...mapGetters('auth', [
      'currentUser',
      'isAdmin',
      'isManager',
      'isUser'
    ]),
    
    userRole() {
      if (this.isAdmin) return 'Администратор';
      if (this.isManager) return 'Менеджер';
      return 'Клиент';
    }
  },
  
  methods: {
    requestStatusText(status) {
      const statusMap = {
        'PENDING': 'На рассмотрении',
        'APPROVED': 'Одобрена',
        'REJECTED': 'Отклонена',
        'COMPLETED': 'Завершена'
      };
      return statusMap[status] || status;
    },
    
    contractStatusText(status) {
      const statusMap = {
        'ACTIVE': 'Активен',
        'COMPLETED': 'Завершен',
        'TERMINATED': 'Расторгнут'
      };
      return statusMap[status] || status;
    },
    
    formatDate(date) {
      return new Date(date).toLocaleDateString('ru-RU');
    },
    
    async viewRequest(id) {
      this.$router.push(`/myrequests/${id}`);
    },
    
    async viewContract(id) {
      this.$router.push(`/mycontracts/${id}`);
    },
    
    async fetchUserData() {
      this.loading = true;
      try {
        if (this.isUser) {
          const [requests, contracts] = await Promise.all([
            profileService.getRecentRequests(),
            profileService.getActiveContracts()
          ]);
          this.recentRequests = requests;
          this.activeContracts = contracts;
        }
        
        if (this.isManager || this.isAdmin) {
          const stats = await profileService.getStats();
          this.stats = stats;
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        this.loading = false;
      }
    }
  },
  
  created() {
    this.fetchUserData();
  }
};
</script>
