export const useRedirectIfAuthenticated = (url = '/') => {
  const user = useSupabaseUser();

  watch(
    user,
    (currentUser) => {
      if (currentUser) {
        return navigateTo(url);
      }
    },
    { immediate: true }
  );

  return { user };
};
