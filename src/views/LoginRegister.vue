<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">
        {{ isLoginMode ? 'Вход' : 'Регистрация' }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block mb-1">Email:</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full border px-3 py-2 rounded-md"
          />
        </div>

        <div>
          <label class="block mb-1">Пароль:</label>
          <input
            v-model="form.password"
            type="password"
            required
            class="w-full border px-3 py-2 rounded-md"
          />
        </div>

        <div v-if="!isLoginMode" class="space-y-4">
          <div>
            <label class="block mb-1">Название организации:</label>
            <input
              v-model="form.organization_name"
              type="text"
              required
              class="w-full border px-3 py-2 rounded-md"
            />
          </div>

          <div>
            <label class="block mb-1">Телефон:</label>
            <input
              v-model="form.phone_number"
              type="text"
              required
              class="w-full border px-3 py-2 rounded-md"
            />
          </div>

          <div>
            <label class="block mb-1">Дополнительная информация:</label>
            <textarea
              v-model="form.info"
              class="w-full border px-3 py-2 rounded-md"
            ></textarea>
          </div>
        </div>

        <div v-if="errorMessage" class="text-red-500 text-sm">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          class="w-full bg-[#35170c] text-white py-2 rounded-md hover:bg-[#f46430] transition"
        >
          {{ isLoginMode ? 'Войти' : 'Зарегистрироваться' }}
        </button>
      </form>

      <p class="mt-4 text-center text-sm">
        {{ isLoginMode ? 'Нет аккаунта?' : 'Уже есть аккаунт?' }}
        <button @click="toggleMode" class="text-[#f46430] hover:underline ml-1">
          {{ isLoginMode ? 'Зарегистрироваться' : 'Войти' }}
        </button>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/axios';

const router = useRouter();

const isLoginMode = ref(true);
const errorMessage = ref('');

const form = ref({
  email: '',
  password: '',
  organization_name: '',
  phone_number: '',
  info: '',
});

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value;
  errorMessage.value = '';
};

const handleSubmit = async () => {
  try {
    errorMessage.value = '';

    if (isLoginMode.value) {
      const response = await api.post('/login', {
        email: form.value.email,
        password: form.value.password,
      });

      const token = response.data.access_token;
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', response.data.role);
      router.push('/');
    } else {
      await api.post('/register', {
        email: form.value.email,
        password: form.value.password,
        organization_name: form.value.organization_name,
        phone_number: form.value.phone_number,
        info: form.value.info,
      });

      const loginResponse = await api.post('/login', {
        email: form.value.email,
        password: form.value.password,
      });

      const token = loginResponse.data.access_token;
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', loginResponse.data.role);
      router.push('/profile');
    }
  } catch (error) {
    console.error(error);
    if (error.response?.data?.detail) {
      errorMessage.value = error.response.data.detail;
    } else {
      errorMessage.value = 'Произошла ошибка. Попробуйте снова.';
    }
  }
};
</script>

<style scoped>
@media (max-width: 600px) {
  .w-full.max-w-md {
    width: 90%;
    padding: 1rem;
  }
}
</style>
