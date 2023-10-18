import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import Padder from '../components/Padder'
import Scroller from '../components/Scroller'
import TextField from '../components/TextField'
import Button from '../components/Button'
import LoadingSpinner from '../components/LoadingSpinner'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Text, Alert, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    gap: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    width: "100%"
  },
  title: {
    fontSize: 35,
    color: "#344340",
    fontWeight: "bold",
    display: "flex",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    color: "gray",
    display: "flex",
    textAlign: "center",
  }
})

const createReport = async (content, userId) => {
  const payload = {
    user_id: userId,
    content
  }
  const _ = await requestServer(
    "/reports_service/create_report",
    payload
  )
}

export default () => {
  const navigation = useNavigation()
  const [session, _] = useSession()

  const [content, setContent] = useState("")

  const handleSubmitReport = () => {
    createReportMutation.mutate({
      content,
      userId: session.data.customer_id
    })
  }

  const handleSubmitReportSuccess = () => {
    Alert.alert(
      "Éxito",
      "Tu reportado se ha publicado con éxito"
    )

    navigation.goBack()
  }

  const createReportMutation = useMutation(
    ({ content, userId }) => createReport(content, userId),
    {
      onSuccess: handleSubmitReportSuccess
    }
  )

  return (
    <Scroller>
      <KeyboardAwareScrollView>
        <Padder style={styles.container}>
          <Text style={styles.title}>
            Haz un reporte
          </Text>

          <TextField
            value={content}
            onChangeText={setContent}
            multiline
          />

          <Button
            style={{ width: "70%" }}
            disabled={content.length === 0}
            onPress={handleSubmitReport}
          >
            {
              createReportMutation.isLoading ?
              <LoadingSpinner /> :
              "Enviar"
            }
          </Button>
        </Padder>
      </KeyboardAwareScrollView>
    </Scroller>
  )
}
