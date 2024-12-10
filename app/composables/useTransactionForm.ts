import type { Transaction, TransactionState } from '~/types/index';

export function useTransactionForm(props: { transaction?: Transaction }) {
  const isEditing = computed(() => !!props.transaction);

  const initialState = computed((): TransactionState => {
    return isEditing.value
      ? {
          type: props.transaction?.type || '',
          amount: props.transaction?.amount || 0,
          created_at: props.transaction?.created_at.split('T')[0] || '',
          description: props.transaction?.description || undefined,
          category: props.transaction?.category || '',
        }
      : {
          type: '',
          amount: 0,
          created_at: '',
          description: undefined,
          category: '',
        };
  });

  const state = ref<TransactionState>({ ...initialState.value });

  watch(
    () => props.transaction,
    (newTransaction) => {
      if (newTransaction) {
        state.value = {
          type: newTransaction.type || '',
          amount: newTransaction.amount || 0,
          created_at: newTransaction.created_at.split('T')[0] || '',
          description: newTransaction.description || undefined,
          category: newTransaction.category || '',
        };
      }
    }
  );

  const resetForm = () => {
    state.value = { ...initialState.value };
  };

  return { state, isEditing, resetForm };
}
