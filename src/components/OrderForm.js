import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useAtom } from 'jotai'
import { sessionAtom } from '../context'
import { requestServer } from '../utilities/requests'
import { formatBase64String } from '../utilities/formatting'
import LoadingSpinner from '../components/LoadingSpinner'
import NumericInput from 'react-native-numeric-input'
import { View, StyleSheet, Dimensions } from 'react-native'
import { Surface, Card, Text, Button } from 'react-native-paper'

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: Dimensions.get("screen").height * 0.1,
    left: Dimensions.get("screen").width * 0.1,
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
    padding: 16,
    borderRadius: 12,
    width: Dimensions.get("screen").width * 0.8
  }
})

const fetchPost = async (postId, customerId) => {
  const payload = {
    post_id: postId,
    customer_id: customerId
  }
  const post = await requestServer(
    "/posts_service/get_post_by_id",
    payload
  )

  return post
}

const createSaleIntent = async (postId, customerId, amount) => {
  const payload = {
    post_id: postId,
    customer_id: customerId,
    amount
  }
  const response = await requestServer(
    "/sales_service/create_sale_intent",
    payload
  )

  return response
}

const PostTile = ({ post }) => {
    return (
        <Card style={{ width: "95%" }}>
            <Card.Cover
                source={{ uri: formatBase64String(post.multimedia[0]) }}
            />

            <Card.Title
                title={post.title}
                subtitle={post.price}
            />

            <Card.Content>
                <Text variant="bodyMedium">
                    {post.description}
                </Text>
            </Card.Content>
        </Card>
    )
}

export default () => {
    const [amount, setAmount] = useState(1)
    const [session, _] = useAtom(sessionAtom)
    const navigation = useNavigation()
    const route = useRoute()

    const { postId } = route.params
    const postQuery = useQuery({
      queryKey: ["postToBuy"],
      queryFn: () => fetchPost(postId, session.customerId)
    })
    const createSaleIntentMutation = useMutation(
      ({ postId, customerId, amount }) => createSaleIntent(postId, customerId, amount)
    )

    if (createSaleIntentMutation.isSuccess) {
      const stripeClientSecret = createSaleIntentMutation.data.stripe_client_secret

      navigation.navigate(
        "PaymentForm",
        {
          stripeClientSecret
        }
      )
    }

    const handleBuy = () => {
      createSaleIntentMutation.mutate({
        postId,
        customerId: session.customerId,
        amount
      })
    }

    if (postQuery.isLoading) {
        return (
          <LoadingSpinner inScreen />
        )
    }

    return (
        <Surface elevation={5} style={styles.container}>
            <PostTile post={postQuery.data} />

            <NumericInput
                minValue={1}
                maxValue={postQuery.data.amount}
                value={amount}
                onChange={setAmount}
            />

            <Button
                mode="contained"
                onPress={handleBuy}
            >
              {
                createSaleIntentMutation.isLoading ?
                <LoadingSpinner /> :
                "Comprar"
              }
            </Button>
        </Surface>
    )
}
