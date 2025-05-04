<template>
  <div class="home-page">
    <!-- Баннер -->
    <div class="header-background">
      <div class="header-content">
        <h1>Аренда спецтехники</h1>
      </div>
    </div>

    <!-- Блок "Как это устроено" -->
    <section class="how-it-works">
      <h2>Как это устроено</h2>
      <div class="steps">
        <div class="step">
          <button class="step-btn">1. Выберите нужную технику из каталога</button>
        </div>
        <div class="step">
          <button class="step-btn">2. Оформите заявку через форму</button>
        </div>
        <div class="step">
          <button class="step-btn">3. Получите технику в кратчайшие сроки</button>
        </div>
      </div>
    </section>

    <!-- Каталог -->
    <div class="page-content">
      <h1 class="catalog-title" id="catalog">Каталог</h1>

      <!-- Кнопка Добавить Технику (только для админа) -->
      <div v-if="isAdmin" class="admin-actions">
        <button @click="openAddPopup" class="add-machinery-btn">
          <i class="fas fa-plus"></i> Добавить технику
        </button>
      </div>

      <div class="search-bar">
        <input v-model="searchQuery" type="text" placeholder="Поиск по технике..." class="search-input" />
      </div>

      <div class="catalog">
        <!-- Карточка техники -->
        <div v-for="item in filteredItems" :key="item.id" class="card">
          <img :src="item.image_url || defaultImage" :alt="item.invent_num" class="card-image" @error="handleImageError" />
          <div class="card-info">
            <h3>{{ item.invent_num }}</h3>
            <p><strong>Цена: {{ item.model.cost_per_hour }} руб./час</strong></p>
            <p v-if="item.status === 'Rented'" class="status unavailable">Недоступна</p>
            <p v-else class="status available">Доступна</p>
            <button @click="openDetailsPopup(item)" class="details-btn">Подробнее</button>
          </div>
          <!-- Кнопки управления для Админа и Менеджера -->
          <div class="card-actions">
            <button v-if="isAdmin" @click="openEditPopup(item)" class="action-btn edit-btn" title="Редактировать">
              <i class="fas fa-edit"></i>
            </button>
            <button v-if="isManager" @click="openEditPopup(item)" class="action-btn edit-btn" title="Изменить статус">
              <i class="fas fa-toggle-on"></i>
            </button>
            <button v-if="isAdmin" @click="confirmDeleteMachinery(item.id)" class="action-btn delete-btn" title="Удалить">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Попап Детали -->
      <div v-if="showDetailsPopup" class="popup-overlay">
        <div class="popup-card">
          <div class="popup-content">
            <h2>{{ selectedItem.invent_num }}</h2>
            <p>{{ selectedItem.info }}</p>
            <p><strong>Цена: {{ selectedItem.model.cost_per_hour }} руб./час</strong></p>
          </div>
          <div class="popup-buttons">
            <button v-if="!currentUser" @click="showLoginPrompt" class="rent-btn">Оформить аренду</button>
            <button v-else @click="goToRentForm(selectedItem.id)" class="rent-btn">Оформить аренду</button>
            <button class="close-btn" @click="closePopups">Закрыть</button>
          </div>
        </div>
      </div>

      <!-- Попап Добавить/Редактировать -->
      <div v-if="showAddPopup || showEditPopup" class="popup-overlay">
        <div class="popup-card form-popup">
          <h2>{{ isEditing ? 'Редактировать технику' : 'Добавить технику' }}</h2>
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="invent_num">Инвентарный номер:</label>
              <input type="text" id="invent_num" v-model="formData.invent_num" :disabled="!isAdmin" required />
            </div>
            <div class="form-group">
              <label for="info">Доп. информация:</label>
              <textarea id="info" v-model="formData.info" :disabled="!isAdmin"></textarea>
            </div>
            <div class="form-group">
              <label for="image_url">URL изображения:</label>
              <input type="url" id="image_url" v-model="formData.image_url" :disabled="!isAdmin" />
            </div>
            <div class="form-group">
              <label for="model_id">Модель:</label>
              <select id="model_id" v-model="formData.model_id" :disabled="!isAdmin" required>
                <option v-for="model in models" :key="model.id" :value="model.id">{{ model.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label for="status">Статус:</label>
              <select id="status" v-model="formData.status" :disabled="!isAdmin && !isManager" required>
                <option value="Available">Доступна</option>
                <option value="Rented">Недоступна</option>
              </select>
            </div>
            <div class="popup-buttons form-buttons">
              <button type="submit" class="save-btn">Сохранить</button>
              <button type="button" class="close-btn" @click="closePopups">Отмена</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/axios';
import { authApi } from '@/api/auth';

export default {
  name: 'HomePage',
  data() {
    return {
      items: [],
      models: [],
      selectedItem: null,
      searchQuery: '',
      showDetailsPopup: false,
      showAddPopup: false,
      showEditPopup: false,
      isEditing: false,
      formData: this.getEmptyFormData(),
      currentUser: null,
      defaultImage: 'https://via.placeholder.com/300x200?text=No+Image',
    };
  },
  computed: {
    isAdmin() {
      return this.currentUser?.role === 'ADMIN';
    },
    isManager() {
      return this.currentUser?.role === 'MANAGER';
    },
    filteredItems() {
      if (!this.searchQuery) {
        return this.items;
      }
      const lowerQuery = this.searchQuery.toLowerCase();
      return this.items.filter(item =>
        item.invent_num.toLowerCase().includes(lowerQuery) ||
        item.info?.toLowerCase().includes(lowerQuery)
      );
    },
  },
  methods: {
    getEmptyFormData() {
      return {
        id: null,
        invent_num: '',
        info: '',
        image_url: '',
        status: 'Available',
        model_id: null,
      };
    },

    async fetchMachinery() {
      try {
        const response = await api.get('/special-machinery');
        this.items = response.data;
      } catch (error) {
        console.error('Ошибка загрузки техники:', error);
      }
    },

    async fetchModels() {
      try {
        const response = await api.get('/machine_model');
        this.models = response.data;
      } catch (error) {
        console.error('Ошибка загрузки моделей:', error);
      }
    },

    async addMachinery() {
      try {
        await api.post('/special-machinery', this.formData);
        this.closePopups();
        this.fetchMachinery();
        alert('Техника успешно добавлена!');
      } catch (error) {
        console.error('Ошибка добавления техники:', error);
        alert('Не удалось добавить технику.');
      }
    },

    async updateMachinery() {
      try {
        const payload = this.isAdmin ? this.formData : { status: this.formData.status };
        await api.put(`/special-machinery/${this.formData.id}`, payload);
        this.closePopups();
        this.fetchMachinery();
        alert('Техника успешно обновлена!');
      } catch (error) {
        console.error('Ошибка обновления техники:', error);
        alert('Не удалось обновить технику.');
      }
    },

    openAddPopup() {
      this.isEditing = false;
      this.formData = this.getEmptyFormData();
      this.showAddPopup = true;
    },

    openEditPopup(item) {
      this.isEditing = true;
      this.formData = { ...item, model_id: item.model.id };
      this.showEditPopup = true;
    },

    confirmDeleteMachinery(id) {
      const confirmation = confirm('Вы уверены, что хотите удалить эту технику?');
      if (confirmation) {
        api.delete(`/special-machinery/${id}`)
          .then(() => {
            this.fetchMachinery();
            alert('Техника удалена.');
          })
          .catch(error => {
            console.error('Ошибка удаления техники:', error);
            alert('Не удалось удалить технику.');
          });
      }
    },

    openDetailsPopup(item) {
      this.selectedItem = item;
      this.showDetailsPopup = true;
    },

    closePopups() {
      this.showDetailsPopup = false;
      this.showAddPopup = false;
      this.showEditPopup = false;
    },

    goToRentForm(id) {
      this.$router.push(`/rent/${id}`);
    },

    showLoginPrompt() {
      alert('Вы должны зарегистрироваться для оформления аренды.');
      this.$router.push('/login');
    },

    handleImageError(event) {
      event.target.src = this.defaultImage;
    },

    handleSubmit() {
      if (this.isEditing) {
        this.updateMachinery();
      } else {
        this.addMachinery();
      }
    },

    async checkAuth() {
      try {
        const user = await authApi.getCurrentUser();
        this.currentUser = user;
      } catch (error) {
        console.error('Ошибка проверки авторизации:', error);
        localStorage.removeItem('token');
      }
    }
  },

  created() {
    this.checkAuth();
    this.fetchMachinery();
    this.fetchModels();
  }
};
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
}

.header-background {
  background-color: #35170c;
  background-image: url('https://via.placeholder.com/1200x300?text=Аренда+спецтехники');
  background-size: cover;
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}

.header-content h1 {
  font-size: 3rem;
  font-weight: bold;
}

.how-it-works {
  margin: 50px 0;
  text-align: center;
}

.steps {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.step {
  font-size: 1.2rem;
  max-width: 200px;
}

.step-btn {
  background-color: #f46430;
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.step-btn:hover {
  background-color: #e15f0d;
}

.catalog-title {
  text-align: center;
  margin: 30px 0;
  font-size: 2rem;
  font-weight: bold;
  color: #35170c;
}

.search-bar {
  margin: 20px 0;
  display: flex;
  justify-content: center;
}

.search-input {
  width: 300px;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
}

.catalog {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  width: 80%;
  margin-top: 30px;
}

.card {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.card-image {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
}

.card-info {
  margin-top: 20px;
  text-align: center;
}

.card-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.status {
  padding: 5px;
  font-weight: bold;
  border-radius: 5px;
}

.status.available {
  background-color: #28a745;
  color: #fff;
}

.status.unavailable {
  background-color: #dc3545;
  color: #fff;
}

.details-btn,
.edit-btn,
.delete-btn {
  background-color: #f46430;
  color: #fff;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.details-btn:hover,
.edit-btn:hover,
.delete-btn:hover {
  background-color: #e15f0d;
}

.add-machinery-btn {
  background-color: #35170c;
  color: #fff;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.add-machinery-btn:hover {
  background-color: #2a120a;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 30px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.popup-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.save-btn,
.close-btn,
.rent-btn {
  padding: 10px 20px;
  background-color: #f46430;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.save-btn:hover,
.close-btn:hover,
.rent-btn:hover {
  background-color: #e15f0d;
}

.form-group {
  margin-bottom: 15px;
}

form label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
  color: #35170c;
}

form input,
form textarea,
form select {
  width: 100%;
  padding: 8px;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ddd;
  outline: none;
}

form input:focus,
form textarea:focus,
form select:focus {
  border-color: #f46430;
}
</style>