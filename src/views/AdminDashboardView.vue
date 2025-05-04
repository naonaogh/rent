<template>
  <div class="container">
    <h1 class="title">Админ-панель</h1>

    <!-- Вкладки для навигации -->
    <div class="tabs">
      <button :class="{ active: activeTab === 'organizations' }" @click="activeTab = 'organizations'">Организации</button>
      <button :class="{ active: activeTab === 'managers' }" @click="activeTab = 'managers'">Менеджеры</button>
      <button :class="{ active: activeTab === 'requests' }" @click="activeTab = 'requests'">Заявки</button>
      <button :class="{ active: activeTab === 'contracts' }" @click="activeTab = 'contracts'">Договоры</button>
      <button :class="{ active: activeTab === 'equipment' }" @click="activeTab = 'equipment'">Техника</button>
    </div>

    <!-- Раздел: Организации -->
    <div v-if="activeTab === 'organizations'" class="tab-content">
      <h2>Управление организациями</h2>
      <!-- Фильтры и поиск -->
      <div class="filters">
        <div class="filter-group search-group">
          <label>Поиск:</label>
          <input v-model="orgSearchQuery" type="text" placeholder="Поиск по названию, email, телефону..." />
        </div>
      </div>
      <table class="org-table">
        <thead>
          <tr>
            <th>Логотип</th>
            <th>Организация</th>
            <th>Информация</th>
            <th>Email</th>
            <th>Телефон</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="org in filteredOrganizations" :key="org.id">
            <td>
              <img v-if="org.logo" :src="org.logo" alt="Логотип" class="logo-img" />
              <span v-else>-</span>
            </td>
            <td>{{ org.organizationName }}</td>
            <td>{{ org.organizationDetails }}</td>
            <td>{{ org.email }}</td>
            <td>{{ org.phone }}</td>
            <td>
              <button @click="openEditOrgPopup(org)" class="edit-btn">Редактировать</button>
              <button @click="openDeleteOrgPopup(org)" class="delete-btn">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Раздел: Менеджеры -->
    <div v-if="activeTab === 'managers'" class="tab-content">
      <h2>Управление менеджерами</h2>
      <button @click="openAddManagerPopup" class="add-btn">Добавить менеджера</button>
      <!-- Фильтры и поиск -->
      <div class="filters">
        <div class="filter-group search-group">
          <label>Поиск:</label>
          <input v-model="managerSearchQuery" type="text" placeholder="Поиск по имени, email..." />
        </div>
      </div>
      <table class="manager-table">
        <thead>
          <tr>
            <th>Имя</th>
            <th>Email</th>
            <th>Пароль</th>
            <th>Организация</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="manager in filteredManagers" :key="manager.id">
            <td>{{ manager.name }}</td>
            <td>{{ manager.email }}</td>
            <td>{{ manager.password }}</td>
            <td>{{ getOrgNameById(manager.organizationId) }}</td>
            <td>
              <button @click="openEditManagerPopup(manager)" class="edit-btn">Редактировать</button>
              <button @click="openDeleteManagerPopup(manager)" class="delete-btn">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Раздел: Заявки -->
    <div v-if="activeTab === 'requests'" class="tab-content">
      <h2>Управление заявками</h2>
      <button @click="addRequest" class="add-btn">Добавить заявку</button>
      <!-- Фильтры и поиск -->
      <div class="filters">
        <div class="filter-group search-group">
          <label>Поиск:</label>
          <input v-model="requestSearchQuery" type="text" placeholder="Поиск по организации..." />
        </div>
        <div class="filter-group">
          <label>Статус:</label>
          <select v-model="requestFilter.status">
            <option value="">Все статусы</option>
            <option value="на рассмотрении">На рассмотрении</option>
            <option value="подтверждена">Подтверждена</option>
            <option value="отклонена">Отклонена</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Техника (инв. номер):</label>
          <select v-model="requestFilter.inventoryNumber">
            <option value="">Вся техника</option>
            <option v-for="equip in equipment" :key="equip.id" :value="equip.inventoryNumber">{{ equip.name }} ({{ equip.inventoryNumber }})</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Дата начала:</label>
          <input v-model="requestFilter.startDate" type="date" />
        </div>
        <div class="filter-group">
          <label>Дата окончания:</label>
          <input v-model="requestFilter.endDate" type="date" />
        </div>
      </div>
      <table class="request-table">
        <thead>
          <tr>
            <th>Организация</th>
            <th>Контакты</th>
            <th>Техника</th>
            <th>Инв. номер</th>
            <th>Даты аренды</th>
            <th>Часы/день</th>
            <th>Местоположение</th>
            <th>Виды работ</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="request in filteredRequests" :key="request.id">
            <td>{{ request.organizationName }}</td>
            <td>{{ request.contactInfo }}</td>
            <td>{{ request.equipmentName }}</td>
            <td>{{ request.inventoryNumber }}</td>
            <td>{{ request.startDate }} - {{ request.endDate }}</td>
            <td>{{ request.dailyWorkHours }}</td>
            <td>{{ request.objectLocation }}</td>
            <td>{{ request.workTypes }}</td>
            <td>
              <select v-model="request.status" @change="updateRequestStatus(request)">
                <option value="на рассмотрении">На рассмотрении</option>
                <option value="подтверждена">Подтверждена</option>
                <option value="отклонена">Отклонена</option>
              </select>
              <button v-if="request.status === 'на рассмотрении'" @click="approveRequest(request)" class="approve-btn">Подтвердить</button>
              <button v-if="request.status === 'на рассмотрении'" @click="openRejectRequestPopup(request)" class="reject-btn">Отклонить</button>
            </td>
            <td>
              <button @click="openEditRequestPopup(request)" class="edit-btn">Редактировать</button>
              <button @click="openDeleteRequestPopup(request)" class="delete-btn">Удалить</button>
              <button @click="openDetailsRequestPopup(request)" class="details-btn">Подробнее</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Раздел: Договоры -->
    <div v-if="activeTab === 'contracts'" class="tab-content">
      <h2>Управление договорами</h2>
      <button @click="openAddContractPopup" class="add-btn">Добавить договор</button>
      <!-- Фильтры и поиск -->
      <div class="filters">
        <div class="filter-group search-group">
          <label>Поиск:</label>
          <input v-model="contractSearchQuery" type="text" placeholder="Поиск по номеру договора, организации..." />
        </div>
        <div class="filter-group">
          <label>Статус:</label>
          <select v-model="contractFilter.status">
            <option value="">Все статусы</option>
            <option value="действует">Действует</option>
            <option value="завершен">Завершен</option>
            <option value="расторгнут">Расторгнут</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Техника (инв. номер):</label>
          <select v-model="contractFilter.inventoryNumber">
            <option value="">Вся техника</option>
            <option v-for="equip in equipment" :key="equip.id" :value="equip.inventoryNumber">{{ equip.name }} ({{ equip.inventoryNumber }})</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Дата начала:</label>
          <input v-model="contractFilter.startDate" type="date" />
        </div>
        <div class="filter-group">
          <label>Дата окончания:</label>
          <input v-model="contractFilter.endDate" type="date" />
        </div>
      </div>
      <table class="contract-table">
        <thead>
          <tr>
            <th>Номер договора</th>
            <th>Организация</th>
            <th>Контакты</th>
            <th>Техника</th>
            <th>Инв. номер</th>
            <th>Даты договора</th>
            <th>Часы/день</th>
            <th>Местоположение</th>
            <th>Виды работ</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="contract in filteredContracts" :key="contract.id">
            <td>{{ contract.contractNumber }}</td>
            <td>{{ contract.organizationName }}</td>
            <td>{{ contract.contactInfo }}</td>
            <td>{{ contract.equipmentName }}</td>
            <td>{{ contract.inventoryNumber }}</td>
            <td>{{ contract.startDate }} - {{ contract.endDate }}</td>
            <td>{{ contract.dailyWorkHours }}</td>
            <td>{{ contract.objectLocation }}</td>
            <td>{{ contract.workTypes }}</td>
            <td>
              <select v-model="contract.status" @change="updateContractStatus(contract)">
                <option value="действует">Действует</option>
                <option value="завершен">Завершен</option>
                <option value="расторгнут">Расторгнут</option>
              </select>
            </td>
            <td>
              <button @click="openEditContractPopup(contract)" class="edit-btn">Редактировать</button>
              <button @click="openDeleteContractPopup(contract)" class="delete-btn">Удалить</button>
              <a :href="contract.pdfUrl" target="_blank" class="open-btn">Открыть</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Раздел: Техника -->
    <div v-if="activeTab === 'equipment'" class="tab-content">
      <h2>Управление техникой</h2>
      <button @click="openAddEquipmentPopup" class="add-btn">Добавить технику</button>
      <!-- Фильтры и поиск -->
      <div class="filters">
        <div class="filter-group search-group">
          <label>Поиск:</label>
          <input v-model="equipmentSearchQuery" type="text" placeholder="Поиск по названию, инв. номеру..." />
        </div>
        <div class="filter-group">
          <label>Тип техники:</label>
          <select v-model="equipmentFilter.type">
            <option value="">Все типы</option>
            <option v-for="type in equipmentTypes" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>
      </div>
      <table class="equipment-table">
        <thead>
          <tr>
            <th>Тип</th>
            <th>Название</th>
            <th>Инв. номер</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="equip in filteredEquipment" :key="equip.id">
            <td>{{ equip.type }}</td>
            <td>{{ equip.name }}</td>
            <td>{{ equip.inventoryNumber }}</td>
            <td>
              <button @click="openEditEquipmentPopup(equip)" class="edit-btn">Редактировать</button>
              <button @click="openDeleteEquipmentPopup(equip)" class="delete-btn">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Кнопка выхода -->
    <div class="logout-section">
      <button @click="openLogoutPopup" class="logout-btn">Выйти</button>
    </div>

    <!-- Попап для редактирования организации -->
    <div v-if="showEditOrgPopup" class="popup-overlay">
      <div class="popup-card">
        <h2>Редактировать организацию</h2>
        <div class="edit-form">
          <div class="form-group">
            <label>Логотип:</label>
            <input type="file" @change="handleLogoUpload('editOrg')" accept="image/*" />
            <img v-if="editOrg.logo" :src="editOrg.logo" alt="Предпросмотр логотипа" class="logo-preview" />
          </div>
          <div class="form-group">
            <label>Организация:</label>
            <input v-model="editOrg.organizationName" type="text" :class="{ 'input-error': !editOrg.organizationName }" />
            <p v-if="!editOrg.organizationName" class="error-message">Название организации обязательно</p>
          </div>
          <div class="form-group">
            <label>Информация:</label>
            <input v-model="editOrg.organizationDetails" type="text" :class="{ 'input-error': !editOrg.organizationDetails }" />
            <p v-if="!editOrg.organizationDetails" class="error-message">Информация об организации обязательна</p>
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input v-model="editOrg.email" type="email" :class="{ 'input-error': !editOrg.email }" />
            <p v-if="!editOrg.email" class="error-message">Email обязателен</p>
          </div>
          <div class="form-group">
            <label>Телефон:</label>
            <input v-model="editOrg.phone" type="text" :class="{ 'input-error': !editOrg.phone }" />
            <p v-if="!editOrg.phone" class="error-message">Телефон обязателен</p>
          </div>
        </div>
        <div class="popup-buttons">
          <button @click="saveOrgChanges" class="save-btn" :disabled="!isEditOrgValid">Сохранить</button>
          <button @click="closeEditOrgPopup" class="close-btn">Закрыть</button>
        </div>
      </div>
    </div>

    <!-- Попап для подтверждения удаления организации -->
    <div v-if="showDeleteOrgPopup" class="popup-overlay">
      <div class="popup-card">
        <h2>Вы точно хотите удалить организацию {{ selectedOrg.organizationName }}?</h2>
        <div class="popup-buttons">
          <button @click="confirmDeleteOrg" class="confirm-btn">Да</button>
          <button @click="closeDeleteOrgPopup" class="cancel-btn">Отмена</button>
        </div>
      </div>
    </div>

    <!-- Попап для добавления менеджера -->
    <div v-if="showAddManagerPopup" class="popup-overlay">
      <div class="popup-card">
        <h2>Добавить менеджера</h2>
        <div class="edit-form">
          <div class="form-group">
            <label>Имя:</label>
            <input v-model="newManager.name" type="text" :class="{ 'input-error': !newManager.name }" />
            <p v-if="!newManager.name" class="error-message">Имя обязательно</p>
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input v-model="newManager.email" type="email" :class="{ 'input-error': !isEmailValid(newManager.email) }" />
            <p v-if="!isEmailValid(newManager.email)" class="error-message">Введите валидный email</p>
          </div>
          <div class="form-group">
            <label>Пароль:</label>
            <input v-model="newManager.password" type="password" :class="{ 'input-error': !newManager.password }" />
            <p v-if="!newManager.password" class="error-message">Пароль обязателен</p>
          </div>
          <div class="form-group">
            <label>Организация:</label>
            <select v-model="newManager.organizationId" :class="{ 'input-error': !newManager.organizationId }">
              <option value="">Выберите организацию</option>
              <option v-for="org in organizations" :key="org.id" :value="org.id">{{ org.organizationName }}</option>
            </select>
            <p v-if="!newManager.organizationId" class="error-message">Организация обязательна</p>
          </div>
        </div>
        <div class="popup-buttons">
          <button @click="addManager" class="save-btn" :disabled="!isNewManagerValid">Сохранить</button>
          <button @click="closeAddManagerPopup" class="close-btn">Закрыть</button>
        </div>
      </div>
    </div>

    <!-- Попап для редактирования менеджера -->
    <div v-if="showEditManagerPopup" class="popup-overlay">
      <div class="popup-card">
        <h2>Редактировать менеджера</h2>
        <div class="edit-form">
          <div class="form-group">
            <label>Имя:</label>
            <input v-model="editManager.name" type="text" :class="{ 'input-error': !editManager.name }" />
            <p v-if="!editManager.name" class="error-message">Имя обязательно</p>
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input v-model="editManager.email" type="email" :class="{ 'input-error': !isEmailValid(editManager.email) }" />
            <p v-if="!isEmailValid(editManager.email)" class="error-message">Введите валидный email</p>
          </div>
          <div class="form-group">
            <label>Пароль:</label>
            <input v-model="editManager.password" type="password" :class="{ 'input-error': !editManager.password }" />
            <p v-if="!editManager.password" class="error-message">Пароль обязателен</p>
          </div>
          <div class="form-group">
            <label>Организация:</label>
            <select v-model="editManager.organizationId" :class="{ 'input-error': !editManager.organizationId }">
              <option value="">Выберите организацию</option>
              <option v-for="org in organizations" :key="org.id" :value="org.id">{{ org.organizationName }}</option>
            </select>
            <p v-if="!editManager.organizationId" class="error-message">Организация обязательна</p>
          </div>
        </div>
        <div class="popup-buttons">
          <button @click="saveManagerChanges" class="save-btn" :disabled="!isEditManagerValid">Сохранить</button>
          <button @click="closeEditManagerPopup" class="close-btn">Закрыть</button>
        </div>
      </div>
    </div>

    <!-- Попап для подтверждения удаления менеджера -->
    <div v-if="showDeleteManagerPopup" class="popup-overlay">
      <div class="popup-card">
        <h2>Вы точно хотите удалить менеджера {{ selectedManager.name }}?</h2>
        <div class="popup-buttons">
          <button @click="confirmDeleteManager" class="confirm-btn">Да</button>
          <button @click="closeDeleteManagerPopup" class="cancel-btn">Отмена</button>
        </div>
      </div>
    </div>

    <!-- Попап для редактирования заявки -->
    <div v-if="showEditRequestPopup" class="popup-overlay">
      <div class="popup-card">
        <h2>Редактировать заявку</h2>
        <div class="edit-form">
          <div class="form-group">
            <label>Организация:</label>
            <select v-model="editRequest.organizationId" :class="{ 'input-error': !editRequest.organizationId }">
              <option value="">Выберите организацию</option>
              <option v-for="org in organizations" :key="org.id" :value="org.id">{{ org.organizationName }}</option>
            </select>
            <p v-if="!editRequest.organizationId" class="error-message">Организация обязательна</p>
          </div>
          <div class="form-group">
            <label>Контакты:</label>
            <input v-model="editRequest.contactInfo" type="text" :class="{ 'input-error': !editRequest.contactInfo }" />
            <p v-if="!editRequest.contactInfo" class="error-message">Контакты обязательны</p>
          </div>
          <div class="form-group">
            <label>Техника:</label>
            <select v-model="editRequest.equipmentId" :class="{ 'input-error': !editRequest.equipmentId }">
              <option value="">Выберите технику</option>
              <option v-for="equip in equipment" :key="equip.id" :value="equip.id">{{ equip.name }} ({{ equip.inventoryNumber }})</option>
            </select>
            <p v-if="!editRequest.equipmentId" class="error-message">Техника обязательна</p>
          </div>
          <div class="form-group">
            <label>Дата начала:</label>
            <input v-model="editRequest.startDate" type="date" :class="{ 'input-error': !editRequest.startDate }" />
            <p v-if="!editRequest.startDate" class="error-message">Дата начала обязательна</p>
          </div>
          <div class="form-group">
            <label>Дата окончания:</label>
            <input v-model="editRequest.endDate" type="date" :class="{ 'input-error': !editRequest.endDate }" />
            <p v-if="!editRequest.endDate" class="error-message">Дата окончания обязательна</p>
          </div>
          <div class="form-group">
            <label>Часы/день:</label>
            <input v-model.number="editRequest.dailyWorkHours" type="number" :class="{ 'input-error': !editRequest.dailyWorkHours }" />
            <p v-if="!editRequest.dailyWorkHours" class="error-message">Часы/день обязательны</p>
          </div>
          <div class="form-group">
            <label>Местоположение:</label>
            <input v-model="editRequest.objectLocation" type="text" :class="{ 'input-error': !editRequest.objectLocation }" />
            <p v-if="!editRequest.objectLocation" class="error-message">Местоположение обязательно</p>
          </div>
          <div class="form-group">
            <label>Виды работ:</label>
            <input v-model="editRequest.workTypes" type="text" :class="{ 'input-error': !editRequest.workTypes }" />
            <p v-if="!editRequest.workTypes" class="error-message">Виды работ обязательны</p>
          </div>
          <div class="form-group">
            <label>Статус:</label>
            <select v-model="editRequest.status">
              <option value="на рассмотрении">На рассмотрении</option>
              <option value="подтверждена">Подтверждена</option>
              <option value="отклонена">Отклонена</option>
            </select>
          </div>
        </div>
        <div class="popup-buttons">
          <button @click="saveRequestChanges" class="save-btn" :disabled="!isEditRequestValid">Сохранить</button>
          <button @click="closeEditRequestPopup" class="close-btn">Закрыть</button>
        </div>
      </div>
    </div>

    <!-- Попап для деталей заявки -->
    <div v-if="showDetailsRequestPopup" class="popup-overlay">
      <div class="popup-card">
        <h2>Детали заявки</h2>
        <div class="details-content">
          <p><strong>Организация:</strong> {{ selectedRequest.organizationName }}</p>
          <p><strong>Контакты:</strong> {{ selectedRequest.contactInfo }}</p>
          <p><strong>Техника:</strong> {{ selectedRequest.equipmentName }}</p>
          <p><strong>Инв. номер:</strong> {{ selectedRequest.inventoryNumber }}</p>
          <p><strong>Даты аренды:</strong> {{ selectedRequest.startDate }} - {{ selectedRequest.endDate }}</p>
          <p><strong>Часы/день:</strong> {{ selectedRequest.dailyWorkHours }}</p>
          <p><strong>Местоположение:</strong> {{ selectedRequest.objectLocation }}</p>
          <p><strong>Виды работ:</strong> {{ selectedRequest.workTypes }}</p>
          <p><strong>Статус:</strong> <span :class="getRequestStatusClass(selectedRequest.status)">{{ selectedRequest.status }}</span></p>
        </div>
        <div class="popup-buttons">
          <button @click="closeDetailsRequestPopup" class="close-btn">Закрыть</button>
        </div>
      </div>
    </div>

    <!-- Попап для подтверждения отклонения заявки -->
    <div v-if="showRejectRequestPopup" class="popup-overlay">
      <div class="popup-card">
        <h2>Вы точно хотите отклонить заявку от {{ selectedRequest.organizationName }}?</h2>
        <div class="popup-buttons">
          <button @click="confirmRejectRequest" class="confirm-btn">Да</button>
          <button @click="closeRejectRequestPopup" class="cancel-btn">Отмена</button>
        </div>
      </div>
    </div>

    <!-- Попап для подтверждения удаления заявки -->
    <div v-if="showDeleteRequestPopup" class="popup-overlay">
      <div class="popup-card">
        <h2>Вы точно хотите удалить заявку от {{ selectedRequest.organizationName }}?</h2>
        <div class="popup-buttons">
          <button @click="confirmDeleteRequest" class="confirm-btn">Да</button>
          <button @click="closeDeleteRequestPopup" class="cancel-btn">Отмена</button>
        </div>
      </div>
    </div>

    <!-- Попап для добавления договора -->
    <div v-if="showAddContractPopup" class="popup-overlay">
      <div class="popup-card">
        <h2>Добавить договор</h2>
        <div class="edit-form">
          <div class="form-group">
            <label>Номер договора:</label>
            <input v-model="newContract.contractNumber" type="text" :class="{ 'input-error': !newContract.contractNumber }" />
            <p v-if="!newContract.contractNumber" class="error-message">Номер договора обязателен</p>
          </div>
          <div class="form-group">
            <label>Организация:</label>
            <select v-model="newContract.organizationId" :class="{ 'input-error': !newContract.organizationId }">
              <option value="">Выберите организацию</option>
              <option v-for="org in organizations" :key="org.id" :value="org.id">{{ org.organizationName }}</option>
            </select>
            <p v-if="!newContract.organizationId" class="error-message">Организация обязательна</p>
          </div>
          <div class="form-group">
            <label>Контакты:</label>
            <input v-model="newContract.contactInfo" type="text" :class="{ 'input-error': !newContract.contactInfo }" />
            <p v-if="!newContract.contactInfo" class="error-message">Контакты обязательны</p>
          </div>
          <div class="form-group">
            <label>Техника:</label>
            <select v-model="newContract.equipmentId" :class="{ 'input-error': !newContract.equipmentId }">
              <option value="">Выберите технику</option>
              <option v-for="equip in equipment" :key="equip.id" :value="equip.id">{{ equip.name }} ({{ equip.inventoryNumber }})</option>
            </select>
            <p v-if="!newContract.equipmentId" class="error-message">Техника обязательна</p>
          </div>
          <div class="form-group">
            <label>Дата начала:</label>
            <input v-model="newContract.startDate" type="date" :class="{ 'input-error': !newContract.startDate }" />
            <p v-if="!newContract.startDate" class="error-message">Дата начала обязательна</p>
          </div>
          <div class="form-group">
            <label>Дата окончания:</label>
            <input v-model="newContract.endDate" type="date" :class="{ 'input-error': !newContract.endDate }" />
            <p v-if="!newContract.endDate" class="error-message">Дата окончания обязательна</p>
          </div>
          <div class="form-group">
            <label>Часы/день:</label>
            <input v-model.number="newContract.dailyWorkHours" type="number" :class="{ 'input-error': !newContract.dailyWorkHours }" />
            <p v-if="!newContract.dailyWorkHours" class="error-message">Часы/день обязательны</p>
          </div>
          <div class="form-group">
            <label>Местоположение:</label>
            <input v-model="newContract.objectLocation" type="text" :class="{ 'input-error': !newContract.objectLocation }" />
            <p v-if="!newContract.objectLocation" class="error-message">Местоположение обязательно</p>
          </div>
          <div class="form-group">
            <label>Виды работ:</label>
            <input v-model="newContract.workTypes" type="text" :class="{ 'input-error': !newContract.workTypes }" />
            <p v-if="!newContract.workTypes" class="error-message">Виды работ обязательны</p>
          </div>
          <div class="form-group">
            <label>Статус:</label>
            <select v-model="newContract.status">
              <option value="действует">Действует</option>
              <option value="завершен">Завершен</option>
              <option value="расторгнут">Расторгнут</option>
            </select>
          </div>
          <div class="form-group">
            <label>PDF URL:</label>
            <input v-model="newContract.pdfUrl" type="text" :class="{ 'input-error': !newContract.pdfUrl }" />
            <p v-if="!newContract.pdfUrl" class="error-message">URL PDF обязателен</p>
          </div>
        </div>
        <div class="popup-buttons">
          <button @click="addContract" class="save-btn" :disabled="!isNewContractValid">Сохранить</button>
          <button @click="closeAddContractPopup" class="close-btn">Закрыть</button>
        </div>
      </div>
    </div>

    <!-- Попап для редактирования договора -->
    <div v-if="showEditContractPopup" class="popup-overlay">
      <div class="popup-card">
        <h2>Редактировать договор</h2>
        <div class="edit-form">
          <div class="form-group">
            <label>Номер договора:</label>
            <input v-model="editContract.contractNumber" type="text" :class="{ 'input-error': !editContract.contractNumber }" />
            <p v-if="!editContract.contractNumber" class="error-message">Номер договора обязателен</p>
          </div>
          <div class="form-group">
            <label>Организация:</label>
            <select v-model="editContract.organizationId" :class="{ 'input-error': !editContract.organizationId }">
              <option value="">Выберите организацию</option>
              <option v-for="org in organizations" :key="org.id" :value="org.id">{{ org.organizationName }}</option>
            </select>
            <p v-if="!editContract.organizationId" class="error-message">Организация обязательна</p>
          </div>
          <div class="form-group">
            <label>Контакты:</label>
            <input v-model="editContract.contactInfo" type="text" :class="{ 'input-error': !editContract.contactInfo }" />
            <p v-if="!editContract.contactInfo" class="error-message">Контакты обязательны</p>
          </div>
          <div class="form-group">
            <label>Техника:</label>
            <select v-model="editContract.equipmentId" :class="{ 'input-error': !editContract.equipmentId }">
              <option value="">Выберите технику</option>
              <option v-for="equip in equipment" :key="equip.id" :value="equip.id">{{ equip.name }} ({{ equip.inventoryNumber }})</option>
            </select>
            <p v-if="!editContract.equipmentId" class="error-message">Техника обязательна</p>
          </div>
          <div class="form-group">
            <label>Дата начала:</label>
            <input v-model="editContract.startDate" type="date" :class="{ 'input-error': !editContract.startDate }" />
            <p v-if="!editContract.startDate" class="error-message">Дата начала обязательна</p>
          </div>
          <div class="form-group">
            <label>Дата окончания:</label>
            <input v-model="editContract.endDate" type="date" :class="{ 'input-error': !editContract.endDate }" />
            <p v-if="!editContract.endDate" class="error-message">Дата окончания обязательна</p>
          </div>
          <div class="form-group">
            <label>Часы/день:</label>
            <input v-model.number="editContract.dailyWorkHours" type="number" :class="{ 'input-error': !editContract.dailyWorkHours }" />
            <p v-if="!editContract.dailyWorkHours" class="error-message">Часы/день обязательны</p>
          </div>
          <div class="form-group">
            <label>Местоположение:</label>
            <input v-model="editContract.objectLocation" type="text" :class="{ 'input-error': !editContract.objectLocation }" />
            <p v-if="!editContract.objectLocation" class="error-message">Местоположение обязательно</p>
          </div>
          <div class="form-group">
            <label>Виды работ:</label>
            <input v-model="editContract.workTypes" type="text" :class="{ 'input-error': !editContract.workTypes }" />
            <p v-if="!editContract.workTypes" class="error-message">Виды работ обязательны</p>
          </div>
          <div class="form-group">
            <label>Статус:</label>
            <select v-model="editContract.status">
              <option value="действует">Действует</option>
              <option value="завершен">Завершен</option>
              <option value="расторгнут">Расторгнут</option>
            </select>
          </div>
          <div class="form-group">
            <label>PDF URL:</label>
            <input v-model="editContract.pdfUrl" type="text" :class="{ 'input-error': !editContract.pdfUrl }" />
            <p v-if="!editContract.pdfUrl" class="error-message">URL PDF обязателен</p>
          </div>
        </div>
        <div class="popup-buttons">
          <button @click="saveContractChanges" class="save-btn" :disabled="!isEditContractValid">Сохранить</button>
          <button @click="closeEditContractPopup" class="close-btn">Закрыть</button>
        </div>
      </div>
    </div>

    <!-- Попап для подтверждения удаления договора -->
    <div v-if="showDeleteContractPopup" class="popup-overlay">
      <div class="popup-card">
        <h2>Вы точно хотите удалить договор {{ selectedContract.contractNumber }}?</h2>
        <div class="popup-buttons">
          <button @click="confirmDeleteContract" class="confirm-btn">Да</button>
          <button @click="closeDeleteContractPopup" class="cancel-btn">Отмена</button>
        </div>
      </div>
    </div>

    <!-- Попап для добавления техники -->
    <div v-if="showAddEquipmentPopup" class="popup-overlay">
      <div class="popup-card">
        <h2>Добавить технику</h2>
        <div class="edit-form">
          <div class="form-group">
            <label>Тип:</label>
            <select v-model="newEquipment.type" :class="{ 'input-error': !newEquipment.type }">
              <option value="">Выберите тип</option>
              <option v-for="type in equipmentTypes" :key="type" :value="type">{{ type }}</option>
              <option value="custom">Добавить новый тип</option>
            </select>
            <input v-if="newEquipment.type === 'custom'" v-model="newEquipment.customType" type="text" placeholder="Введите новый тип" class="custom-type-input" />
            <p v-if="!newEquipment.type" class="error-message">Тип обязателен</p>
            <p v-if="newEquipment.type === 'custom' && !newEquipment.customType" class="error-message">Введите новый тип</p>
          </div>
          <div class="form-group">
            <label>Название:</label>
            <input v-model="newEquipment.name" type="text" :class="{ 'input-error': !newEquipment.name }" />
            <p v-if="!newEquipment.name" class="error-message">Название техники обязательно</p>
          </div>
          <div class="form-group">
            <label>Инв. номер:</label>
            <input v-model="newEquipment.inventoryNumber" type="text" :class="{ 'input-error': !newEquipment.inventoryNumber }" />
            <p v-if="!newEquipment.inventoryNumber" class="error-message">Инвентарный номер обязателен</p>
          </div>
        </div>
        <div class="popup-buttons">
          <button @click="addEquipment" class="save-btn" :disabled="!isNewEquipmentValid">Сохранить</button>
          <button @click="closeAddEquipmentPopup" class="close-btn">Закрыть</button>
        </div>
      </div>
    </div>

    <!-- Попап для редактирования техники -->
    <div v-if="showEditEquipmentPopup" class="popup-overlay">
      <div class="popup-card">
        <h2>Редактировать технику</h2>
        <div class="edit-form">
          <div class="form-group">
            <label>Тип:</label>
            <select v-model="editEquipment.type" :class="{ 'input-error': !editEquipment.type }">
              <option value="">Выберите тип</option>
              <option v-for="type in equipmentTypes" :key="type" :value="type">{{ type }}</option>
              <option value="custom">Добавить новый тип</option>
            </select>
            <input v-if="editEquipment.type === 'custom'" v-model="editEquipment.customType" type="text" placeholder="Введите новый тип" class="custom-type-input" />
            <p v-if="!editEquipment.type" class="error-message">Тип обязателен</p>
            <p v-if="editEquipment.type === 'custom' && !editEquipment.customType" class="error-message">Введите новый тип</p>
          </div>
          <div class="form-group">
            <label>Название:</label>
            <input v-model="editEquipment.name" type="text" :class="{ 'input-error': !editEquipment.name }" />
            <p v-if="!editEquipment.name" class="error-message">Название техники обязательно</p>
          </div>
          <div class="form-group">
            <label>Инв. номер:</label>
            <input v-model="editEquipment.inventoryNumber" type="text" :class="{ 'input-error': !editEquipment.inventoryNumber }" />
            <p v-if="!editEquipment.inventoryNumber" class="error-message">Инвентарный номер обязателен</p>
          </div>
        </div>
        <div class="popup-buttons">
          <button @click="saveEquipmentChanges" class="save-btn" :disabled="!isEditEquipmentValid">Сохранить</button>
          <button @click="closeEditEquipmentPopup" class="close-btn">Закрыть</button>
        </div>
      </div>
    </div>

    <!-- Попап для подтверждения удаления техники -->
    <div v-if="showDeleteEquipmentPopup" class="popup-overlay">
      <div class="popup-card">
        <h2>Вы точно хотите удалить технику {{ selectedEquipment.name }} ({{ selectedEquipment.inventoryNumber }})?</h2>
        <div class="popup-buttons">
          <button @click="confirmDeleteEquipment" class="confirm-btn">Да</button>
          <button @click="closeDeleteEquipmentPopup" class="cancel-btn">Отмена</button>
        </div>
      </div>
    </div>

    <!-- Попап для подтверждения выхода -->
    <div v-if="showLogoutPopup" class="popup-overlay">
      <div class="popup-card">
        <h2>Вы точно хотите выйти?</h2>
        <div class="popup-buttons">
          <button @click="logout" class="confirm-btn">Да</button>
          <button @click="closeLogoutPopup" class="cancel-btn">Отмена</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminPanelPage',
  data() {
    return {
      activeTab: 'organizations',
      organizations: [],
      managers: [],
      requests: [],
      contracts: [],
      equipment: [],
      equipmentTypes: ['Экскаватор', 'Бульдозер', 'Погрузчик'],
      showEditOrgPopup: false,
      showDeleteOrgPopup: false,
      showAddManagerPopup: false,
      showEditManagerPopup: false,
      showDeleteManagerPopup: false,
      showEditRequestPopup: false,
      showDetailsRequestPopup: false,
      showRejectRequestPopup: false,
      showDeleteRequestPopup: false,
      showAddContractPopup: false,
      showEditContractPopup: false,
      showDeleteContractPopup: false,
      showAddEquipmentPopup: false,
      showEditEquipmentPopup: false,
      showDeleteEquipmentPopup: false,
      showLogoutPopup: false,
      editOrg: {
        id: null,
        logo: '',
        organizationName: '',
        organizationDetails: '',
        email: '',
        phone: ''
      },
      selectedOrg: {},
      newManager: {
        name: '',
        email: '',
        password: '',
        organizationId: ''
      },
      editManager: {
        id: null,
        name: '',
        email: '',
        password: '',
        organizationId: ''
      },
      selectedManager: {},
      editRequest: {
        id: null,
        userId: 1,
        organizationId: '',
        contactInfo: '',
        equipmentId: '',
        startDate: '',
        endDate: '',
        dailyWorkHours: '',
        objectLocation: '',
        workTypes: '',
        status: ''
      },
      selectedRequest: {},
      newContract: {
        userId: 1,
        contractNumber: '',
        organizationId: '',
        contactInfo: '',
        equipmentId: '',
        startDate: '',
        endDate: '',
        dailyWorkHours: '',
        objectLocation: '',
        workTypes: '',
        status: 'действует',
        pdfUrl: ''
      },
      editContract: {
        id: null,
        userId: 1,
        contractNumber: '',
        organizationId: '',
        contactInfo: '',
        equipmentId: '',
        startDate: '',
        endDate: '',
        dailyWorkHours: '',
        objectLocation: '',
        workTypes: '',
        status: '',
        pdfUrl: ''
      },
      selectedContract: {},
      newEquipment: {
        type: '',
        customType: '',
        name: '',
        inventoryNumber: ''
      },
      editEquipment: {
        id: null,
        type: '',
        customType: '',
        name: '',
        inventoryNumber: ''
      },
      selectedEquipment: {},
      // Поисковые запросы
      orgSearchQuery: '',
      managerSearchQuery: '',
      requestSearchQuery: '',
      contractSearchQuery: '',
      equipmentSearchQuery: '',
      // Фильтры
      requestFilter: {
        status: '',
        inventoryNumber: '',
        startDate: '',
        endDate: ''
      },
      contractFilter: {
        status: '',
        inventoryNumber: '',
        startDate: '',
        endDate: ''
      },
      equipmentFilter: {
        type: ''
      }
    };
  },
  computed: {
    isEditOrgValid() {
      return (
        this.editOrg.organizationName &&
        this.editOrg.organizationDetails &&
        this.editOrg.email &&
        this.editOrg.phone
      );
    },
    isNewManagerValid() {
      return (
        this.newManager.name &&
        this.isEmailValid(this.newManager.email) &&
        this.newManager.password &&
        this.newManager.organizationId
      );
    },
    isEditManagerValid() {
      return (
        this.editManager.name &&
        this.isEmailValid(this.editManager.email) &&
        this.editManager.password &&
        this.editManager.organizationId
      );
    },
    isEditRequestValid() {
      return (
        this.editRequest.organizationId &&
        this.editRequest.contactInfo &&
        this.editRequest.equipmentId &&
        this.editRequest.startDate &&
        this.editRequest.endDate &&
        this.editRequest.dailyWorkHours &&
        this.editRequest.objectLocation &&
        this.editRequest.workTypes &&
        this.editRequest.status
      );
    },
    isNewContractValid() {
      return (
        this.newContract.contractNumber &&
        this.newContract.organizationId &&
        this.newContract.contactInfo &&
        this.newContract.equipmentId &&
        this.newContract.startDate &&
        this.newContract.endDate &&
        this.newContract.dailyWorkHours &&
        this.newContract.objectLocation &&
        this.newContract.workTypes &&
        this.newContract.status &&
        this.newContract.pdfUrl
      );
    },
    isEditContractValid() {
      return (
        this.editContract.contractNumber &&
        this.editContract.organizationId &&
        this.editContract.contactInfo &&
        this.editContract.equipmentId &&
        this.editContract.startDate &&
        this.editContract.endDate &&
        this.editContract.dailyWorkHours &&
        this.editContract.objectLocation &&
        this.editContract.workTypes &&
        this.editContract.status &&
        this.editContract.pdfUrl
      );
    },
    isNewEquipmentValid() {
      if (this.newEquipment.type === 'custom') {
        return this.newEquipment.customType && this.newEquipment.name && this.newEquipment.inventoryNumber;
      }
      return this.newEquipment.type && this.newEquipment.name && this.newEquipment.inventoryNumber;
    },
    isEditEquipmentValid() {
      if (this.editEquipment.type === 'custom') {
        return this.editEquipment.customType && this.editEquipment.name && this.editEquipment.inventoryNumber;
      }
      return this.editEquipment.type && this.editEquipment.name && this.editEquipment.inventoryNumber;
    },
    // Фильтрация организаций
    filteredOrganizations() {
      let filtered = this.organizations;
      if (this.orgSearchQuery) {
        const query = this.orgSearchQuery.toLowerCase();
        filtered = filtered.filter(
          org =>
            org.organizationName.toLowerCase().includes(query) ||
            org.email.toLowerCase().includes(query) ||
            org.phone.toLowerCase().includes(query)
        );
      }
      return filtered;
    },
    // Фильтрация менеджеров
    filteredManagers() {
      let filtered = this.managers;
      if (this.managerSearchQuery) {
        const query = this.managerSearchQuery.toLowerCase();
        filtered = filtered.filter(
          manager =>
            manager.name.toLowerCase().includes(query) ||
            manager.email.toLowerCase().includes(query)
        );
      }
      return filtered;
    },
    // Фильтрация заявок
    filteredRequests() {
      let filtered = this.requests;
      if (this.requestSearchQuery) {
        const query = this.requestSearchQuery.toLowerCase();
        filtered = filtered.filter(
          request => request.organizationName.toLowerCase().includes(query)
        );
      }
      if (this.requestFilter.status) {
        filtered = filtered.filter(
          request => request.status === this.requestFilter.status
        );
      }
      if (this.requestFilter.inventoryNumber) {
        filtered = filtered.filter(
          request => request.inventoryNumber === this.requestFilter.inventoryNumber
        );
      }
      if (this.requestFilter.startDate) {
        filtered = filtered.filter(
          request => new Date(request.startDate) >= new Date(this.requestFilter.startDate)
        );
      }
      if (this.requestFilter.endDate) {
        filtered = filtered.filter(
          request => new Date(request.endDate) <= new Date(this.requestFilter.endDate)
        );
      }
      return filtered;
    },
    // Фильтрация договоров
    filteredContracts() {
      let filtered = this.contracts;
      if (this.contractSearchQuery) {
        const query = this.contractSearchQuery.toLowerCase();
        filtered = filtered.filter(
          contract =>
            contract.contractNumber.toLowerCase().includes(query) ||
            contract.organizationName.toLowerCase().includes(query)
        );
      }
      if (this.contractFilter.status) {
        filtered = filtered.filter(
          contract => contract.status === this.contractFilter.status
        );
      }
      if (this.contractFilter.inventoryNumber) {
        filtered = filtered.filter(
          contract => contract.inventoryNumber === this.contractFilter.inventoryNumber
        );
      }
      if (this.contractFilter.startDate) {
        filtered = filtered.filter(
          contract => new Date(contract.startDate) >= new Date(this.contractFilter.startDate)
        );
      }
      if (this.contractFilter.endDate) {
        filtered = filtered.filter(
          contract => new Date(contract.endDate) <= new Date(this.contractFilter.endDate)
        );
      }
      return filtered;
    },
    // Фильтрация техники
    filteredEquipment() {
      let filtered = this.equipment;
      if (this.equipmentSearchQuery) {
        const query = this.equipmentSearchQuery.toLowerCase();
        filtered = filtered.filter(
          equip =>
            equip.name.toLowerCase().includes(query) ||
            equip.inventoryNumber.toLowerCase().includes(query)
        );
      }
      if (this.equipmentFilter.type) {
        filtered = filtered.filter(
          equip => equip.type === this.equipmentFilter.type
        );
      }
      return filtered;
    }
  },
  mounted() {
    setTimeout(() => {
      this.organizations = [
        {
          id: 1,
          logo: '',
          organizationName: 'ООО Рога и Копыта',
          organizationDetails: 'ИНН: 1234567890',
          email: 'ivan@example.com',
          phone: '+79991234567'
        },
        {
          id: 2,
          logo: '',
          organizationName: 'ООО Тестовая Компания',
          organizationDetails: 'ИНН: 5555555555',
          email: 'test@example.com',
          phone: '+79995555555'
        }
      ];

      this.managers = [
        {
          id: 1,
          name: 'Иван Иванов',
          email: 'ivan@example.com',
          password: 'password123',
          organizationId: 1
        },
        {
          id: 2,
          name: 'Тест Менеджер',
          email: 'test.manager@example.com',
          password: 'test123',
          organizationId: 1
        }
      ];

      this.requests = [
        {
          id: 1,
          userId: 1,
          organizationName: 'ООО Рога и Копыта',
          contactInfo: 'ИНН: 1234567890, тел: +79991234567, email: ivan@example.com',
          equipmentName: 'JCB 3CX',
          inventoryNumber: 'JCB-001',
          startDate: '2025-05-01',
          endDate: '2025-05-03',
          dailyWorkHours: 8,
          objectLocation: 'г. Москва, ул. Примерная, д. 1',
          workTypes: 'Земляные работы, планировка территории',
          status: 'на рассмотрении'
        },
        {
          id: 2,
          userId: 2,
          organizationName: 'ООО Тестовая Компания',
          contactInfo: 'ИНН: 5555555555, тел: +79995555555, email: test@example.com',
          equipmentName: 'JCB 3CX',
          inventoryNumber: 'JCB-002',
          startDate: '2025-05-10',
          endDate: '2025-05-12',
          dailyWorkHours: 6,
          objectLocation: 'г. Казань, ул. Примерная, д. 3',
          workTypes: 'Строительство фундамента',
          status: 'отклонена'
        }
      ];

      this.contracts = [
        {
          id: 1,
          userId: 1,
          organizationName: 'ООО Рога и Копыта',
          contractNumber: 'ДГ-001/2025',
          contactInfo: 'ИНН: 1234567890, тел: +79991234567, email: ivan@example.com',
          equipmentName: 'JCB 3CX',
          inventoryNumber: 'JCB-001',
          startDate: '2025-05-01',
          endDate: '2025-05-03',
          dailyWorkHours: 8,
          objectLocation: 'г. Москва, ул. Примерная, д. 1',
          workTypes: 'Земляные работы, планировка территории',
          status: 'действует',
          pdfUrl: 'https://docs.google.com/viewer?url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
        },
        {
          id: 2,
          userId: 2,
          organizationName: 'ООО Тестовая Компания',
          contractNumber: 'ДГ-003/2025',
          contactInfo: 'ИНН: 5555555555, тел: +79995555555, email: test@example.com',
          equipmentName: 'JCB 3CX',
          inventoryNumber: 'JCB-002',
          startDate: '2025-05-10',
          endDate: '2025-05-12',
          dailyWorkHours: 6,
          objectLocation: 'г. Казань, ул. Примерная, д. 3',
          workTypes: 'Строительство фундамента',
          status: 'расторгнут',
          pdfUrl: 'https://docs.google.com/viewer?url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
        }
      ];

      this.equipment = [
        {
          id: 1,
          type: 'Экскаватор',
          name: 'JCB 3CX',
          inventoryNumber: 'JCB-001'
        },
        {
          id: 2,
          type: 'Экскаватор',
          name: 'JCB 3CX',
          inventoryNumber: 'JCB-002'
        },
        {
          id: 3,
          type: 'Бульдозер',
          name: 'CAT D6T',
          inventoryNumber: 'CAT-01'
        }
      ];
    }, 500);
  },
  methods: {
    handleLogoUpload(formType) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          if (formType === 'editOrg') {
            this.editOrg.logo = e.target.result;
          }
        };
        reader.readAsDataURL(file);
      }
    },
    isEmailValid(email) {
      return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    getOrgNameById(orgId) {
      const org = this.organizations.find(o => o.id === orgId);
      return org ? org.organizationName : 'Не указана';
    },
    getOrgIdByName(orgName) {
      const org = this.organizations.find(o => o.organizationName === orgName);
      return org ? org.id : null;
    },
    getEquipmentById(equipId) {
      return this.equipment.find(eq => eq.id === equipId) || {};
    },
    openEditOrgPopup(org) {
      this.editOrg = { ...org };
      this.showEditOrgPopup = true;
    },
    closeEditOrgPopup() {
      this.showEditOrgPopup = false;
    },
    saveOrgChanges() {
      if (this.isEditOrgValid) {
        const index = this.organizations.findIndex(org => org.id === this.editOrg.id);
        if (index !== -1) {
          this.organizations[index] = { ...this.editOrg };
        }
        this.closeEditOrgPopup();
      }
    },
    openDeleteOrgPopup(org) {
      this.selectedOrg = org;
      this.showDeleteOrgPopup = true;
    },
    closeDeleteOrgPopup() {
      this.showDeleteOrgPopup = false;
      this.selectedOrg = {};
    },
    confirmDeleteOrg() {
      this.organizations = this.organizations.filter(org => org.id !== this.selectedOrg.id);
      this.closeDeleteOrgPopup();
    },
    openAddManagerPopup() {
      this.newManager = {
        name: '',
        email: '',
        password: '',
        organizationId: ''
      };
      this.showAddManagerPopup = true;
    },
    closeAddManagerPopup() {
      this.showAddManagerPopup = false;
    },
    addManager() {
      if (this.isNewManagerValid) {
        this.managers.push({
          id: this.managers.length + 1,
          ...this.newManager
        });
        this.closeAddManagerPopup();
      }
    },
    openEditManagerPopup(manager) {
      this.editManager = { ...manager };
      this.showEditManagerPopup = true;
    },
    closeEditManagerPopup() {
      this.showEditManagerPopup = false;
    },
    saveManagerChanges() {
      if (this.isEditManagerValid) {
        const index = this.managers.findIndex(m => m.id === this.editManager.id);
        if (index !== -1) {
          this.managers[index] = { ...this.editManager };
        }
        this.closeEditManagerPopup();
      }
    },
    openDeleteManagerPopup(manager) {
      this.selectedManager = manager;
      this.showDeleteManagerPopup = true;
    },
    closeDeleteManagerPopup() {
      this.showDeleteManagerPopup = false;
      this.selectedManager = {};
    },
    confirmDeleteManager() {
      this.managers = this.managers.filter(m => m.id !== this.selectedManager.id);
      this.closeDeleteManagerPopup();
    },
    addRequest() {
      this.$router.push('/request-form');
    },
    openEditRequestPopup(request) {
      const orgId = this.getOrgIdByName(request.organizationName);
      const equip = this.equipment.find(eq => eq.inventoryNumber === request.inventoryNumber);
      this.editRequest = {
        id: request.id,
        userId: request.userId,
        organizationId: orgId || '',
        contactInfo: request.contactInfo,
        equipmentId: equip ? equip.id : '',
        startDate: request.startDate,
        endDate: request.endDate,
        dailyWorkHours: request.dailyWorkHours,
        objectLocation: request.objectLocation,
        workTypes: request.workTypes,
        status: request.status
      };
      this.showEditRequestPopup = true;
    },
    closeEditRequestPopup() {
      this.showEditRequestPopup = false;
    },
    saveRequestChanges() {
      if (this.isEditRequestValid) {
        const org = this.organizations.find(o => o.id === this.editRequest.organizationId);
        const equip = this.getEquipmentById(this.editRequest.equipmentId);
        const index = this.requests.findIndex(req => req.id === this.editRequest.id);
        if (index !== -1) {
          this.requests[index] = {
            id: this.editRequest.id,
            userId: this.editRequest.userId,
            organizationName: org ? org.organizationName : '',
            contactInfo: this.editRequest.contactInfo,
            equipmentName: equip.name || '',
            inventoryNumber: equip.inventoryNumber || '',
            startDate: this.editRequest.startDate,
            endDate: this.editRequest.endDate,
            dailyWorkHours: this.editRequest.dailyWorkHours,
            objectLocation: this.editRequest.objectLocation,
            workTypes: this.editRequest.workTypes,
            status: this.editRequest.status
          };
        }
        this.closeEditRequestPopup();
      }
    },
    openDetailsRequestPopup(request) {
      this.selectedRequest = request;
      this.showDetailsRequestPopup = true;
    },
    closeDetailsRequestPopup() {
      this.showDetailsRequestPopup = false;
      this.selectedRequest = {};
    },
    updateRequestStatus(request) {
      const index = this.requests.findIndex(req => req.id === request.id);
      if (index !== -1) {
        this.requests[index].status = request.status;
      }
    },
    approveRequest(request) {
      const index = this.requests.findIndex(req => req.id === request.id);
      if (index !== -1) {
        this.requests[index].status = 'подтверждена';
      }
    },
    openRejectRequestPopup(request) {
      this.selectedRequest = request;
      this.showRejectRequestPopup = true;
    },
    closeRejectRequestPopup() {
      this.showRejectRequestPopup = false;
      this.selectedRequest = {};
    },
    confirmRejectRequest() {
      const index = this.requests.findIndex(req => req.id === this.selectedRequest.id);
      if (index !== -1) {
        this.requests[index].status = 'отклонена';
      }
      this.closeRejectRequestPopup();
    },
    openDeleteRequestPopup(request) {
      this.selectedRequest = request;
      this.showDeleteRequestPopup = true;
    },
    closeDeleteRequestPopup() {
      this.showDeleteRequestPopup = false;
      this.selectedRequest = {};
    },
    confirmDeleteRequest() {
      this.requests = this.requests.filter(req => req.id !== this.selectedRequest.id);
      this.closeDeleteRequestPopup();
    },
    openAddContractPopup() {
      this.newContract = {
        userId: 1,
        contractNumber: '',
        organizationId: '',
        contactInfo: '',
        equipmentId: '',
        startDate: '',
        endDate: '',
        dailyWorkHours: '',
        objectLocation: '',
        workTypes: '',
        status: 'действует',
        pdfUrl: ''
      };
      this.showAddContractPopup = true;
    },
    closeAddContractPopup() {
      this.showAddContractPopup = false;
    },
    addContract() {
      if (this.isNewContractValid) {
        const org = this.organizations.find(o => o.id === this.newContract.organizationId);
        const equip = this.getEquipmentById(this.newContract.equipmentId);
        this.contracts.push({
          id: this.contracts.length + 1,
          userId: this.newContract.userId,
          contractNumber: this.newContract.contractNumber,
          organizationName: org ? org.organizationName : '',
          contactInfo: this.newContract.contactInfo,
          equipmentName: equip.name || '',
          inventoryNumber: equip.inventoryNumber || '',
          startDate: this.newContract.startDate,
          endDate: this.newContract.endDate,
          dailyWorkHours: this.newContract.dailyWorkHours,
          objectLocation: this.newContract.objectLocation,
          workTypes: this.newContract.workTypes,
          status: this.newContract.status,
          pdfUrl: this.newContract.pdfUrl
        });
        this.closeAddContractPopup();
      }
    },
    openEditContractPopup(contract) {
      const orgId = this.getOrgIdByName(contract.organizationName);
      const equip = this.equipment.find(eq => eq.inventoryNumber === contract.inventoryNumber);
      this.editContract = {
        id: contract.id,
        userId: contract.userId,
        contractNumber: contract.contractNumber,
        organizationId: orgId || '',
        contactInfo: contract.contactInfo,
        equipmentId: equip ? equip.id : '',
        startDate: contract.startDate,
        endDate: contract.endDate,
        dailyWorkHours: contract.dailyWorkHours,
        objectLocation: contract.objectLocation,
        workTypes: contract.workTypes,
        status: contract.status,
        pdfUrl: contract.pdfUrl
      };
      this.showEditContractPopup = true;
    },
    closeEditContractPopup() {
      this.showEditContractPopup = false;
    },
    saveContractChanges() {
      if (this.isEditContractValid) {
        const org = this.organizations.find(o => o.id === this.editContract.organizationId);
        const equip = this.getEquipmentById(this.editContract.equipmentId);
        const index = this.contracts.findIndex(con => con.id === this.editContract.id);
        if (index !== -1) {
          this.contracts[index] = {
            id: this.editContract.id,
            userId: this.editContract.userId,
            contractNumber: this.editContract.contractNumber,
            organizationName: org ? org.organizationName : '',
            contactInfo: this.editContract.contactInfo,
            equipmentName: equip.name || '',
            inventoryNumber: equip.inventoryNumber || '',
            startDate: this.editContract.startDate,
            endDate: this.editContract.endDate,
            dailyWorkHours: this.editContract.dailyWorkHours,
            objectLocation: this.editContract.objectLocation,
            workTypes: this.editContract.workTypes,
            status: this.editContract.status,
            pdfUrl: this.editContract.pdfUrl
          };
        }
        this.closeEditContractPopup();
      }
    },
    openDeleteContractPopup(contract) {
      this.selectedContract = contract;
      this.showDeleteContractPopup = true;
    },
    closeDeleteContractPopup() {
      this.showDeleteContractPopup = false;
      this.selectedContract = {};
    },
    confirmDeleteContract() {
      this.contracts = this.contracts.filter(con => con.id !== this.selectedContract.id);
      this.closeDeleteContractPopup();
    },
    updateContractStatus(contract) {
      const index = this.contracts.findIndex(con => con.id === contract.id);
      if (index !== -1) {
        this.contracts[index].status = contract.status;
      }
    },
    openAddEquipmentPopup() {
      this.newEquipment = {
        type: '',
        customType: '',
        name: '',
        inventoryNumber: ''
      };
      this.showAddEquipmentPopup = true;
    },
    closeAddEquipmentPopup() {
      this.showAddEquipmentPopup = false;
    },
    addEquipment() {
      if (this.isNewEquipmentValid) {
        let type = this.newEquipment.type;
        if (this.newEquipment.type === 'custom' && this.newEquipment.customType) {
          type = this.newEquipment.customType;
          if (!this.equipmentTypes.includes(type)) {
            this.equipmentTypes.push(type);
          }
        }
        this.equipment.push({
          id: this.equipment.length + 1,
          type,
          name: this.newEquipment.name,
          inventoryNumber: this.newEquipment.inventoryNumber
        });
        this.closeAddEquipmentPopup();
      }
    },
    openEditEquipmentPopup(equip) {
      this.editEquipment = { ...equip, customType: '' };
      this.showEditEquipmentPopup = true;
    },
    closeEditEquipmentPopup() {
      this.showEditEquipmentPopup = false;
    },
    saveEquipmentChanges() {
      if (this.isEditEquipmentValid) {
        let type = this.editEquipment.type;
        if (this.editEquipment.type === 'custom' && this.editEquipment.customType) {
          type = this.editEquipment.customType;
          if (!this.equipmentTypes.includes(type)) {
            this.equipmentTypes.push(type);
          }
        }
        const index = this.equipment.findIndex(eq => eq.id === this.editEquipment.id);
        if (index !== -1) {
          this.equipment[index] = { ...this.editEquipment, type };
        }
        this.closeEditEquipmentPopup();
      }
    },
    openDeleteEquipmentPopup(equip) {
      this.selectedEquipment = equip;
      this.showDeleteEquipmentPopup = true;
    },
    closeDeleteEquipmentPopup() {
      this.showDeleteEquipmentPopup = false;
      this.selectedEquipment = {};
    },
    confirmDeleteEquipment() {
      this.equipment = this.equipment.filter(eq => eq.id !== this.selectedEquipment.id);
      this.closeDeleteEquipmentPopup();
    },
    openLogoutPopup() {
      this.showLogoutPopup = true;
    },
    closeLogoutPopup() {
      this.showLogoutPopup = false;
    },
    logout() {
      this.$router.push('/login');
    },
    getRequestStatusClass(status) {
      return {
        'status-pending': status === 'на рассмотрении',
        'status-approved': status === 'подтверждена',
        'status-rejected': status === 'отклонена'
      };
    },
    getContractStatusClass(status) {
      return {
        'status-active': status === 'действует',
        'status-completed': status === 'завершен',
        'status-terminated': status === 'расторгнут'
      };
    }
  }
};
</script>

