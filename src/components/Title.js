import { Text, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  }
})

export default ({ children }) => {
  return (
    <Text style={styles.title}>
      {children}
    </Text>
  )
}
