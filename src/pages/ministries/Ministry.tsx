import { type SyntheticEvent, useState } from 'react'
import {
  Box,
  FormHelperText,
  Grid,
  Link,
  Tab,
  TextField,
  Typography
} from '@mui/material'
import { useLoaderData, useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab'
import SaveIcon from '@mui/icons-material/Save'
import SelectMultiple from '../../components/common/inputs/SelectMultiple'
import Item from '../../components/common/grid/Item'
import MainCard from '../../components/common/cards/MainCard'
import ListGroup from './ListGroup'
import { createDocument, getCollection, getDocument, getRef, updateDocument } from '../../utils/firestoreUtils'
import { type Groups, type Ministries, type User } from '../../types/Types'

import { useAlert } from '../../context/AlertContext'
import EditMinistry from './EditMinistry'

export async function loader ({ params }: { params: { ministryId: string } }) {
  const users = (await getCollection('users'))
  const ministry = (await getDocument('ministries', params.ministryId))
  const ministryRef = await getRef('ministries', params.ministryId)
  const groups = await getCollection('groups', { filters: [['ministry', '==', ministryRef]] })
  if (users != null && ministry != null && groups != null) {
    groups.forEach((group) => {
      if (Array.isArray(group.leaders)) {
        group.leaders = group.leaders.map((leader: { id: string | undefined }) => {
          const user = users.find((user) => user.id === leader.id)
          return user as User
        })
      }
      if (Array.isArray(group.members)) {
        group.members = group.members.map((member: { id: string | undefined }) => {
          const user = users.find((user) => user.id === member.id)
          return user as User
        })
      }
    })
    return { users, ministry, groups }
  } else {
    return { users: [], ministry: {}, groups: [] }
  }
}

interface UserList {
  id: string
  name?: string
}

interface initialValues {
  id?: string
  name: string
  description: string
  leaders: UserList[]
  members: UserList[]
}

interface DataLoader {
  users: User[]
  ministry: Ministries
  groups: Groups[]
}

interface MinistriesWithGroups {
  id: string
  name: string
  description: string
  groups?: Groups[]
}

const Ministry = () => {
  const navigate = useNavigate()
  const showAlert = useAlert()
  const dataLoader = useLoaderData() as DataLoader
  const [groups, setGroups] = useState<Groups[]>(dataLoader.groups)
  const [ministry, setMinistry] = useState<MinistriesWithGroups>(dataLoader.ministry as MinistriesWithGroups)
  const [formDataGroup, setFormDataGroup] = useState<initialValues>({
    name: '',
    description: '',
    leaders: [],
    members: []
  })
  const [selectedLeaders, setSelectedLeaders] = useState([])
  const [selectedMembers, setSelectedMembers] = useState([])
  const [formGroupErrors, setFormGroupErrors] = useState<Record<string, string>>({})
  const [value, setValue] = useState('2')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const users: User[] = dataLoader.users
  const usersList: UserList[] = dataLoader.users.map((user) => ({
    id: user.id,
    name: user.displayName
  }))

  const handleChange = (_event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const handleInputChangeGroup = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormDataGroup({ ...formDataGroup, [name]: value })

    const errors: Record<string, string> = {}

    if (name === 'name' && value.trim() === '') {
      errors.name = 'El nombre del Grupo es obligatorio'
    } else if (name === 'description' && value.trim() === '') {
      errors.description = 'La descripción del Ministerio es obligatoria'
    } else if (name === 'leaders' && formDataGroup.leaders.length === 0) {
      errors.leaders = 'Debes asignar al menos un líder'
    } else if (name === 'members' && formDataGroup.members.length === 0) {
      errors.members = 'Debes asignar al menos un usuario'
    }

    setFormGroupErrors(errors)
  }

  const updateFormDataGroup = async () => {
    const fetchMinistry = await getDocument('ministries', ministry.id)
    const ministryRef = await getRef('ministries', ministry.id)
    const newGroups: Groups[] = await getCollection('groups', { filters: [['ministry', '==', ministryRef]] }) as Groups[]
    if ((fetchMinistry != null) && (newGroups != null)) {
      newGroups.forEach((group: Groups) => {
        if (Array.isArray(group.leaders)) {
          group.leaders = group.leaders.map((leader: { id: string | undefined }) => {
            const user = dataLoader.users.find((user) => user.id === leader.id)
            return user as User
          })
        }
        if (Array.isArray(group.members)) {
          group.members = group.members.map((member: { id: string | undefined }) => {
            const user = dataLoader.users.find((user) => user.id === member.id)
            return user as User
          })
        }
      })
      setGroups(newGroups)
      setMinistry(fetchMinistry as MinistriesWithGroups)
      setFormDataGroup({
        name: '',
        description: '',
        leaders: [],
        members: []
      })
      setSelectedLeaders([])
      setSelectedMembers([])
      setIsEditing(false)
    }
  }

  const handleSubmitGroup = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errors: Record<string, string> = {}

    if (formDataGroup.name.trim() === '') {
      errors.name = 'El nombre del Grupo es obligatorio'
    }

    if (formDataGroup.description.trim() === '') {
      errors.description = 'La descripción del grupo es obligatoria'
    }

    if (formDataGroup.leaders.length === 0) {
      errors.leaders = 'Debes asignar al menos un líder'
    }

    if (formDataGroup.members.length === 0) {
      errors.members = 'Debes asignar al menos un usuario'
    }

    if (Object.keys(errors).length === 0) {
      formDataGroup.leaders = await Promise.all(
        formDataGroup.leaders.map(async (leader) => {
          return await getRef('users', leader.id)
        })
      )
      formDataGroup.members = await Promise.all(
        formDataGroup.members.map(async (member) => {
          return await getRef('users', member.id)
        })
      )
      const dataGroup = {
        ministry: await getRef('ministries', ministry.id),
        name: formDataGroup.name,
        description: formDataGroup.description,
        leaders: formDataGroup.leaders,
        members: formDataGroup.members
      }

      try {
        setLoading(true)
        if ((formDataGroup.id != null) && isEditing) {
          if (formDataGroup.leaders.length > 0) {
            await Promise.all(formDataGroup.leaders.map(async (leader) => {
              const fetchUser = await getDocument('users', leader.id)
              if (fetchUser != null) {
                const roles: any[] = fetchUser.roles ?? []
                if (!roles.includes('leader')) {
                  roles.push('leader')
                }

                const groups: any[] = fetchUser.groups ?? []
                if (formDataGroup.id != null) {
                  const getRefGroup = await getRef('groups', formDataGroup.id)
                  const containsGroup = groups.some(ref => ref.id === getRefGroup.id)
                  if (!containsGroup) {
                    groups.push(getRefGroup)
                  }
                }

                const ministries: any[] = fetchUser.ministries ?? []
                const getRefMinistry = await getRef('ministries', ministry.id)
                const containsMinistry = ministries.some(ref => ref.id === getRefMinistry.id)
                if (!containsMinistry) {
                  ministries.push(getRefMinistry)
                }
                await updateDocument('users', leader.id, {
                  roles,
                  groups,
                  ministries
                })
              }
            }))
          }

          if (formDataGroup.members.length > 0) {
            await Promise.all(formDataGroup.members.map(async (member) => {
              const fetchUser = await getDocument('users', member.id)
              if (fetchUser != null) {
                const roles: any[] = fetchUser.roles ?? []
                if (!roles.includes('member')) {
                  roles.push('member')
                }
                const groups: any[] = fetchUser.groups ?? []
                if (formDataGroup.id != null) {
                  const getRefGroup = await getRef('groups', formDataGroup.id)
                  const containsGroup = groups.some(ref => ref.id === getRefGroup.id)
                  if (!containsGroup) {
                    groups.push(getRefGroup)
                  }
                }
                const ministries: any[] = fetchUser.ministries ?? []
                const getRefMinistry = await getRef('ministries', ministry.id)
                const containsMinistry = ministries.some(ref => ref.id === getRefMinistry.id)
                if (!containsMinistry) {
                  ministries.push(getRefMinistry)
                }
                await updateDocument('users', member.id, {
                  roles,
                  groups,
                  ministries
                })
              }
            }))
          }

          await updateDocument('groups', formDataGroup.id, {
            id: formDataGroup.id,
            ...dataGroup
          })
          void updateFormDataGroup()
          showAlert('Se ha editado correctamente', 'success')
        } else {
          if (ministry.groups == null) {
            ministry.groups = []
          }
          const oldGroups = ministry.groups.map(async (group) => await getRef('groups', group.id))
          console.log(dataGroup)
          const newGroup = await createDocument('groups', dataGroup)
          await updateDocument('groups', newGroup.id, {
            id: newGroup.id
          })
          await updateDocument('ministries', ministry.id, {
            groups: [...oldGroups, newGroup]
          })
          formDataGroup.id = newGroup.id
          void updateFormDataGroup()
          showAlert('Se ha guardado correctamente', 'success')
        }
        setLoading(false)
      } catch (error: Error | any) {
        showAlert(error.message, 'error')
      }

      setFormGroupErrors({
        name: '',
        description: '',
        leaders: '',
        members: ''
      })
    } else {
      setFormGroupErrors(errors)
    }
  }

  const editGroup = (id: string) => {
    const group: Groups | undefined = groups.find((group) => group.id === id)
    if (group != null) {
      const leadersDoc: User[] = group.leaders.filter((leader) => leader !== undefined)
      const membersDoc: User[] = group.members?.filter((member) => member !== undefined) as User[]

      const leaders: UserList[] = leadersDoc.map((leader) => ({
        id: leader.id,
        name: leader.displayName
      }))

      const members: UserList[] = membersDoc.map((member) => ({
        id: member.id,
        name: member.displayName
      }))

      setSelectedLeaders(leaders.map((leader) => leader.id) as never[])
      setSelectedMembers(members.map((member) => member.id) as never[])

      setFormDataGroup({
        id: group.id,
        name: group.name,
        description: group.description,
        leaders,
        members
      })
      setIsEditing(true)
    } else {
      setFormDataGroup({
        id: '',
        name: '',
        description: '',
        leaders: [],
        members: []
      })
      setSelectedLeaders([])
      setSelectedMembers([])
      setIsEditing(false)
    }
  }

  return (
    <Box sx={{ width: '100%', paddingTop: '20px' }}>
      <Link onClick={() => { navigate('/admin/ministries') }} variant="h5" underline="none">
        <ArrowBackIcon /> Regresar
      </Link>

      <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
          <TabList onChange={handleChange}>
            <Tab label={ministry.name} value="1" />
            <Tab label="Grupos" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <EditMinistry ministry={ministry} />
        </TabPanel>

        <TabPanel value="2">
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12} md={8}>
              <Item>
                <MainCard>
                    <Typography variant="h5" component="h2" gutterBottom>
                      Crear Grupo
                    </Typography>
                    <Box sx={{ flexGrow: 1, marginTop: 6 }}>
                      <form onSubmit={handleSubmitGroup as React.FormEventHandler<HTMLFormElement>}>
                        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                          <Grid item xs={12} sm={6} md={6} lg={3}>
                            <Item>
                              <TextField
                                fullWidth
                                label="Nombre del Grupo"
                                type="text"
                                name="name"
                                variant="outlined"
                                onChange={handleInputChangeGroup as React.ChangeEventHandler}
                                value={formDataGroup.name}
                                error={Boolean(formGroupErrors.name)}
                                helperText={formGroupErrors.name}
                              />
                            </Item>
                          </Grid>
                          <Grid item xs={12} sm={6} md={6} lg={3}>
                            <Item>
                              <TextField
                                fullWidth
                                label="Descripción del Grupo"
                                type="text"
                                name="description"
                                variant="outlined"
                                multiline
                                rows={4}
                                onChange={handleInputChangeGroup as React.ChangeEventHandler}
                                value={formDataGroup.description}
                                error={Boolean(formGroupErrors.description)}
                                helperText={formGroupErrors.description}
                              />
                            </Item>
                          </Grid>
                          <Grid item xs={12} sm={6} md={6} lg={3}>
                            <Item>
                              <SelectMultiple
                                label="Asignar líder"
                                items={usersList}
                                selectedItems={selectedLeaders}
                                onUpdate={(options) => {
                                  const leaders: UserList[] = options.map((option) => {
                                    return users.find((user) => user.id === option) as UserList
                                  })
                                  formDataGroup.leaders = leaders
                                }}
                                />
                              {Boolean(formGroupErrors.leaders) && (<FormHelperText error>{formGroupErrors.leaders}</FormHelperText>)}
                            </Item>
                          </Grid>
                          <Grid item xs={12} sm={6} md={6} lg={3}>
                            <Item>
                              <SelectMultiple
                                label="Asignar usuarios"
                                items={usersList}
                                selectedItems={selectedMembers}
                                onUpdate={(options) => {
                                  const members: UserList[] = options.map((option) => {
                                    return users.find((user) => user.id === option) as UserList
                                  })
                                  formDataGroup.members = members
                                }}
                              />
                              {Boolean(formGroupErrors.members) && (<FormHelperText error>{formGroupErrors.members}</FormHelperText>)}
                            </Item>
                          </Grid>
                        </Grid>
                        <Grid container justifyContent="flex-end">
                          {
                            isEditing
                              ? (
                                <LoadingButton
                                  variant="contained"
                                  color='secondary'
                                  sx={{ mt: 3, mb: 2 }}
                                  type="submit"
                                  startIcon={<SaveIcon />}
                                  loading={loading}
                                >
                                  Guardar
                                </LoadingButton>
                                )
                              : (
                                <LoadingButton
                                  variant="contained"
                                  sx={{ mt: 3, mb: 2 }}
                                  type="submit"
                                  startIcon={<SaveIcon />}
                                  loading={loading}
                                >
                                  Crear
                                </LoadingButton>
                                )
                          }
                        </Grid>
                      </form>
                    </Box>
                </MainCard>
              </Item>
            </Grid>
            <Grid item xs={12} md={4}>
              <Item>
                <MainCard>
                    <Typography variant="h5" component="h2" gutterBottom>
                      Grupos
                    </Typography>
                    <ListGroup groups={groups} onEdit={editGroup}/>
                  </MainCard>
              </Item>
            </Grid>
          </Grid>
        </TabPanel>
      </TabContext>
      </Box>
    </Box>
  )
}

export default Ministry
