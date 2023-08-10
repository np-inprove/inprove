<script setup lang="ts">
import Divider from 'primevue/divider'

const Toast = defineAsyncComponent(() => import('primevue/toast'))
</script>

<template>
  <div>
    <Toast />

    <!-- TODO there are like 3 different ways this same layout is implemented across the app, should probably standardize -->
    <div flex items-center justify-between>
      <div>
        <h2 text-lg font-medium>
          Vouchers
        </h2>
        <p text-sm opacity-80>
          List of all vouchers
        </p>
      </div>

      <VoucherCreate />
    </div>

    <Divider :pt="{ root: { class: 'before:border-solid!' } }" />

    <VoucherList />
  </div>
</template>
