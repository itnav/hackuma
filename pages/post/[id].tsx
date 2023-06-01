import Base from '@/components/layouts/base'
import { useUpdatePostMutation } from '@/hooks/useMutatePosts'
import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { Post } from '@/types/types'
import { supabase } from '@/utils/supabase'
import EditorBase from '@/components/layouts/editor-base'
import {
  useCreateFileMutation,
  useDeleteFileMutation,
} from '@/hooks/useMutateFiles'
import useUserStore from '@/stores/user'
import { useState } from 'react'
import AppSnackbar from '@/components/elements/Snackbar'
import useSnackbarStore from '@/stores/snackbar'

const getAllPostIds = async () => {
  const { data: ids } = await supabase.from('posts').select('id')
  if (!ids) throw new Error('Post not found')
  return ids.map((id) => {
    return {
      params: {
        id: String(id.id),
      },
    }
  })
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getAllPostIds()
  return { paths, fallback: true }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  if (!ctx.params) return { props: {} }
  const id = ctx.params.id
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()
  return {
    props: {
      post,
    },
  }
}

type StaticProps = {
  post: Post
}

export const DetailPost: NextPage<StaticProps> = ({ post }) => {
  const router = useRouter()

  const { data: user } = useUserStore()

  const { update: updateSnackbar } = useSnackbarStore()

  const { id: postUuid } = router.query

  const updatePostMutation = useUpdatePostMutation()

  const [isChangeFile, setIsChangeFile] = useState<boolean>(false)

  const createFileMutation = useCreateFileMutation()

  const deleteFileMutation = useDeleteFileMutation()

  /**
   * 保存ボタンをクリックしたときの処理
   * @param title
   * @param content
   * @param file
   */
  const handleUpdateButtonClick = async (
    title: string,
    content: string,
    file?: File | null
  ) => {
    if (!postUuid || !user) return
    updateSnackbar({
      isOpen: true,
      message: '投稿を更新中です',
      severity: undefined,
      isLoading: true,
    })
    // 初期値は元画像のパス
    let thumbnailPath: string | null = post.thumbnail_path

    // 画像が変更されている場合は画像をアップロード
    if (file) {
      await createFileMutation.mutateAsync(
        { file, uploadPath: user.id },
        {
          onSuccess: (data) => {
            thumbnailPath = data.path
          },
        }
      )
    } else {
      thumbnailPath = null
    }

    if (!isChangeFile && post.thumbnail_path) {
      // 画像が削除されている場合は変更前の画像を削除する
      await deleteFileMutation.mutateAsync([post.thumbnail_path])
    }

    // 投稿を更新
    updatePostMutation.mutate(
      {
        id: postUuid as string,
        title: title,
        content: content,
        thumbnail_path: thumbnailPath,
      },
      {
        onSuccess: () => {
          updateSnackbar({
            isOpen: true,
            message: '投稿を更新しました！',
            severity: 'success',
          })
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
      <AppSnackbar />
      <EditorBase
        post={post}
        saveFunction={handleUpdateButtonClick}
        changeFile={() => setIsChangeFile(true)}
      />
    </Base>
  )
}

export default DetailPost
