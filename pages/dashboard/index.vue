<script setup lang="ts">
// TODO this page occasionally causes hydration mismatch, probably cuz of my whacky greeting implementation thing

import ScrollPanel from 'primevue/scrollpanel'
import endOfToday from 'date-fns/endOfToday/index'
import formatDistanceToNow from 'date-fns/formatDistanceToNow/index'

const { data: me, error: meError } = useMe()

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12)
    return 'morning'

  else if (hour >= 12 && hour < 18)
    return 'afternoon'

  else
    return 'evening'
})

const timeTillReset = ref('')

let interval: any
onMounted(() => {
  interval = setInterval(() => {
    timeTillReset.value = formatDistanceToNow(endOfToday(), { includeSeconds: true })
  }, 1000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<template>
  <div w-full flex flex-col>
    <div v-if="meError" h-full flex items-center justify-center pb25>
      <LazyErrorCard v-bind="meError" />
    </div>

    <template v-else>
      <CommonHeader />

      <div overflow-x-hidden overflow-y-auto>
        <ScrollPanel style="height: 100%">
          <div p4 space-y-8 md:p8>
            <h3 class="text-3xl font-bold tracking-tight">
              Good {{ greeting }}, {{ me?.name }}
            </h3>

            <!-- TODO move to own component -->
            <h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
              Points
            </h4>
            <div grid="~ cols-1 md:cols-2 lg:cols-3 gap-4">
              <Card>
                <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle class="font-medium">
                    🥞 Pancakes received
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {{ me?.points }}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle class="font-medium">
                    🎉 Pancakes awarded
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {{ me?.pointsAwardedCount }}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle class="font-medium">
                    ⌚ Time till reset
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {{ timeTillReset }}
                  </div>
                </CardContent>
              </Card>
            <!-- ENDTODO move to own component -->
            </div>

            <DashboardVouchersOverview />
          </div>
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
}
</style>
