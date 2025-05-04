<template>
  <div class="rent-form-view container">
    <h1>Оформление аренды</h1>
    
    <form @submit.prevent="submitForm" class="rent-form">
      <div class="form-section">
        <h2>Информация о технике</h2>
        <div class="form-group">
          <label>Техника:</label>
          <select 
            v-model="form.machinery_id" 
            required
            :disabled="!!machineryId"
          >
            <option value="">Выберите технику</option>
            <option 
              v-for="machinery in availableMachinery" 
              :key="machinery.id" 
              :value="machinery.id"
            >
              {{ machinery.name }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="form-section">
        <h2>Информация об организации</h2>
        <div class="form-group">
          <label>Название организации:</label>
          <input 
            type="text" 
            v-model="form.organization_name" 
            required
            :disabled="isAuthenticated"
          >
        </div>
        
        <div class="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            v-model="form.email" 
            required
            :disabled="isAuthenticated"
          >
        </div>
        
        <div class="form-group">
          <label>Телефон:</label>
          <input 
            type="tel" 
            v-model="form.phone_number" 
            required
            :disabled="isAuthenticated"
          >
        </div>
        
        <div class="form-group">
          <label>Дополнительная информация:</label>
          <textarea 
            v-model="form.info" 
            rows="3"
          ></textarea>
        </div>
      </div>
      
      <div class="form-section">
        <h2>Параметры аренды</h2>
        <div class="form-group">
          <label>Дата начала:</label>
          <input 
            type="date" 
            v-model="form.start_date" 
            required
          >
        </div>
        
        <div class="form-group">
          <label>Дата окончания:</label>
          <input 
            type="date" 
            v-model="form.end_date" 
            required
          >
        </div>
        
        <div class="form-group">
          <label>Часов в день:</label>
          <input 
            type="number" 
            v-model="form.daily_work_hours" 
            required
            min="1"
            max="24"
          >
        </div>
        
        <div class="form-group">
          <label>Местоположение объекта:</label>
          <input 
            type="text" 
            v-model="form.object_location" 
            required
          >
        </div>
        
        <div class="form-group">
          <label>Виды работ:</label>
          <textarea 
            v-model="form.work_types" 
            rows="3"
            required
          ></textarea>
        </div>
      </div>
      
      <div class="form-actions">
        <button type="submit" class="submit-button">
          <i class="fas fa-paper-plane"></i> Отправить заявку
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'RentForm',
  
  props: {
    machineryId: {
      type: [String, Number],
      default: null
    }
  },
  
  data() {
    return {
      form: {
        machinery_id: this.machineryId || '',
        organization_name: '',
        email: '',
        phone_number: '',
        info: '',
        start_date: '',
        end_date: '',
        daily_work_hours: 8,
        object_location: '',
        work_types: ''
      },
      availableMachinery: []
    };
  },
  
  computed: {
    ...mapGetters('auth', [
      'isAuthenticated',
      'currentUser'
    ])
  },
  
  methods: {
    async fetchAvailableMachinery() {
      try {
        // TODO: Добавить API запрос для получения доступной техники
        // Пока используем моковые данные
        this.availableMachinery = [];
      } catch (error) {
        console.error('Error fetching machinery:', error);
      }
    },
    
    async submitForm() {
      if (!this.isAuthenticated) {
        // TODO: Показать попап с сообщением о необходимости регистрации
        return;
      }
      
      try {
        // TODO: Добавить API запрос для создания заявки
        this.$router.push('/myrequests');
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  },
  
  created() {
    this.fetchAvailableMachinery();
    
    if (this.isAuthenticated && this.currentUser) {
      this.form.organization_name = this.currentUser.organization_name;
      this.form.email = this.currentUser.email;
      this.form.phone_number = this.currentUser.phone_number;
      this.form.info = this.currentUser.info;
    }
  }
};
</script>

<style scoped>
.rent-form-view {
  padding: 2rem;
}

.rent-form {
  max-width: 800px;
  margin: 0 auto;
}

.form-section {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.form-section h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:disabled,
.form-group select:disabled,
.form-group textarea:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.form-group textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.submit-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #45a049;
}
</style>
