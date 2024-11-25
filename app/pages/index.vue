<template>
  <section class="flex justify-between items-center mb-10">
    <h1 class="text-4xl font-extrabold">Summary</h1>
    <div>
      <USelectMenu v-model="selectedView" :options="TRANSACTION_VIEW_OPTIONS" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { TRANSACTION_VIEW_OPTIONS } from '~/utils/constants';
const selectedView = ref<string>(TRANSACTION_VIEW_OPTIONS[1]);
</script>
