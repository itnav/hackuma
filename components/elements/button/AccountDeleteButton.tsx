import { FC } from 'react'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/router'
import usePublicUserStore from '@/stores/public_user'
import { useDeleteUserMutation } from '@/hooks/useMutateAuth'
import useSnackbarStore from '@/stores/snackbar'
import { useDeleteFileMutation } from '@/hooks/useMutateFiles'
import { Button } from '@mui/material'

type Props = {
  onDeleted: () => void
}

export const AccountDeleteButton: FC<Props> = ({ onDeleted }) => {
  const router = useRouter()

  const { data: publicUser } = usePublicUserStore()

  const deleteUsersMutation = useDeleteUserMutation()
  const deleteFileMutation = useDeleteFileMutation()

  const { update: updateSnackbar } = useSnackbarStore()

  const handleDelete = async () => {
    if (!publicUser) return
    updateSnackbar({
      isOpen: true,
      message: '削除中です...',
      severity: 'success',
    })

    // ストレージのフォルダを削除
    const { data: files } = await supabase.storage
      .from('files')
      .list(publicUser.user_id)

    const ids = files?.map((file) => `${publicUser.user_id}/${file.name}`)
    if (ids?.length) {
      await deleteFileMutation.mutateAsync(ids)
    }

    // アカウント削除
    deleteUsersMutation
      // アカウント削除
      .mutate(publicUser.user_id, {
        onSuccess: () => {
          updateSnackbar({
            isOpen: true,
            message: '削除しました',
            severity: 'success',
          })
          router.push('/')
        },
        onError: () => {
          updateSnackbar({
            isOpen: true,
            message: '削除に失敗しました',
            severity: 'error',
          })
        },
        onSettled: () => {
          onDeleted()
        },
      })
  }

  return (
    <Button onClick={handleDelete} color="error">
      削除する
    </Button>
  )
}

export default AccountDeleteButton
