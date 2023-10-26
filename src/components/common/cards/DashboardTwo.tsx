import { styled } from '@mui/material/styles'
import MainCard from './MainCard'
import { Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material'
import { type ReactNode } from 'react'
import SkeletonDT from '../skeleton/SkeletonDT'

interface CardProps {
  isLoading: boolean
  icon: ReactNode
  value: number
  title: string
  backgroundColor?: string
  background?: string
}

const DashboardTwo = ({ isLoading, icon, value, title, backgroundColor, background }: CardProps) => {
  const CardWrapper = styled(MainCard)(() => ({
    backgroundColor,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
      content: '""',
      position: 'absolute',
      width: 310,
      height: 210,
      background: `linear-gradient(210.04deg, ${background} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
      borderRadius: '50%',
      top: -30,
      right: -180
    },
    '&:before': {
      content: '""',
      position: 'absolute',
      width: 210,
      height: 210,
      background: `linear-gradient(140.9deg, ${background} -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
      borderRadius: '50%',
      top: -160,
      right: -130
    }
  }))
  return (
    <>
    {isLoading
      ? (<SkeletonDT />)
      : (
        <CardWrapper border={false} content={false}>
          <Box sx={{ px: 2 }}>
            <List sx={{ py: 0 }}>
              <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                <ListItemAvatar>
                {icon}
                </ListItemAvatar>
                <ListItemText
                  sx={{
                    py: 0,
                    mt: 1,
                    mb: 0.45
                  }}
                  primary={
                    <Typography variant="h4" sx={{ color: '#fff' }}>
                      {value ?? '0'}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="subtitle2" sx={{ color: 'primary.light' }}>
                      {title ?? 'Descripción'}
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Box>
        </CardWrapper>
        )}
    </>
  )
}

export default DashboardTwo
