import MainCard from '../../../components/common/cards/MainCard'
import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography, useTheme } from '@mui/material'
import { LineChart } from '@mui/x-charts'

export default function ChartArea () {
  const theme = useTheme()
  const uData = [3, 8, 22, 5]
  const xLabels = [
    'Page A',
    'Page B',
    'Page C',
    'Page G'
  ]
  return (
    <MainCard>
      <Typography variant='h6'>
        Title
      </Typography>
      <LineChart
        height={150}
        series={[{ data: uData, label: 'uv', area: true, showMark: false, color: theme.palette.ochre.light }]}
        xAxis={[{ scaleType: 'point', data: xLabels }]}
        sx={{
          backgroundColor: theme.palette.ochre.main,
          borderRadius: '10px',
          '.MuiLineElement-root': {
            display: 'none'
          }
        }}
    />
    <List sx={{ width: '100%', maxWidth: 360 }}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
        </ListItemAvatar>
        <ListItemText
          primary="Brunch this weekend?"
          secondary={
            <>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                Ali Connors
              </Typography>
              {" — I'll be in your neighborhood doing errands this…"}
            </>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
        </ListItemAvatar>
        <ListItemText
          primary="Summer BBQ"
          secondary={
            <>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                to Scott, Alex, Jennifer
              </Typography>
              {" — Wish I could come, but I'm out of town this…"}
            </>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
        </ListItemAvatar>
        <ListItemText
          primary="Oui Oui"
          secondary={
            <>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                Sandra Adams
              </Typography>
              {' — Do you have Paris recommendations? Have you ever…'}
            </>
          }
        />
      </ListItem>
    </List>
    </MainCard>
  )
}
