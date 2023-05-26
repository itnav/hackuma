import Snackbar from '@mui/material/Snackbar'
import { FC, SyntheticEvent } from 'react'
import { Alert, CircularProgress } from '@mui/material'
import useSnackbarStore from '@/stores/snackbar'

export const AppSnackbar: FC = () => {
  const { data: snackbar, reset: resetSnackbar } = useSnackbarStore()

  const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    resetSnackbar()
  }

  return (
    <Snackbar
      open={snackbar.isOpen}
      autoHideDuration={3000}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={snackbar.severity}
        sx={{ width: '100%' }}
        icon={snackbar.isLoading && <CircularProgress size={18} />}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  )
}

export default AppSnackbar
