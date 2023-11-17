import { useEffect, useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { Container, Divider, Grid, Typography } from '@mui/material'
import PageviewIcon from '@mui/icons-material/Pageview'
import { type GridRowId, type GridColDef, DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid'
import AlertDelete from '../../../components/common/AlertDelete'
import ModalCreate from './ModalCreate'
import { getCollection, getDocument } from '../../../utils/firestoreUtils'
import type { Ministries, User } from '../../../types/Types'
import MainCard from '../../../components/common/cards/MainCard'
import { useAlert } from '../../../context/AlertContext'
import { getAuth } from 'firebase/auth'

export async function loader () {
  const ministries: Ministries[] = await getCollection('ministries') as Ministries[]
  return ministries
}

const ListMinistries = () => {
  const showAlert = useAlert()
  const [ministries, setMinistries] = useState<Ministries[]>([])
  const [user, setUser] = useState<User | undefined>()
  const navigate = useNavigate()
  const dataLoader = useLoaderData()
  useEffect(() => {
    const auth = getAuth()
    const getUser = async () => {
      if (auth.currentUser != null) {
        const userDoc = await getDocument('users', auth.currentUser.uid)
        setUser(userDoc as User)
      }
    }
    if (dataLoader instanceof Array) {
      setMinistries(dataLoader as Ministries[])
    }
    void getUser()
  }, [])

  const updateFetchMinistries = async () => {
    const ministries: Ministries[] = await getCollection('ministries') as Ministries[]
    setMinistries(ministries)
  }

  const handleDeleteClick = (id: GridRowId) => () => {
    setMinistries(ministries.filter((ministry) => ministry.id !== id))
  }

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Nombre', width: 250 },
    { field: 'description', headerName: 'Descripción', width: 250 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Acciones',
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            key={id}
            icon={<PageviewIcon color='warning' sx={{ fontSize: 30 }}/>}
            label="Edit"
            className="textPrimary"
            onClick={() => { navigate(`${id}`) }}
            color="inherit"
          />,
          <AlertDelete
            key={id}
            id={String(id)}
            collectionName={String('ministries')}
            onUpdate={handleDeleteClick(String(id))}
          />
        ]
      }
    }
  ]

  return (
    <MainCard sx={{ paddingTop: 5 }}>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <Typography variant="h4" component="h2" gutterBottom>
              Ministerios
            </Typography>
          </Grid>
          <Grid>
            {
               (user != null) && user.roles.some(role => role === 'admin')
                 ? (
                  <ModalCreate returnResponse={(message, type) => {
                    showAlert(message, type)
                    void updateFetchMinistries()
                  }}/>
                   )
                 : null
            }
          </Grid>
        </Grid>
        <Divider />
        <Grid container paddingTop={6} spacing={3}>
          <Grid>
          </Grid>
          <Grid item xs={10}>
            <DataGrid
              sx={{
                border: 'none',
                '@media (max-width: 600px)': {
                  width: 'calc(100vw - 120px)'
                },
                height: 550
              }}
              rows={ministries}
              columns={columns}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true
                }
              }}
            />
          </Grid>
          <Grid>
          </Grid>
        </Grid>
      </Container>
    </MainCard>
  )
}
export default ListMinistries
