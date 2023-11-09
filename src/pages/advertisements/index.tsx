import { type SyntheticEvent, useState, useEffect } from 'react'
import { Box, Grid, Tab, Typography } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import MainCard from '../../components/common/cards/MainCard'
import ModalCreate from './ModalCreate'
import AdGeneral from './AdGeneral'
import { timerAlert } from '../../constants/constants'
import MUISnackbar from '../../components/common/MUISnackbar'
import { getAuth } from 'firebase/auth'
import { getCollection, getDocument } from '../../utils/firestoreUtils'
import { type Advertisement, type Groups, type Ministries, type User } from '../../types/Types'
import { type Timestamp } from 'firebase/firestore'

function formatFirebaseTimestamp (timestamp: Timestamp): string {
  if (timestamp?.seconds != null && timestamp.nanoseconds != null) {
    const date = new Date(timestamp.seconds * 1000)
    return date.toLocaleString()
  } else {
    return 'Timestamp no válido'
  }
}
export default function Advertisements () {
  const [tab, setTab] = useState('1')
  const [advertisements, setAdvertisements] = useState<any[]>([])
  const [alert, setAlert] = useState<{ message: string, type: 'success' | 'info' | 'warning' | 'error' } | null>(null)
  const [user, setUser] = useState<User>()
  const [ministries, setMinistries] = useState<Ministries[]>()
  const [groups, setGroups] = useState<Groups[]>([])

  useEffect(() => {
    const auth = getAuth()
    const getUser = async () => {
      if (auth.currentUser != null) {
        const userDoc = await getDocument('users', auth.currentUser.uid)
        setUser(userDoc as User)
      }
    }
    const advertisements = async () => {
      try {
        const advertisements = await getCollection('advertisements') as Advertisement[]
        const users: User[] = await getCollection('users') as User[]

        const updatedAdvertisements = advertisements.map((advertisementF: Advertisement) => {
          console.log('advertisementF', advertisementF.startDate)
          const startDate = formatFirebaseTimestamp(advertisementF.startDate)
          const endDate = formatFirebaseTimestamp(advertisementF.endDate)

          advertisementF.startDate = startDate
          advertisementF.endDate = endDate

          advertisementF.createdBy = users.find((user: User) => user.id === advertisementF.createdBy.id) as User

          return advertisementF
        })

        setAdvertisements(updatedAdvertisements)
      } catch (error: Error | any) {
        showAlert(error.toString(), 'error')
        console.log(error)
      }
    }
    const ministries = async () => {
      const getMinistries = await getCollection('ministries') as Ministries[]
      setMinistries(getMinistries)
    }
    const groups = async () => {
      const getGroups = await getCollection('groups') as Groups[]
      setGroups(getGroups)
    }
    void getUser()
    void advertisements()
    void ministries()
    void groups()
  }, [])

  const handleChange = (_event: SyntheticEvent, newValue: string) => {
    setTab(newValue)
  }

  const updateFetchAd = async () => {
    const advertisements = await getCollection('advertisements')
    setAdvertisements(advertisements)
    showAlert('Anuncio creado', 'success')
  }

  const showAlert = (message: string, type: 'success' | 'info' | 'warning' | 'error') => {
    setAlert({ message, type })
    setTimeout(() => {
      setAlert(null)
    }, timerAlert)
  }
  return (
    <>
    <MainCard>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h4'>
              Anuncios
        </Typography>
        <ModalCreate user={user} ministries={ministries} groups={groups} returnResponse={(message, type) => {
          showAlert(message, type)
          void updateFetchAd()
        }}/>
      </Box>
      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="General" value="1" />
            <Tab label="Ministerio" value="2" />
            <Tab label="Grupo" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Box sx={{ width: '100%' }}>
            <Grid>
              <AdGeneral advertisements={advertisements} />
            </Grid>
          </Box>
        </TabPanel>
        <TabPanel value="2">Item Two</TabPanel>
        <TabPanel value="3">Item Three</TabPanel>
      </TabContext>
    </MainCard>
    {alert !== null && <MUISnackbar autoHideDuration={timerAlert} vertical='top' horizontal='center' alert={alert}/>}
    </>
  )
}
