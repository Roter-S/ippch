import { Box, Container, Typography } from '@mui/material'
import WarningIcon from '@mui/icons-material/Warning'
const Error404 = () => {
  return (
    <Box sx={{ width: '100%', height: '100vh' }}>
      <Container
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: '100%'
        }}
      >
        <div style={{ textAlign: 'center', width: '100%' }}>
          <Typography variant="h1" gutterBottom>
            <WarningIcon sx={{ fontSize: '5rem' }} color="error"/>
            404
          </Typography>
          <Typography variant="h5" paragraph>
            La página que buscas no existe.
          </Typography>
        </div>
      </Container>
    </Box>
  )
}

export default Error404
