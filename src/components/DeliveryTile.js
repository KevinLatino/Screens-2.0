import * as Linking from 'expo-linking'
import { Alert } from 'react-native'
import { List, TouchableRipple } from 'react-native-paper'

const TrackLocationIcon = ({ delivery, ...props }) => {
  const uberTrackingUrl = delivery.uber_tracking_url

  const openLink = async () => {
    if (!(await Linking.canOpenURL(uberTrackingUrl))) {
      Alert.alert(
        "No se pudo abrir el enlace",
        "Hubo un error intentando abrir el enlace de seguimiento de Uber"
      )
    }

    await Linking.openURL(uberTrackingUrl)
  }

  return (
    <TouchableRipple
      onPress={openLink}
      disabled={uberTrackingUrl === null}
    >
      <List.Icon
        {...props}
        icon="map-marker"
      />
    </TouchableRipple>
  )
}

export default ({ delivery }) =>  {
  const title = delivery.post.title
  const amount = delivery.sale.amount
  const uberState = delivery.uber_state
  const placeName = delivery.location.place_name

  return (
    <List.Item
      title={`${title} x${amount}`}
      description={`${placeName}: ${uberState}`}
      left={(props) => <TrackLocationIcon {...props} delivery={delivery} />}
    />
  )
}
