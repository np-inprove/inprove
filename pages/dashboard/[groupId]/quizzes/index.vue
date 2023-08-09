<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div p4 space-y-4 md:p8>
    <div flex items-center justify-between>
      <h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">
        Quizzes
      </h3>

      <QuizzesCreate
        :group-id="
          route.params.groupId as string
        "
      />
    </div>

    <QuizzesOverview
      :group-id="
        route.params.groupId as string
      "
    />
  </div>
</template>
