import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogProps,
} from '@mui/material'
import { FC, ReactNode } from 'react'

type Pops = DialogProps & {
  title?: string
  children?: ReactNode
  onClose?: () => void
  actionButton: ReactNode
}

export const AppDialog: FC<Pops> = ({
  title,
  children,
  onClose,
  actionButton,
  ...props
}) => {
  return (
    <Dialog onClose={onClose} {...props}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>閉じる</Button>
        {actionButton}
      </DialogActions>
    </Dialog>
  )
}

export default AppDialog
