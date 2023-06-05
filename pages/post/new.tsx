import Base from '@/components/layouts/Base'
import EditorBase from '@/components/layouts/Editor-base'
import { useCreateFileMutation } from '@/hooks/useMutateFiles'
import { useCreatePostMutation } from '@/hooks/useMutatePosts'
import usePublicUserStore from '@/stores/public_user'
import useSnackbarStore from '@/stores/snackbar'
import useUserStore from '@/stores/user'
import { useRouter } from 'next/router'

export const NewPost = () => {
  const router = useRouter()

  const { data: public_user } = usePublicUserStore()

  const { data: user } = useUserStore()

  const createPostMutation = useCreatePostMutation()

  const createFileMutation = useCreateFileMutation()

  const { update: updateSnackbar } = useSnackbarStore()

  /**
   * 保存ボタンをクリックしたときの処理
   * @param title
   * @param content
   * @param file
   */
  const handleSavePost = async (
    title: string,
    content: string,
    file?: File | null
  ) => {
    if (!user || !public_user) return

    updateSnackbar({
      isOpen: true,
      message: '投稿を保存中です',
      severity: undefined,
      isLoading: true,
    })

    let thumbnailPath: string | null = null
    if (file) {
      await createFileMutation.mutateAsync(
        { file, uploadPath: user.id },
        {
          onSuccess: (data) => {
            thumbnailPath = data.path
          },
        }
      )
    }

    // 投稿を作成
    createPostMutation.mutate(
      {
        title: title,
        content: content,
        user_id: user.id,
        public_user_id: public_user.id,
        thumbnail_path: thumbnailPath,
      },
      {
        onSuccess: (data) => {
          updateSnackbar({
            isOpen: true,
            message: '投稿を更新しました！',
            severity: 'success',
          })
          const postId = data[0].id
          router.push(`/post/${postId}`)
        },
        onError: () => {
          updateSnackbar({
            isOpen: true,
            message: '投稿の更新に失敗しました',
            severity: 'error',
          })
        },
      }
    )
  }

  return (
    <Base title="新規投稿">
      <EditorBase saveFunction={handleSavePost} />
    </Base>
  )
}

export default NewPost
