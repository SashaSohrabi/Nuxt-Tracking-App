<template>
  <header class="flex justify-between items-center mt-10">
    <NuxtLink to="/" class="text-xl font-bold">Finance Tracker</NuxtLink>
    <ClientOnly>
      <UToggle
        on-icon="i-heroicons:moon-20-solid"
        off-icon="i-heroicons:sun-20-solid"
        class="ml-auto mr-5"
        v-model="isDarkMode"
      />
    </ClientOnly>

    <div class="flex">
      <UDropdown
        :items="items"
        :ui="{ item: { disabled: 'cursor-text select-text' }, width: 'w-64' }"
        v-if="user"
      >
        <UAvatar :src="url" alt="Avatar" />

        <template #account="{ item }">
          <div class="text-left">
            <p>Signed in as</p>
            <p class="font-medium text-gray-900 dark:text-white">
              {{ item.label }}
            </p>
          </div>
        </template>

        <template #item="{ item }">
          <span class="truncate">{{ item.label }}</span>

          <UIcon
            :name="item.icon"
            class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
          />
        </template>
      </UDropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { url } = useAvatarUrl();
const colorMode = useColorMode();

// Map the boolean toggle value to the color mode
const isDarkMode = computed({
  get: () => colorMode.preference === 'dark',
  set: (value) => {
    colorMode.preference = value ? 'dark' : 'light';
  },
});

const items = [
  [
    {
      label: user.value?.email,
      slot: 'account',
      disabled: true,
    },
  ],
  [
    {
      label: 'Settings',
      icon: 'i-heroicons-cog-8-tooth',
      click: () => navigateTo('/settings/profile'),
    },
    {
      label: 'Sign out',
      icon: 'i-heroicons-arrow-left-on-rectangle',
      click: async () => {
        await supabase.auth.signOut();
        return navigateTo('/login');
      },
    },
  ],
];
</script>
