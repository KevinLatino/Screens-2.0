import InputSpinner from 'react-native-input-spinner'
import configuration from '../configuration'

export default () => {
  return (
    <InputSpinner
      skin="modern"
      background={configuration.BACKGROUND_COLOR}
      textColor="white"
      color={configuration.ACCENT_COLOR_1}
      buttonTextColor="white"
      colorPress={configuration.BACKGROUND_COLOR}
      buttonPressTextColor={configuration.ACCENT_COLOR_1}
    />
  )
}
