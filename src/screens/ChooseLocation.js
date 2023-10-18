import { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import ScrollView from '../components/ScrollView'
import Padder from '../components/Padder'
import LoadingSpinner from '../components/LoadingSpinner'
import LocationTile from '../components/LocationTile'
import Button from '../components/Button'
import Title from '../components/Title'
import FloatingActionButton from '../components/FloatingActionButton'
import { View, Alert, StyleSheet, Dimensions } from 'react-native'

const styles = StyleSheet.create({
  container: {
    gap: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContainer: {
    width: "100%",
    position: "absolute",
    top: Dimensions.get("screen").height * 0.8,
    justifyContent: "center",
    alignItems: "center"
  },
  fab: {
    position: 'absolute',
    top: Dimensions.get("screen").height * 0.85,
    left: Dimensions.get("screen").width * 0.8
  }
})

const fetchLocations = async (customerId) => {
  const payload = {
    customer_id: customerId
  }
  const locations = await requestServer(
    "/locations_service/get_customer_locations",
    payload
  )

  return locations
}

const createDelivery = async (saleId, locationId) => {
  const payload = {
    sale_id: saleId,
    location_id: locationId
  }
  const _ = await requestServer(
    "/deliveries_service/create_delivery",
    payload
  )
}

const LocationsScrollView = ({ saleId }) => {
  const navigation = useNavigation()
  const queryClient = useQueryClient()
  const [session, _] = useSession()

  const [selectedLocation, setSelectedLocation] = useState(null)

  const handleSelect = (location) => {
    setSelectedLocation(location)
  }

  const handleSubmit = () => {
    createDeliveryMutation.mutate({
      saleId,
      locationId: selectedLocation.location_id
    })
  }

  const handleSuccess = (_) => {
    queryClient.refetchQueries({ queryKey: ["activeDeliveries"] })

    Alert.alert(
      "Éxito",
      "Tu entrega ahora está pendiente"
    )

    navigation.goBack()
  }

  const locationsQuery = useQuery({
    queryKey: ["customerLocations"],
    queryFn: () => fetchLocations(session.data.customerId),
    disabled: session.isLoading
  })
  const createDeliveryMutation = useMutation(
    ({ saleId, locationId }) => createDelivery(saleId, locationId),
    {
      onSuccess: handleSuccess
    }
  )

  if (locationsQuery.isLoading || session.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  return (
    <View style={{ gap: 20 }}>
      <ScrollView
        style={{ flex: 1 }}
        data={locationsQuery.data}
        keyExtractor={(location) => location.location_id}
        renderItem={
          ({ item }) => {
            return (
              <LocationTile
                location={item}
                isSelected={
                  (selectedLocation !== null) &&
                  (item.location_id == selectedLocation.location_id)
                }
                onPress={() => handleSelect(item)}
              />
            )
          }
        }
        emptyIcon="map-marker"
        emptyMessage="No has añadido ningún domicilio"
      />

      <Button
        style={{ width: "70%" }}
        onPress={handleSubmit}
        disabled={selectedLocation === null || createDeliveryMutation.isLoading}
      >
        {
          createDeliveryMutation.isLoading ?
          <LoadingSpinner /> :
          "Programar entrega"
        }
      </Button>
    </View>
  )
}

export default () => {
  const navigation = useNavigation()
  const route = useRoute()

  const { saleId } = route.params

  const navigateToAddLocation = () => {
    navigation.navigate("AddLocation")
  }

  return (
    <Padder style={styles.container}>
      <Title>
        Escoge el destino de tu compra
      </Title>

      <LocationsScrollView
        saleId={saleId}
      />

      <FloatingActionButton
        icon="plus"
        style={styles.fab}
        onPress={navigateToAddLocation}
      />
    </Padder>
  )
}
