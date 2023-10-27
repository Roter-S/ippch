import * as React from 'react'
import { DataGrid, type GridColDef, GridToolbar, type GridRowId } from '@mui/x-data-grid'
import { Avatar, List, Divider, ListItem, ListItemText, Typography } from '@mui/material'
import { getCollection } from '../utils/firestoreUtils'
import AlertDelete from '../components/common/AlertDelete'
import MainCard from '../components/common/cards/MainCard'
import { getDoc } from 'firebase/firestore'
import { type Ministries, type Groups, type User } from '../types/Types'
import { useLoaderData } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

interface UserDocument {
  id: string
  displayName: string
  email: string
  photoURL: string
  ministries: Ministries[]
  groups: Groups[]
  roles: string[]
}

export async function loader () {
  const users: User[] = await getCollection('users')
  const userDocuments: UserDocument[] = []

  for (const user of users) {
    const ministries = user.ministries
    const ministriesDocs: Ministries[] = []

    if (Array.isArray(ministries) && ministries.length > 0) {
      for (const ministry of ministries) {
        const ministryDoc = await getDoc(ministry)
        if (ministryDoc.exists()) {
          ministriesDocs.push(ministryDoc.data() as Ministries)
        }
      }
    }

    const groups = user.groups
    const groupsDocs: Groups[] = []

    if (Array.isArray(groups) && groups.length > 0) {
      for (const group of groups) {
        const groupDoc = await getDoc(group)
        if (groupDoc.exists()) {
          groupsDocs.push(groupDoc.data() as Groups)
        }
      }
    }

    userDocuments.push({
      id: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      ministries: ministriesDocs,
      groups: groupsDocs,
      roles: user.roles
    })
  }
  return userDocuments
}

const Users = () => {
  const [users, setUsers] = React.useState<User[]>([])
  const dataLoader = useLoaderData()

  React.useEffect(() => {
    if (dataLoader instanceof Array) {
      setUsers(dataLoader as User[])
    }
  }, [])

  const handleDeleteClick = (id: GridRowId) => () => {
    setUsers(users.filter((user) => user.uid !== id))
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
        if (Array.isArray(value) && value.length > 0) {
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
        if (Array.isArray(value) && value.length > 0) {
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
      width: 100,
      renderCell: ({ value }) => {
        if (Array.isArray(value) && value.length > 0) {
          return (
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
        } else {
          return <Typography key={uuidv4()} variant="body2">Sin asignación</Typography>
        }
      }
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
          height: 550
        }}
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
