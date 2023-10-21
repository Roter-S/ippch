import { Backdrop } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'

const Loader = () => {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <CircularProgress color="secondary" />
    </Backdrop>
  )
}

export default Loader
