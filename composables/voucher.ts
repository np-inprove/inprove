import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { CreateVoucherInput, RedeemAdminClaimInput, RedeemClaimInput, RedeemVoucherInput, UpdateVoucherInput } from '~/shared/voucher'

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

export function useClaimRedeems() {
  const { $client } = useNuxtApp()

  return useQuery({
    queryKey: ['vouchersRedeemed'],
    queryFn: () => $client.redeem.listUnclaimedVouchers.query(),
  })
}

export function useClaimRedeem() {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: RedeemClaimInput) => $client.redeem.claim.mutate(input),
    onSuccess() {
      queryClient.invalidateQueries(['vouchersRedeemed'])
      queryClient.invalidateQueries(['me'])
    },
  })
}

export function useAdminClaimRedeem() {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: RedeemAdminClaimInput) => $client.redeem.adminClaim.mutate(input),
    onSuccess() {
      queryClient.invalidateQueries(['vouchersRedeemed'])
      queryClient.invalidateQueries(['me'])
    },
  })
}
