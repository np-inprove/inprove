<script setup lang="ts">
import Sidebar from 'primevue/sidebar'
import InputText from 'primevue/inputtext'
import Calendar from 'primevue/calendar'
import Button from 'primevue/button'

const formData = reactive({
  title: '',
  startTime: new Date(),
  endTime: new Date(),
  location: '',
  repeat: '',
})

const visible = defineModel<boolean>('visible', { required: true })
</script>

<template>
  <Sidebar v-model:visible="visible" position="right">
    <div p4>
      <h1 text-2xl font-bold tracking-tight>
        Create a new event
      </h1>
      <p>Use events to keep track of important dates, such as exams, in your group.</p>

      <form mt6 space-y-4 class="w-full md:w-3/4">
        <div class="flex flex-col gap-2">
          <label for="name">Name</label>
          <InputText id="name" v-model="formData.title" size="small" aria-describedby="name-help" autofocus />
          <small id="name-help" sr-only>Enter a name or description for your event.</small>
        </div>

        <div flex items-center justify-between>
          <div class="flex flex-col gap-2">
            <label for="startDate">Start date</label>
            <Calendar id="startDate" v-model="formData.startTime" size="small" aria-describedby="startDate-help" />
            <small id="startDate-help" sr-only>Enter a start time for your event.</small>
          </div>

          <div class="flex flex-col gap-2">
            <label for="endTime">End time</label>
            <Calendar id="endTime" v-model="formData.endTime" size="small" aria-describedby="endTime-help" />
            <small id="endTime-help" sr-only>Enter a end time for your event.</small>
          </div>

          <div>
            <Button size="small" label="Add time" />
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label for="location">Location</label>
          <InputText id="location" v-model="formData.location" size="small" aria-describedby="location-help" />
          <small id="location-help" sr-only>Enter a location for your event.</small>
        </div>
      </form>
    </div>
  </Sidebar>
</template>
