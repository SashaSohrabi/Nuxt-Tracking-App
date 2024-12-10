export const useCurrency = (amount: number | Ref<number>) => {
  const unwrapped = unref(amount);

  const formattedAmount = computed(() => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'EUR',
    }).format(unwrapped);
  });

  watch(formattedAmount, (newVal) => {
    currency.value = newVal;
  });

  const currency = ref(formattedAmount.value);

  return { currency };
};
