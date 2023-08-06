<script setup lang="ts">
import Button from 'primevue/button'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'

const { $client } = useNuxtApp()
const config = useRuntimeConfig()

const { data: me } = await $client.me.get.useQuery(undefined, { lazy: true })

interface Faq {
  title: string
  content: string
}

const faqs = [
  {
    title: 'How do I reset my account password?',
    content: 'Currently, we do not support the option of password self reset, do contact the administrator at the following email: helpdesk.inprove@gmail.com to request for a password reset.',
  },
  {
    title: 'How do I turn off notifications?',
    content: 'To Be Implemented',
  },
  {
    title: 'How do I upload a file to the forum?',
    content: 'We currently do not support uploading of files into the forum, you can however share the link of the file into the forum chat.',
  },
  {
    title: 'How do I create an event for a group?',
    content: 'To Be Implemented',
  },
  {
    title: 'How do I redeem reward vouchers?',
    content: 'To Be Implemented',
  },
  {
    title: 'Am I able to change my pet?',
    content: 'To Be Implemented',
  },
] satisfies Faq[]
</script>

<template>
  <div w-full items-center>
    <header
      class="h-24 flex items-center justify-between bg-$surface-section"
    >
      <NuxtLink to="/">
        <span class="font-semibold">{{ config.public.appName }}</span>
      </NuxtLink>

      <NuxtLink to="/about-us">
        About Us
      </NuxtLink>

      <NuxtLink to="/faqs">
        FAQs
      </NuxtLink>

      <Button v-if="me" label="Dashboard" @click="$router.push('dashboard')" />
      <Button v-else label="Login" @click="$router.push('login')" />
    </header>
    <main>
      <h1 p-5 text-center text-3xl>
        Frequently Asked Questions
      </h1>
      <Accordion :active-index="0">
        <AccordionTab v-for="faq in faqs" :key="faq.title" :header="faq.title">
          <p>
            {{ faq.content }}
          </p>
        </AccordionTab>
      </Accordion>
    </main>
  </div>
</template>
