import * as React from 'react'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'
import {
  type GridRowsProp,
  type GridRowModesModel,
  GridRowModes,
  DataGrid,
  type GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  type GridEventListener,
  type GridRowId,
  type GridRowModel,
  GridRowEditStopReasons
} from '@mui/x-data-grid'
import MainCard from '../components/common/cards/MainCard'
import Grid from '@mui/material/Unstable_Grid2'
import Item from '../components/common/Grid/Item'
import { Divider, Typography } from '@mui/material'
import { v4 as uuidv4 } from 'uuid'
import { createDocument, createOrUpdateDocument, listDocuments } from '../utils/firestoreUtils'
import AlertDelete from '../components/common/AlertDelete'

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void
}

interface RoleDocuments {
  id: string
  name: string | null
  description: string
  isNew?: boolean
}
function EditToolbar (props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props

  const handleClick = () => {
    const id = uuidv4()
    setRows((oldRows) => [...oldRows, { id, name: '', age: '', isNew: true }])
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' }
    }))
  }

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Añadir registro
      </Button>
    </GridToolbarContainer>
  )
}

export default function FullFeaturedCrudGrid () {
  const [rows, setRows] = React.useState<RoleDocuments[]>([])
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({})

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const roleDocuments = await listDocuments('roles')
        const rolesData = roleDocuments.map((ministry) => ministry.data)
        setRows(rolesData as RoleDocuments[])
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    void fetchUsers()
  }, [])

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id))
  }

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true }
    })

    const editedRow = rows.find((row) => row.id === id)
    if ((editedRow != null) && 'isNew' in editedRow && (Boolean(editedRow.isNew))) {
      setRows(rows.filter((row) => row.id !== id))
    }
  }

  const processRowUpdate = async (newRow: GridRowModel) => {
    const updatedRow: RoleDocuments = {
      id: newRow.id,
      name: newRow.name as string,
      description: newRow.description as string,
      isNew: false
    }
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)))
    rows.map(async (row) => {
      if (row.id === newRow.id) {
        await createOrUpdateDocument('roles', newRow.id, updatedRow)
      } else {
        await createDocument('roles', {
          name: newRow.name as string,
          description: newRow.description as string
        })
      }
    })
    return updatedRow
  }

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Nombre',
      width: 200,
      editable: true
    },
    {
      field: 'description',
      headerName: 'Descripción',
      type: 'string',
      width: 240,
      editable: true
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Acciones',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return [
            <GridActionsCellItem
                key={id}
                icon={<SaveIcon />}
                label="Save"
                sx={{
                  color: 'primary.main'
                }}
                onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
                key={id}
                icon={<CancelIcon />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(id)}
                color="inherit"
            />
          ]
        }

        return [
          <GridActionsCellItem
            key={id}
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <AlertDelete
            key={id}
            id={String(id)}
            collectionName={String('roles')}
            onUpdate={handleDeleteClick(String(id))}
          />
        ]
      }
    }
  ]

  return (
    <MainCard>
        <Typography variant="h4" component="h2" gutterBottom>
            Roles
        </Typography>
        <Divider />
        <Grid container spacing={3}>
          <Grid lg={3} md={1}>
          </Grid>
          <Grid lg={6} md={10} sm={12} xs={12}>
              <Item>
                  <DataGrid
                      sx={{
                        border: 'none',
                        '@media (max-width: 600px)': {
                          width: 'calc(100vw - 95px)'
                        },
                        height: 650
                      }}
                      rows={rows}
                      columns={columns}
                      editMode="row"
                      rowModesModel={rowModesModel}
                      onRowModesModelChange={handleRowModesModelChange}
                      onRowEditStop={handleRowEditStop}
                      processRowUpdate={processRowUpdate}
                      slots={{
                        toolbar: EditToolbar
                      }}
                      slotProps={{
                        toolbar: { setRows, setRowModesModel }
                      }}
                  />
              </Item>
          </Grid>
          <Grid lg={3} md={1}>
          </Grid>
        </Grid>
    </MainCard>
  )
}
