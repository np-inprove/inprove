<script setup lang="ts">
import Card from 'primevue/card'
import Skeleton from 'primevue/skeleton'

const route = useRoute()

const { error: groupError } = useGroup(route.params.groupId as string)
const { data: forums, isLoading: forumsIsLoading, error: forumsError } = useForums(route.params.groupId as string)
</script>

<template>
  <div w-full>
    <div v-if="groupError || forumsError" h-full flex items-center justify-center pb25>
      <LazyErrorCard v-bind="groupError || forumsError" />
    </div>

    <template v-else>
      <GroupHeader
        :group-id="
          route.params.groupId as string
        "
      />

      <div w-full p8 space-y-6>
        <section space-y-4>
          <h3 font-semibold>
            Forums
          </h3>

          <Skeleton v-if="forumsIsLoading" height="150px" />
          <TransitionGroup v-else appear>
            <div v-for="(forum, idx) in forums" :key="idx" class="w-[200px]">
              <Card
                :pt="$pt.clickableCard"
                @click="$router.push(`/dashboard/${route.params.groupId}/forums/${forum.id}`)"
              >
                <template #subtitle>
                  # {{ forum.name }}
                </template>
                <template #content>
                  {{ forum.description }}
                </template>
              </Card>
            </div>
          </TransitionGroup>
        </section>
      </div>
    </template>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
