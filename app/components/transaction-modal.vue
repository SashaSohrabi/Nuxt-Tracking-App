<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        {{ isEditing ? 'Edit' : 'Add' }} Transaction
      </template>
      <UForm :state="state" :schema="transactionSchema" ref="form" @submit.prevent="save">
        <UFormGroup
          label="Transaction Type"
          :required="true"
          name="type"
          class="mb-4"
        >
          <USelect
            placeholder="Select the transaction type"
            :disabled="isEditing"
            :options="TYPES"
            v-model="state.type"
          />
        </UFormGroup>
        <UFormGroup label="Amount" :required="true" name="amount" class="mb-4">
          <UInput
            type="number"
            placeholder="Amount"
            v-model.number="state.amount"
          />
        </UFormGroup>
        <UFormGroup
          label="Transaction date"
          :required="true"
          name="created_at"
          class="mb-4"
        >
          <UInput
            type="date"
            icon="i-heroicons-calendar-days-20-solid"
            v-model="state.created_at"
          />
        </UFormGroup>
        <UFormGroup
          label="Description"
          hint="Optional"
          name="description"
          class="mb-4"
        >
          <UInput placeholder="Description" v-model="state.description" />
        </UFormGroup>
        <UFormGroup
          label="Category"
          :required="true"
          name="category"
          class="mb-4"
          v-if="state.type === 'Expense'"
        >
          <USelect
            placeholder="Category"
            :options="CATEGORIES"
            v-model="state.category"
          />
        </UFormGroup>
        <UButton
          type="submit"
          color="black"
          variant="solid"
          label="Save"
          :isLoading="isLoading"
        />
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { CATEGORIES, TYPES } from '~/utils/constants';
import { transactionSchema } from '~/utils/schemas/transactionSchema';
import type { TransactionState, Transaction } from '~/types/index';

const props = defineProps<{
  transaction?: Transaction;
  modelValue: boolean;
}>();
const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'saved'): void;
}>();

const isEditing = computed(() => !!props.transaction);

const initialState = computed((): TransactionState => {
  return isEditing.value
    ? {
        type: props.transaction?.type || '',
        amount: props.transaction?.amount || 0,
        created_at:
          (props.transaction?.created_at.split('T')[0] as string) || '',
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

const state = ref<TransactionState>({ ...initialState.value });

const isLoading = ref(false);
const form = useTemplateRef('form');
const supabase = useSupabaseClient();
const { toastSuccess, toastError } = useAppToast();

const save = async () => {
  const formData = await form.value;
  if (transactionSchema.safeParse(formData)) {
    isLoading.value = true;
    try {
      const { error } = await supabase
        .from('transactions')
        .upsert({ ...state.value, id: props.transaction?.id } as any);

      if (error) {
        throw error;
      }

      toastSuccess({
        title: 'Transaction saved!',
      });

      isOpen.value = false;
      emit('saved');
    } catch (e) {
      toastError({
        title: 'Error saving transaction',
        description: (e as Error).message,
      });
    } finally {
      isLoading.value = false;
    }
  }
};

const resetForm = () => {
  state.value = { ...initialState.value };
};

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) resetForm();
    emit('update:modelValue', value);
  },
});
</script>
