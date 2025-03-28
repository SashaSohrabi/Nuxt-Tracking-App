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
      :amount="incomeTotal"
      :last-amount="previousIncomeTotal"
      :loading="pending"
      :key="incomeTotal"
    />
    <Trend
      color="red"
      title="Expense"
      :amount="expenseTotal"
      :last-amount="previousExpenseTotal"
      :loading="pending"
      :key="expenseTotal"
    />
    <Trend
      color="green"
      title="Investments"
      :amount="4000"
      :last-amount="3000"
      :loading="pending"
    />
    <Trend
      color="red"
      title="Saving"
      :amount="4000"
      :last-amount="4100"
      :loading="pending"
    />
  </section>

  <section class="flex justify-between mb-10">
    <div>
      <h2 class="text-2xl font-extrabold">Transactions</h2>
      <div class="text-gray-500 dark:text-gray-400">
        You have {{ incomeCount }} incomes and {{ expenseCount }} expenses in
        this period.
      </div>
    </div>
    <div>
      <TransactionModal v-model="isOpen" @saved="refresh" />
      <UButton
        icon="i-heroicons-plus-circle"
        color="white"
        variant="solid"
        label="Add"
        @click="isOpen = true"
      />
    </div>
  </section>

  <section v-if="!pending">
    <div v-for="(transactionOnDay, date) in byDate" :key="date" class="mb-10">
      <DailyTransactionSummary :date="date" :transactions="transactionOnDay" />
      <Transaction
        v-for="transaction in transactionOnDay"
        :key="transaction.id"
        :transaction="transaction"
        @deleted="refresh"
        @edited="refresh"
      />
    </div>
  </section>
  <section v-else>
    <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
  </section>
</template>

<script setup lang="ts">
import { TRANSACTION_VIEW_OPTIONS } from '~/utils/constants';
import { useFetchTransactions } from '~/composables/useFetchTransactions';

const user = useSupabaseUser();
const selectedView = ref<string>(
  user.value?.user_metadata.transaction_view ?? TRANSACTION_VIEW_OPTIONS[0]
);
const isOpen = ref(false);
const { current, previous } = useSelectedTimePeriod(selectedView);

const {
  transactions: {
    grouped: { byDate },
    incomeCount,
    expenseCount,
    incomeTotal,
    expenseTotal,
  },
  refresh,
  pending,
} = useFetchTransactions(current);

const {
  transactions: {
    incomeTotal: previousIncomeTotal,
    expenseTotal: previousExpenseTotal,
  },
  refresh: refreshPrevious,
} = useFetchTransactions(previous);

await Promise.all([refresh(), refreshPrevious()]);
</script>
