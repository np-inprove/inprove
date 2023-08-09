<template>
  <div
    class="border border-$surface-border rounded-xl bg-$surface-card shadow"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>
