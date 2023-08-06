<script setup lang="ts">
import ScrollPanel from 'primevue/scrollpanel'

const route = useRoute()

const { error: groupError } = useGroup(route.params.groupId as string)
const { error: forumsError } = useForums(route.params.groupId as string)
</script>

<template>
  <div w-full flex flex-col>
    <div v-if="groupError || forumsError" h-full flex items-center justify-center pb25>
      <LazyErrorCard v-bind="groupError || forumsError" />
    </div>

    <template v-else>
      <GroupHeader
        :group-id="
          route.params.groupId as string
        "
      />

      <div overflow-x-hidden overflow-y-auto>
        <ScrollPanel style="height: 100%">
          <NuxtPage />
        </ScrollPanel>
      </div>
    </template>
  </div>
</template>
