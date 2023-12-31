import { useQuery } from "@tanstack/react-query"
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import LoadingSpinner from "../components/LoadingSpinner"
import ScrollView from "../components/ScrollView"
import PostTile from "../components/PostTile"
import Screen from '../components/Screen'
import { View } from 'react-native'
import { Title2 } from 'react-native-ios-kit'

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
      <Screen>
        <View style={{ flex: 1, gap: 20 }}>
          <Title2>
            Tus me gusta
          </Title2>

          <ScrollView
              data={likedPostsQuery.data}
              keyExtractor={(post) => post.post_id}
              renderItem={({ item }) => <PostTile post={item} />}
              emptyIcon="heart"
              emptyMessage="No te gusta ninguna publicación"
          />
        </View>
      </Screen>
    )
}
