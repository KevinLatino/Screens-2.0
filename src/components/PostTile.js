import { useNavigation } from '@react-navigation/native'
import { formatBase64String } from '../utilities/formatting'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { View, Image, StyleSheet } from 'react-native'
import { Caption1 } from 'react-native-ios-kit'
import { TouchableRipple, Text, IconButton } from 'react-native-paper'
import configuration from '../configuration'

const styles = StyleSheet.create({
  tile: {
    width: "100%",
    borderRadius: 15,
    backgroundColor: configuration.BACKGROUND_COLOR,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 15,
    gap: 10,
    shadowColor: "silver",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8
  },
  informationContainer: {
    width: "50%",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    columnGap: 10,
  },
  image: {
    borderRadius: 15,
    resizeMode: 'contain'
  }
})

export default ({ post }) => {
  const navigation = useNavigation()

  const navigateToPostView = () => {
    navigation.navigate("PostView", {
      postId: post.post_id
    })
  }

  const navigateToStoreView= () => {
    navigation.navigate(
      "StoreView",
      {
        storeId: post.store_id
      }
    )
  }

  return (
    <TouchableRipple
      onPress={navigateToPostView}
    >
      <View style={styles.tile}>
        <Image
          source={{
            uri: formatBase64String(post.multimedia[0]),
            height: 120,
            width: 120,
          }}
          style={styles.image}
        />

        <View style={styles.informationContainer}>
          <View>
            <Text
              variant="titleMedium"
              style={{ color: "white" }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {post.title}
            </Text>

            <Caption1 style={{ color: "white" }}>
              {
                post.amount === 1 ?
                "Una unidad disponible" :
                `${post.amount} unidades disponibles`
              }
            </Caption1>
          </View>

          <Caption1 style={{ fontWeight: "bold", color: configuration.ACCENT_COLOR_1 }}>
            ₡{post.price}.00
          </Caption1>

          <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", gap: 15, width: "100%" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
              <Caption1 style={{ color: configuration.ACCENT_COLOR_1 }}>
                {post.likes}
              </Caption1>

              <MaterialCommunityIcons
                name='heart'
                color={configuration.ACCENT_COLOR_1}
                size={24}
              />
            </View>

            <IconButton
              icon="store-outline"
              iconColor={configuration.ACCENT_COLOR_1}
              style={{ backgroundColor: "white" }}
              onPress={navigateToStoreView}
            />
          </View>
        </View>
      </View>
    </TouchableRipple>
  )
}
