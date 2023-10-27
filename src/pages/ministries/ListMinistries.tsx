import { useEffect, useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import type { Ministries } from '../../types/Types'
import { getCollection } from '../../utils/firestoreUtils'
import { type GridRowId, type GridColDef, DataGrid, GridToolbar } from '@mui/x-data-grid'
import AlertDelete from '../../components/common/AlertDelete'
import { Container, Divider, Grid, Typography } from '@mui/material'
import ModalCreate from './ModalCreate'
import MUISnackbar from '../../components/common/MUISnackbar'
import { timerAlert } from '../../constants/constants'

export async function loader () {
  const ministries: Ministries[] = await getCollection('ministries')
  return ministries
}

const ListMinistries = () => {
  const [ministries, setMinistries] = useState<Ministries[]>([])
  const [alert, setAlert] = useState<{ message: string, type: 'success' | 'info' | 'warning' | 'error' } | null>(null)
  const dataLoader = useLoaderData()
  useEffect(() => {
    if (dataLoader instanceof Array) {
      setMinistries(dataLoader as Ministries[])
    }
  }, [])

  const updateFetchMinistries = async () => {
    const ministries: Ministries[] = await getCollection('ministries')
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

  const showAlert = (message: string, type: 'success' | 'info' | 'warning' | 'error') => {
    setAlert({ message, type })
    setTimeout(() => {
      setAlert(null)
    }, timerAlert)
  }

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <Typography variant="h4" component="h2" gutterBottom>
            Ministerios
          </Typography>
        </Grid>
        <Grid>
          <ModalCreate returnResponse={(message, type) => {
            showAlert(message, type)
            void updateFetchMinistries()
          }}/>
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
      {alert !== null && <MUISnackbar autoHideDuration={timerAlert} vertical='top' horizontal='center' alert={alert}/>}
    </Container>
  )
}
export default ListMinistries
