<script setup lang="ts">
const props = defineProps<{
  groupId: string
  forumId: string
  name: string
  description: string
}>()
</script>

<template>
  <NuxtLink prefetch :to="`/dashboard/${props.groupId}/forums/${props.forumId}`">
    <Card>
      <CardHeader>
        <div className="space-y-1">
          <CardTitle class="flex gap-3">
            <span>
              #
            </span>
            <spam>
              {{ props.name }}
            </spam>
          </CardTitle>
          <CardDescription>
            {{ props.description }}
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  </NuxtLink>
</template>
