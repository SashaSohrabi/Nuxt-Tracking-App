type ToastOptions = {
  title: string;
  description?: string;
};

export const useAppToast = () => {
  const toast = (useToast as () => ReturnType<typeof useToast>)();

  return {
    toastSuccess: ({ title, description }: ToastOptions) => {
      toast.add({
        title,
        description,
        icon: 'i-heroicons-check-circle',
        color: 'green',
      });
    },
    toastError: ({ title, description }: ToastOptions) => {
      toast.add({
        title,
        description,
        icon: 'i-heroicons-exclamation-circle',
        color: 'red',
      });
    },
  };
};
