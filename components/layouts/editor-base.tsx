import style from '@/styles/common/component/layout/editor.module.scss'
import { Button, IconButton, TextField, Toolbar } from '@mui/material'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js'
import 'draft-js/dist/Draft.css'
import { Post } from '@/types/types'
import { getImgPath, previewFile } from '@/utils/img'
import Image, { StaticImageData } from 'next/image'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import CancelIcon from '@mui/icons-material/Cancel'

const Editor = dynamic(
  () => {
    return import('draft-js').then((module) => module.Editor)
  },
  { ssr: false }
)

type EditorBaseProps = {
  post?: Post
  saveFunction: (title: string, content: string, file: File | null) => void
  changeFile?: () => void
}

export const EditorBase: FC<EditorBaseProps> = ({
  post,
  saveFunction,
  changeFile,
}) => {
  const router = useRouter()

  const [thumbnail, setThumbnail] = useState<string | StaticImageData>()

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [file, setFile] = useState<File | null>(null)

  const [title, setTitle] = useState('')

  /**
   * サムネイルの削除ボタンが押されたときの処理
   */
  const handleThumbnailDeleteButtonClick = () => {
    setThumbnail(undefined)
    setFile(null)
    if (changeFile) changeFile()
  }

  /**
   * エディターの状態
   */
  const [editorState, setEditorState] = useState(() => {
    if (post && post.content) {
      const contentState = convertFromRaw(JSON.parse(post.content))
      return EditorState.createWithContent(contentState)
    }
    return EditorState.createEmpty()
  })

  /**
   * エディターの内容が変更されたときの処理
   * @param editorState
   */
  const handleChangeEditor = (editorState: EditorState) => {
    setEditorState(editorState)
  }

  /**
   * サムネイル画像のファイル選択ボタンが押されたときの処理
   */
  const handleThumbnailButtonClick = () => {
    if (!fileInputRef.current) return
    fileInputRef.current.click()
  }

  /**
   * 保存ボタンが押されたときの処理
   */
  const handleSaveButtonClick = async () => {
    const contentState = editorState.getCurrentContent()
    const raw = convertToRaw(contentState)
    const content = JSON.stringify(raw)

    saveFunction(title, content, file)
  }

  /**
   * inputでファイルが変更されたときの処理
   * @param event
   * @returns
   */
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target || !event.target.files) return
    setFile(event.target.files[0])
    previewFile(event, setThumbnail)
    if (changeFile) changeFile()
  }

  useEffect(() => {
    if (!post || !post.title) return
    setTitle(post.title)

    if (!post.thumbnail_path) return
    setThumbnail(getImgPath(post.thumbnail_path))
  }, [post])

  return (
    <div className={style['page-container']}>
      <div className={style.sidebar}>
        {/* TODO:サイドバー */}
        <div className={style['thumbnail-wrap']}>
          {thumbnail ? (
            <>
              <IconButton
                className={style['close-icon-btn']}
                onClick={handleThumbnailDeleteButtonClick}
              >
                <CancelIcon />
              </IconButton>
              <Image
                src={thumbnail}
                alt=""
                fill
                style={{
                  objectFit: 'cover',
                }}
              />
            </>
          ) : (
            <IconButton
              className={style['add-thumbnail-icon-btn']}
              onClick={handleThumbnailButtonClick}
            >
              <input
                hidden
                type="file"
                onChange={(e) => handleFileChange(e)}
                ref={fileInputRef}
                accept=".jpg,.jpeg,.png,"
              />
              <AddPhotoAlternateIcon
                fontSize="large"
                style={{ color: 'white' }}
              />
            </IconButton>
          )}
        </div>
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
