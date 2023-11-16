import { type User, type Assists } from '../../../types/Types'
import { getCollection, getDocument } from '../../../utils/firestoreUtils'
import { useAlert } from '../../../context/AlertContext'
import { useEffect, useState } from 'react'
import MainCard from '../../../components/common/cards/MainCard'
import { Box, Button, CircularProgress, Container, Divider, Grid, Typography } from '@mui/material'
import { DataGrid, GridToolbar, type GridColDef, GridActionsCellItem, type GridRowId } from '@mui/x-data-grid'
import { useNavigate } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit'
import AlertDelete from '../../../components/common/AlertDelete'

const ListAssists = () => {
  const showAlert = useAlert()
  const navigate = useNavigate()
  const [assists, setAssists] = useState<Assists[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getAssists = async () => {
      try {
        const assistsCollect: Assists[] = await getCollection('assists', { orderBy: [{ field: 'createdAt', direction: 'desc' }] }) as Assists[]
        setAssists(assistsCollect)
        setLoading(false)
      } catch (error: Error | any) {
        showAlert(error.message, 'error')
        setLoading(false)
      }
    }
    void getAssists()
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'attendanceTaker',
      headerName: 'Creado por:',
      width: 190,
      renderCell: ({ value }) => {
        const [user, setUser] = useState<User>()
        useEffect(() => {
          const getUser = async () => {
            const userCollect: User = await getDocument('users', value.id) as User
            setUser(userCollect)
          }
          void getUser()
        }, [value])
        return (
          <Typography variant='body2'>{user?.displayName}</Typography>
        )
      }
    },
    { field: 'assistCount', headerName: 'Total de asistencia', width: 150 },
    {
      field: 'createdAt',
      headerName: 'Fecha',
      type: 'string',
      valueGetter: (params) => {
        const seconds = params.value?.seconds
        const date = new Date(seconds * 1000)
        const options: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: true
        }
        return date.toLocaleString(undefined, options)
      },
      width: 200
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Acciones',
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            key={id}
            icon={<EditIcon color='warning' sx={{ fontSize: 25 }}/>}
            label="Edit"
            className="textPrimary"
            onClick={() => { navigate(`${id}`) }}
            color="inherit"
          />,
          <AlertDelete
            key={id}
            id={String(id)}
            collectionName={String('assists')}
            onUpdate={handleDeleteClick(String(id))}
          />
        ]
      }
    }
  ]

  const handleDeleteClick = (id: GridRowId) => () => {
    setAssists(assists.filter((attendance) => attendance.id !== id))
  }

  return (
    <MainCard sx={{ paddingTop: 5 }}>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <Typography variant="h4" component="h2" gutterBottom>
              Asistencias
            </Typography>
          </Grid>
          <Grid>
            <Button variant="contained"
              onClick={() => { navigate('create') }}
            >Crear</Button>
          </Grid>
        </Grid>
        <Divider />
        <Grid container paddingTop={6}>
          <Grid item xs={8}>
            {
              loading
                ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
                    <CircularProgress size='1rem' color="inherit" />
                    <Typography variant='body2' marginLeft={1}>cargando...</Typography>
                  </Box>
                  )
                : (
                    assists.length > 0
                      ? (
                        <DataGrid
                          sx={{
                            border: 'none',
                            '@media (max-width: 600px)': {
                              width: 'calc(100vw - 120px)'
                            },
                            height: 550
                          }}
                          rows={assists}
                          columns={columns}
                          slots={{ toolbar: GridToolbar }}
                          slotProps={{
                            toolbar: {
                              showQuickFilter: true
                            }
                          }}
                        />
                        )
                      : (
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
                          <Typography variant='body2'>No hay asistencias registradas</Typography>
                        </Box>
                        )
                  )
            }
          </Grid>
        </Grid>
      </Container>
    </MainCard>
  )
}

export default ListAssists
