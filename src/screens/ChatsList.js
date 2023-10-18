import { useQuery } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import ScrollView from '../components/ScrollView'
import ChatTile from '../components/ChatTile'
import LoadingSpinner from '../components/LoadingSpinner'
import Padder from '../components/Padder'
import SecondaryTitle from '../components/SecondaryTitle'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    gap: 20
  }
})

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
  const navigation = useNavigation()
  const [session, _] = useSession()

  navigation.addListener("beforeRemove", (event) => {
    event.preventDefault()
  })

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
    <Padder style={styles.container}>
      <SecondaryTitle>
        Tus mensajes
      </SecondaryTitle>

      <ScrollView
        data={chatsQuery.data}
        keyExtractor={(chat) => chat.chat_id}
        renderItem={({ item }) => <ChatTile chat={item} />}
        emptyIcon="chat"
        emptyMessage="No has hablado con nadie"
      />
    </Padder>
  )
}