<style scoped>
/* Основной контейнер */
.container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

/* Заголовок */
.title {
  text-align: center;
  font-size: 2rem;
  color: #333;
  margin-bottom: 30px;
}

/* Вкладки */
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tabs button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background-color: #e0e0e0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.tabs button.active {
  background-color: #007BFF;
  color: white;
}

.tab-content {
  margin-bottom: 40px;
}

.tab-content h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 20px;
}

/* Фильтры */
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 5px;
}

.filter-group input,
.filter-group select {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 0.9rem;
  min-width: 200px;
}

.filter-group input:focus,
.filter-group select:focus {
  border-color: #007BFF;
  outline: none;
}

.search-group {
  flex-grow: 1;
}

.search-group input {
  width: 100%;
}

/* Таблицы */
.org-table,
.manager-table,
.request-table,
.contract-table,
.equipment-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.org-table th,
.org-table td,
.manager-table th,
.manager-table td,
.request-table th,
.request-table td,
.contract-table th,
.contract-table td,
.equipment-table th,
.equipment-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.org-table th,
.manager-table th,
.request-table th,
.contract-table th,
.equipment-table th {
  background-color: #35170C;
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.9rem;
}

.org-table tbody tr,
.manager-table tbody tr,
.request-table tbody tr,
.contract-table tbody tr,
.equipment-table tbody tr {
  transition: background-color 0.2s;
}

