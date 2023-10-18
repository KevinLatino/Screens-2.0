import { withTheme } from 'react-native-ios-kit'
import { TouchableRipple, List } from 'react-native-paper'

const AddressAutocompleteTile = ({ isAlternative, isSelected, address, onSelect, theme }) => {
  return (
    <TouchableRipple
      onPress={() => onSelect(address)}
    >
      <List.Item
        style={
          isSelected ?
          {
            backgroundColor: theme.primaryColor,
          } :
          (
            isAlternative ?
            null :
            null
          )
        }
        titleStyle={
          isSelected ?
          {
            color: "white"
          } :
          (
            isAlternative ?
            {
              color: "white"
            } :
            null
          )
        }
        descriptionStyle={
          isSelected ?
          {
            color: "white"
          } :
          null
        }
        key={address.place_id}
        title={address.formatted}
        left={(props) => <List.Icon {...props} icon="map-marker" color={isAlternative ? "white" : undefined}/>}
      />
    </TouchableRipple>
  )
}

export default withTheme(AddressAutocompleteTile)
