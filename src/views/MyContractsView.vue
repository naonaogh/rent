<template>
  <div class="container">
    <h1 class="title">Мои договоры</h1>

    <div class="filters">
      <div class="filter-item">
        <div class="date-filter">
          <button class="calendar-btn" @click="showDatePopup = !showDatePopup">
            <i class="fas fa-calendar"></i> Выбрать дату
          </button>

          <div v-if="showDatePopup" class="date-popup">
            <div class="popup-content">
              <div>
                <label for="start-year">Дата с</label>
                <select v-model="filters.startYear" id="start-year" class="date-input">
                  <option value="">Год</option>
                  <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                </select>
                <select v-model="filters.startMonth" id="start-month" class="date-input">
                  <option value="">Месяц</option>
                  <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
                </select>
                <input type="date" v-model="filters.startDate" id="start-date" class="date-input" />
              </div>

              <div>
                <label for="end-year">Дата по</label>
                <select v-model="filters.endYear" id="end-year" class="date-input">
                  <option value="">Год</option>
                  <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                </select>
                <select v-model="filters.endMonth" id="end-month" class="date-input">
                  <option value="">Месяц</option>
                  <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
                </select>
                <input type="date" v-model="filters.endDate" id="end-date" class="date-input" />
              </div>
              <div class="popup-buttons">
                <button class="reset-btn" @click="resetFilters">Сбросить</button>
                <button class="close-btn" @click="showDatePopup = false">Закрыть</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="filter-item">
        <select v-model="filters.status" class="status-filter">
          <option value="">Все статусы</option>
          <option value="действует">Действует</option>
          <option value="завершен">Завершен</option>
          <option value="расторгнут">Расторгнут</option>
        </select>
      </div>

      <div class="filter-item">
        <select v-model="filters.equipment" class="equipment-filter">
          <option value="">Вся техника</option>
          <option value="JCB 3CX">JCB 3CX</option>
          <option value="CAT D6T">CAT D6T</option>
        </select>
      </div>
    </div>

    <table class="contracts-table">
      <thead>
        <tr>
          <th>Номер договора</th>
          <th>Контакты</th>
          <th>Техника</th>
          <th>Инв. номер</th>
          <th>Даты договора</th>
          <th>Часы/день</th>
          <th>Местоположение</th>
          <th>Виды работ</th>
          <th>Статус</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="contract in filteredContracts" :key="contract.id">
          <td>{{ contract.contractNumber }}</td>
          <td>{{ contract.contactInfo }}</td>
          <td>{{ contract.equipmentName }}</td>
          <td>{{ contract.inventoryNumber }}</td>
          <td>{{ contract.startDate }} - {{ contract.endDate }}</td>
          <td>{{ contract.dailyWorkHours }}</td>
          <td>{{ contract.objectLocation }}</td>
          <td>{{ contract.workTypes }}</td>
          <td :class="getStatusClass(contract.status)">{{ contract.status }}</td>
          <td>
            <button @click="openDetailsPopup(contract)" class="details-btn">Подробнее</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Попап для деталей договора -->
    <div v-if="showDetailsPopup" class="popup-overlay">
      <div class="popup-card">
        <h2>Детали договора</h2>
        <div class="details-content">
          <p><strong>Номер договора:</strong> {{ selectedContract.contractNumber }}</p>
          <p><strong>Организация:</strong> {{ selectedContract.organizationName }}</p>
          <p><strong>Контакты:</strong> {{ selectedContract.contactInfo }}</p>
          <p><strong>Техника:</strong> {{ selectedContract.equipmentName }}</p>
          <p><strong>Инв. номер:</strong> {{ selectedContract.inventoryNumber }}</p>
          <p><strong>Даты договора:</strong> {{ selectedContract.startDate }} - {{ selectedContract.endDate }}</p>
          <p><strong>Часы/день:</strong> {{ selectedContract.dailyWorkHours }}</p>
          <p><strong>Местоположение:</strong> {{ selectedContract.objectLocation }}</p>
          <p><strong>Виды работ:</strong> {{ selectedContract.workTypes }}</p>
          <p><strong>Статус:</strong> <span :class="getStatusClass(selectedContract.status)">{{ selectedContract.status }}</span></p>
        </div>
        <div class="popup-buttons">
          <button @click="closeDetailsPopup" class="close-btn">Закрыть</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyContractsPage',
  data() {
    return {
      contracts: [],
      currentUserId: 1,
      organizationName: 'ООО Рога и Копыта', // Организация текущего пользователя
      showDatePopup: false,
      showDetailsPopup: false,
      selectedContract: null,
      filters: {
        startDate: '',
        endDate: '',
        startYear: '',
        startMonth: '',
        endYear: '',
        endMonth: '',
        status: '',
        equipment: ''
      },
      years: [2021, 2022, 2023, 2024, 2025],
      months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    };
  },
  computed: {
    filteredContracts() {
      return this.contracts.filter(contract => {
        if (contract.userId !== this.currentUserId) {
          return false;
        }

        const contractStartDate = new Date(contract.startDate);
        const contractYear = contractStartDate.getFullYear();
        const contractMonth = contractStartDate.getMonth();

        if (this.filters.status && contract.status !== this.filters.status) {
          return false;
        }

        if (this.filters.equipment && contract.equipmentName !== this.filters.equipment) {
          return false;
        }

        if (this.filters.startYear && contractYear < this.filters.startYear) {
          return false;
        }
        if (this.filters.startMonth) {
          const startMonthIndex = this.months.indexOf(this.filters.startMonth);
          if (contractMonth < startMonthIndex) {
            if (!this.filters.startYear || contractYear === parseInt(this.filters.startYear)) {
              return false;
            }
          }
        }
        if (this.filters.startDate && contractStartDate < new Date(this.filters.startDate)) {
          return false;
        }

        if (this.filters.endYear && contractYear > this.filters.endYear) {
          return false;
        }
        if (this.filters.endMonth) {
          const endMonthIndex = this.months.indexOf(this.filters.endMonth);
          if (contractMonth > endMonthIndex) {
            if (!this.filters.endYear || contractYear === parseInt(this.filters.endYear)) {
              return false;
            }
          }
        }
        if (this.filters.endDate && contractStartDate > new Date(this.filters.endDate)) {
          return false;
        }

        return true;
      });
    },
  },
  mounted() {
    setTimeout(() => {
      this.contracts = [
        {
          id: 1,
          userId: 1,
          organizationName: 'ООО Рога и Копыта',
          contractNumber: 'ДГ-001/2025',
          contactInfo: 'ИНН: 1234567890, тел: +79991234567, email: ivan@example.com',
          equipmentName: 'JCB 3CX',
          inventoryNumber: 'JCB-001',
          startDate: '2025-05-01',
          endDate: '2025-05-03',
          dailyWorkHours: 8,
          objectLocation: 'г. Москва, ул. Примерная, д. 1',
          workTypes: 'Земляные работы, планировка территории',
          status: 'действует',
        },
        {
          id: 2,
          userId: 1,
          organizationName: 'ООО Рога и Копыта',
          contractNumber: 'ДГ-002/2025',
          contactInfo: 'ИНН: 1234567890, тел: +79997654321, email: petr@example.com',
          equipmentName: 'CAT D6T',
          inventoryNumber: 'CAT-01',
          startDate: '2025-05-05',
          endDate: '2025-05-07',
          dailyWorkHours: 10,
          objectLocation: 'г. Санкт-Петербург, ул. Тестовая, д. 2',
          workTypes: 'Дорожные работы, выравнивание грунта',
          status: 'завершен',
        },
        {
          id: 3,
          userId: 2,
          organizationName: 'ООО Тестовая Компания',
          contractNumber: 'ДГ-003/2025',
          contactInfo: 'ИНН: 5555555555, тел: +79995555555, email: test@example.com',
          equipmentName: 'JCB 3CX',
          inventoryNumber: 'JCB-002',
          startDate: '2025-05-10',
          endDate: '2025-05-12',
          dailyWorkHours: 6,
          objectLocation: 'г. Казань, ул. Примерная, д. 3',
          workTypes: 'Строительство фундамента',
          status: 'расторгнут',
        },
      ];
    }, 500);
  },
  methods: {
    resetFilters() {
      this.filters = {
        startDate: '',
        endDate: '',
        startYear: '',
        startMonth: '',
        endYear: '',
        endMonth: '',
        status: '',
        equipment: ''
      };
      this.showDatePopup = false;
    },
    getStatusClass(status) {
      return {
        'status-active': status === 'действует',
        'status-completed': status === 'завершен',
        'status-terminated': status === 'расторгнут'
      };
    },
    openDetailsPopup(contract) {
      this.selectedContract = contract;
      this.showDetailsPopup = true;
    },
    closeDetailsPopup() {
      this.showDetailsPopup = false;
      this.selectedContract = null;
    }
  },
};
</script>

