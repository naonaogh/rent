<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="text-center">
          <v-card-title class="text-h4">
            404 - Страница не найдена
          </v-card-title>
          <v-card-text>
            <p class="text-body-1">
              Извините, запрашиваемая страница не существует.
            </p>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              to="/"
              block
            >
              Вернуться на главную
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// Компонент не требует дополнительной логики
</script>

<style scoped>
.v-card {
  margin-top: 2rem;
}
</style>
