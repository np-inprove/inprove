import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { CreateVoucherInput } from '~/shared/voucher'

export function useVouchers() {
  const { $client } = useNuxtApp()

  return useQuery({
    queryKey: ['vouchers'],
    queryFn: () => $client.voucher.list.query(),
  })
}

export function useCreateVoucher() {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateVoucherInput) => $client.voucher.create.mutate(input),
    onSuccess() {
      queryClient.invalidateQueries(['vouchers'])
    },
  })
}
