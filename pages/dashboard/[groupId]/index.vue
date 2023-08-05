<script setup lang="ts">
import Skeleton from 'primevue/skeleton'
import ScrollPanel from 'primevue/scrollpanel'

const route = useRoute()

const { error: groupError } = useGroup(route.params.groupId as string)
const { data: forums, isLoading: forumsIsLoading, error: forumsError } = useForums(route.params.groupId as string)

const Tab = {
  WorkDue: 'work-due',
  StudyPlan: 'study-plan',
}
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

      <div overflow-auto p4 class="pr0!" md:p8>
        <ScrollPanel style="height: 100%" class="pr6">
          <div mb16 flex flex-wrap gap6>
            <LazyDashboardUpcomingEventsSection
              :group-id="
                route.params.groupId as string
              "
            />

            <section flex-1 space-y-4>
              <h3 font-semibold>
                Forums
              </h3>

              <Skeleton v-if="forumsIsLoading" height="100px" />
              <TransitionGroup v-else appear>
                <div
                  v-for="(forum, idx) in forums"
                  :key="idx" class="w-[200px]"
                >
                  <DashboardForumCard
                    :group-id="
                      route.params.groupId as string
                    "
                    :forum-id="
                      forum.id as string
                    "
                    :name="forum.name"
                    :description="forum.description"
                  />
                </div>
              </TransitionGroup>
            </section>
          </div>

          <section mt6 space-y-4>
            <div flex gap2>
              <NuxtLink
                prefetch
                :class="{ 'bg-$highlight-bg text-$highlight-text-color hover:no-underline': !route.query.tab || route.query.tab === Tab.WorkDue }"
                class="h-9 inline-flex cursor-pointer items-center justify-start rounded-md px-4 py-2 font-normal transition-colors disabled:pointer-events-none hover:bg-$highlight-bg font-medium! hover:text-$highlight-text-color hover:underline disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1"
                to="?tab=work-due"
              >
                Work due
              </NuxtLink>
              <NuxtLink
                prefetch
                :class="{ 'bg-$highlight-bg text-$highlight-text-color hover:no-underline': route.query.tab === Tab.StudyPlan }"
                class="h-9 inline-flex cursor-pointer items-center justify-start rounded-md px-4 py-2 font-normal transition-colors disabled:pointer-events-none hover:bg-$highlight-bg font-medium! hover:text-$highlight-text-color hover:underline disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1"
                to="?tab=study-plan"
              >
                Study plan
              </NuxtLink>
            </div>

            <KeepAlive>
              <DashboardWorkDue
                v-if="
                  !route.query.tab || route.query.tab === Tab.WorkDue
                "
                :group-id="
                  route.params.groupId as string
                "
              />
              <DashboardStudyPlan v-else-if="route.query.tab === Tab.StudyPlan" />
            </KeepAlive>
          </section>
        </ScrollPanel>
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
