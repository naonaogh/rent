<template>
  <div class="contracts-view container">
    <h1>Договоры аренды</h1>

    <div class="filters">
      <div class="filter-group">
        <label>Статус:</label>
        <select v-model="filters.status" @change="fetchContracts">
          <option value="">Все</option>
          <option value="ACTIVE">Активные</option>
          <option value="COMPLETED">Завершенные</option>
          <option value="TERMINATED">Расторгнутые</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Дата:</label>
        <input type="date" v-model="filters.date" @change="fetchContracts" />
      </div>

      <div class="filter-group">
        <label>Техника:</label>
        <input
          type="text"
          v-model="filters.machinery"
          placeholder="Поиск по технике..."
          @input="debounceFetchContracts"
        />
      </div>
    </div>

    <div class="actions">
      <button class="action-button" @click="createContract">
        <i class="fas fa-plus"></i> Создать договор
      </button>
      <button class="action-button" @click="generateReport">
        <i class="fas fa-file-export"></i> Сформировать отчет
      </button>
    </div>

    <div class="contracts-table">
      <table>
        <thead>
          <tr>
            <th>№</th>
            <th>Клиент</th>
            <th>Техника</th>
            <th>Дата начала</th>
            <th>Дата окончания</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="contract in contracts" :key="contract.id">
            <td>{{ contract.contract_number }}</td>
            <td>{{ contract.organization_name }}</td>
            <td>{{ contract.machinery_name }}</td>
            <td>{{ formatDate(contract.start_date) }}</td>
            <td>{{ formatDate(contract.end_date) }}</td>
            <td>
              <span :class="['status-badge', contract.status.toLowerCase()]">
                {{ contractStatusText(contract.status) }}
              </span>
            </td>
            <td>
              <div class="table-actions">
                <button class="action-button small view" @click="viewContract(contract.id)">
                  <i class="fas fa-eye"></i>
                </button>
                <button
                  v-if="contract.status === 'ACTIVE'"
                  class="action-button small edit"
                  @click="editContract(contract.id)"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  v-if="contract.status === 'ACTIVE'"
                  class="action-button small terminate danger"
                  @click="terminateContract(contract.id)"
                >
                  <i class="fas fa-times"></i>
                </button>
                <button
                  class="action-button small delete danger"
                  @click="deleteContract(contract.id)"
                >
                  <i class="fas fa-trash-alt"></i>
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
  name: 'AllContractsView',

  data() {
    return {
      contracts: [],
      filters: {
        status: '',
        date: '',
        machinery: ''
      },
      loading: false,
    };
  },

  methods: {
    async fetchContracts() {
      this.loading = true;
      try {
        const params = new URLSearchParams({
          status: this.filters.status,
          date: this.filters.date,
          machinery: this.filters.machinery
        });

        const response = await fetch(`/api/contracts?${params}`);
        if (!response.ok) throw new Error('Ошибка загрузки');
        this.contracts = await response.json();
      } catch (error) {
        console.error('Ошибка при получении договоров:', error);
      } finally {
        this.loading = false;
      }
    },

    debounceFetchContracts: debounce(function() {
      this.fetchContracts();
    }, 300),

    formatDate(date) {
      return new Date(date).toLocaleDateString('ru-RU');
    },

    contractStatusText(status) {
      const map = {
        ACTIVE: 'Активен',
        COMPLETED: 'Завершен',
        TERMINATED: 'Расторгнут'
      };
      return map[status] || status;
    },

    createContract() {
      this.$router.push('/admin/contracts/create');
    },

    viewContract(id) {
      this.$router.push(`/admin/contracts/${id}`);
    },

    editContract(id) {
      this.$router.push(`/admin/contracts/${id}/edit`);
    },

    async terminateContract(id) {
      if (confirm('Вы уверены, что хотите расторгнуть этот договор?')) {
        try {
          const response = await fetch(`/api/contracts/${id}/terminate`, {
            method: 'POST'
          });
          if (!response.ok) throw new Error('Не удалось расторгнуть договор');
          await this.fetchContracts();
        } catch (error) {
          console.error('Ошибка при расторжении договора:', error);
        }
      }
    },

    async deleteContract(id) {
      if (confirm('Вы уверены, что хотите удалить этот договор? Это действие необратимо.')) {
        try {
          const response = await fetch(`/api/contracts/${id}`, {
            method: 'DELETE'
          });
          if (!response.ok) {
            let errorBody = 'Не удалось удалить договор';
            try {
              const errorData = await response.json();
              errorBody = errorData.message || errorBody;
            } catch (e) { /* Игнорируем ошибку парсинга JSON */ }
            throw new Error(errorBody);
          }
          this.contracts = this.contracts.filter(c => c.id !== id);
          alert('Договор успешно удален.');
        } catch (error) {
          console.error('Ошибка при удалении договора:', error);
          alert(`Ошибка: ${error.message}`);
        }
      }
    },

    async generateReport() {
      try {
        const response = await fetch('/api/contracts/report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.filters)
        });
        if (!response.ok) throw new Error('Ошибка при генерации отчета');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'report.pdf'; // или .xlsx
        a.click();
      } catch (error) {
        console.error('Ошибка генерации отчета:', error);
      }
    }
  },

  created() {
    this.fetchContracts();
  }
};

function debounce(func, wait) {
  let timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  };
}
</script>

<style scoped>
.contracts-view {
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
  display: flex;
  gap: 1rem;
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

.action-button.terminate,
.action-button.delete {
  background-color: #dc3545;
}
.action-button.terminate:hover,
.action-button.delete:hover {
  background-color: #c82333;
}

.contracts-table {
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
  font-weight: bold;
  color: white;
}

.status-badge.active {
  background-color: #f46430;
}

.status-badge.completed {
  background-color: #ccc;
  color: #35170c;
}

.status-badge.terminated {
  background-color: #ffb3a7;
  color: #35170c;
}
</style>
