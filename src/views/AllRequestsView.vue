<template>
  <div class="requests-view container">
    <h1>Заявки на аренду</h1>
    
    <div class="filters">
      <div class="filter-group">
        <label>Статус:</label>
        <select v-model="filters.status" @change="fetchRequests">
          <option value="">Все</option>
          <option value="PENDING">На рассмотрении</option>
          <option value="APPROVED">Одобрены</option>
          <option value="REJECTED">Отклонены</option>
          <option value="COMPLETED">Завершены</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>Дата:</label>
        <input 
          type="date" 
          v-model="filters.date" 
          @change="fetchRequests"
        >
      </div>
      
      <div class="filter-group">
        <label>Техника:</label>
        <input 
          type="text" 
          v-model="filters.machinery" 
          placeholder="Поиск по технике..."
          @input="fetchRequests"
        >
      </div>
    </div>
    
    <div class="actions">
      <button class="action-button" @click="createRequest">
        <i class="fas fa-plus"></i> Создать заявку
      </button>
    </div>
    
    <div class="requests-table">
      <table>
        <thead>
          <tr>
            <th>№</th>
            <th>Клиент</th>
            <th>Техника</th>
            <th>Дата подачи</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="request in requests" :key="request.id">
            <td>{{ request.id }}</td>
            <td>{{ request.organization_name }}</td>
            <td>{{ request.machinery_name }}</td>
            <td>{{ formatDate(request.filing_date) }}</td>
            <td>
              <span :class="['status-badge', request.status.toLowerCase()]">
                {{ requestStatusText(request.status) }}
              </span>
            </td>
            <td>
              <div class="table-actions">
                <button 
                  class="action-button small view"
                  @click="viewRequest(request.id)"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button 
                  v-if="request.status === 'PENDING'"
                  class="action-button small edit"
                  @click="editRequest(request.id)"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button 
                  v-if="request.status === 'REJECTED'"
                  class="action-button small delete danger"
                  @click="deleteRequest(request.id)"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios'; // импорт axios

export default {
  name: 'AllRequestsView',

  data() {
    return {
      requests: [],
      filters: {
        status: '',
        date: '',
        machinery: ''
      }
    };
  },

  methods: {
    async fetchRequests() {
      try {
        const params = {
          status: this.filters.status,
          machinery: this.filters.machinery,
          date: this.filters.date
        };

        // удалим пустые значения
        Object.keys(params).forEach(key => {
          if (!params[key]) delete params[key];
        });

        const response = await axios.get('/api/requests', { params });

        this.requests = response.data;
      } catch (error) {
        console.error('Ошибка при загрузке заявок:', error);
        alert('Не удалось загрузить список заявок. Пожалуйста, попробуйте позже.');
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('ru-RU');
    },

    requestStatusText(status) {
      const statusMap = {
        'PENDING': 'На рассмотрении',
        'APPROVED': 'Одобрена',
        'REJECTED': 'Отклонена',
        'COMPLETED': 'Завершена'
      };
      return statusMap[status] || status;
    },

    createRequest() {
      this.$router.push('/admin/requests/create');
    },

    viewRequest(id) {
      this.$router.push(`/admin/requests/${id}`);
    },

    editRequest(id) {
      this.$router.push(`/admin/requests/${id}/edit`);
    },

    async deleteRequest(id) {
      if (confirm('Вы уверены, что хотите удалить эту заявку?')) {
        try {
          await axios.delete(`/api/requests/${id}`);
          await this.fetchRequests();
          alert('Заявка успешно удалена.');
        } catch (error) {
          console.error('Ошибка при удалении заявки:', error);
          alert('Не удалось удалить заявку. Пожалуйста, попробуйте позже.');
        }
      }
    }
  },

  created() {
    this.fetchRequests();
  }
};
</script>

<style scoped>
.requests-view {
  padding: 2rem;
  color: #35170c;
}

h1 {
  color: #35170c;
  margin-bottom: 2rem;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: bold;
  color: #35170c;
}

.filter-group select,
.filter-group input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  color: #35170c;
}

.actions {
  margin-bottom: 2rem;
}

.action-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #f46430;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-button:hover {
  background-color: #d95a29;
}

.action-button.small {
  padding: 0.25rem 0.5rem;
}

.action-button.view,
.action-button.edit {
  background-color: #5a6268;
}
.action-button.view:hover,
.action-button.edit:hover {
  background-color: #4a4f54;
}

.action-button.delete {
  background-color: #dc3545;
}
.action-button.delete:hover {
  background-color: #c82333;
}

.requests-table {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid #eee;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
  color: #35170c;
}

th {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #35170c;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.status-badge.pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-badge.approved {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.rejected {
  background-color: #f8d7da;
  color: #721c24;
}

.status-badge.completed {
  background-color: #e2e3e5;
  color: #383d41;
}

.table-actions {
  display: flex;
  gap: 0.5rem;
}

.action-button i {
  color: white;
}
</style>