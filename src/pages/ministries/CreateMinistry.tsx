import {
  Divider,
  FormHelperText,
  Grid,
  Link,
  TextField
} from '@mui/material'
import { useLoaderData, useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SaveIcon from '@mui/icons-material/Save'
import React from 'react'
import { type User } from '../../types/Types'
import { getCollection } from '../../utils/firestoreUtils'
import { LoadingButton } from '@mui/lab'
import SelectMultiple from '../../components/common/inputs/SelectMultiple'

export async function loader () {
  const users: User[] = await getCollection('users')
  if (Array.isArray(users) && users.length > 0) {
    return users
  } else {
    return []
  }
}

interface UserList {
  id: string
  name?: string
}

interface initialValues {
  ministryName: string
  ministryDescription: string
  nameGroup: string
  groupDescription: string
  leaders: UserList[]
  members: UserList[]
}

const CreateMinistry = () => {
  const dataLoader = useLoaderData() as User[]
  const navigate = useNavigate()
  const [users, setUsers] = React.useState<UserList[]>([])

  const [formData, setFormData] = React.useState<initialValues>({
    ministryName: '',
    ministryDescription: '',
    nameGroup: '',
    groupDescription: '',
    leaders: [],
    members: []
  })

  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    const usersList: UserList[] = dataLoader.map((user) => ({
      id: user.uid,
      name: user.displayName
    }))
    setUsers(usersList)
  }, [dataLoader])

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    const errors: Record<string, string> = {}

    if (name === 'ministryName' && value.trim() === '') {
      errors.ministryName = 'El nombre del Ministerio es obligatorio'
    } else if (name === 'ministryDescription' && value.trim() === '') {
      errors.ministryDescription = 'La descripción del Ministerio es obligatoria'
    } else if (name === 'nameGroup' && value.trim() === '') {
      errors.nameGroup = 'El nombre del Grupo es obligatorio'
    } else if (name === 'groupDescription' && value.trim() === '') {
      errors.groupDescription = 'La descripción del Ministerio es obligatoria'
    } else if (name === 'leaders' && formData.leaders.length === 0) {
      errors.leaders = 'Debes asignar al menos un líder'
    } else if (name === 'members' && formData.members.length === 0) {
      errors.members = 'Debes asignar al menos un usuario'
    }

    setFormErrors(errors)
  }

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errors: Record<string, string> = {}

    if (formData.ministryName.trim() === '') {
      errors.ministryName = 'El nombre del Ministerio es obligatorio'
    }

    if (formData.ministryDescription.trim() === '') {
      errors.ministryDescription = 'La descripción del Ministerio es obligatoria'
    }

    if (formData.nameGroup.trim() === '') {
      errors.nameGroup = 'El nombre del Grupo es obligatorio'
    }

    if (formData.groupDescription.trim() === '') {
      errors.groupDescription = 'La descripción del grupo es obligatoria'
    }

    if (formData.leaders.length === 0) {
      errors.leaders = 'Debes asignar al menos un líder'
    }

    if (formData.members.length === 0) {
      errors.members = 'Debes asignar al menos un usuario'
    }

    if (Object.keys(errors).length === 0) {
      setFormErrors({
        ministryName: '',
        ministryDescription: '',
        nameGroup: '',
        groupDescription: '',
        leaders: '',
        members: ''
      })
      console.log(formData)
    } else {
      setFormErrors(errors)
    }
  }

  return (
    <Grid item xs={12}>
      <Link onClick={() => { navigate('/admin/ministries') }} variant="h5" underline="none">
        <ArrowBackIcon />
        Crear Ministerio
      </Link>
      <Divider />
      <Grid container marginTop={5} direction="row" justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={12} md={8} lg={6} xl={4}>
          <form onSubmit={handleSubmit as React.FormEventHandler<HTMLFormElement>}>
            <Grid margin={2}>
              <TextField
                fullWidth
                label="Nombre del Ministerio"
                type="text"
                name="ministryName"
                variant="outlined"
                onChange={handleInputChange as React.ChangeEventHandler}
                value={formData.ministryName}
                error={Boolean(formErrors.ministryName)}
                helperText={formErrors.ministryName}
              />
            </Grid>
            <Grid margin={2}>
              <TextField
                fullWidth
                label="Descripción del Ministerio"
                type="text"
                name="ministryDescription"
                variant="outlined"
                onChange={handleInputChange as React.ChangeEventHandler}
                value={formData.ministryDescription}
                error={Boolean(formErrors.ministryDescription)}
                helperText={formErrors.ministryDescription}
              />
            </Grid>
            <Grid margin={2}>
              <TextField
                fullWidth
                label="Nombre del Grupo"
                type="text"
                name="nameGroup"
                variant="outlined"
                onChange={handleInputChange as React.ChangeEventHandler}
                value={formData.nameGroup}
                error={Boolean(formErrors.nameGroup)}
                helperText={formErrors.nameGroup}
              />
            </Grid>
            <Grid margin={2}>
              <TextField
                fullWidth
                label="Descripción del Grupo"
                type="text"
                name="groupDescription"
                variant="outlined"
                onChange={handleInputChange as React.ChangeEventHandler}
                value={formData.groupDescription}
                error={Boolean(formErrors.groupDescription)}
                helperText={formErrors.groupDescription}
              />
            </Grid>
            <Grid margin={2}>
              <SelectMultiple
                label="Asignar líder"
                items={users}
                onUpdate={(options) => {
                  const leaders: UserList[] = options.map((option) => {
                    return users.find((user) => user.id === option) as UserList
                  })
                  formData.leaders = leaders
                }}
              />
              {Boolean(formErrors.leaders) && (<FormHelperText error>{formErrors.leaders}</FormHelperText>)}
            </Grid>
            <Grid margin={2}>
              <SelectMultiple
                label="Asignar usuarios"
                items={users}
                onUpdate={(options) => {
                  const members: UserList[] = options.map((option) => {
                    return users.find((user) => user.id === option) as UserList
                  })
                  formData.members = members
                }}
              />
              {Boolean(formErrors.members) && (<FormHelperText error>{formErrors.members}</FormHelperText>)}
            </Grid>
            <Grid margin={2}>
              <LoadingButton
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                fullWidth
                type="submit"
                startIcon={<SaveIcon />}
              >
                Crear
              </LoadingButton>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default CreateMinistry
