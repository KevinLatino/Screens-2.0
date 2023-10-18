import { useQuery } from '@tanstack/react-query'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import ScrollView from '../components/ScrollView'
import LoadingSpinner from '../components/LoadingSpinner'
import SaleTile from '../components/SaleTile'
import SecondaryTitle from '../components/SecondaryTitle'
import Padder from '../components/Padder'
import { View, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white"
  }
})

const fetchPurchases = async (customerId) => {
    const payload = {
        customer_id: customerId
    }
    const purchases = await requestServer(
        "/sales_service/get_customer_purchases",
        payload
    )

    return purchases
}

export default () => {
    const [session, _] = useSession()

    const purchasesQuery = useQuery({
      queryKey: ["customerPurchases"],
      queryFn: () => fetchPurchases(session.data.customerId),
      disabled: session.isLoading
    })

    if (purchasesQuery.isLoading || session.isLoading) {
        return (
            <LoadingSpinner inScreen />
        )
    }

    return (
      <Padder style={styles.container}>
        <View style={{ flex: 1, gap: 20 }}>
          <SecondaryTitle>
            Tus compras
          </SecondaryTitle>

          <ScrollView
              data={purchasesQuery.data}
              keyExtractor={(purchase) => purchase.sale_id}
              renderItem={({ item }) => <SaleTile sale={item} />}
              emptyIcon="basket"
              emptyMessage="No has comprado nada"
          />
        </View>
      </Padder>
    )
}
