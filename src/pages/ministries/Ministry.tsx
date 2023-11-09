import { type SyntheticEvent, useEffect, useState } from 'react'
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
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { useAlert } from '../../context/AlertContext'

export async function loader ({ params }: { params: { ministryId: string } }) {
  const data = { users: [], ministry: {} }
  const users: User[] = await getCollection('users') as User[]
  const ministryDoc = await getDocument('ministries', params.ministryId)
  const ministry: Ministries | undefined = ministryDoc as Ministries | undefined
  const groupsCollection = await getCollection('groups')
  const updatedGroups: Groups[] | undefined = []
  if (ministry != null && Array.isArray(ministry.groups) && ministry.groups.length > 0) {
    ministry.id = params.ministryId
    ministry.groups.forEach((group) => {
      const groupMinistry: Groups[] = groupsCollection.filter((groupCollection) => groupCollection.id === group.id) as Groups[]
      if (groupMinistry.length > 0) {
        groupMinistry.forEach((group) => {
          group.leaders = group.leaders.map((leader) => {
            const user = users.find((user) => user.id === leader.id)
            return user as User
          })
          if (Array.isArray(group.members) && group.members.length > 0) {
            group.members = group.members.map((member) => {
              const user = users.find((user) => user.id === member.id)
              return user as User
            })
          }
        })
      }
      updatedGroups?.push(...groupMinistry)
    })
    ministry.groups = updatedGroups
  }
  if (Array.isArray(users) && users.length > 0) {
    data.users = users as never[]
    data.ministry = ministry as never
    return data
  } else {
    return { users: [], ministry: {} }
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
}

interface MinistriesWithGroups {
  id: string
  name: string
  description: string
  groups?: Groups[]
}

const CreateMinistry = () => {
  const showAlert = useAlert()
  const dataLoader = useLoaderData() as DataLoader
  const navigate = useNavigate()
  const [users, setUsers] = useState<UserList[]>([])
  const [formDataGroup, setFormDataGroup] = useState<initialValues>({
    name: '',
    description: '',
    leaders: [],
    members: []
  })
  const [selectedLeaders, setSelectedLeaders] = useState([])
  const [selectedMembers, setSelectedMembers] = useState([])
  const [ministryData, setMinistryData] = useState<MinistriesWithGroups>({
    id: '',
    name: '',
    description: '',
    groups: []
  })
  const [formGroupErrors, setFormGroupErrors] = useState<Record<string, string>>({})
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const usersList: UserList[] = dataLoader.users.map((user) => ({
      id: user.id,
      name: user.displayName
    }))
    setUsers(usersList)
    setMinistryData(dataLoader.ministry as MinistriesWithGroups)
  }, [dataLoader])

  const MinistrySchema = Yup.object().shape({
    name: Yup.string()
      .min(5, '¡Muy corto!')
      .max(30, 'Demasiado largo')
      .required('Es obligatorio'),
    description: Yup.string()
      .min(10, '¡Muy corto!')
      .max(250, 'Demasiado largo')
      .required('Es obligatorio')
  })

  const handleSubmitMinistry = async (value: any) => {
    try {
      await updateDocument('ministries', ministryData.id, value)
      showAlert('Se ha guardado correctamente', 'success')
    } catch (error: Error | any) {
      showAlert(error.message, 'error')
    }
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
    const fetchMinistry = await getDocument('ministries', ministryData.id)
    const newGroups = await getCollection('groups')
    if ((fetchMinistry != null) && (newGroups != null)) {
      newGroups.forEach((group) => {
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
      fetchMinistry.groups = newGroups
      setMinistryData(fetchMinistry as MinistriesWithGroups)
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
      formDataGroup.leaders = formDataGroup.leaders.map((leader) => {
        return getRef('users', leader.id)
      })
      formDataGroup.members = formDataGroup.members.map((member) => {
        return getRef('users', member.id)
      })

      const dataGroup = {
        ministry: getRef('ministries', ministryData.id),
        name: formDataGroup.name,
        description: formDataGroup.description,
        leaders: formDataGroup.leaders,
        members: formDataGroup.members
      }

      try {
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
                  const getRefGroup = getRef('groups', formDataGroup.id)
                  const containsGroup = groups.some(ref => ref.id === getRefGroup.id)
                  if (!containsGroup) {
                    groups.push(getRefGroup)
                  }
                }

                const ministries: any[] = fetchUser.ministries ?? []
                const getRefMinistry = getRef('ministries', ministryData.id)
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
                  const getRefGroup = getRef('groups', formDataGroup.id)
                  const containsGroup = groups.some(ref => ref.id === getRefGroup.id)
                  if (!containsGroup) {
                    groups.push(getRefGroup)
                  }
                }
                const ministries: any[] = fetchUser.ministries ?? []
                const getRefMinistry = getRef('ministries', ministryData.id)
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
          if (ministryData.groups == null) {
            ministryData.groups = []
          }
          const oldGroups = ministryData.groups.map((group) => getRef('groups', group.id))
          const newGroup = await createDocument('groups', dataGroup)
          await updateDocument('groups', newGroup.id, {
            id: newGroup.id
          })
          await updateDocument('ministries', ministryData.id, {
            groups: [...oldGroups, newGroup]
          })
          formDataGroup.id = newGroup.id
          void updateFormDataGroup()
          showAlert('Se ha guardado correctamente', 'success')
        }
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

  const [value, setValue] = useState('2')

  const handleChange = (_event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const editGroup = (id: string) => {
    const group: Groups | undefined = ministryData.groups?.find((group) => group.id === id)
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
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label={ministryData.name} value="1" />
            <Tab label="Grupos" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={12} md={10} lg={5}>
              <MainCard>
                <Typography variant="h5" component="h2" gutterBottom>
                  Editar Ministerio
                </Typography>
                <Box sx={{ flexGrow: 1, marginTop: 6 }}>
                  <Formik
                    initialValues={{
                      name: ministryData.name,
                      description: ministryData.description
                    }}
                    validationSchema={MinistrySchema}
                    onSubmit={handleSubmitMinistry}
                  >
                    {({ isSubmitting, errors, isValid }) => (
                      <Form>
                        <Grid container>
                          <Grid item xs={12} sm={12} md={12}>
                            <Item>
                              <Field
                                as={TextField}
                                label="Nombre del Ministerio"
                                fullWidth
                                type="text"
                                name="name"
                                variant="outlined"
                                error={Boolean(errors?.name)}
                                helperText={errors?.name}
                              />
                            </Item>
                            <Item>
                              <Field
                                as={TextField}
                                label="Descripción del Ministerio"
                                fullWidth
                                multiline
                                rows={4}
                                type="text"
                                name="description"
                                variant="outlined"
                                error={Boolean(errors?.description)}
                                helperText={errors?.description}
                              />
                            </Item>
                          </Grid>
                        </Grid>
                        <Grid container justifyContent="flex-end">
                          <Grid item>
                            <LoadingButton
                              variant="contained"
                              type="submit"
                              color='secondary'
                              startIcon={<SaveIcon />}
                              disabled={!isValid}
                              loading={isSubmitting}
                            >
                              Guardar
                            </LoadingButton>
                          </Grid>
                        </Grid>
                      </Form>
                    )}
                  </Formik>
                </Box>
              </MainCard>
            </Grid>
          </Grid>
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
                                items={users}
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
                                items={users}
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
                    <ListGroup groups={ministryData.groups} onEdit={editGroup}/>
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

export default CreateMinistry
