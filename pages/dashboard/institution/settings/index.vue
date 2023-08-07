<script setup lang="ts">
import Divider from 'primevue/divider'

const Toast = defineAsyncComponent(() => import('primevue/toast'))
</script>

<template>
  <div>
    <Toast />

    <h2 text-lg font-medium>
      Vouchers
    </h2>
    <p text-sm opacity-80>
      List of all vouchers
    </p>

    <Divider :pt="{ root: { class: 'before:border-solid!' } }" />
  </div>
</template>
