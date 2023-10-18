import { useQuery } from '@tanstack/react-query'
import { useRoute } from '@react-navigation/native'
import { requestServer } from '../utilities/requests'
import LoadingSpinner from '../components/LoadingSpinner'
import ScrollView from '../components/ScrollView'
import PostTile from '../components/PostTile'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 15
  }
})

const fetchStorePosts = async (storeId) => {
  const payload = {
    store_id: storeId
  }
  const posts = await requestServer(
    "/posts_service/get_store_posts",
    payload
  )

  return posts
}

export default () => {
  const route = useRoute()

  const { storeId } = route.params

  const storePostsQuery = useQuery({
    queryKey: ["storePosts"],
    queryFn: () => fetchStorePosts(storeId)
  })

  if (storePostsQuery.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        data={storePostsQuery.data}
        keyExtractor={(post) => post.post_id}
        renderItem={({ item }) => <PostTile post={item} />}
        emptyIcon="basket"
        emptyMessage="Esta tienda no ha hecho ninguna publicación"
      />
    </SafeAreaView>
  )
}
