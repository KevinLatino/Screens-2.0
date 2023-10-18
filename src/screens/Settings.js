import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '../utilities/hooks'
import { useSession } from '../context'
import { checkEmail, makeNotEmptyChecker } from '../utilities/validators'
import { requestServer } from '../utilities/requests'
import LoadingSpinner from '../components/LoadingSpinner'
import Padder from '../components/Padder'
import Dialog from 'react-native-dialog'
import SecondaryTitle from '../components/SecondaryTitle'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { View, Alert, StyleSheet } from 'react-native'
import { List, TouchableRipple, Text, Divider } from 'react-native-paper'
import configuration from '../configuration'

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    gap: 20
  },
  settingEntry: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 10
  }
})

const changeEmail = async (customerId, email, password) => {
  const payload = {
    user_id: customerId,
    email,
    password
  }

  const handleError = (data) => {
    if (data.message === "INCORRECT_PASSWORD") {
      Alert.alert(
        "Contraseña incorrecta",
        "La contraseña que ingresaste es incorrecta"
      )

      return true
    }

    return false
  }

  const _ = await requestServer(
    "/users_service/change_user_email",
    payload,
    handleError
  )
}

const changePassword = async (customerId, oldPassword, newPassword) => {
  const payload = {
    user_id: customerId,
    old_password: oldPassword,
    new_password: newPassword
  }

  const handleError = (data) => {
    if (data.message === "INCORRECT_PASSWORD") {
      Alert.alert(
        "Contraseña incorrecta",
        "La contraseña que ingresaste es incorrecta"
      )

      return true
    }

    return false
  }

  const _ = await requestServer(
    "/users_service/change_user_password",
    payload,
    handleError
  )
}

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

const deleteCustomer = async (customerId) => {
  const payload = {
    user_id: customerId
  }
  const _ = await requestServer(
    "/users_service/delete_user",
    payload
  )
}

const SettingEntry = ({ setting, isDangerous, onPress }) => {
  return (
    <TouchableRipple
      onPress={onPress}
    >
      <View style={styles.settingEntry}>
        <Text
          variant="bodyMedium"
          style={isDangerous ? { color: "red" } : { color: configuration.SECONDARY_COLOR }}
        >
          {setting}
        </Text>

        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={isDangerous ? "red" : configuration.SECONDARY_COLOR}
        />
      </View>
    </TouchableRipple>
  )
}

const ChangeEmailDialog = ({ isVisible, onDismiss }) => {
  const [session, _] = useSession()

  const fillFormFields = (data) => {
    form.setField("email")(data.email)
  }

  const handleSubmit = () => {
    changeEmailMutation.mutate(form.fields)
  }

  const handleSuccess = () => {
    onDismiss()

    Alert.alert(
      "Éxito",
      "Tu correo electrónico se actualizó con éxito"
    )
  }

  const customerQuery = useQuery({
    queryKey: ["customerChangeEmail"],
    queryFn: () => fetchCustomer(session.data.customerId),
    onSuccess: fillFormFields,
    disabled: session.isLoading
  })
  const changeEmailMutation = useMutation(
    ({ email, password }) => changeEmail(session.data.customerId, email, password),
    {
      onSuccess: handleSuccess
    }
  )
  const form = useForm(
    {
      email: "",
      password: ""
    },
    {
      email: checkEmail,
      password: makeNotEmptyChecker("Contraseña vacía")
    }
  )

  if (isVisible && (customerQuery.isLoading || changeEmailMutation.isLoading)) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  return (
    <Dialog.Container visible={isVisible} onBackdropPress={onDismiss}>
      <Dialog.Title>
        Cambia tu correo de electrónico
      </Dialog.Title>

      <Dialog.Input
        value={form.getField("email")}
        onChange={form.setField("email")}
        placeholder="Nuevo correo electrónico"
      />

      <Dialog.Input
        value={form.getField("password")}
        onChange={form.setField("password")}
        placeholder="Contraseña"
        secureTextEntry
      />

      <Dialog.Button
        label="Cancelar"
        onPress={onDismiss}
        color="red"
      />

      <Dialog.Button
        label="Confirmar"
        onPress={handleSubmit}
      />
    </Dialog.Container>
  )
}

