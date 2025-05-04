<template>
  <div id="app">
    <NavigationView />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
import NavigationView from '@/components/NavigationView.vue';

export default {
  name: 'App',
  components: {
    NavigationView
  }
};
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 20px;
  background-color: #fff;
}

/* Глобальные стили */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #35170c;
}

a {
  text-decoration: none;
  color: #35170c;
}

a:hover {
  color: #f46430;
}

button {
  cursor: pointer;
}

/* Утилиты */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.text-center {
  text-align: center;
}

.mt-4 {
  margin-top: 1rem;
}

.mb-4 {
  margin-bottom: 1rem;
}
</style>