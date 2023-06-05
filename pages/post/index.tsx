import Base from '@/components/layouts/Base'
import { useState } from 'react'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import styleCommon from '@/styles/common/foundation/common.module.scss'
import {
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Toolbar,
  Paper,
  Tooltip,
} from '@mui/material'
import { useDeletePostMutation } from '@/hooks/useMutatePosts'
import { useRouter } from 'next/router'
import { format } from 'date-fns'
import { useQueryPostsByUserId } from '@/hooks/useQueryPosts'
import FilterListIcon from '@mui/icons-material/FilterList'
import { useQueryClient } from 'react-query'
import { Post } from '@/types/types'
import Link from 'next/link'
import useUserStore from '@/stores/user'

export const ManagePost = () => {
  const router = useRouter()

  const queryClient = useQueryClient()

  const { data: user } = useUserStore()

  const { data: posts } = useQueryPostsByUserId(user ? user.id : null)

  const deletePostMutation = useDeletePostMutation()

  const [targetPost, setTargetPost] = useState<string>('')

  const [targetPosts, setTargetPosts] = useState<string[]>([])

  const tableHeadRow = ['タイトル', '公開日', '設定']

  /**
   * 記事の削除
   * @param post_id 記事ID
   */
  const handleDeleteButtonClick = async (postId: string) => {
    handleMenuClose()
    deletePostMutation.mutate(postId, {
      onSuccess: () => {
        queryClient.invalidateQueries('postsByUserId')
      },
    })
  }

  /**
   * 記事をまとめて削除
   */
  const handleCheckboxDeleteButtonClick = async () => {
    targetPosts.forEach((targetId) => {
      deletePostMutation.mutate(targetId, {
        onSuccess: () => {
          queryClient.invalidateQueries('postsByUserId')
          setTargetPosts([])
        },
      })
    })
  }

  /**
   * TableHeadの一括チェックボックスのチェック状態
   * 全ての記事が選択されている場合はtrue（一つも記事がない場合はfalse）
   */
  const isAllChecked =
    targetPosts.length === posts?.length && targetPosts.length !== 0

  /**
   * テーブルヘッダーのチェックボックスのクリックイベント
   */
  const handleHeaderCheckboxClick = (event: React.ChangeEvent) => {
    setTargetPosts([])
    const target = event.target as HTMLInputElement
    if (target.checked && posts) {
      setTargetPosts(posts.map((post: Post) => post.id))
    }
  }

  // Menuのアンカー要素
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)

  // TableCellのMenuの開閉状態
  const [isOpenTableCellSettingMenu, setIsOpenTableCellSettingMenu] =
    useState<boolean>(false)

  // TableHeaderのMenuの開閉状態
  const [isOpenTableHeaderFilterMenu, setIsOpenTableHeaderFilterMenu] =
    useState<boolean>(false)

  /**
   * 記事の設定ボタンのクリックイベント
   */
  const handleClickTableCellSetting = (
    event: React.MouseEvent<HTMLButtonElement>,
    post_id: string
  ) => {
    setTargetPost(post_id)
    setMenuAnchorEl(event.currentTarget)
    setIsOpenTableCellSettingMenu(true)
  }

  /**
   * TableHeaderのフィルターボタンのクリックイベント
   */
  const handleClickTableHeaderFilter = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setMenuAnchorEl(event.currentTarget)
    setIsOpenTableHeaderFilterMenu(true)
  }

  /**
   * メニューを閉じる
   */
  const handleMenuClose = () => {
    setMenuAnchorEl(null)
    setIsOpenTableCellSettingMenu(false)
    setIsOpenTableHeaderFilterMenu(false)
  }

  return (
    <Base title="記事">
      <h1 className={styleCommon['page-title']}>記事管理</h1>
      <div className="page-content">
        <div className="">
          <Box
            className=""
            sx={{
              textAlign: 'right',
              marginBottom: '20px',
            }}
          >
            <Button
              variant="contained"
              onClick={() => {
                router.push('/post/new')
              }}
            >
              New
            </Button>
          </Box>
          <Box>
            <Paper>
              <Toolbar>
                {targetPosts.length > 0 && (
                  <>
                    <div>{targetPosts.length}件の記事を選択中</div>
                    <Button
                      variant="outlined"
                      onClick={handleCheckboxDeleteButtonClick}
                      sx={{
                        marginLeft: '20px',
                      }}
                    >
                      削除
                    </Button>
                  </>
                )}
                <Tooltip
                  title="Filter list"
                  sx={{ marginLeft: 'auto', marginRight: 0 }}
                >
                  <IconButton onClick={handleClickTableHeaderFilter}>
                    <FilterListIcon />
                  </IconButton>
                </Tooltip>
                <Menu
                  id="basic-menu"
                  anchorEl={menuAnchorEl}
                  open={isOpenTableHeaderFilterMenu}
                  onClose={handleMenuClose}
                >
                  <MenuItem>フィルター</MenuItem>
                </Menu>
              </Toolbar>
              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isAllChecked}
                          onChange={handleHeaderCheckboxClick}
                        />
                      </TableCell>
                      {tableHeadRow.map((row, index, array) => (
                        <TableCell
                          key={index}
                          align={index == array.length - 1 ? 'right' : 'left'}
                        >
                          {index == array.length - 1 ? '' : row}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {posts &&
                      posts.map((row) => {
                        // チェックボックスのチェック状態
                        const isChecked = targetPosts.includes(row.id)
                        // チェックボックスのクリックイベント
                        const handleCheckboxClick = (
                          event: React.ChangeEvent
                        ) => {
                          const target = event.target as HTMLInputElement
                          if (target.checked) {
                            setTargetPosts([...targetPosts, row.id])
                          } else {
                            setTargetPosts(
                              targetPosts.filter((id) => id !== row.id)
                            )
                          }
                        }

                        return (
                          <TableRow
                            key={row.id}
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                            }}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={isChecked}
                                onChange={handleCheckboxClick}
                              />
                            </TableCell>
                            <TableCell>
                              <Link href={`/post/${row.id}`}>{row.title}</Link>
                            </TableCell>
                            <TableCell>
                              {format(new Date(row.created_at), 'yyyy/MM/dd')}
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                className=""
                                onClick={(e) =>
                                  handleClickTableCellSetting(e, row.id)
                                }
                              >
                                <MoreHorizIcon />
                              </IconButton>
                              <Menu
                                id="basic-menu"
                                anchorEl={menuAnchorEl}
                                open={isOpenTableCellSettingMenu}
                                onClose={handleMenuClose}
                              >
                                <MenuItem
                                  onClick={() =>
                                    handleDeleteButtonClick(targetPost)
                                  }
                                >
                                  削除
                                </MenuItem>
                              </Menu>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </div>
      </div>
    </Base>
  )
}

export default ManagePost
