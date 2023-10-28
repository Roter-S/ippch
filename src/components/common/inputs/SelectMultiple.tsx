import { Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, type SelectChangeEvent } from '@mui/material'
import { useEffect, useState } from 'react'

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
  selectedItems: string[]
}

const SelectMultiple = ({ items, label, onUpdate, selectedItems }: Props) => {
  const [options, setOptions] = useState<string[]>([])

  useEffect(() => {
    setOptions(selectedItems)
  }, [selectedItems])

  const handleChange = (event: SelectChangeEvent<typeof options>) => {
    const {
      target: { value }
    } = event
    setOptions(
      typeof value === 'string' ? value.split(',') : value
    )
  }

  useEffect(() => {
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
            {selected.map((value, index) => {
              const selectedItem = items.find(item => item.id === value)
              return (
                <Chip key={index} label={(selectedItem != null) ? selectedItem.name : value} />
              )
            })}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {items.map((item, index) => (
          <MenuItem
            key={index}
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
