<template>
  <div class="about-page">
    <!-- Фон с заголовком -->
    <div class="header-background">
      <div class="header-content">
        <h1>О компании</h1>
      </div>
    </div>

    <!-- Основной блок с описанием -->
    <div class="about-text">
      <section>
        <h2>Основное направление деятельности</h2>
        <p>
          Строительная компания «ЛК ГРУПП» предоставляет услуги аренды спецтехники с обслуживающим персоналом
          (водителями-машинистами, механиками). В ее распоряжении — один из крупнейших автопарков, способный решать
          задачи любого масштаба.
        </p>
      </section>

      <section>
        <h2>Миссия и стратегия</h2>
        <p>
          Компания обеспечивает частные и государственные организации надежной спецтехникой, гарантируя оперативное и
          качественное выполнение работ. Ее стратегическая цель — развитие строительной отрасли и экономики России в
          целом.
        </p>
      </section>

      <section>
        <h2>Преимущества</h2>
        <ul>
          <li>Большой автопарк — техника для любых задач.</li>
          <li>Исправность техники — регулярный контроль и обслуживание.</li>
          <li>Индивидуальный подход — учитываются пожелания клиентов.</li>
          <li>Оперативность — техника подается в течение часа.</li>
          <li>Квалифицированный персонал — специалисты для любых работ.</li>
        </ul>
      </section>

      <section>
        <h2>Контактная информация</h2>
        <p><strong>Телефон:</strong> +7 (495) 123-45-67</p>
        <p><strong>Email:</strong> info@lkgroup.ru</p>
        <p><strong>Адрес:</strong> г. Москва, ул. Примерная, д. 1</p>
      </section>

      <section>
        <h2>Реквизиты</h2>
        <p><strong>ИНН:</strong> 7701234567</p>
        <p><strong>КПП:</strong> 770101001</p>
        <p><strong>ОГРН:</strong> 1027700123456</p>
        <p><strong>Банк:</strong> ПАО «Пример Банк»</p>
        <p><strong>Расчетный счет:</strong> 40702810900000001234</p>
        <p><strong>Корр. счет:</strong> 30101810400000000225</p>
        <p><strong>БИК:</strong> 044525225</p>
      </section>
    </div>
  </div>
</template>

<script setup>
// ничего не нужно
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

.about-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Inter', sans-serif;
  color: #35170C; /* Устанавливаем цвет текста */
}

/* Фон с заголовком */
.header-background {
  background-image: url("@/assets/header-about.jpg");
  background-size: cover;
  background-position: center;
  height: 300px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-content h1 {
  color: white;
  font-size: 3rem;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
}

/* Текст */
.about-text {
  max-width: 900px;
  padding: 40px 20px;
  text-align: center;
}

.about-text h2 {
  font-size: 1.8rem;
  margin-top: 30px;
  margin-bottom: 10px;
}

.about-text p {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 10px;
}

.about-text ul {
  list-style-type: disc;
  text-align: left;
  padding-left: 20px;
  margin-top: 10px;
}

.about-text li {
  margin-bottom: 10px;
  font-size: 1.1rem;
}
</style>
