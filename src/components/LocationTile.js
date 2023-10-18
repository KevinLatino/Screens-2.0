import { formatLocation } from '../utilities/formatting'
import { TouchableRipple, List } from "react-native-paper"
import configuration from '../configuration'

export default ({ location, isSelected, onPress }) => {
  return (
    <TouchableRipple
      onPress={onPress}
    >
      <List.Item
        style={
          isSelected ?
          {
            backgroundColor: configuration.ACCENT_COLOR_1,
          } :
          {
            backgroundColor: configuration.BACKGROUND_COLOR
          }
        }
        titleStyle={{
          color: "white"
        }}
        descriptionStyle={{
          color: "white"
        }}
        title={location.place_name}
        description={formatLocation(location)}
        left={(props) => <List.Icon {...props} icon="map-marker" />}
      />
    </TouchableRipple>
  )
}
