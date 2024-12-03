<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header> Add Transaction </template>
      <UForm :state="state" :schema="schema" ref="form" @submit.prevent="save">
        <UFormGroup
          label="Transaction Type"
          :required="true"
          name="type"
          class="mb-4"
        >
          <USelect
            placeholder="Select the transaction type"
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
import type { TransactionState } from '~/types/index';
import { z } from 'zod';

const props = defineProps<{
  modelValue: boolean;
}>();
const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'saved'): void;
}>();

const defaultSchema = z.object({
  amount: z.number().min(1, 'Amount must be greater than 0'),
  created_at: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  description: z.string().optional(),
});

const incomeSchema = z.object({
  type: z.literal('Income'),
});

const expenseSchema = z.object({
  type: z.literal('Expense'),
  category: z.enum(CATEGORIES),
});

const investmentSchema = z.object({
  type: z.literal('Investment'),
});

const savingSchema = z.object({
  type: z.literal('Saving'),
});

const schema = z.intersection(
  z.discriminatedUnion('type', [
    incomeSchema,
    expenseSchema,
    investmentSchema,
    savingSchema,
  ]),
  defaultSchema
);

const initialState = ref<TransactionState>({
  type: '',
  amount: 0,
  created_at: '',
  description: undefined,
  category: '',
});

const state = ref<TransactionState>({
  type: '',
  amount: 0,
  created_at: '',
  description: undefined,
  category: '',
});

const isLoading = ref(false);
const form = useTemplateRef('form');
const supabase = useSupabaseClient();
const { toastSuccess, toastError } = useAppToast();

const save = async () => {
  const formData = await form.value;
  if (schema.safeParse(formData)) {
    isLoading.value = true;
    try {
      const { error } = await supabase
        .from('transactions')
        .upsert({ ...state.value } as any);

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
