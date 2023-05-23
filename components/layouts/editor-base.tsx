import style from '@/styles/common/component/layout/editor.module.scss'
import { Button, IconButton, TextField, Toolbar } from '@mui/material'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { FC, useEffect, useState } from 'react'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js'
import 'draft-js/dist/Draft.css'
import { Post } from '@/types/types'

const Editor = dynamic(
  () => {
    return import('draft-js').then((module) => module.Editor)
  },
  { ssr: false }
)

type EditorBaseProps = {
  post?: Post
  saveFunction: (title: string, content: string) => void
}

export const EditorBase: FC<EditorBaseProps> = ({ post, saveFunction }) => {
  const [title, setTitle] = useState('')

  const router = useRouter()

  const handleSaveButtonClick = async () => {
    const contentState = editorState.getCurrentContent()
    const raw = convertToRaw(contentState)
    const content = JSON.stringify(raw)

    saveFunction(title, content)
  }

  const [editorState, setEditorState] = useState(() => {
    if (post && post.content) {
      const contentState = convertFromRaw(JSON.parse(post.content))
      return EditorState.createWithContent(contentState)
    }
    return EditorState.createEmpty()
  })

  const handleChangeEditor = (editorState: EditorState) => {
    setEditorState(editorState)
  }

  useEffect(() => {
    if (!post || !post.title) return
    setTitle(post.title)
  }, [])

  return (
    <div className={style['page-container']}>
      <div className={style.sidebar}>
        {/* TODO:サイドバー */}
        <div>新規投稿</div>
      </div>
      <div className={style.editor}>
        {/* エディター */}

        <Toolbar disableGutters={true}>
          <Button
            color="neutral"
            onClick={() => {
              router.push('/post')
            }}
            sx={{ mr: 'auto', ml: 0 }}
          >
            戻る
          </Button>
          <Button
            variant="outlined"
            onClick={handleSaveButtonClick}
            sx={{ mr: 2 }}
          >
            保存
          </Button>
          {/* TODO:メニュー 
          <IconButton className="">
            <MoreHorizIcon />
          </IconButton> */}
        </Toolbar>

        <TextField
          variant="standard"
          type="text"
          required
          value={title}
          placeholder="記事タイトル"
          onChange={(e) => {
            setTitle(e.target.value)
          }}
          InputProps={{
            disableUnderline: true,
            className: style['title-text-field'],
          }}
        />
        <Editor
          editorState={editorState}
          onChange={handleChangeEditor}
          placeholder="本文を入力してください"
        />
      </div>
    </div>
  )
}

export default EditorBase
