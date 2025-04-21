<template>
  <div class="page-content">
    <h1 class="title">Каталог</h1>
    
    <!-- Контейнер для карточек -->
    <div class="catalog">
      <div v-for="item in items" :key="item.id" class="card">
        <img :src="item.image" :alt="item.name" class="card-image" />
        <div class="card-info">
          <h3>{{ item.name }}</h3>
          <p>{{ item.description }}</p>
          <p><strong>Цена: {{ item.price }} руб.</strong></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      // Массив с данными о карточках
      items: [
        {
          id: 1,
          name: 'Экскаватор',
          description: 'Мощный экскаватор для строительных работ.',
          price: '1500',
          image: 'https://via.placeholder.com/200'
        },
        {
          id: 2,
          name: 'Гусеничный трактор',
          description: 'Трактор с гусеничной базой для работы на сложных грунтах.',
          price: '1200',
          image: 'https://via.placeholder.com/200'
        },
        {
          id: 3,
          name: 'Бульдозер',
          description: 'Бульдозер для выемки и планировки грунта.',
          price: '1800',
          image: 'https://via.placeholder.com/200'
        }
      ]
    }
  }
}
</script>

<style scoped>
.page-content {
  text-align: right; /* Выравнивание текста по правому краю */
  padding: 20px;
}

.title {
  font-size: 2em;
  margin-bottom: 20px;
}

.catalog {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding-top: 20px;
}

.card {
  background-color: #f4f4f4;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-image {
  max-width: 100%;
  border-radius: 8px;
}

.card-info h3 {
  font-size: 1.2em;
  margin-top: 10px;
}

.card-info p {
  margin: 5px 0;
}
</style>
