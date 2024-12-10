<template>
  <UForm :state="state" :schema="profileSchema" @submit.prevent="saveProfile">
    <UFormGroup class="mb-4" label="Full name" name="fullname">
      <UInput v-model="state.fullname" />
    </UFormGroup>

    <UFormGroup class="mb-4" label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormGroup>

    <UButton
      type="submit"
      color="black"
      variant="solid"
      label="Save"
      :loading="pending"
      :disabled="pending"
    />
  </UForm>
</template>

<script setup lang="ts">
import type { ProfileState } from '~/types/index';
import { profileSchema } from '~/utils/schemas/profileSchema';

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const { toastSuccess, toastError } = useAppToast();
const pending = ref(false);

const state = ref<ProfileState>({
  fullname: user.value?.user_metadata.fullname,
  email: user.value?.new_email || user.value?.email,
});

const saveProfile = async () => {
  pending.value = true;

  try {
    const data: { data: { fullname: string }; email?: string } = {
      data: {
        fullname: state.value.fullname,
      },
    };

    if (state.value.email !== user.value?.email) {
      data.email = state.value.email;
    }

    const { error } = await supabase.auth.updateUser(data);

    if (error) {
      throw error;
    }

    toastSuccess({
      title: 'Profile updated successfully',
      description: 'Your profile has been updated.',
    });
  } catch (e) {
    toastError({
      title: 'Error updating profile',
      description: (e as Error).message,
    });
  } finally {
    pending.value = false;
  }
};
</script>