.org-table tbody tr:hover,
.manager-table tbody tr:hover,
.request-table tbody tr:hover,
.contract-table tbody tr:hover,
.equipment-table tbody tr:hover {
  background-color: #f9f9f9;
}

/* Логотип в таблице организаций */
.logo-img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}

/* Кнопки действий */
.edit-btn,
.delete-btn,
.approve-btn,
.reject-btn,
.details-btn,
.open-btn,
.add-btn,
.logout-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
  margin-right: 5px;
}

.edit-btn {
  background-color: #007BFF;
  color: white;
}

.edit-btn:hover {
  background-color: #0056b3;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.delete-btn:hover {
  background-color: #b02a37;
}

.approve-btn {
  background-color: #28a745;
  color: white;
}

.approve-btn:hover {
  background-color: #218838;
}

.reject-btn {
  background-color: #ff6f61;
  color: white;
}

.reject-btn:hover {
  background-color: #e65a4f;
}

.details-btn {
  background-color: #6c757d;
  color: white;
}

.details-btn:hover {
  background-color: #565e64;
}

.open-btn {
  background-color: #17a2b8;
  color: white;
  text-decoration: none;
}

.open-btn:hover {
  background-color: #138496;
}

.add-btn {
  background-color: #28a745;
  color: white;
  margin-bottom: 15px;
}

