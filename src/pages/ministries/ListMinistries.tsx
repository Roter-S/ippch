import { useEffect, useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { Container, Divider, Grid, Typography } from '@mui/material'
import PageviewIcon from '@mui/icons-material/Pageview'
import { type GridRowId, type GridColDef, DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid'
import AlertDelete from '../../components/common/AlertDelete'
import ModalCreate from './ModalCreate'
import { getCollection } from '../../utils/firestoreUtils'
import type { Ministries } from '../../types/Types'
import MainCard from '../../components/common/cards/MainCard'
import { useAlert } from '../../context/AlertContext'

export async function loader () {
  const ministries: Ministries[] = await getCollection('ministries') as Ministries[]
  return ministries
}

const ListMinistries = () => {
  const showAlert = useAlert()
  const [ministries, setMinistries] = useState<Ministries[]>([])
  const naigate = useNavigate()
  const dataLoader = useLoaderData()
  useEffect(() => {
    if (dataLoader instanceof Array) {
      setMinistries(dataLoader as Ministries[])
    }
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
            icon={<PageviewIcon color='ochre' sx={{ fontSize: 30 }}/>}
            label="Edit"
            className="textPrimary"
            onClick={() => { naigate(`${id}`) }}
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
      </Container>
    </MainCard>
  )
}
export default ListMinistries
