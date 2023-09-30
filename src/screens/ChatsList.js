import { useQuery } from '@tanstack/react-query'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import ScrollView from '../components/ScrollView'
import ChatTile from '../components/ChatTile'
import LoadingSpinner from '../components/LoadingSpinner'
import Screen from '../components/Screen'
import { Text } from 'react-native-paper'

const fetchChats = async (customerId) => {
  const payload = {
    user_id: customerId
  }
  const chats = await requestServer(
    "/chat_service/get_user_chats",
    payload
  )

  return chats
}

export default () => {
  const [session, _] = useSession()

  const chatsQuery = useQuery({
    queryKey: ["listOfChats"],
    queryFn: () => fetchChats(session.data.customerId),
    disabled: session.isLoading
  })

  if (chatsQuery.isLoading || session.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  return (
    <Screen>
      <Text variant="titleLarge">
        Tus mensajes
      </Text>

      <ScrollView
        data={chatsQuery.data}
        keyExtractor={(chat) => chat.chat_id}
        renderItem={({ item }) => <ChatTile chat={item} />}
        emptyIcon="chat"
        emptyMessage="No has hablado con nadie"
      />
    </Screen>
  )
}
