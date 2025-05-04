<template>
  <div class="about-contact-view container">
    <h1>О компании</h1>
    
    <div class="content-section">
      <h2>Основное направление деятельности</h2>
      <p>
        Строительная компания «ЛК ГРУПП» предоставляет услуги аренды спецтехники с обслуживающим персоналом
        (водителями-машинистами, механиками). В ее распоряжении — один из крупнейших автопарков, способный решать
        задачи любого масштаба.
      </p>
    </div>
    
    <div class="content-section">
      <h2>Миссия и стратегия</h2>
      <p>
        Компания обеспечивает частные и государственные организации надежной спецтехникой, гарантируя оперативное и
        качественное выполнение работ. Ее стратегическая цель — развитие строительной отрасли и экономики России в
        целом.
      </p>
    </div>

    <div class="content-section">
      <h2>Преимущества</h2>
      <ul>
        <li>Большой автопарк — техника для любых задач.</li>
        <li>Исправность техники — регулярный контроль и обслуживание.</li>
        <li>Индивидуальный подход — учитываются пожелания клиентов.</li>
        <li>Оперативность — техника подается в течение часа.</li>
        <li>Квалифицированный персонал — специалисты для любых работ.</li>
      </ul>
    </div>

    <div class="content-section">
      <h2>Контактная информация</h2>
      <div class="contact-info">
        <div class="contact-item">
          <i class="fas fa-phone"></i>
          <div>
            <h3>Телефон</h3>
            <p>+7 978 057 06 71</p>
          </div>
        </div>
        <div class="contact-item">
          <i class="fas fa-envelope"></i>
          <div>
            <h3>Email</h3>
            <p>lkgrupp@mail.ru</p>
          </div>
        </div>
        <div class="contact-item">
          <i class="fas fa-map-marker-alt"></i>
          <div>
            <h3>Адрес</h3>
            <p>295022, улица Кубанская, д.18, КАБ 55, г. Симферополь, Республика Крым, Россия</p>
          </div>
        </div>
      </div>
    </div>

    <div class="content-section">
      <h2>Реквизиты</h2>
      <p>
        ИНН/КПП: 9102291041/910201001<br />
        р/с 40702810352000002426 в ЮГО-ЗАПАДНОМ БАНКЕ ПАО СБЕРБАНК<br />
        к/с 30101810600000000602 БИК 046015602
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutContact'
};
</script>

<style scoped>
.about-contact-view {
  padding: 2rem;
  text-align: center;
}

.content-section {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.content-section h2 {
  margin-bottom: 1.5rem;
  color: #35170c;
}

.content-section p {
  color: #666;
}

ul {
  list-style-type: none;
  padding: 0;
}

ul li {
  margin-bottom: 0.5rem;
  color: #333;
}

.contact-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.contact-item i {
  font-size: 1.5rem;
  color: #f46430;
}

.contact-item h3 {
  margin-bottom: 0.5rem;
  color: #35170c;
}

.contact-item p {
  color: #666;
  margin: 0;
}
</style>
