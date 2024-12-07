export const useAvatarUrl = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  const getPublicAvatarUrl = () => {
    if (!user.value?.user_metadata?.avatar_url) {
      return "";
    }

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(user.value?.user_metadata?.avatar_url);
    return data?.publicUrl;
  };

  const url = ref(getPublicAvatarUrl());

  watch(
    user,
    (currentUser) => {
      if (currentUser) {
        url.value = getPublicAvatarUrl();
      }
    },
    { immediate: true }
  );

  return {
    url,
  };
};
