<script setup lang="ts">
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { TRPCClientError } from '@trpc/client'

const route = useRoute()
const config = useRuntimeConfig()
const { $client } = useNuxtApp()

useSeoMeta({
  title: 'Login',
})

const formData = reactive<{
  email: string
  otp: string
  pending: boolean
  stage: 'email' | 'otp'
  error?: string
}>({
  email: '',
  otp: '',
  pending: false,
  stage: 'email',
})

async function generateOtp() {
  formData.pending = true
  try {
    await $client.auth.email.login.mutate(formData)
    formData.stage = 'otp'
    await nextTick(() => { // Wait for OTP form to load
      document.getElementById('otp')?.focus()
    })
  }
  catch (err) {
    console.error(err)
    if (err instanceof TRPCClientError)
      formData.error = err.message
    else
      formData.error = JSON.stringify(err)
  }
  finally {
    formData.pending = false
  }
}

async function verifyOtp() {
  formData.pending = true
  try {
    await $client.auth.email.verifyOtp.mutate({
      email: formData.email,
      otp: formData.otp,
    })

    if (route.query.redirectTo)
      navigateTo(route.query.redirectTo as string)
    else
      navigateTo('/dashboard')
  }
  catch (err) {
    console.error(err)
    if (err instanceof TRPCClientError)
      formData.error = err.message
    else
      formData.error = JSON.stringify(err)
  }
  finally {
    formData.pending = false
  }
}
</script>

<template>
  <div>
    <header class="h-24 flex items-center justify-between p-6 lg:px-30">
      <NuxtLink to="/">
        <span font-semibold>{{ config.public.appName }}</span>
      </NuxtLink>
    </header>

    <main>
      <div grid grid-cols-1 md:grid-cols-2 lg:py-20>
        <div mx-auto max-w-lg w-full p-10>
          <UndrawLogin />
        </div>

        <div flex p-6 lg:px-30>
          <Card class="w-full md:max-w-lg">
            <template #title>
              Login
            </template>
            <template #subtitle>
              Please enter your academic email address.
            </template>
            <template #content>
              <form v-if="formData.stage === 'email'" @submit.prevent="generateOtp">
                <div class="flex flex-col gap-2">
                  <InputText
                    id="email"
                    v-model="formData.email" :class="{ 'p-invalid': formData.error }" autofocus :required="true" placeholder="sam@doge.edu.sg"
                    type="email" aria-describedby="email-help"
                  />
                  <small id="email-help" class="sr-only">Enter your email</small>
                  <small id="text-error" class="p-error">{{ formData.error || '&nbsp;' }}</small>
                </div>

                <div mt2>
                  <Button type="submit" :loading="formData.pending" icon="" icon-pos="right" label="Get OTP" />
                </div>
              </form>

              <form v-else-if="formData.stage === 'otp'" @submit.prevent="verifyOtp">
                <div class="flex flex-col gap-2">
                  <InputText
                    id="otp"
                    v-model="formData.otp" :class="{ 'p-invalid': formData.error }" autofocus :required="true" placeholder="123456"
                    aria-describedby="otp-help"
                  />
                  <small id="otp-help" class="sr-only">Enter your OTP</small>
                  <small id="text-error" class="p-error">{{ formData.error || '&nbsp;' }}</small>
                </div>

                <div mt2>
                  <Button type="submit" :loading="formData.pending" icon="" icon-pos="right" label="Login" />
                </div>
              </form>
            </template>
          </Card>
        </div>
      </div>
    </main>
  </div>
</template>
