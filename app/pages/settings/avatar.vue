<template>
  <div>
    <div class="mb-4">
      <UFormGroup
        label="Current avatar"
        class="w-full"
        help="This would be blank by default"
      >
        <UAvatar
          :src="url"
          size="3xl"
        />
      </UFormGroup>
    </div>

    <div class="mb-4">
      <UFormGroup
        label="New avatar"
        class="w-full"
        name="avatar"
        help="After choosing an image click Save to actually upload the new avatar"
      >
        <UInput type="file" ref="file-input" />
      </UFormGroup>
    </div>

    <UButton
      type="submit"
      color="black"
      variant="solid"
      label="Save"
      :loading="uploading"
      :disabled="uploading"
      @click="saveAvatar"
    />
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { toastSuccess, toastError } = useAppToast();
const { url } = useAvatarUrl();
const uploading = ref(false);
const fileInput = useTemplateRef('file-input');

const saveAvatar = async () => {
  const file = fileInput.value?.input?.files?.[0];

  if (!file) {
    toastError({
      title: 'No avatar selected',
    });
    return;
  }

  const fileExt = file.name.split('.')[1];
  const fileName = `${Math.random()}.${fileExt}`;

  try {
    uploading.value = true;
    const currentAvaterUrl = user.value?.user_metadata?.avatar_url;

    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file);

    if (error) {
      throw error;
    }

    await supabase.auth.updateUser({
      data: {
        avatar_url: fileName,
      },
    });

    if (currentAvaterUrl) {
      const { error } = await supabase.storage
        .from('avatars')
        .remove([currentAvaterUrl]);

      if (error) {
        throw error;
      }
    }

    fileInput.value.input.value = '';

    toastSuccess({
      title: 'Avatar uploaded',
    });
  } catch (error) {
    toastError({
      title: 'Error uploading avatar',
      description: (error as Error).message,
    });
  } finally {
    uploading.value = false;
  }
};
</script>
