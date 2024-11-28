<template>
  <div
    class="grid grid-cols-2 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-bold"
  >
    <div class="flex items-center justify-between">{{ props.date }}</div>
    <div class="flex items-center justify-end mr-10">{{ currency }}</div>
  </div>
</template>

<script setup lang="ts">
import type { Transaction } from '~/types/index';
const props = defineProps<{
  date: string;
  transactions: Transaction[];
}>();

const sum = computed(() => {
  return props.transactions.reduce(
    (sum, transaction) =>
      sum +
      (transaction.type === 'Income'
        ? transaction.amount
        : -transaction.amount),
    0
  );
});

const { currency } = useCurrency(sum);
</script>
