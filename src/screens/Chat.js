import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { useSession } from '../context'
import { useRoute } from '@react-navigation/native'
import { requestServer } from '../utilities/requests'
import { call } from '../utilities/calls'
import { selectPictureFromGallery } from '../utilities/camera'
import { formatBase64String } from '../utilities/formatting'
import uuid from 'react-native-uuid'
import LoadingSpinner from '../components/LoadingSpinner'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, TouchableOpacity, StyleSheet} from 'react-native'
import { List, IconButton, Avatar } from 'react-native-paper'
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import configuration from '../configuration'

const styles = StyleSheet.create({
  headerLoadingView: {
    padding: 10,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  }
})

const giftMessage = (message) => {
  const text =
    message.content_type === "text" ?
    message.content :
    undefined
  const image =
    message.content_type === "image" ?
    formatBase64String(message.content) :
    undefined
  const giftedMessage = {
    _id: message.message_id,
    text,
    image,
    createdAt: new Date(message.sent_datetime),
    user: {
      _id: message.user_id
    }
  }

  return giftedMessage
}

const fetchMessages = async (chatId) => {
  const payload = {
    chat_id: chatId
  }
  const messages = await requestServer(
    "/chat_service/get_chat_by_id",
    payload
  )

  return messages
}

const addMessage = async (message, senderId, receiverId) => {
  const payload = {
    sender_id: senderId,
    receiver_id: receiverId,
    ...message
  }
  const _ = await requestServer(
    "/chat_service/add_message",
    payload
  )
}

const Header = ({ chat, isLoading }) => {
  const navigation = useNavigation()

  const navigateToStoreView = () => {
    navigation.navigate(
      "StoreView",
      {
        storeId: chat.user.user_id
      }
    )
  }

  const handleCallUser = async () => {
    call(chat.user.phone_number)
  }

  return (
    <TouchableOpacity onPress={navigateToStoreView}>
      {
        isLoading ?
        (
          <View
            style={styles.headerLoadingView}
          >
            <LoadingSpinner />
          </View>
        ) :
        null
      }

      <List.Item
        style={{ backgroundColor: "white" }}
        titleStyle={{ color: configuration.SECONDARY_COLOR }}
        title={chat.user.name}
        left={(props) => {
          return (
            <Avatar.Image
              size={45}
              {...props}
              source={{
                uri: formatBase64String(chat.user.picture)
              }}
            />
          )
        }}
        right={(props) => {
          return (
            <IconButton
              {...props}
              icon="phone"
              iconColor={configuration.ACCENT_COLOR_1}
              style={{ backgroundColor: "white" }}
              onPress={handleCallUser}
            />
          )
        }}
      />
    </TouchableOpacity>
  )
}

export default () => {
  const route = useRoute()
  const queryClient = useQueryClient()
  const [session, _] = useSession()

  const { chat } = route.params

  const [messages, setMessages] = useState([])

  const addMessageToState = (message) => {
    setMessages((previousMessages) => {
      const newMessages = GiftedChat.append(previousMessages, [message])

      return newMessages
    })
  }

  const handleTextMessageSend = ([giftedMessage]) => {
    const message = {
      content: giftedMessage.text,
      content_type: "text"
    }

    addMessageMutation.mutate({
      message,
      customerId: session.data.customerId,
      receiverId: chat.user.user_id
    })

    addMessageToState(giftedMessage)
  }

  const handlePictureMessageChoosen = async () => {
    const picture = await selectPictureFromGallery()

    if (picture === null) {
      return
    }

    const message = {
      content: picture,
      content_type: "image"
    }

    addMessageMutation.mutate({
      message,
      customerId: session.data.customerId,
      receiverId: chat.user.user_id
    })

    const giftedMessage = {
      _id: uuid.v4(),
      image: formatBase64String(picture),
      createdAt: new Date(),
      user: {
        _id: session.data.customerId,
      }
    }

    addMessageToState(giftedMessage)
  }

  const handleLoadMessages = (fetchedMessages) => {
    const giftedFetchedMessages = fetchedMessages.map(giftMessage)

    setMessages(giftedFetchedMessages)
  }

  const handleMutationSuccess = () => {
    queryClient.refetchQueries({
      queryKey: ["chatMessages", chat.chat_id]
    })
  }

  const messagesQuery = useQuery({
    queryKey: ["chatMessages", chat.chat_id],
    queryFn: () => fetchMessages(chat.chat_id),
    onSuccess: handleLoadMessages,
    enabled: chat.chat_id !== undefined
  })
  const addMessageMutation = useMutation(
    ({ message, customerId, receiverId }) => addMessage(
      message,
      customerId,
      receiverId
    ),
    {
      onSuccess: handleMutationSuccess
    }
  )

  if (session.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: configuration.BACKGROUND_COLOR
          }
        }}
      />
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        chat={chat}
        isLoading={messagesQuery.isFetching}
      />

      <GiftedChat
        messages={messages}
        onSend={handleTextMessageSend}
        user={{
          _id: session.data.customerId
        }}

        placeholder='Mensaje...'
        renderBubble={renderBubble}
        renderActions={() => <IconButton
          icon="camera-outline"
          iconColor={configuration.SECONDARY_COLOR}
          onPress={handlePictureMessageChoosen}
        />}
        renderLoading={() => <LoadingSpinner inScreen /> }

        scrollToBottom
      />
    </SafeAreaView>
  )
}
