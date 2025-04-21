<template>
  <div id="app">
    <!-- Шапка -->
    <header class="header">
      <router-link to="/" class="logo">
        <img :src="logo" alt="Логотип" height="40" />
        <span class="logo_dec">LKgrupp</span>
      </router-link>
      <nav>
        <ul>
          <li>
            <router-link to="/">
              <v-icon>mdi-home</v-icon> Главная
            </router-link>
          </li>
          <li>
            <router-link to="/aboutcontact">
              <v-icon>mdi-information</v-icon> О компании
            </router-link>
          </li>
        </ul>
      </nav>
    </header>

    <!-- Контент -->
    <main class="content">
      <router-view />
    </main>

    <!-- Футер -->
    <v-footer class="custom-footer" padless>
      <div class="footer-container">
        <!-- Верх: логотип -->
        <div class="footer-top">
          <div class="footer-logo-block">
            <router-link to="/" class="footer-logo-link">
              <img :src="logo" alt="Логотип" class="footer-logo" />
              <div class="footer-title">LKgrupp</div>
            </router-link>
          </div>
        </div>

        <!-- Основной контент -->
        <div class="footer-content">
          <!-- Ссылки с иконками -->
          <div class="footer-links">
            <router-link to="/aboutcontact" class="footer-link">
              <v-icon class="footer-icon">mdi-information</v-icon>
              О компании
            </router-link>
            <router-link to="/requests" class="footer-link">
              <v-icon class="footer-icon">mdi-format-list-bulleted</v-icon>
              Заявки
            </router-link>
            <router-link to="/useragreement" class="footer-link">
              <v-icon class="footer-icon">mdi-file-document-outline</v-icon>
              Пользовательское соглашение
            </router-link>
            <router-link to="/privacypolicy" class="footer-link">
              <v-icon class="footer-icon">mdi-lock-outline</v-icon>
              Политика конфиденциальности
            </router-link>
          </div>

          <!-- Разделитель -->
          <div class="footer-divider"></div>

          <!-- Контакты с иконками -->
          <div class="footer-contacts">
            <div class="footer-contact">
              <v-icon class="footer-icon">mdi-clock-time-four</v-icon>
              Звоните: пн–пт 09:00–18:00
            </div>
            <div class="footer-contact">
              <v-icon class="footer-icon">mdi-phone</v-icon>
              <a href="tel:+79780570671">+7 978 057 06 71</a>
            </div>
            <div class="footer-contact">
              <v-icon class="footer-icon">mdi-email</v-icon>
              <a href="mailto:lkgrupp@mail.ru">lkgrupp@mail.ru</a>
            </div>
            <div class="footer-contact">
              <v-icon class="footer-icon">mdi-map-marker</v-icon>
              295022, Республика Крым, г. Симферополь,<br />
              ул. Кубанская, д.18, каб.55
            </div>
          </div>
        </div>

        <!-- Линия и копирайт -->
        <div class="footer-bottom-line"></div>
        <div class="footer-bottom-text">2025 LKgrupp – Аренда спецтехники</div>
      </div>
    </v-footer>
  </div>
</template>

<script>
import logo from '@/assets/logo.png';

export default {
  name: 'App',
  data() {
    return {
      logo,
    };
  },
};
</script>

<style scoped>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Шапка */
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #997d64;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  z-index: 1000;
  box-sizing: border-box;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo_dec {
  color: #35170C;
  font-size: 26px;
  font-weight: bold;
  margin-left: 10px;
  text-decoration: none;
}

nav ul {
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0;
}

nav a {
  color: #35170C;
  text-decoration: none;
  font-weight: bold;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Контент */
.content {
  flex: 1;
  padding-top: 80px;
  box-sizing: border-box;
}

/* Футер */
.custom-footer {
  background: #997d64;
  padding: 2px 0 1px; /* Уменьшены отступы сверху и снизу */
  position: relative;
  color: #35170C;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
}

.footer-container {
  width: 100%;
  max-width: 100%; /* растягиваем на всю ширину */
  margin: 0 auto;
}

.footer-top {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px; /* Уменьшен нижний отступ */
}

.footer-logo-block {
  display: flex;
  align-items: center;
  gap: 16px;
}

.footer-logo {
  width: 50px;
  height: 50px;
}

.footer-title {
  font-size: 22px; /* стиль для текста, как у ссылок */
  color: #35170C;
  text-decoration: none;
  font-weight: bold;
}

.footer-logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.footer-content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 40px;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.footer-link {
  font-size: 20px;
  color: #35170C;
  text-decoration: none;
  transition: color 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-link:hover {
  color: #35170C;
  text-decoration: underline;
}

.footer-icon {
  font-size: 20px;
  vertical-align: middle;
}

.footer-divider {
  width: 1px;
  height: 160px;
  background-color: #35170C;
  margin: 24px 0; /* 24px отступ сверху и снизу от линии */
}

.footer-contacts {
  display: flex;
  flex-direction: column;
  gap: 14px;
  font-size: 20px;
}

.footer-contact {
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-contact a {
  color: #35170C;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-contact a:hover {
  color: #35170C;
  text-decoration: underline;
}

.footer-bottom-line {
  width: 80%;
  max-width: 80%; /* растягиваем на всю ширину */
  height: 1px;
  background-color: #35170C;
  margin: 1px auto 12px; 
}

.footer-bottom-text {
  text-align: center;
  font-size: 18px; /* Уменьшен размер шрифта */
  color: #35170c73;
  padding: 5px 0;
  margin: 0%; /* Уменьшены отступы */
}
</style>
