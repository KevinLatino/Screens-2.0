import { default as startPhoneCall } from 'react-native-phone-call'
import { Alert } from 'react-native'

export const call = async (phoneNumber) => {
  try {
    await startPhoneCall({
      number: phoneNumber,
      prompt: true,
      skipCanOpen: true
    })
  } catch (error) {
    Alert.alert(
      "No se pudo realizar la llamada",
      "Inténtalo más tarde"
    )
  }
}
