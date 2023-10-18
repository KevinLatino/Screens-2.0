import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useStripe } from '@stripe/stripe-react-native'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import LoadingSpinner from '../components/LoadingSpinner'
import Button from '../components/Button'
import Padder from '../components/Padder'
import Subtitle from '../components/Subtitle'
import NumberStepper from '../components/NumberStepper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { View, Alert, StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import configuration from '../configuration'

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 20,
    padding: 15,
    width: "100%"
  },
  informationContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 20,
  },
  informationEntry: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 15,
    padding: 5
  },
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

const InformationEntry = ({ icon, text }) => {
  return (
    <View style={styles.informationEntry}>
      <MaterialCommunityIcons
        name={icon}
        size={30}
        color={configuration.ACCENT_COLOR_1}
      />

      <Text
        variant="bodySmall"
        style={{ color: configuration.ACCENT_COLOR_1, flexShrink: 1 }}
      >
        {text}
      </Text>
    </View>
  )
}

const InformationContainer = ({ post, amount }) => {
  return (
    <View style={styles.informationContainer}>
      <InformationEntry
        icon="pound"
        text={amount}
      />

      <InformationEntry
        icon="currency-usd"
        text={post.price * amount}
      />
    </View>
  )
}

export default () => {
    const navigation = useNavigation()
    const route = useRoute()
    const [session, _] = useSession()
    const { initPaymentSheet, presentPaymentSheet } = useStripe()

    const { postId } = route.params

    const [amount, setAmount] = useState(1)

    const handleBuy = () => {
      createSaleIntentMutation.mutate({
        postId,
        customerId: session.data.customerId,
        amount
      })
    }

    const handleSuccess = async (data) => {
      const stripeClientSecret = data.stripe_client_secret

      const paymentSheet = await initPaymentSheet({
        merchantDisplayName: postQuery.data.store_name,
        paymentIntentClientSecret: stripeClientSecret,
        style: "automatic",
        customFlow: false
      })

      if (paymentSheet.error) {
        Alert.alert(
          "Error de Stripe",
          "Hubo un error al intentar conectarse a Stripe, inténtale de nuevo más tarde"
        )

        return
      }

      const presentation = await presentPaymentSheet()

      if (presentation.error) {
        Alert.alert(
          "Error de Stripe",
          "Hubo un error al intentar conectarse a Stripe, inténtale de nuevo más tarde"
        )

        return
      }

      navigation.navigate("ChooseLocation", {
        saleId: data.sale_id
      })
    }

    const postQuery = useQuery({
      queryKey: ["postToBuy"],
      queryFn: () => fetchPost(postId, session.data.customerId),
      disabled: session.isLoading
    })
    const createSaleIntentMutation = useMutation(
      ({ postId, customerId, amount }) => createSaleIntent(postId, customerId, amount),
      {
        onSuccess: handleSuccess
      }
    )

    if (postQuery.isLoading) {
        return (
          <LoadingSpinner inScreen />
        )
    }

    return (
      <Padder style={styles.container}>
        <Subtitle>
          Comprando '{postQuery.data.title}'
        </Subtitle>

        <InformationContainer
          post={postQuery.data}
          amount={amount}
        />

        <NumberStepper
          min={1}
          max={postQuery.data.amount}
          value={amount}
          onChange={setAmount}
        />

        <Button
            onPress={handleBuy}
            style={{ width: "70%" }}
        >
          {
            createSaleIntentMutation.isLoading ?
            <LoadingSpinner /> :
            "Comprar"
          }
        </Button>
      </Padder>
    )
}
