<template>
  <div class="agreement-page">
    <!-- Фон с заголовком -->
    <div class="header-background">
      <div class="header-content">
        <h1>Пользовательское соглашение</h1>
      </div>
    </div>

    <!-- Основной блок с текстом соглашения -->
    <div class="agreement-text">
      <section>
        <h2>1. Общие положения</h2>
        <p>
          Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует отношения между компанией «ЛК ГРУПП» и пользователями сайта.
          Используя сайт, вы подтверждаете своё согласие с условиями данного Соглашения.
        </p>
      </section>

      <section>
        <h2>2. Условия использования</h2>
        <p>
          Пользователь обязуется не предпринимать действия, которые могут привести к нарушению работы сайта, нарушению прав третьих лиц или законодательства РФ.
        </p>
        <p>
          Администрация сайта оставляет за собой право ограничить доступ к сайту в случае нарушения условий Соглашения.
        </p>
      </section>

      <section>
        <h2>3. Права и обязанности сторон</h2>
        <p>
          Компания «ЛК ГРУПП» предоставляет доступ к информации, размещённой на сайте, и делает всё возможное для обеспечения его бесперебойной работы.
        </p>
        <p>
          Пользователь обязуется предоставлять достоверную информацию и не использовать сайт в противоправных целях.
        </p>
      </section>

      <section>
        <h2>4. Конфиденциальность</h2>
        <p>
          Все персональные данные пользователей обрабатываются в соответствии с <a href="#" class="privacy-policy-link">Политикой конфиденциальности</a>. 
          Мы не передаём ваши данные третьим лицам без вашего согласия, за исключением случаев, предусмотренных законом.
        </p>
      </section>

      <section>
        <h2>5. Ответственность</h2>
        <p>
          Компания не несёт ответственности за возможные сбои в работе сайта, а также за прямой или косвенный ущерб, возникший в результате использования сайта.
        </p>
      </section>

      <section>
        <h2>6. Изменение условий</h2>
        <p>
          Мы вправе изменять условия настоящего Соглашения в любое время. Изменения вступают в силу с момента публикации на сайте.
        </p>
      </section>

      <section>
        <h2>7. Заключительные положения</h2>
        <p>
          К настоящему Соглашению применяется законодательство Российской Федерации. Все споры подлежат разрешению в соответствии с действующим правом РФ.
        </p>
      </section>

      <section>
        <h2>8. Контактная информация</h2>
        <p>
          По всем вопросам, связанным с данным Соглашением, вы можете связаться с нами:
          <br />
          <strong>Телефон:</strong> +7 (495) 123-45-67<br />
          <strong>Email:</strong> info@lkgroup.ru
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

.agreement-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Inter', sans-serif;
  color: #35170C;
}

/* Заголовок с фоном */
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

/* Тело текста */
.agreement-text {
  max-width: 900px;
  padding: 40px 20px;
  text-align: center;
}

.agreement-text h2 {
  font-size: 1.8rem;
  margin-top: 30px;
  margin-bottom: 10px;
}

.agreement-text p {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 10px;
}

/* Ссылка на политику */
.privacy-policy-link {
  color: #35170C;
  text-decoration: underline;
}

.privacy-policy-link:hover {
  text-decoration: none;
}
</style>
