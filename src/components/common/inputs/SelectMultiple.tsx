import { Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, type SelectChangeEvent } from '@mui/material'
import React from 'react'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

interface Item {
  id: string
  name?: string
}
interface Props {
  label: string
  items: Item[]
  onUpdate: (items: string[]) => void
}

const SelectMultiple = ({ items, label, onUpdate }: Props) => {
  const [options, setOptions] = React.useState<string[]>([])
  const handleChange = (event: SelectChangeEvent<typeof options>) => {
    const {
      target: { value }
    } = event
    setOptions(
      typeof value === 'string' ? value.split(',') : value
    )
  }
  React.useEffect(() => {
    onUpdate(options)
  }, [options, onUpdate])
  return (
    <FormControl fullWidth>
      <InputLabel id="multiple-chip-label">{label}</InputLabel>
      <Select
        labelId="multiple-chip-label"
        multiple
        value={options}
        onChange={handleChange}
        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => {
              const selectedItem = items.find(item => item.id === value)
              return (
                <Chip key={value} label={(selectedItem != null) ? selectedItem.name : value} />
              )
            })}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {items.map((item) => (
          <MenuItem
            key={item.id}
            value={item.id}
          >
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
export default SelectMultiple
