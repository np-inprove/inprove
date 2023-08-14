import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { CreateVoucherInput, RedeemVoucherInput, UpdateVoucherInput } from '~/shared/voucher'

export function useVouchers() {
  const { $client } = useNuxtApp()

  return useQuery({
    queryKey: ['vouchers'],
    queryFn: () => $client.voucher.list.query(),
  })
}

export function useRedeemedVouchers() {
  const { $client } = useNuxtApp()

  return useQuery({
    queryKey: ['vouchersRedeemed'],
    queryFn: () => $client.voucher.listRedeemed.query(),
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

export function useUpdateVoucher() {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateVoucherInput) => $client.voucher.update.mutate(input),
    onSuccess() {
      queryClient.invalidateQueries(['vouchers'])
    },
  })
}

export function useDeleteVoucher() {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: RedeemVoucherInput) => $client.voucher.delete.mutate(input),
    onSuccess() {
      queryClient.invalidateQueries(['vouchers'])
    },
  })
}

export function useRedeemVoucher() {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: RedeemVoucherInput) => $client.voucher.redeem.mutate(input),
    onSuccess() {
      queryClient.invalidateQueries(['vouchers'])
      queryClient.invalidateQueries(['me'])
    },
  })
}
