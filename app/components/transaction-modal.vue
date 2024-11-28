<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header> Add Transaction </template>
      <div>hello</div>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
}>();
const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
</script>
