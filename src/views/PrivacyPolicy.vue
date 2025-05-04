<template>
  <div class="privacy-page">
    <!-- Фон с заголовком -->
    <div class="header-background">
      <div class="header-content">
        <h1>Политика конфиденциальности</h1>
      </div>
    </div>

    <!-- Основной блок с текстом политики -->
    <div class="privacy-text">
      <section>
        <h2>1. Общие положения</h2>
        <p>
          Настоящая Политика конфиденциальности описывает, какие персональные данные мы собираем, как используем их,
          храним и обрабатываем в рамках деятельности компании «ЛК ГРУПП» на сайте [вставьте ссылку].
        </p>
      </section>

      <section>
        <h2>2. Какие данные мы собираем</h2>
        <p>
          Мы можем собирать следующие данные:
        </p>
        <ul>
          <li>ФИО</li>
          <li>Контактную информацию (email, телефон)</li>
          <li>IP-адрес, cookies и другие технические данные</li>
        </ul>
      </section>

      <section>
        <h2>3. Цели обработки данных</h2>
        <p>
          Персональные данные используются для:
        </p>
        <ul>
          <li>предоставления услуг,</li>
          <li>обратной связи с клиентом,</li>
          <li>улучшения качества сайта и сервиса.</li>
        </ul>
      </section>

      <section>
        <h2>4. Хранение и защита данных</h2>
        <p>
          Мы принимаем все необходимые организационные и технические меры для защиты ваших данных от несанкционированного доступа, изменения или уничтожения.
        </p>
      </section>

      <section>
        <h2>5. Передача данных третьим лицам</h2>
        <p>
          Мы не передаём персональные данные третьим лицам, за исключением случаев, предусмотренных законом или с согласия пользователя.
        </p>
      </section>

      <section>
        <h2>6. Права пользователя</h2>
        <p>
          Вы имеете право запросить удаление, обновление или уточнение ваших персональных данных, направив запрос по адресу: info@lkgroup.ru
        </p>
      </section>

      <section>
        <h2>7. Изменения в политике</h2>
        <p>
          Мы можем обновлять данную Политику. Актуальная версия всегда доступна на этой странице.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
// ничего не требуется
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

.privacy-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Inter', sans-serif;
  color: #35170C;
}

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

.privacy-text {
  max-width: 900px;
  padding: 40px 20px;
  text-align: center;
}

.privacy-text h2 {
  font-size: 1.8rem;
  margin-top: 30px;
  margin-bottom: 10px;
}

.privacy-text p,
.privacy-text li {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 10px;
}

.privacy-text ul {
  list-style: none;
  padding: 0;
}

.privacy-text ul li::before {
  content: "•";
  color: #f46430;
  display: inline-block;
  width: 1em;
  margin-left: -1em;
}
</style>
