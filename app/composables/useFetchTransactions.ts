import type { Transaction } from '~/types/index';

export const useFetchTransactions = (
  period: Ref<
    | {
        from: Date;
        to: Date;
      }
    | undefined
  >
) => {
  const supabase = useSupabaseClient();
  const transactions = ref<Transaction[]>([]);
  const pending = ref(false);

  const income = computed(() =>
    transactions.value.filter((t) => t.type === 'Income')
  );

  const expense = computed(() =>
    transactions.value.filter((t) => t.type === 'Expense')
  );

  const incomeCount = computed(() => income.value.length);
  const expenseCount = computed(() => expense.value.length);

  const incomeTotal = computed(() =>
    income.value.reduce((sum, transaction) => sum + transaction.amount, 0)
  );

  const expenseTotal = computed(() =>
    expense.value.reduce((sum, transaction) => sum + transaction.amount, 0)
  );

  const fetchTransactions = async () => {
    try {
      pending.value = true;
      const { data } = await useAsyncData<Transaction[] | null>(
        `transactions-${period.value?.from.toDateString()}-${period.value?.to.toDateString()}`,
        async () => {
          const { data, error } = await supabase
            .from('transactions')
            .select()
            .gte('created_at', period.value?.from.toISOString())
            .lte('created_at', period.value?.to.toISOString())
            .order('created_at', { ascending: false });

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
      pending.value = false;
    }
  };

  const refresh = async () =>
    (transactions.value = (await fetchTransactions()) ?? []);

  watch(period, async () => await refresh());

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

  return {
    transactions: {
      all: transactions,
      grouped: {
        byDate: transactionsGroupedByDate,
      },
      income,
      expense,
      incomeCount,
      expenseCount,
      incomeTotal,
      expenseTotal,
    },
    refresh,
    pending,
  };
};
