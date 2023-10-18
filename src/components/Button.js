import { StyleSheet } from 'react-native'
import { Button, Headline } from 'react-native-ios-kit'
import configuration from '../configuration'

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: configuration.ACCENT_COLOR_1,
    borderColor: configuration.ACCENT_COLOR_1
  },
  text: {
    color: "#ffffff",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center"
  }
})

export default ({ children, style, ...iosButtonProps }) => {
  return (
    <Button
      centered
      inverted
      rounded
      {...iosButtonProps}
      style={{
        ...styles.button,
        ...style
      }}
    >
      <Headline style={styles.text}>
        {children}
      </Headline>
    </Button>
  )
}
