<script setup lang="ts">
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'

const { data: vouchers, isLoading: vouchersIsloading, error: vouchersError } = useVouchers()
const { data: me } = useQuery(queries.me.info)

const { mutate: redeemMutate } = useRedeemVoucher()

function redeem(id: string) {
  redeemMutate({
    voucherId: id,
  })
}
</script>

<template>
  <div space-y-8>
    <h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
      Vouchers
    </h4>

    <div v-if="vouchersIsloading" grid="~ cols-1 md:cols-2 lg:cols-3 gap-4">
      <Skeleton v-for="_, idx in Array.from({ length: 9 })" :key="idx" height="96px" />
    </div>

    <div v-else grid="~ cols-1 md:cols-2 lg:cols-3 gap-4">
      <!-- TODO unsafe comparison types -->
      <Card
        v-for="voucher in vouchers"
        :key="voucher.id" :class="[voucher.pointsRequired > me?.points! ? 'opacity-50' : '']"
      >
        <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle class="text-lg">
            {{ voucher.name }}
          </CardTitle>
          <Button v-if="voucher.pointsRequired <= me?.points!" severity="secondary" size="small" :label="`Redeem for ${voucher.pointsRequired}`" @click="redeem(voucher.id)" />
        </CardHeader>
        <CardContent>
          {{ voucher.description }}
        </CardContent>
      </Card>
    </div>
  </div>
</template>