const ChangePasswordDialog = ({ isVisible, onDismiss }) => {
  const [session, _] = useSession()

  const handleSubmit = () => {
    changePasswordMutation.mutate(form.fields)
  }

  const handleSuccess = () => {
    onDismiss()

    Alert.alert(
      "Éxito",
      "Tu contraseña se actualizó con éxito"
    )
  }

  const changePasswordMutation = useMutation(
    ({ oldPassword, newPassword }) => changePassword(session.data.customerId, oldPassword, newPassword),
    {
      onSuccess: handleSuccess
    }
  )
  const form = useForm(
    {
      oldPassword: "",
      newPassword: ""
    },
    {
      oldPassword: makeNotEmptyChecker("Contraseña vacía"),
      newPassword: makeNotEmptyChecker("Contraseña vacía")
    }
  )

  if (isVisible && changePasswordMutation.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  return (
    <Dialog.Container visible={isVisible} onBackdropPress={onDismiss}>
      <Dialog.Title>
        Cambia tu contraseña
      </Dialog.Title>

      <Dialog.Input
        value={form.getField("newPassword")}
        onChange={form.setField("newPassword")}
        placeholder="Nueva contraseña"
        secureTextEntry
      />

      <Dialog.Input
        value={form.getField("oldPassword")}
        onChange={form.setField("oldPassword")}
        placeholder="Vieja contraseña"
        secureTextEntry
      />

      <Dialog.Button
        label="Cancelar"
        onPress={onDismiss}
        color="red"
      />

      <Dialog.Button
        label="Confirmar"
        onPress={handleSubmit}
      />
    </Dialog.Container>
  )
}

const CloseSessionDialog = ({ isVisible, onDismiss }) => {
  const navigation = useNavigation()
  const [_, setSession] = useSession()

  const handleCloseSession = () => {
    setSession(_ => null)

    onDismiss()

    navigation.navigate("Welcome")
  }

  return (
    <Dialog.Container visible={isVisible} onBackdropPress={onDismiss}>
      <Dialog.Title>
        ¿Estás seguro?
      </Dialog.Title>

      <Dialog.Description>
        Estás apunto de cerrar sesión
      </Dialog.Description>

      <Dialog.Button
        label="Cancelar"
        onPress={onDismiss}
        color="red"
      />

      <Dialog.Button
        label="Confirmar"
        onPress={handleCloseSession}
      />
    </Dialog.Container>
  )
}

const DeleteAccountDialog = ({ isVisible, onDismiss }) => {
  const navigation = useNavigation()
  const [session, _] = useSession()

  const handleSuccess = () => {
    onDismiss()

    navigation.navigate("Welcome")
  }

  const handleDeleteAccount = () => {
    deleteCustomerMutation.mutate({ customerId: session.data.customerId })

    navigation.navigate("Welcome")
  }

  const deleteCustomerMutation = useMutation(
    ({ customerId }) => deleteCustomer(customerId),
    {
      onSuccess: handleSuccess
    }
  )

  return (
    <Dialog.Container visible={isVisible} onBackdropPress={onDismiss}>
      <Dialog.Title>
        ¿Estás seguro?
      </Dialog.Title>

      <Dialog.Description>
        No podrás recuperar tu cuenta después de eliminarla
      </Dialog.Description>

      <Dialog.Button
        label="Cancelar"
        onPress={onDismiss}
        color="red"
      />

      <Dialog.Button
        label="Confirmar"
        onPress={handleDeleteAccount}
      />
    </Dialog.Container>
  )
}

export default () => {
  const navigation = useNavigation()
  const [session, _] = useSession()

  const [isChangeEmailDialogVisible, setIsChangeEmailDialogVisible] = useState(false)
  const [isChangePasswordDialogVisible, setIsChangePasswordDialogVisible] = useState(false)
  const [isCloseSessionDialogVisible, setIsCloseSessionDialogVisible] = useState(false)
  const [isDeleteAccountDialogVisible, setIsDeleteAccountDialogVisible] = useState(false)

  navigation.addListener("beforeRemove", (event) => {
    event.preventDefault()
  })

  const navigateToCreateReport = () => {
    navigation.navigate("CreateReport")
  }

  const customerQuery = useQuery({
    queryKey: ["customerSettings"],
    queryFn: () => fetchCustomer(session.data.customerId),
    disabled: session.isLoading
  })

  if (customerQuery.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  return (
    <Padder style={styles.container}>
      <SecondaryTitle>
        Configuración
      </SecondaryTitle>

      <List.Section>
        <SettingEntry
          setting="Publicaciones que te gustan"
          onPress={() => navigation.navigate("LikedPosts")}
        />

        <SettingEntry
          setting="Tus compras"
          onPress={() => navigation.navigate("PurchasesList")}
        />

        <Divider />

        <View>
          {
            customerQuery.data.account_type === "PlainAccount" ?
            (
              <View>
                <SettingEntry
                  setting="Cambiar correo electrónico"
                  onPress={() => setIsChangeEmailDialogVisible(true)}
                />

                <SettingEntry
                  setting="Cambiar contraseña"
                  onPress={() => setIsChangePasswordDialogVisible(true)}
                />
              </View>
            ) :
            null
          }
        </View>

        <SettingEntry
          setting="Hacer un reporte"
          onPress={navigateToCreateReport}
        />

        <SettingEntry
          setting="Cerrar sesión"
          onPress={() => setIsCloseSessionDialogVisible(true)}
          isDangerous
        />

        <SettingEntry
          setting="Eliminar cuenta"
          onPress={() => setIsDeleteAccountDialogVisible(true)}
          isDangerous
        />
      </List.Section>

      <ChangeEmailDialog
        isVisible={isChangeEmailDialogVisible}
        onDismiss={() => setIsChangeEmailDialogVisible(false)}
      />

      <ChangePasswordDialog
        isVisible={isChangePasswordDialogVisible}
        onDismiss={() => setIsChangePasswordDialogVisible(false)}
      />

      <CloseSessionDialog
        isVisible={isCloseSessionDialogVisible}
        onDismiss={() => setIsCloseSessionDialogVisible(false)}
      />

      <DeleteAccountDialog
        isVisible={isDeleteAccountDialogVisible}
        onDismiss={() => setIsDeleteAccountDialogVisible(false)}
      />
    </Padder>
  )
}
