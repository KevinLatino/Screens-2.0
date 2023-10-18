import { Text, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 17.5,
    color: "white",
    textAlign: "center"
  }
})

export default ({ children }) => {
  return (
    <Text style={styles.subtitle}>
      {children}
    </Text>
  )
}
