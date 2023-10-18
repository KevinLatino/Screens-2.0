import { useQuery } from "@tanstack/react-query"
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import LoadingSpinner from "../components/LoadingSpinner"
import ScrollView from "../components/ScrollView"
import PostTile from "../components/PostTile"
import Padder from '../components/Padder'
import SecondaryTitle from '../components/SecondaryTitle'
import { View, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white"
  }
})

const fetchLikedPosts = async (customerId) => {
    const payload = {
        customer_id: customerId
    }
    const posts = await requestServer(
        "/posts_service/get_customer_liked_posts",
        payload
    )

    return posts
}

export default () => {
    const [session, _] = useSession()

    const likedPostsQuery = useQuery({
      queryKey: ["likedPosts"],
      queryFn: () => fetchLikedPosts(session.data.customerId),
      disabled: session.isLoading
    })

    if (likedPostsQuery.isLoading || session.isLoading) {
        return (
            <LoadingSpinner inScreen />
        )
    }

    return (
      <Padder style={styles.container}>
        <View style={{ flex: 1, gap: 20 }}>
          <SecondaryTitle>
            Tus me gusta
          </SecondaryTitle>

          <ScrollView
              data={likedPostsQuery.data}
              keyExtractor={(post) => post.post_id}
              renderItem={({ item }) => <PostTile post={item} />}
              emptyIcon="heart"
              emptyMessage="No te gusta ninguna publicación"
          />
        </View>
      </Padder>
    )
}