<style scoped>
/* Основной контейнер */
.container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

/* Заголовок */
.container .title {
  text-align: center !important;
  font-size: 2rem;
  color: #333;
  margin-bottom: 30px;
}

/* Фильтры */
.filters {
  display: flex;
  justify-content: flex-start;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 30px;
}

.filter-item {
  display: flex;
  flex-direction: column;
}

.filter-item label {
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 5px;
}

.filter-item input,
.filter-item select {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 0.9rem;
  transition: border-color 0.3s;
  height: 40px;
}

.filter-item input:focus,
.filter-item select:focus {
  border-color: #007BFF;
  outline: none;
}

.date-input {
  width: 150px;
  margin-bottom: 10px;
}

.status-filter,
.equipment-filter {
  width: 200px;
}

.date-filter {
  position: relative;
}

.calendar-btn {
  padding: 6px 12px;
  background-color: #35170c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  height: 40px;
}

.date-popup {
  position: absolute;
  top: 40px;
  left: 0;
  background: white;
  padding: 20px;
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 300px;
  z-index: 10;
}

.date-popup .popup-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.date-popup .popup-content > div {
  display: flex;
  flex-direction: column;
}

.popup-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.reset-btn {
  padding: 6px 12px;
  background-color: #f46430;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.close-btn {
  padding: 6px 12px;
  background-color: #f46430;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

/* Таблица договоров */
.contracts-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.contracts-table th,
.contracts-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.contracts-table th {
  background-color: #35170C;
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.9rem;
}

.contracts-table tbody tr {
  transition: background-color 0.2s;
}

.contracts-table tbody tr:hover {
  background-color: #f9f9f9;
}

.contracts-table td {
  vertical-align: middle;
  color: #333;
}

/* Стили для статусов */
.contracts-table td.status-active {
  color: #28a745 !important;
}

.contracts-table td.status-completed {
  color: #6c757d !important;
}

.contracts-table td.status-terminated {
  color: #dc3545 !important;
}

/* Кнопка "Подробнее" */
.details-btn {
  padding: 6px 12px;
  background-color: #f46430;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.details-btn:hover {
  background-color: #f46430;
}

/* Попап деталей */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.popup-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  text-align: left;
}

.popup-card h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  text-align: center;
}

.details-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.details-content p {
  margin: 0;
  font-size: 0.9rem;
  color: #333;
}

.details-content p strong {
  display: inline-block;
  width: 150px;
}

.details-content .status-active {
  color: #28a745;
}

.details-content .status-completed {
  color: #6c757d;
}

.details-content .status-terminated {
  color: #dc3545;
}

.popup-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
</style>