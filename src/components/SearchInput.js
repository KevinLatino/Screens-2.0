import { SearchBar } from 'react-native-elements'
import configuration from '../configuration'

export default ({ ...searchBarProps }) => {
  return (
    <SearchBar
      cancelButtonProps={{ color: "white", fontSize: 20 }}
      cancelButtonTitle='cancelar'
      inputContainerStyle={{ height: 30 }}
      containerStyle={{ backgroundColor: configuration.BACKGROUND_COLOR }}
      platform="ios"
      showCancel
      lightTheme
      {...searchBarProps}
    />
  )
}
