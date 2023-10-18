import { StyleSheet } from 'react-native'
import { Title2 } from 'react-native-ios-kit'
import configuration from '../configuration'

const styles = StyleSheet.create({
  secondaryTitle: {
    color: configuration.SECONDARY_COLOR
  }
})

export default ({ children }) => {
  return (
    <Title2 style={styles.secondaryTitle}>
      {children}
    </Title2>
  )
}
