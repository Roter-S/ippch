import { Paper, Typography } from '@mui/material'
import MainCard from '../../components/common/cards/MainCard'

const Welcome = () => {
  return (
    <MainCard sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
    <Paper elevation={3} sx={{ textAlign: 'center', padding: 2, borderRadius: 12, maxWidth: 400 }}>
        <Typography variant="h4" component="div" sx={{ mb: 2, color: 'primary.main' }}>
          ¡Bienvenido!
        </Typography>
        <Typography variant="body1" component="div" sx={{ mb: 2 }}>
          Para comenzar a usar la aplicación, por favor seleccione una opción del menú lateral.
        </Typography>
        <Typography variant="body1" component="div" sx={{ color: 'text.secondary' }}>
          Si no tiene acceso a ninguna opción, por favor contacte al administrador.
        </Typography>
    </Paper>
  </MainCard>
  )
}

export default Welcome
