import Base from '@/components/layouts/base'
import { NextPage } from 'next'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import style from '@/styles/pages/settings.module.scss'
import { Avatar, Box, Button, IconButton, TextField } from '@mui/material'
import AppDialog from '@/components/elements/dialog'
import PetsIcon from '@mui/icons-material/Pets'
import { getImgPath, previewFile } from '@/utils/img'
import Image from 'next/image'
import usePublicUserStore from '@/stores/public_user'
import { useUpdateUserMutation } from '@/hooks/useMutateUsers'
import useSnackbarStore from '@/stores/snackbar'
import {
  useCreateFileMutation,
  useDeleteFileMutation,
} from '@/hooks/useMutateFiles'
import AppSnackbar from '@/components/elements/Snackbar'
import CancelIcon from '@mui/icons-material/Cancel'
import AccountDeleteButton from '@/components/elements/button/accountDeleteButton'

const Settings: NextPage = () => {
  const createFileMutation = useCreateFileMutation()
  const updateUserMutation = useUpdateUserMutation()
  const deleteFileMutation = useDeleteFileMutation()

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const { update: updateSnackbar } = useSnackbarStore()

  const { data: publicUser } = usePublicUserStore()

  const [name, setName] = useState<string>('')

  const [icon, setIcon] = useState<string>('')

  const [isOpenDialog, setIsOpenDialog] = useState(false)

  const [file, setFile] = useState<File | null>(null)

  /**
   * アカウント削除ボタンが押されたときの処理
   */
  const handleClickAccountDeleteButton = () => {
    setIsOpenDialog(true)
  }

  /**
   * サムネイル画像のファイル選択ボタンが押されたときの処理
   */
  const handleIconButtonClick = () => {
    fileInputRef.current?.click()
  }

  /**
   * inputでファイルが変更されたときの処理
   * @param event
   * @returns
   */
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target?.files?.[0] ?? null)
    previewFile(event, setIcon)
  }

  /**
   * プロフィール画像の削除ボタンが押されたときの処理
   */
  const handleIconDeleteButtonClick = () => {
    setIcon('')
    setFile(null)
  }

  /**
   * 保存ボタンが押されたときの処理
   */
  const handleSubmit = async () => {
    if (!publicUser) return

    updateSnackbar({
      isOpen: true,
      message: '保存中です...',
      severity: undefined,
      isLoading: true,
    })

    let iconPath: string | null = null

    // アイコン画像をアップロード
    if (file) {
      await createFileMutation.mutateAsync(
        { file, uploadPath: publicUser.user_id },
        {
          onSuccess: (data: { path: string | null }) => {
            iconPath = data.path
          },
        }
      )
    }

    if (publicUser.icon_path && !file) {
      deleteFileMutation.mutate([publicUser.icon_path])
    }

    // プロフィールを更新
    updateUserMutation.mutate(
      {
        editProfile: {
          handle_name: name,
          icon_path: iconPath,
        },
        id: publicUser.id,
      },
      {
        onSuccess: () => {
          updateSnackbar({
            isOpen: true,
            message: '更新が完了しました',
            severity: 'success',
          })
        },
        onError: () => {
          updateSnackbar({
            isOpen: true,
            message: '更新に失敗しました',
            severity: 'error',
          })
        },
      }
    )
    setIsOpenDialog(false)
  }

  useEffect(() => {
    if (!publicUser) return
    setName(publicUser.handle_name)
    const imgPath = getImgPath(publicUser.icon_path, false)
    if (typeof imgPath == 'string') setIcon(imgPath)
  }, [publicUser])

  return (
    <Base title="設定">
      <div className={style['page-content']}>
        <Box className={style['box']}>
          <h1>設定</h1>
          <div className={style['form-item']}>
            <label>アイコン</label>
            <div className={style['icon-wrap']}>
              {icon && (
                <IconButton
                  className={style['close-icon-btn']}
                  onClick={handleIconDeleteButtonClick}
                >
                  <CancelIcon />
                </IconButton>
              )}
              <Avatar className={style['avatar']}>
                {icon ? (
                  <>
                    <Image src={icon} alt="" fill />
                  </>
                ) : (
                  <PetsIcon fontSize="large" />
                )}
              </Avatar>
            </div>
            <Button
              variant="outlined"
              style={{
                marginTop: '16px',
                width: '300px',
              }}
              onClick={handleIconButtonClick}
            >
              <input
                hidden
                type="file"
                onChange={handleFileChange}
                ref={fileInputRef}
                accept=".jpg,.jpeg,.png,"
              />
              プロフィール画像をアップロード
            </Button>
          </div>
          <div className={style['form-item']}>
            <label>ユーザー名</label>
            <TextField
              className={style['text-field']}
              type="text"
              required
              variant="outlined"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
              }}
            />
          </div>
          <Button
            variant="contained"
            className={style['button-submit']}
            onClick={handleSubmit}
          >
            保存
          </Button>
        </Box>

        <Box className={style['box']}>
          <div>
            <div>アカウント削除</div>
            <p
              style={{
                marginTop: '16px',
              }}
            >
              一度アカウントを削除すると、元に戻せません。十分ご注意ください。
            </p>
            <Button
              color="error"
              variant="contained"
              onClick={handleClickAccountDeleteButton}
              style={{
                marginTop: '16px',
              }}
            >
              アカウントを削除する
            </Button>
          </div>
          <AppDialog
            open={isOpenDialog}
            title="アカウント削除"
            onClose={() => setIsOpenDialog(false)}
            actionButton={
              <AccountDeleteButton onDeleted={() => setIsOpenDialog(false)} />
            }
          >
            <div>アカウントを削除しますか？</div>
          </AppDialog>
        </Box>
      </div>
      <AppSnackbar />
    </Base>
  )
}

export default Settings
