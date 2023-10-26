import { Outlet } from 'react-router-dom'
import MainCard from '../../components/common/cards/MainCard'

const Index = () => {
  return (
    <MainCard>
      <Outlet />
    </MainCard>
  )
}

export default Index
