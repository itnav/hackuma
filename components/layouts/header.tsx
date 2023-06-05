import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import AdbIcon from '@mui/icons-material/Adb'
import style from '../../styles/common/component/layout/header.module.scss'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useMutateAuth } from '@/hooks/useMutateAuth'
import usePublicUserStore from '@/stores/public_user'
import { getImgPath } from '@/utils/img'

const pages = [
  { name: 'Event', path: '/event' },
  { name: 'Report', path: '/report' },
]

const userMenu = [
  { name: 'マイページ', path: '/mypage' },
  { name: 'ダッシュボード', path: '/dashboard' },
  { name: '設定', path: '/settings' },
]

function Header() {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const router = useRouter()

  const { data: publicUser } = usePublicUserStore()

  const { signOut } = useMutateAuth()

  const [iconPath, setIconPath] = useState<string>()

  useEffect(() => {
    if (!publicUser?.icon_path) return
    const path = getImgPath(publicUser?.icon_path, false)
    if (typeof path === 'string') setIconPath(path)
  }, [])

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon />
          <Link className={style['logo']} href="/">
            LOGO
          </Link>
          <Box className={style['right-box']}>
            {publicUser ? (
              // ログインしている場合
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu}>
                  <Avatar src={iconPath} />
                </IconButton>
              </Tooltip>
            ) : (
              // ログインしていない場合
              <>
                <Button
                  className={style['btn-white']}
                  variant="outlined"
                  onClick={() => router.push('/sign-in')}
                >
                  ログイン
                </Button>
                <Button
                  className={style['btn-outlined-white']}
                  variant="outlined"
                  onClick={() => router.push('/sign-up')}
                >
                  新規登録
                </Button>
              </>
            )}

            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {userMenu.map((page) => (
                <MenuItem
                  key={page.name}
                  onClick={() => router.push(page.path)}
                >
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
              <MenuItem onClick={signOut}>
                <Typography textAlign="center">ログアウト</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>

        <Box className={`${style['bottom-box']} ${style['bottom-box']}`}>
          {pages.map((page) => (
            <Button
              className={style['bottom-box-btn']}
              key={page.name}
              onClick={() => router.push(page.path)}
            >
              {page.name}
            </Button>
          ))}
        </Box>
      </Container>
    </AppBar>
  )
}
export default Header
