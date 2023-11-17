import { Typography, Box, Link, Container } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'

const PageUnderConstruction = () => {
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
          <SettingsIcon color="primary" sx={{ fontSize: '19rem' }} className="rotating-icon" />
          <Typography variant="h4" gutterBottom>
            Sitio en Construcción
          </Typography>
          <Typography variant="body1" paragraph>
            <Link color="secondary.main" href="/admin" underline="hover">
              Estamos trabajando en mejorar nuestro sitio. Vuelve pronto para ver las novedades.
            </Link>
          </Typography>
        </div>
      </Container>
    </Box>
  )
}

export default PageUnderConstruction
