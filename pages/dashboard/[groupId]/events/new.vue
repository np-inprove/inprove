<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div w-full flex flex-col>
    <GroupHeader
      :group-id="
        route.params.groupId as string
      "
    />
  </div>
</template>
