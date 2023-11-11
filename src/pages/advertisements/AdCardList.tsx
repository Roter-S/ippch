import { type User, type Advertisement } from '../../types/Types'
import AnnouncementCard from '../../components/common/cards/AnnouncementCard'
import SkeletonAdvertisement from '../../components/common/skeleton/SkeletonAdvertisement'
import { Box } from '@mui/material'
import Grid from '@mui/material/Grid'
import Item from '../../components/common/grid/Item'
import { useEffect, useState } from 'react'
import { type Timestamp } from 'firebase/firestore'
import { getCollection } from '../../utils/firestoreUtils'
import { useAlert } from '../../context/AlertContext'

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
  const showAlert = useAlert()
  const [loading, setLoading] = useState<boolean>(true)
  const [advertisements, setAdvertisements] = useState<Array<Advertisement | undefined>>([])
  useEffect(() => {
    try {
      const fetchAdvertisements = async () => {
        try {
          const getAdvertisements = await getCollection('advertisements', {
            filters: [['type', '==', type]],
            orderBy: [{ field: 'startDate', direction: 'desc' }]
          }) as Advertisement[]

          const users: User[] = (await getCollection('users')) as User[]

          const updatedAdvertisements = getAdvertisements
            .filter((advertisement: Advertisement) => {
              if ((user?.roles.some((role: string) => role === 'admin')) ?? false) {
                return updateAdvertisementData(advertisement, users)
              } else if ((user?.roles.some((role: string) => role === 'leader')) ?? false) {
                const matchingAdvertisements = advertisement.ministries.some(ministry =>
                  user?.ministries.some(userMinistry => userMinistry.id === ministry.id)
                )
                if ((matchingAdvertisements && advertisement.type === 'ministry') || advertisement.type === 'general') {
                  return updateAdvertisementData(advertisement, users)
                } else {
                  return false
                }
              } else if ((user?.roles.some((role: string) => role === 'member')) ?? false) {
                const matchingAdvertisements = advertisement.groups.some(group =>
                  user?.groups.some(userGroup => userGroup.id === group.id)
                )
                if ((matchingAdvertisements && advertisement.type === 'group') || advertisement.type === 'general') {
                  return updateAdvertisementData(advertisement, users)
                } else {
                  return false
                }
              }
              return false
            })
            .filter((advertisement: Advertisement | false) => advertisement !== false)

          setAdvertisements(updatedAdvertisements)
          setLoading(false)
        } catch (error: Error | any) {
          showAlert(error.message, 'error')
          console.error('Error fetching advertisements:', error)
        }
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
                : (advertisements.map((advertisement: Advertisement | undefined) => {
                    if (advertisement != null) {
                      return (
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
                              ministries={advertisement.ministries}
                              groups={advertisement.groups}
                              type={advertisement.type}
                          />
                        </Item>
                      </Grid>
                      )
                    }
                    return null
                  }))
              )
      }
      </Grid>
    </Box>
  )
}
