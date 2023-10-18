import { useState, useEffect } from 'react'
import Voice from '@react-native-voice/voice'
import { Alert } from 'react-native'
import { IconButton } from 'react-native-paper'

export default ({ onSpeech }) => {
  const [isListening, setIsListening] = useState(false)

  useEffect(() => {
    Voice.onSpeechResults((results) => console.log(results))
  }, [])

  useEffect(() => {
    return () => Voice.removeAllListeners()
  }, [])

  const handleStartListening = async () => {
    const error = await Voice.start("es-CR")

    if (error !== null) {
      Alert.alert(
        "No te podemos escuchar",
        "El reconocimiento de voz no está disponible en tu dispositvo"
      )
    }

    setIsListening(true)
  }

  const handleStopListening = async () => {
    const error = await Voice.stop()

    if (error !== null) {
      Alert.alert(
        "No te pudimos escuchar",
        "Hubo un problema mientras intentabamos reconocer to voz"
      )
    }

    setIsListening(false)
  }

  return (
    <IconButton
      icon="microphone"
      mode={isListening ? "contained" : undefined}
      onLongPress={handleStartListening}
      onPressOut={handleStopListening}
    />
  )
}
