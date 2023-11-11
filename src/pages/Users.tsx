import * as React from 'react'
import { DataGrid, type GridColDef, GridToolbar, type GridRowId } from '@mui/x-data-grid'
import { Avatar, List, Divider, ListItem, ListItemText, Typography } from '@mui/material'
import { getCollection } from '../utils/firestoreUtils'
import AlertDelete from '../components/common/AlertDelete'
import MainCard from '../components/common/cards/MainCard'
import { type Ministries, type Groups, type User } from '../types/Types'
import { useLoaderData } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

export async function loader () {
  const users: User[] = await getCollection('users') as User[]
  const ministries: Ministries[] = await getCollection('ministries') as Ministries[]
  const groups: Groups[] = await getCollection('groups') as Groups[]

  users.forEach((user) => {
    user.ministries = ministries.filter((ministry) => user.ministries.some((ministry2) => ministry2.id === ministry.id))
    user.groups = groups.filter((group) => user.groups.some((group2) => group2.id === group.id))
  })
  return users
}

const Users = () => {
  const [users, setUsers] = React.useState<User[]>([])
  const dataLoader = useLoaderData()

  React.useEffect(() => {
    if (dataLoader instanceof Array) {
      setUsers(dataLoader as User[])
    }
  }, [dataLoader])

  const handleDeleteClick = (id: GridRowId) => () => {
    setUsers(users.filter((user) => user.id !== id))
  }

  const columns: GridColDef[] = [
    { field: 'displayName', headerName: 'Nombre', width: 250 },
    { field: 'email', headerName: 'Correo electrónico', width: 250 },
    {
      field: 'photoURL',
      headerName: 'Foto de perfil',
      renderCell: ({ value }) => <Avatar alt="user" src={value as string} />
    },
    {
      field: 'roles',
      headerName: 'Roles',
      width: 250,
      renderCell: ({ value }) => {
        if (value.length > 0) {
          return (
            <List>
              {
                value.map((role: string) => (
                  <ListItem disablePadding key={uuidv4()}>
                    <ListItemText primary={role} />
                  </ListItem>
                ))
              }
            </List>
          )
        } else {
          return <Typography key={uuidv4()} variant="body2">Sin asignación</Typography>
        }
      }
    },
    {
      field: 'ministries',
      headerName: 'Ministerios',
      width: 250,
      renderCell: ({ value }) => {
        if (value.length > 0) {
          return (
            <List>
              {
                value.map((ministry: Ministries) => (
                  <ListItem disablePadding key={uuidv4()}>
                    <ListItemText primary={ministry.name} />
                  </ListItem>
                ))
              }
            </List>
          )
        } else {
          return <Typography key={uuidv4()} variant="body2">Sin asignación</Typography>
        }
      }
    },
    {
      field: 'groups',
      headerName: 'Grupo',
      width: 200,
      renderCell: ({ value }) => (
        <List>
          {
            value.map((group: Groups) => (
              <ListItem disablePadding key={uuidv4()}>
                <ListItemText primary={group.name} />
              </ListItem>
            ))
          }
        </List>
      )
    },
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
            collectionName={String('users')}
            onUpdate={handleDeleteClick(String(id))}
          />
        ]
      }
    }
  ]

  return (
    <MainCard>
      <Typography variant="h5" gutterBottom>
        Usuarios
      </Typography>
      <Divider />
      <DataGrid
        sx={{
          border: 'none',
          '@media (max-width: 600px)': {
            width: 'calc(100vw - 95px)'
          },
          height: 650
        }}
        getRowHeight={() => 'auto'}
        rows={users}
        columns={columns}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true
          }
        }}
      />
    </MainCard>
  )
}
export default Users
