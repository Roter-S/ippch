import SkeletonDO from '../skeleton/SkeletonDO'
import { styled } from '@mui/material/styles'
import MainCard from './MainCard'
import { Box, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import Item from '../Grid/Item'
import { type ReactNode } from 'react'

interface CardProps {
  isLoading: boolean
  icon: ReactNode
  value: number
  title: string
  backgroundColor?: string
  background?: string
}

const DashboardOne = ({ isLoading, icon, value, title, backgroundColor, background }: CardProps) => {
  const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
      content: '""',
      position: 'absolute',
      width: 210,
      height: 210,
      background,
      borderRadius: '50%',
      top: -85,
      right: -95,
      [theme.breakpoints.down('sm')]: {
        top: -105,
        right: -140
      }
    },
    '&:before': {
      content: '""',
      position: 'absolute',
      width: 210,
      height: 210,
      background,
      borderRadius: '50%',
      top: -125,
      right: -15,
      opacity: 0.5,
      [theme.breakpoints.down('sm')]: {
        top: -155,
        right: -70
      }
    }
  }))
  return (
    <>
    {isLoading
      ? (<SkeletonDO />)
      : (
    <CardWrapper>
      <Box>
        <Grid container direction="column">
          <Grid item>
            <Grid container alignItems="center">
              <Grid item
                sx={{
                  backgroundColor: background,
                  color: 'white',
                  borderRadius: '10px',
                  paddingX: '4px',
                  paddingBottom: '0px',
                  marginRight: '2px'
                }}
              >
                {icon}
              </Grid>
              <Grid item>
                <Typography
                  sx={{
                    fontSize: '2.125rem',
                    fontWeight: 500,
                    mr: 1,
                    mt: 1.75,
                    mb: 0.75
                  }}
                >
                  {value ?? '0'}
                </Typography>
              </Grid>
            </Grid>
            <Grid sx={{ mb: 1.25 }}>
              <Typography
                sx={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: 'white'
                }}
              >
                {title ?? 'Descripción'}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </CardWrapper>
        )}
    </>
  )
}

export default DashboardOne
