import * as React from 'react'
import { PieChart } from '@mui/x-charts/PieChart'
import { useDrawingArea } from '@mui/x-charts/hooks'
import { styled } from '@mui/material/styles'
import MainCard from '../../../components/common/cards/MainCard'
import { Typography } from '@mui/material'

const data = [
  { value: 5, label: 'A' },
  { value: 10, label: 'B' },
  { value: 15, label: 'C' },
  { value: 20, label: 'D' },
  { value: 20, label: 'E' },
  { value: 10, label: 'F' }
]
const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 20
}))

function PieCenterLabel ({ children }: { children: React.ReactNode }) {
  const { width, height, left, top } = useDrawingArea()
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  )
}

export default function ChartPie () {
  return (
    <MainCard>
       <Typography variant='h6'>
          Title
      </Typography>
      <PieChart
        colors={[
          '#64b5f6',
          '#f06292',
          '#fff176',
          '#b3e5fc',
          '#80cbc4',
          '#e57373'
        ]}
        height={450}
        series={[{ data, innerRadius: 80 }]}
      >
        <PieCenterLabel>Center label</PieCenterLabel>
      </PieChart>
    </MainCard>
  )
}
