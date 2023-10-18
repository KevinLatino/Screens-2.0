import { ScrollView, StyleSheet } from 'react-native'
import configuration from '../configuration'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: configuration.BACKGROUND_COLOR
  }
})

export default ({ children, ...props }) => {
  return (
    <ScrollView
      {...props}
      style={styles.container}
      contentContainerStyle={styles.container}
    >
      {children}
    </ScrollView>
  )
}
