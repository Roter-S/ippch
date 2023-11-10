import { type User, type Advertisement } from '../../types/Types'
import AnnouncementCard from '../../components/common/cards/AnnouncementCard'
import SkeletonAdvertisement from '../../components/common/skeleton/SkeletonAdvertisement'
import { Box } from '@mui/material'
import Grid from '@mui/material/Grid'
import Item from '../../components/common/grid/Item'
import { useEffect, useState } from 'react'
import { type Timestamp } from 'firebase/firestore'
import { getCollection } from '../../utils/firestoreUtils'

function formatFirebaseTimestamp (timestamp: Timestamp): string {
  if (timestamp?.seconds != null && timestamp.nanoseconds != null) {
    const date = new Date(timestamp.seconds * 1000)
    return date.toLocaleString()
  } else {
    return 'Timestamp no válido'
  }
}

function updateAdvertisementData (advertisement: Advertisement, users: User[]): Advertisement {
  const startDate = formatFirebaseTimestamp(advertisement.startDate)
  const endDate = formatFirebaseTimestamp(advertisement.endDate)

  const createdBy = users.find((user: User) => user.id === advertisement.createdBy.id) as User

  return {
    ...advertisement,
    startDate,
    endDate,
    createdBy
  }
}

export default function AdCardList ({ type, user }: { type: string, user: User | undefined }) {
  const [loading, setLoading] = useState<boolean>(true)
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([])
  useEffect(() => {
    try {
      const fetchAdvertisements = async () => {
        const getAdvertisements = await getCollection('advertisements', {
          filters: [['type', '==', type]],
          orderBy: [{ field: 'startDate', direction: 'desc' }]
        }) as Advertisement[]

        const users: User[] = (await getCollection('users')) as User[]

        const updatedAdvertisements = getAdvertisements.map((advertisement: Advertisement) => {
          return updateAdvertisementData(advertisement, users)
        })

        setAdvertisements(updatedAdvertisements)
        setLoading(false)
      }
      void fetchAdvertisements()
    } catch (error: Error | any) {
      console.log(error)
    }
  }, [user])
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, md: 6, lg: 12 }}>
        {
          loading
            ? <SkeletonAdvertisement />
            : (advertisements.length === 0
                ? (<Grid item xs={12} md={12} lg={12}>
                    <Item>
                      <h2>No hay anuncios</h2>
                    </Item>
                  </Grid>)
                : (advertisements.map((advertisement: Advertisement) => (
                  <Grid item xs={12} md={3} lg={3} key={advertisement.id}>
                    <Item>
                      <AnnouncementCard
                          id={advertisement.id}
                          key={advertisement.id}
                          title={advertisement.title}
                          description={advertisement.description}
                          content={advertisement.content}
                          image={advertisement.image}
                          imagePath={advertisement.imagePath}
                          createdBy={advertisement.createdBy}
                          startDate={advertisement.startDate.toString()}
                          endDate={advertisement.endDate.toString()}
                          type={advertisement.type}
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
