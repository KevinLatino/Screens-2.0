import { useRoute } from '@react-navigation/native'
import { formatBase64String } from '../utilities/formatting'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 15,
    gap: 15,
    backgroundColor: "white"
  }
})

export default ({}) => {
  const route = useRoute()

  const { multimedia } = route.params

  const images = multimedia.map((image, index) => {
    return (
      <Image
        key={index}
        source={{
          uri: formatBase64String(image),
          height: 200,
          width: 300
        }}
      />
    )
  })

  return (
    <SafeAreaView style={styles.container}>
      {images}
    </SafeAreaView>
  )
}
