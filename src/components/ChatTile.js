import { useNavigation } from '@react-navigation/native'
import { Image } from 'react-native'
import { List, TouchableRipple } from 'react-native-paper'

const formatLastMessage = (message) => {
  const contentType = message.content_type

  switch (contentType) {
    case "text":
      return message.content

    case "image":
      return "Imagen"
  }
}

const UserChatPicture = (user) => {
  return (
    <Image
      source={{ uri: user.picture }}
    />
  )
}

export default ({ chat }) => {
  const navigation = useNavigation()

  const navigateToChat = () => {
    const chatId = chat.chat_id

    navigation.navigate("Chat", {
      chatId,
      receiverId: chat.user.user_id,
      receiverName: chat.user.name,
      receiverPicture: chat.user.picture
    })
  }

  return (
    <TouchableRipple
      onPress={navigateToChat}
    >
      <List.Item
        title={chat.user.name}
        description={formatLastMessage(chat.last_message)}
        left={(props) => <UserChatPicture {...props} user={chat.user} />}
      />
    </TouchableRipple>
  )
}