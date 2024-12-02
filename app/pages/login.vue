<template>
  <UCard v-if="!success">
    <template #header> Sign in to Finance Tracker </template>

    <form @submit.prevent="handleSubmit">
      <UFormGroup
        label="Email"
        name="email"
        class="mb-4"
        :required="true"
        help="You will receive an email with the confirmation link."
      >
        <UInput v-model="email" type="email" placeholder="Email" required />
      </UFormGroup>

      <UButton
        type="submit"
        variant="solid"
        color="black"
        :loading="pending"
        :disabled="pending"
        >Sign in</UButton
      >
    </form>
  </UCard>

  <UCard v-else>
    <template #header> Email has been sent </template>

    <div class="text-center">
      <p class="mb-4">
        We have sent an email to <strong>{{ email }}</strong> with a link to
        sign in.
      </p>
      <p><strong>Important:</strong> The link will expired in 5 minutes.</p>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const success = ref(false);
const email = ref('');
const pending = ref(false);
const toast = useToast();
const supabase = useSupabaseClient();

useRedirectIfAuthenticated();

const handleSubmit = async () => {
  pending.value = true;

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        emailRedirectTo: 'http://localhost:3000/confirm',
      },
    });

    if (error) {
      throw error;
    } else {
      success.value = true;
    }
  } catch (error) {
    toast.add({
      title: 'Error signing in',
      icon: 'i-heroicons-exclamation-circle',
      description: (error as Error).message,
      color: 'red',
    });
  } finally {
    pending.value = false;
  }
};
</script>
