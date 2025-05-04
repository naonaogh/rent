<template>
  <nav class="navigation">
    <div class="nav-brand">
      <router-link to="/">Rent</router-link>
    </div>
    
    <div class="nav-links">
      <router-link to="/" class="nav-link">Главная</router-link>
      <router-link to="/about" class="nav-link">О компании</router-link>
      <router-link to="/privacy" class="nav-link">Политика конфиденциальности</router-link>
      <router-link to="/agreement" class="nav-link">Пользовательское соглашение</router-link>
      <router-link to="/offer" class="nav-link">Договор оферты</router-link>
      
      <!-- Ссылки для авторизованных пользователей -->
      <template v-if="isAuthenticated">
        <!-- Для клиентов -->
        <template v-if="isClient">
          <router-link to="/myrequests" class="nav-link">
            <i class="fas fa-file-alt"></i> Мои заявки
          </router-link>
          <router-link to="/mycontracts" class="nav-link">
            <i class="fas fa-file-contract"></i> Мои договоры
          </router-link>
        </template>
        
        <!-- Для менеджеров -->
        <template v-if="isManager">
          <router-link to="/allrequests" class="nav-link">
            <i class="fas fa-tasks"></i> Заявки
          </router-link>
          <router-link to="/allcontracts" class="nav-link">
            <i class="fas fa-file-signature"></i> Договоры
          </router-link>
        </template>
        
        <!-- Для админов -->
        <template v-if="isAdmin">
          <router-link to="/admin" class="nav-link">
            <i class="fas fa-cog"></i> Админ-панель
          </router-link>
        </template>
        
        <!-- Общие ссылки для всех авторизованных -->
        <router-link to="/profile" class="nav-link">
          <i class="fas fa-user"></i> Личный кабинет
        </router-link>
        <a href="#" @click.prevent="handleLogout" class="nav-link">
          <i class="fas fa-sign-out-alt"></i> Выйти
        </a>
      </template>
      
      <!-- Ссылки для гостей -->
      <template v-else>
        <router-link to="/loginregister" class="nav-link">
          <i class="fas fa-sign-in-alt"></i> Войти
        </router-link>
        <router-link to="/register" class="nav-link">
          <i class="fas fa-user-plus"></i> Регистрация
        </router-link>
      </template>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'NavigationView',
  
  computed: {
    ...mapGetters('auth', [
      'isAuthenticated',
      'isAdmin',
      'isManager',
      'isClient',
      'currentUser'
    ])
  },
  
  methods: {
    ...mapActions('auth', ['logout']),
    
    async handleLogout() {
      await this.logout();
      this.$router.push('/loginregister');
    }
  }
};
</script>

<style scoped>
.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #35170c;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-brand a {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  color: #fff;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: #f46430;
  color: #fff;
}

.nav-link i {
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .navigation {
    flex-direction: column;
    padding: 1rem;
  }
  
  .nav-links {
    flex-direction: column;
    width: 100%;
    margin-top: 1rem;
  }
  
  .nav-link {
    width: 100%;
    justify-content: center;
  }
}
</style>