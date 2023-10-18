import { selectPictureFromGallery } from '../utilities/camera'
import { formatBase64String } from '../utilities/formatting'
import uuid from 'react-native-uuid'
import VividIconButton from '../components/VividIconButton'
import { View, ScrollView, Image, StyleSheet } from 'react-native'
import { TouchableRipple } from 'react-native-paper'

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 20
  },
  multimediaTilesScrollview: {
    gap: 10
  }
})

const MultimediaTile = ({ multimediaItem, onPress }) => {
  const uri = formatBase64String(multimediaItem)

  return (
    <TouchableRipple
      onPress={onPress}
    >
      <Image
        source={{
          uri,
          height: 100,
          width: 100
        }}
      />
    </TouchableRipple>
  )
}

export default ({ multimedia, setMultimedia }) => {
  const handleAddMultimedia = async () => {
    const newPicture = await selectPictureFromGallery()

    if (newPicture === null) {
      return
    }

    const newMultimedia = [newPicture, ...multimedia]

    setMultimedia(newMultimedia)
  }

  const handleDeleteMultimedia = (multimediaItem) => {
    const newMultimedia = multimedia.filter((i) => i !== multimediaItem)

    setMultimedia(newMultimedia)
  }

  const multimediaTiles = multimedia.map((item) => {
    return (
      <MultimediaTile
        key={uuid.v4()}
        multimediaItem={item}
        onPress={() => handleDeleteMultimedia(item)}
      />
    )
  })

  return (
    <View style={styles.container}>
      <VividIconButton
        icon="plus"
        onPress={handleAddMultimedia}
      />

      <ScrollView
        horizontal
        contentContainerStyle={styles.multimediaTilesScrollview}
        style={{ flexGrow: 0 }}
      >
        {multimediaTiles}
      </ScrollView>
    </View>
  )
}
