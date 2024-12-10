import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';
import 'dotenv/config';

// Define environment variable types
const SUPABASE_URL: string | undefined = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE: string | undefined = process.env.SUPABASE_SERVICE_ROLE;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  throw new Error('Missing Supabase URL or key in environment variables.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
  auth: { persistSession: false },
});

const categories: string[] = ['Food', 'Housing', 'Car', 'Entertainment'];
const {
  data: { users },
  error,
} = await supabase.auth.admin.listUsers();
const userIds = users.map((user) => user.id);

interface Transaction {
  created_at: Date;
  amount: number;
  type: 'Income' | 'Expense' | 'Saving' | 'Investment';
  description: string;
  category: string | null; // Category is only for 'Expense'
  user_id: string;
}

async function seedTransactions(): Promise<void> {
  // Delete existing data
  const { error: deleteError } = await supabase
    .from('transactions')
    .delete()
    .gte('id', 0);

  if (deleteError) {
    console.error('Error deleting existing data:', deleteError);
    return;
  }

  const transactions: Transaction[] = [];

  for (const user of userIds) {
    for (
      let year = new Date().getFullYear();
      year > new Date().getFullYear() - 2;
      year--
    ) {
      for (let i = 0; i < 10; i++) {
        const date = new Date(
          year,
          faker.number.int({ min: 0, max: 11 }),
          faker.number.int({ min: 1, max: 28 })
        );

        let type: 'Income' | 'Expense' | 'Saving' | 'Investment';
        let category: string | null = null;
        const typeBias = Math.random();

        if (typeBias < 0.85) {
          type = 'Expense';
          category = faker.helpers.arrayElement(categories); // Category only for 'Expense'
        } else if (typeBias < 0.95) {
          type = 'Income';
        } else {
          type = faker.helpers.arrayElement(['Saving', 'Investment']);
        }

        let amount: number;
        switch (type) {
          case 'Income':
            amount = faker.number.int({ min: 2000, max: 5000 });
            break;
          case 'Expense':
            amount = faker.number.int({ min: 100, max: 1000 });
            break;
          case 'Saving':
          case 'Investment':
            amount = faker.number.int({ min: 5000, max: 10000 });
            break;
          default:
            amount = 0;
        }

        transactions.push({
          created_at: date,
          amount,
          type,
          description: faker.lorem.sentence(),
          category: type === 'Expense' ? category : null, // Category only for 'Expense'
          user_id: user,
        });
      }
    }
  }

  const { error: insertError } = await supabase
    .from('transactions')
    .upsert(transactions);

  if (insertError) {
    console.error('Error inserting data:', insertError);
  } else {
    console.log('Data inserted successfully.');
  }
}

seedTransactions().catch(console.error);
