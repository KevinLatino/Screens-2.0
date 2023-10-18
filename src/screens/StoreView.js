import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import { formatBase64String, formatLocation } from '../utilities/formatting'
import { call } from '../utilities/calls'
import LoadingSpinner from '../components/LoadingSpinner'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { View, StyleSheet } from 'react-native'
import { Caption1 } from 'react-native-ios-kit'
import { Avatar, Text, TouchableRipple, IconButton } from 'react-native-paper'
import configuration from '../configuration'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  storeView: {
    flex: 1,
    alignItems: "center"
  },
  topContainer: {
    borderRadius: 30,
    height: "35%",
    width: "100%",
    backgroundColor: configuration.BACKGROUND_COLOR,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  descriptionContainer: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "silver",
    padding: 15,
    width: "80%",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    bottom: 25
  },
  extraInformationContainer: {
    width: "100%",
    backgroundColor: "white",
    paddingHorizontal: 10,
  },
  actionsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10
  },
  linksContainer: {
    width: "100%",
    paddingHorizontal: 10,
  },
  informationEntry: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 15,
    padding: 5
  },
  link: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 10
  },
})

const fetchStore = async (storeId, customerId) => {
  const payload = {
    store_id: storeId,
    customer_id: customerId
  }
  const store = await requestServer(
    "/stores_service/get_store_by_id",
    payload
  )

  return store
}

const fetchChat = async (senderId, receiverId) => {
  const payload = {
    sender_id: senderId,
    receiver_id: receiverId
  }
  const optionChat = await requestServer(
    "/chat_service/get_chat_by_sender_and_receiver",
    payload
  )

  return optionChat
}

const followStore = async (storeId, customerId) => {
  const payload = {
    store_id: storeId,
    customer_id: customerId
  }
  const _ = await requestServer(
    "/stores_service/follow_store",
    payload
  )
}

const InformationEntry = ({ icon, text }) => {
  return (
    <View style={styles.informationEntry}>
      <MaterialCommunityIcons
        name={icon}
        size={30}
        color="silver"
      />

      <Caption1 style={{ color: configuration.ACCENT_COLOR_1, flexShrink: 1 }}>
        {text}
      </Caption1>
    </View>
  )
}

const Link = ({ text, onPress }) => {
  return (
    <TouchableRipple
      onPress={onPress}
    >
      <View style={styles.link}>
        <Text
          variant="bodyMedium"
          style={{ color: configuration.SECONDARY_COLOR }}
        >
          {text}
        </Text>

        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={configuration.SECONDARY_COLOR}
        />
      </View>
    </TouchableRipple>
  )
}

const TopContainer = ({ store }) => {
  return (
    <View style={styles.topContainer}>
      <Avatar.Image
        source={{ uri: formatBase64String(store.picture) }}
        size={80}
      />

      <Text
        variant="titleLarge"
        style={{ color: "white" }}
      >
        {store.name}
      </Text>

      <ActionsContainer
        store={store}
      />
    </View>
  )
}

const DescriptionContainer = ({ description }) => {
  return (
    <View style={styles.descriptionContainer}>
      <Text
        variant="bodySmall"
        color={{ color: configuration.SECONDARY_COLOR }}
      >
        {description}
      </Text>
    </View>
  )
}

const ExtraInformationContainer = ({ followerCount, location, phoneNumber }) => {
  return (
    <View style={styles.extraInformationContainer}>
      <InformationEntry
        icon="account"
        text={`${followerCount} ${followerCount !== 1 ? 'seguidores' : 'seguidor'}`}
      />

      <InformationEntry
        icon="map-marker"
        text={formatLocation(location)}
      />

      <InformationEntry
        icon="phone"
        text={phoneNumber}
      />
    </View>
  )
}

const ActionsContainer = ({ store }) => {
  const navigation = useNavigation()
  const [session, _] = useSession()

  const [isFollowing, setIsFollowing] = useState(store.does_customer_follow_store)

  const navigateToChat = async () => {
    const optionalChat = await fetchChat(session.data.customerId, store.user_id)

    const chatId = optionalChat?.chat_id

    navigation.navigate("Chat", {
      chat: {
        chat_id: chatId,
        user: {
          user_id: store.user_id,
          name: store.name,
          picture: store.picture,
          phone_number: store.phone_number
        }
      }
    })
  }

  const handleCallStore = async () => {
    call(store.phone_number)
  }

  const handleFollowStore = () => {
    followStoreMutation.mutate({
      storeId: store.user_id,
      customerId: session.data.customerId
    })

    setIsFollowing(!isFollowing)
  }

  const followStoreMutation = useMutation(
    ({ storeId, customerId }) => followStore(storeId, customerId)
  )

  return (
    <View style={styles.actionsContainer}>
      <IconButton
        icon="chat"
        iconColor={configuration.ACCENT_COLOR_1}
        style={{ backgroundColor: "white" }}
        onPress={navigateToChat}
      />

      <IconButton
        icon="phone"
        iconColor={configuration.ACCENT_COLOR_1}
        style={{ backgroundColor: "white" }}
        onPress={handleCallStore}
      />

      <IconButton
        icon={isFollowing ? "check" : "plus"}
        iconColor={configuration.ACCENT_COLOR_1}
        style={{ backgroundColor: "white" }}
        onPress={handleFollowStore}
      />
    </View>
  )
}

const LinksContainer = ({ multimedia, storeId }) => {
  const navigation = useNavigation()

  const navigateToMultimediaView = (multimedia) => {
    navigation.navigate(
      "MultimediaView",
      {
        multimedia
      }
    )
  }

  const navigateToStorePosts = () => {
    navigation.navigate(
      "StorePosts",
      {
        storeId
      }
    )
  }

  return (
    <View style={styles.linksContainer}>
      <Link
        text="Ver imágenes"
        onPress={() => navigateToMultimediaView(multimedia)}
      />

      <Link
        text="Ver publicaciones"
        onPress={navigateToStorePosts}
      />
    </View>
  )
}

const StoreView = ({ storeId }) => {
  const [session, _] = useSession()

  const storeQuery = useQuery({
    queryKey: ["storeProfileView"],
    queryFn: () => fetchStore(storeId, session.data.customerId),
    disabled: session.isLoading
  })

  if (storeQuery.isLoading || session.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  const {
    name,
    description,
    phone_number,
    multimedia,
    picture,
    location,
    follower_count
  } = storeQuery.data

  return (
    <View style={styles.storeView}>
      <TopContainer
        store={storeQuery.data}
      />

      <DescriptionContainer
        description={description}
      />

      <ExtraInformationContainer
        followerCount={follower_count}
        location={location}
        phoneNumber={phone_number}
      />

      <LinksContainer
        multimedia={multimedia}
        storeId={storeQuery.data.user_id}
      />
    </View>
  )
}

export default () => {
  const route = useRoute()

  const { storeId } = route.params

  return (
    <View style={styles.container}>
      <StoreView
        storeId={storeId}
      />
    </View>
  )
}
