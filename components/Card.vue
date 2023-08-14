<script setup>
const { $cn } = useNuxtApp()
</script>

<template>
  <div
    :class="
      $cn('border border-$surface-border rounded-xl bg-$surface-card shadow', $attrs.class)
    "
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>
