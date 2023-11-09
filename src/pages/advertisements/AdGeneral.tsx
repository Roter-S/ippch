import { type Advertisement } from '../../types/Types'
import AnnouncementCard from '../../components/common/cards/AnnouncementCard'
import SkeletonAdvertisement from '../../components/common/skeleton/SkeletonAdvertisement'
import { Box } from '@mui/material'
import Grid from '@mui/material/Grid'
import Item from '../../components/common/grid/Item'
import { useEffect, useState } from 'react'

export default function AdGeneral ({ advertisements }: { advertisements: Advertisement[] }) {
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    if (advertisements.length > 0) {
      setLoading(false)
    }
  }, [advertisements])
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, md: 6, lg: 12 }}>
        {
          loading
            ? <SkeletonAdvertisement />
            : (advertisements.length === 0
                ? <p>No hay anuncios</p>
                : (advertisements.map((advertisementF: Advertisement) => (
                  <Grid item xs={12} md={3} lg={3} key={advertisementF.id}>
                    <Item>
                      <AnnouncementCard
                          id={advertisementF.id}
                          key={advertisementF.id}
                          title={advertisementF.title}
                          description={advertisementF.description}
                          content={advertisementF.content}
                          image={advertisementF.image}
                          imagePath={advertisementF.imagePath}
                          createdBy={advertisementF.createdBy}
                          startDate={advertisementF.startDate.toString()}
                          endDate={advertisementF.endDate.toString()}
                      />
                    </Item>
                  </Grid>
                  )))
              )
      }
      </Grid>
    </Box>
  )
}
