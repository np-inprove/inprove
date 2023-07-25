<script setup lang="ts">
import Card from 'primevue/card'
import Button from 'primevue/button'

const emit = defineEmits(['refresh'])
</script>

<template>
  <Card class="mb15 max-w-md text-center">
    <template #title>
      You are not in any institution.
    </template>
    <template #subtitle>
      Please check you've used the correct email, or contact your institution administrator for help.
    </template>
    <template #content>
      <div flex justify-center gap3>
        <Button outlined size="small" label="Read our FAQs" />
        <Button size="small" label="Reload" @click="emit('refresh')" />
      </div>
    </template>
  </Card>
</template>
