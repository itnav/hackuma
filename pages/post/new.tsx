import Base from '@/components/layouts/base'
import EditorBase from '@/components/layouts/editor-base'
import { useMutatePosts } from '@/hooks/useMutatePosts'
import useUserStore from '@/stores/user'

export const NewPost = () => {
  const { data: user } = useUserStore()

  const { createPostMutation } = useMutatePosts()

  const handleSavePost = (title: string, content: string) => {
    if (!user) return
    createPostMutation.mutate({
      title,
      content,
      user_id: user.id,
    })
  }

  return (
    <Base title="新規投稿">
      <EditorBase saveFunction={handleSavePost} />
    </Base>
  )
}

export default NewPost
