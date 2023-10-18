import { useNavigation } from '@react-navigation/native'
import { formatBase64String } from '../utilities/formatting'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { View, Image, StyleSheet } from 'react-native'
import { Caption1, Subhead } from 'react-native-ios-kit'
import { TouchableRipple } from 'react-native-paper'
import configuration from '../configuration'

const styles = StyleSheet.create({
  tile: {
    borderRadius: 15,
    backgroundColor: configuration.BACKGROUND_COLOR
  },
  informationContainer: {
    padding: 18,
    gap: 8
  },
  image: {
    borderRadius: 15
  }
})

export default ({ store }) => {
  const navigation = useNavigation()

  const navigateToStoreView = () => {
    navigation.navigate(
      "StoreView",
      {
        storeId: store.user_id
      }
    )
  }

  return (
    <TouchableRipple
      onPress={navigateToStoreView}
      style={{ borderRadius: 15 }}
    >
      <View style={styles.tile}>
        <Image
          source={{
            uri: formatBase64String(store.picture),
            height: 100
          }}
          style={styles.image}
        />

        <View style={styles.informationContainer}>
          <Subhead style={{ color: "white" }}>
            {store.name}
          </Subhead>

          <Caption1 style={{ color: "white" }}>
            {store.description}
          </Caption1>

          <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 3 }}>
            <MaterialCommunityIcons
              name='account'
              color={configuration.ACCENT_COLOR_1}
              size={24}
            />

            <Caption1 style={{ color: configuration.ACCENT_COLOR_1 }}>
              {store.follower_count}
            </Caption1>
          </View>
        </View>
      </View>
    </TouchableRipple>
  )
}
