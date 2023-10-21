import { List, ListItem, Skeleton, Stack } from '@mui/material'

const SkeletonNameApp = () => {
  return (<Stack spacing={1} padding={2}>
    <List>
      <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="text" width={100} sx={{ fontSize: '2rem', marginLeft: '5px' }} />
        </ListItem>
    </List>
  </Stack>)
}

export default SkeletonNameApp
