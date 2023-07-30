<script setup lang="ts">
import Avatar from 'primevue/avatar'

const props = withDefaults(defineProps<{
  name?: string
}>(), {
  name: 'User',
})

const emit = defineEmits([
  'logout',
])

const Menu = defineAsyncComponent(() => import('primevue/menu'))

const menuVisible = ref(false)
const menu = ref()

const menuItems = [
  {
    label: 'Logout',
    command: logout,
  },
]

async function logout() {
  emit('logout')
}

function toggle(event: any) {
  menu.value.toggle(event)
}
</script>

<template>
  <!-- For some reason, adding a chevron indicator breaks everything -->
  <div flex cursor-pointer items-center gap2 aria-haspopup="true" aria-controls="Dashboard__TheHeaderMenu">
    <Avatar :label="props.name.slice(undefined, 1).toUpperCase()" shape="circle" @click="toggle" />

    <Menu
      id="Dashboard__TheHeaderMenu" ref="menu" :model="menuItems" :popup="true" @blur="menuVisible = false"
      @focus="menuVisible = true"
    />
  </div>
</template>
