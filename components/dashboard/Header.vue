<script setup lang="ts">
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import Menu from 'primevue/menu'

const props = defineProps<{
  name?: string
  admin?: boolean
}>()

const config = useRuntimeConfig()
const { $client } = useNuxtApp()
const { visible } = useSidebar()

const menuVisible = ref(false)
const menu = ref()

const menuItems = [
  {
    label: 'Logout',
    command: logout,
  },
]

async function logout() {
  await $client.auth.email.logout.mutate()
  navigateTo('/login')
}

function toggle(event: any) {
  menu.value.toggle(event)
}
</script>

<template>
  <div>
    <header class="flex items-center justify-between px6 py4">
      <NuxtLink to="/dashboard">
        <span font-semibold>{{ config.public.appName }}</span>
      </NuxtLink>

      <div flex items-center gap-6>
        <Button v-if="props.admin" link label="Admin" @click="$router.push('/dashboard/__admin')" />

        <div md:hidden>
          <Button text size="small" :pt="{ root: { style: 'padding: 0 !important' } }" @click="visible = !visible">
            <div v-if="visible" class="text-xl" i-tabler-layout-sidebar-left-collapse />
            <div v-else class="text-xl" i-tabler-layout-sidebar-left-expand />
          </Button>
        </div>
        <!-- For some reason, adding a chevron indicator breaks everything -->
        <div flex cursor-pointer items-center gap2 aria-haspopup="true" aria-controls="Dashboard__TheHeaderMenu">
          <Avatar
            v-if="props.name"
            :label="props.name.slice(undefined, 1).toUpperCase()" shape="circle"
            @click="toggle"
          />
          <Avatar v-else label="U" shape="circle" />
        </div>
      </div>
    </header>

    <Menu
      id="Dashboard__TheHeaderMenu"
      ref="menu" :model="menuItems" :popup="true" @blur="menuVisible = false"
      @focus="menuVisible = true"
    />
  </div>
</template>
