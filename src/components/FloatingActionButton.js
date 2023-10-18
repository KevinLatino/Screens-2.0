import { FAB } from 'react-native-paper'
import configuration from '../configuration'

export default ({ style, ...fabProps }) => {
  return (
    <FAB
      {...fabProps}
      customSize={45}
      color="white"
      style={{
        ...style,
        backgroundColor: configuration.ACCENT_COLOR_1
      }}
    />
  )
}
