import Base from '@/components/layouts/base'
import EditorBase from '@/components/layouts/editor-base'
import { useMutateFiles } from '@/hooks/useMutateFiles'
import { useMutatePosts } from '@/hooks/useMutatePosts'
import usePublicUserStore from '@/stores/public_user'
import useSnackbarStore from '@/stores/snackbar'
import useUserStore from '@/stores/user'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const NewPost = () => {
  const router = useRouter()

  const { data: public_user } = usePublicUserStore()

  const { data: user } = useUserStore()

  const { createPostMutation } = useMutatePosts()

  const { createFileMutation } = useMutateFiles()

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
    if (!user) return
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

    if (!public_user) return
    // 投稿を作成
    createPostMutation.mutateAsync(
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

  useEffect(() => {
    if (createPostMutation.isLoading) {
      updateSnackbar({
        isOpen: true,
        message: '投稿を保存中です',
        severity: undefined,
        isLoading: true,
      })
    }
  }, [createPostMutation.isLoading])

  return (
    <Base title="新規投稿">
      <EditorBase saveFunction={handleSavePost} />
    </Base>
  )
}

export default NewPost
