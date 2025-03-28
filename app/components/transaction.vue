<template>
  <div
    class="grid grid-cols-3 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100"
  >
    <div class="flex items-center justify-between space-x-4 col-span-2">
      <div class="flex items-center space-x-1">
        <UIcon :name="icon" :class="[iconColor]" />
        <div>{{ transaction.description }}</div>
      </div>
      <UBadge color="white" v-if="transaction.category">{{
        transaction.category
      }}</UBadge>
    </div>
    <div class="flex items-center justify-end space-x-2">
      <div>{{ currency }}</div>
      <div>
        <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
          <UButton
            color="white"
            variant="ghost"
            trailing-icon="i-heroicons-ellipsis-horizontal"
            :loading="isLoading"
          />
          <TransactionModal
            v-model="isOpen"
            :transaction="props.transaction"
            @saved="emit('edited')"
          />
        </UDropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Transaction } from '~/types/index';
const props = defineProps<{
  transaction: Transaction;
}>();
const emit = defineEmits<{
  (event: 'deleted', id: number): void;
  (event: 'edited'): void;
}>();
const { currency } = useCurrency(props.transaction.amount);
const isLoading = ref(false);
const isOpen = ref(false);
const { toastSuccess, toastError } = useAppToast();
const supabase = useSupabaseClient();

watch(
  () => props.transaction,
  (newTransaction) => {
    if (newTransaction) {
      currency.value = useCurrency(newTransaction.amount).currency.value;
    }
  }
);

const deleteTransaction = async () => {
  isLoading.value = true;

  try {
    await supabase.from('transactions').delete().eq('id', props.transaction.id);

    toastSuccess({
      title: 'Transaction deleted',
      description: 'The transaction has been deleted.',
    });
    emit('deleted', props.transaction.id);
  } catch (e) {
    toastError({
      title: 'Error deleting transaction',
      description: 'An error occurred while deleting the transaction.',
    });
  } finally {
    isLoading.value = false;
  }
};

const items = [
  [
    {
      label: 'Edit',
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => (isOpen.value = true),
    },
    {
      label: 'Delete',
      icon: 'i-heroicons-trash-20-solid',
      click: deleteTransaction,
    },
  ],
];

const isIncome = computed(() => props.transaction.type === 'Income');
const icon = computed(() =>
  isIncome.value ? 'i-heroicons-arrow-up-right' : 'i-heroicons-arrow-down-left'
);
const iconColor = computed(() =>
  isIncome.value ? 'text-green-600' : 'text-red-600'
);
</script>
