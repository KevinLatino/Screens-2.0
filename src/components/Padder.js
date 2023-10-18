import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native'
import configuration from '../configuration'

const styles = StyleSheet.create({
  padder: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: configuration.BACKGROUND_COLOR
  }
})

export default ({ children, style, ...props }) => {
  return (
    <SafeAreaView
      style={{
        ...styles.padder,
        ...style
      }}
      {...props}
    >
      {children}
    </SafeAreaView>
  )
}
