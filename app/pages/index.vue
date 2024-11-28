<template>
  <section class="flex justify-between items-center mb-10">
    <h1 class="text-4xl font-extrabold">Summary</h1>
    <div>
      <USelectMenu v-model="selectedView" :options="TRANSACTION_VIEW_OPTIONS" />
    </div>
  </section>

  <section
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10"
  >
    <Trend
      color="green"
      title="Income"
      :amount="4000"
      :last-amount="3000"
      :loading="isLoading"
    />
    <Trend
      color="red"
      title="Expense"
      :amount="4000"
      :last-amount="5000"
      :loading="isLoading"
    />
    <Trend
      color="green"
      title="Investments"
      :amount="4000"
      :last-amount="3000"
      :loading="isLoading"
    />
    <Trend
      color="red"
      title="Saving"
      :amount="4000"
      :last-amount="4100"
      :loading="isLoading"
    />
  </section>

  <section v-if="!isLoading">
    <div
      v-for="(transactionOnDay, date) in transactionsGroupedByDate"
      :key="date"
      class="mb-10"
    >
      <DailyTransactionSummary :date="date" :transactions="transactionOnDay" />
      <Transaction
        v-for="transaction in transactionOnDay"
        :key="transaction.id"
        :transaction="transaction"
        @deleted="refreshTransactions"
      />
    </div>
  </section>
  <section v-else>
    <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i"/>
  </section>
</template>

<script setup lang="ts">
import { TRANSACTION_VIEW_OPTIONS } from '~/utils/constants';
import type { Transaction } from '~/types/index';

const selectedView = ref<string>(TRANSACTION_VIEW_OPTIONS[1]);
const transactions = ref<Transaction[]>([]);
const supabase = useSupabaseClient();
const isLoading = ref(false);

const fetchTransactions = async () => {
  try {
    isLoading.value = true;
    const { data } = await useAsyncData<Transaction[] | null>(
      'transactions',
      async () => {
        const { data, error } = await supabase.from('transactions').select();

        if (error) {
          console.error('Error fetching transactions:', error);
          return null;
        }
        return data;
      }
    );

    return data.value;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const refreshTransactions = async () => transactions.value = await fetchTransactions() ?? [];

await refreshTransactions();

const transactionsGroupedByDate = computed(() => {
  if (!transactions.value) return {};

  return transactions.value.reduce<Record<string, Transaction[]>>(
    (acc, { created_at, ...transaction }) => {
      const date = created_at
        ? new Date(created_at).toISOString().split('T')[0]
        : null;

      if (date) {
        acc[date] = acc[date] || [];
        acc[date].push({ created_at, ...transaction });
      }

      return acc;
    },
    {}
  );
});
</script>