.add-btn:hover {
  background-color: #218838;
}

.logout-btn {
  background-color: #dc3545;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
}

.logout-btn:hover {
  background-color: #b02a37;
}

/* Секция выхода */
.logout-section {
  text-align: center;
  margin-top: 40px;
}

/* Попапы */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.popup-card h2 {
  font-size: 1.4rem;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

/* Форма редактирования в попапе */
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 5px;
}

.form-group input,
.form-group select {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 0.9rem;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #007BFF;
  outline: none;
}

.input-error {
  border-color: #dc3545 !important;
}

.error-message {
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 5px;
}

/* Предпросмотр логотипа */
.logo-preview {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  margin-top: 10px;
}

/* Кнопки в попапе */
.popup-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.save-btn,
.close-btn,
.confirm-btn,
.cancel-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.save-btn {
  background-color: #28a745;
  color: white;
}

.save-btn:hover {
  background-color: #218838;
}

.save-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.close-btn,
.cancel-btn {
  background-color: #6c757d;
  color: white;
}

.close-btn:hover,
.cancel-btn:hover {
  background-color: #565e64;
}

.confirm-btn {
  background-color: #dc3545;
  color: white;
}

.confirm-btn:hover {
  background-color: #b02a37;
}

/* Статусы заявок */
.status-pending {
  color: #ff6f61;
}

.status-approved {
  color: #28a745;
}

.status-rejected {
  color: #dc3545;
}

/* Статусы договоров */
.status-active {
  color: #28a745;
}

.status-completed {
  color: #6c757d;
}

.status-terminated {
  color: #dc3545;
}

/* Детали заявки */
.details-content p {
  margin: 10px 0;
  font-size: 0.9rem;
  color: #333;
}

.details-content strong {
  color: #555;
}

/* Поле для ввода нового типа техники */
.custom-type-input {
  margin-top: 10px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 0.9rem;
}

.custom-type-input:focus {
  border-color: #007BFF;
  outline: none;
}

/* Стили для скролла в попапе */
.popup-card::-webkit-scrollbar {
  width: 8px;
}

.popup-card::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.popup-card::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.popup-card::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>