import { useQuery } from '@tanstack/react-query'
import { useRoute } from '@react-navigation/native'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import { formatBase64String } from '../utilities/formatting'
import ScrollView from '../components/ScrollView'
import PostTile from '../components/PostTile'
import LoadingSpinner from '../components/LoadingSpinner'
import Scroller from '../components/Scroller'
import Padder from '../components/Padder'
import { View, Image, StyleSheet } from 'react-native'
import { Divider } from 'react-native-paper'
import { Title2 } from 'react-native-ios-kit'

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    gap: 20
  },
  pictureDisplay: {
    justifyContent: "center",
    alignItems: "center",
    gap: 20
  },
  pictureDisplayImage: {
    borderRadius: 5
  }
})

const fetchPosts = async (picture, customerId) => {
  const payload = {
    picture,
    customer_id: customerId
  }
  const posts = await requestServer(
    "/posts_service/search_posts_by_image",
    payload
  )

  return posts
}

const PictureDisplay = ({ picture }) => {
  return (
    <View style={styles.pictureDisplay}>
      <Title2>
        Resultados de la búsqueda por imagen
      </Title2>

      <Image
        style={styles.pictureDisplayImage}
        source={{
          uri: formatBase64String(picture),
          height: 200,
          width: 300
        }}
      />
    </View>
  )
}

const PostsList = ({ picture }) => {
  const [session, _] = useSession()

  const postsQuery = useQuery({
    queryKey: ["picturePostResults"],
    queryFn: () => fetchPosts(picture, session.data.customerId)
  })

  if (postsQuery.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  return (
    <ScrollView
      data={postsQuery.data}
      keyExtractor={(post) => post.post_id}
      renderItem={({ item }) => <PostTile post={item} />}
      emptyIcon="basket"
      emptyMessage="No se encontraron resultados"
    />
  )
}

export default () => {
  const route = useRoute()

  const { picture } = route.params

  return (
    <Scroller>
      <Padder>
        <PictureDisplay picture={picture} />

        <Divider style={{ width: "90%" }} />

        <PostsList picture={picture} />
      </Padder>
    </Scroller>
  )
}
