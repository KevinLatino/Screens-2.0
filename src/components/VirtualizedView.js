import { View, FlatList } from 'react-native'

export default ({ children })  => {
  return (
    <FlatList
      data={[]}
      ListEmptyComponent={null}
      keyExtractor={() => "dummy"}
      renderItem={null}
      ListHeaderComponent={() => (
        <View style={{ flex: 1 }}>
          {children}
        </View>
      )}
    />
  )
}
