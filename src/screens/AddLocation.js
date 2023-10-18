import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import { formatLocation } from '../utilities/formatting'
import Padder from '../components/Padder'
import Title from '../components/Title'
import Subtitle from '../components/Subtitle'
import Button from '../components/Button'
import LocationSelector from '../components/LocationSelector'
import LoadingSpinner from '../components/LoadingSpinner'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20
  }
})

const addLocation = async (location, customerId) => {
  const payload = {
    customer_id: customerId,
    ...location
  }
  const _ = await requestServer(
    "/locations_service/add_customer_location",
    payload
  )
}

export default () => {
  const navigation = useNavigation()
  const queryClient = useQueryClient()
  const [session, _] = useSession()

  const [location, setLocation] = useState(null)

  const handleAddLocation = () => {
    addLocationMutation.mutate({
      location,
      customerId: session.data.customerId
    })
  }

  const handleAddLocationSuccess = () => {
    queryClient.refetchQueries({
      queryKey: ["customerLocations"]
    })

    navigation.goBack()
  }

  const addLocationMutation = useMutation(
    ({ location, customerId }) => addLocation(location, customerId),
    {
      onSuccess: handleAddLocationSuccess
    }
  )

  return (
    <Padder style={styles.container}>
      <Title>
        Añade un domicilio
      </Title>

      <Subtitle>
        {
          location !== null ?
          formatLocation(location) :
          null
        }
      </Subtitle>

      <LocationSelector
        onSelect={setLocation}
        isAlternative
      />

      <Button
        style={{ width: "70%" }}
        disabled={location === null || addLocationMutation.isLoading}
        onPress={handleAddLocation}
      >
        {
          addLocationMutation.isLoading ?
          <LoadingSpinner /> :
          "Añadir"
        }
      </Button>
    </Padder>
  )
}
