import Base from '@/components/layouts/base'
import EditorBase from '@/components/layouts/editor-base'
import { useMutatePosts } from '@/hooks/useMutatePosts'
import useUserStore from '@/stores/user'
import { useRouter } from 'next/router'

export const NewPost = () => {
  const router = useRouter()

  const { data: user } = useUserStore()

  const { createPostMutation } = useMutatePosts()

  const handleSavePost = (title: string, content: string) => {
    if (!user) return
    createPostMutation.mutateAsync(
      {
        title,
        content,
        user_id: user.id,
      },
      {
        onSuccess: (data) => {
          const postId = data[0].id
          router.push(`/post/${postId}`)
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
