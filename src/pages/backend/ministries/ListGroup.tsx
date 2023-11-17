import { Divider, Paper } from '@mui/material'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { useState } from 'react'
import { type Groups } from '../../../types/Types'

interface SelectedListItemProps {
  groups: Groups[] | undefined
  onEdit: (id: string) => void
}

export default function SelectedListItem ({ groups, onEdit }: SelectedListItemProps) {
  const [selectedIndex, setSelectedIndex] = useState('')

  const handleListItemClick = (index: string) => {
    setSelectedIndex((prevIndex) => (prevIndex === index ? '' : index))
    onEdit(selectedIndex === index ? '' : index)
  }

  return (
    <Paper elevation={3} sx={{ width: '100%', maxHeight: '400px', overflowY: 'auto' }}>
      <List component="nav" aria-label="main mailbox folders">
        {
          ((groups != null) && groups.length > 0)
            ? groups.map((group: any) => (
              <div key={group.id}>
                <ListItemButton
                  selected={selectedIndex === group.id}
                  onClick={() => { handleListItemClick(group.id) }}
                >
                  <ListItemText primary={group.name} secondary={group.description} />
                </ListItemButton>
                <Divider />
              </div>
            ))
            : <ListItemText primary='No se encontraron resultados...' />
        }
      </List>
    </Paper>
  )
}
