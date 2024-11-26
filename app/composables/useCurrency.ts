export const useCurrency = (amount: number | Ref<number>) => {
  const unwrapped = unref(amount);

  const currency = computed(() => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'EUR',
    }).format(unwrapped);
  });

  return { currency };
};
