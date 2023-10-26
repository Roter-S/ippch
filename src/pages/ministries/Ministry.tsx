import * as React from 'react'
import { FormControl, FormControlLabel, InputLabel, Link, MenuItem, Select, Switch, TextField, Divider, Button } from '@mui/material'
import AddBoxIcon from '@mui/icons-material/AddBox'
import Grid from '@mui/material/Grid'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { getDocument } from '../../utils/firestoreUtils'
import { useLoaderData, useNavigate } from 'react-router-dom'
import type { Params } from 'react-router-dom'
import { type Ministries } from '../../types/Types'
import SelectMultiple from '../../components/common/inputs/SelectMultiple'

export async function loader ({ params }: { params: Params }) {
  const ministryId = params.ministryId ?? ''

  if (ministryId.length === 0) return {}

  return await getDocument('ministries', ministryId)
}

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder'
]

const Groups = () => {
  return (
    <Grid container spacing={2}>
      <Grid item>
        <FormControl variant="standard" sx={{ width: '220px' }}>
          <InputLabel id="simple-select-label">Seleccionar encargado</InputLabel>
          <Select
            labelId="simple-select-label"
            id="simple-select"
            value={10}
            label="Age"
            onChange={() => { console.log('hola') }}
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <TextField id="standard-basic" label="Nombre del grupo" variant="standard" />
      </Grid>
      <Grid item>
        <SelectMultiple label='Agregar usuarios' items={names}/>
      </Grid>
      <Grid item>
        <Button variant="contained" color='secondary' startIcon={<AddBoxIcon/>}>Agregar</Button>
      </Grid>
    </Grid>
  )
}

const Ministry = () => {
  const navigate = useNavigate()
  const data = useLoaderData()
  const [ministry, setMinistry] = React.useState<Ministries>()
  const [showGroups, setShowGroups] = React.useState(false)
  React.useEffect(() => {
    if (data instanceof Object) {
      setMinistry(data as Ministries)
    }
  }, [data])

  const handleSwitchChange = (event: { target: { checked: any } }) => {
    setShowGroups(event.target.checked)
  }

  return (
    <Grid container>
      <Link
        onClick={() => { navigate('/admin/ministries') }}
        variant='h5'
        underline="none">
        <ArrowBackIcon />
        {ministry?.name}
      </Link>
      <Divider />

      <Grid container marginTop={3} spacing={2}>
        <Grid item>
          <SelectMultiple label='Agregar encargados' items={names}/>
        </Grid>
        <Grid item>
          {showGroups ? null : <SelectMultiple label='Agregar usuarios' items={names}/>}
        </Grid>
      </Grid>
      <Grid container marginTop={3} spacing={1} marginLeft={1}>
        <FormControlLabel control={<Switch checked={showGroups} onChange={handleSwitchChange} />} label="Grupos" />
      </Grid>
      <Grid container marginTop={2} spacing={1}>
        <Grid item>
          {showGroups ? <Groups /> : null}
        </Grid>
      </Grid>
    </Grid>
  )
}
export default Ministry
