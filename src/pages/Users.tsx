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
    if (user.groups.length > 0) {
      const resultGroups: Groups[] = []
      user.groups.forEach((group) => {
        const groupUpdate: Groups = groups.find((item) => item.id === group.id) as Groups
        if (groupUpdate !== undefined) {
          if (groupUpdate.leaders.length > 0) {
            const resultLeader: User[] = []
            groupUpdate.leaders.forEach((leader) => {
              const leaderUpdate = users.find((user) => user.id === leader.id)
              if (leaderUpdate !== undefined) {
                resultLeader.push(leaderUpdate)
              }
            })
            groupUpdate.leaders = resultLeader
          }

          if (groupUpdate.members !== undefined && groupUpdate.members.length > 0) {
            const resultMembers: User[] = []
            groupUpdate.members.forEach((member) => {
              const memberUpdate = users.find((user) => user.id === member.id)
              if (memberUpdate !== undefined) {
                resultMembers.push(memberUpdate)
              }
            })
            groupUpdate.members = resultMembers
          }
          resultGroups.push(groupUpdate)
        }
      })
      user.groups = resultGroups
      const resultMinistries: Ministries[] = []
      user.ministries.forEach((ministry) => {
        const ministryUpdate = ministries.find((item) => item.id === ministry.id)
        if (ministryUpdate !== undefined) {
          resultMinistries.push(ministryUpdate)
        }
      })
      user.ministries = resultMinistries
    }
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
  }, [])

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
