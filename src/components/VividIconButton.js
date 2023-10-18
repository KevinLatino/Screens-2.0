import { IconButton } from 'react-native-paper'
import configuration from '../configuration'

export default ({ icon, ...iconButtonProps }) => {
  return (
    <IconButton
      mode="contained"
      iconColor="white"
      style={{ backgroundColor: configuration.ACCENT_COLOR_2 }}
      icon={icon}
      size={30}
      {...iconButtonProps}
    />
  )
}
