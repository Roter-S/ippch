import React from 'react'
import { useLoaderData } from 'react-router-dom'
import type { Ministries } from '../../types/Types'
import { getCollection } from '../../utils/firestoreUtils'
import { type GridRowId, type GridColDef, DataGrid, GridToolbar } from '@mui/x-data-grid'
import AlertDelete from '../../components/common/AlertDelete'
import { Container, Divider, Grid, Typography } from '@mui/material'
import MUIModal from '../../components/common/MUIModal'

export async function loader () {
  const ministries: Ministries[] = await getCollection('ministries')
  return ministries
}

const ListMinistries = () => {
  const [ministries, setMinistries] = React.useState<Ministries[]>([])
  const dataLoader = useLoaderData()
  React.useEffect(() => {
    if (dataLoader instanceof Array) {
      setMinistries(dataLoader as Ministries[])
    }
  }, [])

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

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid xs={10}>
          <Typography variant="h4" component="h2" gutterBottom>
            Ministerios
          </Typography>
        </Grid>
        <Grid xs>
          <MUIModal />
        </Grid>
      </Grid>
      <Divider />
      <Grid container paddingTop={6} spacing={3}>
        <Grid xs>
        </Grid>
        <Grid xs={10}>
          <DataGrid
            sx={{
              border: 'none',
              '@media (max-width: 600px)': {
                width: 'calc(100vw - 95px)'
              },
              height: 650
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
        <Grid xs>
        </Grid>
      </Grid>
    </Container>
  )
}
export default ListMinistries
