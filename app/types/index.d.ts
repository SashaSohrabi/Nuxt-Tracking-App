type Transaction = {
  id: number;
  created_at: string;
  amount: number;
  type: string;
  description: string;
  category: string;
};

type TransactionState = {
  type: string;
  amount: number;
  created_at: string;
  description?: string;
  category: string;
};

export { Transaction, TransactionState };
