import React, { useState, useEffect } from 'react'
import { Box, Grid, Tab, Typography } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import MainCard from '../../components/common/cards/MainCard'
import ModalCreate from './ModalCreate'
import AdCardList from './AdCardList'
import { getAuth } from 'firebase/auth'
import { getCollection, getDocument } from '../../utils/firestoreUtils'
import { type Groups, type Ministries, type User } from '../../types/Types'
import { useAlert } from '../../context/AlertContext'

function Advertisements () {
  const showAlert = useAlert()
  const [tab, setTab] = useState('1')
  const [user, setUser] = useState<User | undefined>()
  const [ministries, setMinistries] = useState<Ministries[] | undefined>()
  const [groups, setGroups] = useState<Groups[]>([])

  useEffect(() => {
    const auth = getAuth()

    const getUser = async () => {
      if (auth.currentUser != null) {
        const userDoc = await getDocument('users', auth.currentUser.uid)
        setUser(userDoc as User)
      }
    }

    const fetchMinistries = async () => {
      const getMinistries = (await getCollection('ministries')) as Ministries[]
      setMinistries(getMinistries)
    }

    const fetchGroups = async () => {
      const getGroups = (await getCollection('groups')) as Groups[]
      setGroups(getGroups)
    }

    void getUser()
    void fetchMinistries()
    void fetchGroups()
  }, [])

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue)
  }

  const updateFetchAd = async () => {
    try {
      showAlert('Anuncio creado', 'success')
    } catch (error: Error | any) {
      showAlert(error.toString(), 'error')
    }
  }

  return (
    <>
      <MainCard>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='h4'>Anuncios</Typography>
          <ModalCreate user={user} ministries={ministries} groups={groups} returnResponse={(message, type) => {
            showAlert(message, type)
            void updateFetchAd()
          }} />
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
                <AdCardList type='general' user={user}/>
              </Grid>
            </Box>
          </TabPanel>
          <TabPanel value="2">
            <AdCardList type='ministry' />
          </TabPanel>
          <TabPanel value="3">
            <AdCardList type='group' />
          </TabPanel>
        </TabContext>
      </MainCard>
    </>
  )
}

export default Advertisements
