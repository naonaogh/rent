<template>
  <div class="my-requests-view container">
    <h1>Мои заявки</h1>
    
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
            <th>Техника</th>
            <th>Дата подачи</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="request in requests" :key="request.id">
            <td>{{ request.id }}</td>
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
                  class="action-button small"
                  @click="viewRequest(request.id)"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button 
                  v-if="request.status === 'PENDING'"
                  class="action-button small"
                  @click="editRequest(request.id)"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button 
                  v-if="['PENDING', 'REJECTED'].includes(request.status)"
                  class="action-button small danger"
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
export default {
  name: 'MyRequestsView',
  
  data() {
    return {
      requests: []
    };
  },
  
  methods: {
    async fetchRequests() {
      try {
        const response = await fetch('/api/requests'); // Получаем заявки клиента
        if (!response.ok) {
          throw new Error('Не удалось загрузить заявки');
        }
        this.requests = await response.json();
      } catch (error) {
        console.error('Error fetching requests:', error);
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
      this.$router.push('/rent');
    },
    
    viewRequest(id) {
      this.$router.push(`/myrequests/${id}`);
    },
    
    editRequest(id) {
      this.$router.push(`/myrequests/${id}/edit`);
    },
    
    async deleteRequest(id) {
      if (confirm('Вы уверены, что хотите удалить эту заявку?')) {
        try {
          const response = await fetch(`/api/requests/${id}`, {
            method: 'DELETE'
          });
          if (!response.ok) {
            throw new Error('Не удалось удалить заявку');
          }
          this.fetchRequests(); // Обновляем список заявок
        } catch (error) {
          console.error('Error deleting request:', error);
        }
      }
    }
  },
  
  created() {
    this.fetchRequests(); // Загружаем заявки при создании компонента
  }
};
</script>

<style scoped>
.my-requests-view {
  padding: 20px;
}

h1 {
  text-align: center;
  font-size: 2rem;
  color: #35170c;
}

.actions {
  margin-bottom: 20px;
  text-align: right;
}

.action-button {
  background-color: #f46430;
  color: #fff;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.action-button.small {
  font-size: 0.9rem;
}

.action-button.danger {
  background-color: #dc3545;
}

.requests-table {
  width: 100%;
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
}

.status-badge {
  padding: 5px 10px;
  border-radius: 3px;
  font-size: 0.9rem;
}

.status-badge.pending {
  background-color: #f7c04e;
  color: #fff;
}

.status-badge.approved {
  background-color: #28a745;
  color: #fff;
}

.status-badge.rejected {
  background-color: #dc3545;
  color: #fff;
}

.status-badge.completed {
  background-color: #17a2b8;
  color: #fff;
}

.table-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.table-actions button {
  background-color: #f46430;
  color: #fff;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
}

.table-actions button.small {
  font-size: 0.9rem;
}

.table-actions button.danger {
  background-color: #dc3545;
}
</style>
