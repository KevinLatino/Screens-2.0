import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { requestServer } from '../utilities/requests'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '../utilities/hooks'
import { useSession } from '../context'
import { makeNotEmptyChecker, checkPhoneNumber } from '../utilities/validators'
import TextField from '../components/TextField'
import LoadingSpinner from '../components/LoadingSpinner'
import PictureInput from '../components/PictureInput'
import Button from '../components/Button'
import Title from '../components/Title'
import Scroller from '../components/Scroller'
import Padder from '../components/Padder'
import { Alert, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 20
  }
})

const fetchCustomer = async (customerId) => {
  const payload = {
    customer_id: customerId
  }
  const customer = await requestServer(
    "/customers_service/get_customer_by_id",
    payload
  )

  return customer
}

const updateCustomer = async (customerId, newCustomer, picture) => {
  const payload = {
    customer_id: customerId,
    picture,
    ...newCustomer
  }
  const _ = await requestServer(
    "/customers_service/update_customer",
    payload
  )
}

export default () => {
  const navigation = useNavigation()
  const queryClient = useQueryClient()
  const [session, _] = useSession()

  const [picture, setPicture] = useState(null)

  const handleSuccess = () => {
    queryClient.refetchQueries({ queryKey: ["customer"] })

    Alert.alert(
      "Éxito",
      "Información actualizada con éxito"
    )

    navigation.goBack()
  }

  const fillFormFields = (data) => {
    form.setField("name")(data.name)
    form.setField("first_surname")(data.first_surname)
    form.setField("second_surname")(data.second_surname)
    form.setField("phone_number")(data.phone_number)

    setPicture(data.picture)
  }

  const handleUpdate = () => {
    if (!form.validate()) {
      Alert.alert(
        "Información incompleta",
        "Ingresa información necesaria para actualizar los datos"
      )

      return
    }

    updateCustomerMutation.mutate({
      customerId: session.data.customerId,
      fields: form.fields,
      picture
    })
  }

  const form = useForm(
    {
      name: null,
      first_surname: null,
      second_surname: null,
      phone_number: null
    },
    {
      name: makeNotEmptyChecker("Nombre vacío"),
      first_surname: makeNotEmptyChecker("Primer apellido vacío"),
      second_surname: makeNotEmptyChecker("Segundo apellido vacío"),
      phone_number: checkPhoneNumber
    }
  )
  const customerQuery = useQuery({
    queryKey: ["customerToEdit"],
    queryFn: () => fetchCustomer(session.data.customerId),
    onSuccess: (data) => fillFormFields(data),
    disabled: session.isLoading
  })
  const updateCustomerMutation = useMutation(
    ({ customerId, fields, picture }) => updateCustomer(
      customerId, fields, picture
    ), {
      onSuccess: handleSuccess
    }
  )

  if (customerQuery.isLoading || session.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  return (
    <Scroller>
      <Padder style={styles.container}>
        <Title>
          Edita tu información
        </Title>

        <PictureInput
          picture={picture}
          onChangePicture={setPicture}
        />

        <TextField
          value={form.getField("name")}
          onChangeText={form.setField("name")}
          error={form.getError("name")}
          placeholder="Nombre"
        />

        <TextField
          value={form.getField("first_surname")}
          onChangeText={form.setField("first_surname")}
          error={form.getError("first_surname")}
          placeholder="Primer apellido"
        />

        <TextField
          value={form.getField("second_surname")}
          onChangeText={form.setField("second_surname")}
          error={form.getError("second_surname")}
          placeholder="Segundo apellido"
        />

        <TextField
          value={form.getField("phone_number")}
          onChangeText={form.setField("phone_number")}
          error={form.getError("phone_number")}
          placeholder="Número telefónico"
        />

        <Button
          onPress={handleUpdate}
          disabled={updateCustomerMutation.isLoading}
        >
          {
            updateCustomerMutation.isLoading ?
            <LoadingSpinner /> :
            "Confirmar"
          }
        </Button>
      </Padder>
    </Scroller>
  )
}
