import { Card, CardContent, CardHeader, Skeleton } from '@mui/material'
import Grid from '@mui/material/Grid'
import Item from '../grid/Item'

const SkeletonAdvertisement = () => {
  const repetitions = 4
  const skeleton = []
  for (let i = 0; i < repetitions; i++) {
    skeleton.push(
        <Grid item xs={12} md={3} lg={3} key={i}>
            <Item>
                <Card key={i} sx={{ maxWidth: 342 }}>
                    <CardHeader
                        avatar={<Skeleton animation="wave" variant="circular" width={40} height={40} />}
                        title={
                        <Skeleton
                            animation="wave"
                            height={10}
                            width="80%"
                            style={{ marginBottom: 6 }}
                        />
                    }
                        subheader={<Skeleton animation="wave" height={10} width="40%" />}
                    />
                    <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />
                    <CardContent>
                        <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                        <Skeleton animation="wave" height={10} width="80%" />
                    </CardContent>
                </Card>
            </Item>
        </Grid>
    )
  }
  return (
    <>
        { skeleton }
    </>
  )
}

export default SkeletonAdvertisement
