import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '../utilities/hooks'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import {
  makeNotEmptyChecker,
  checkEmail,
  checkPhoneNumber
} from '../utilities/validators'
import TextField from '../components/TextField'
import GoogleSignInButton from '../components/GoogleSignInButton'
import LoadingSpinner from '../components/LoadingSpinner'
import PictureInput from '../components/PictureInput'
import Button from '../components/Button'
import Title from '../components/Title'
import Subtitle from '../components/Subtitle'
import Scroller from '../components/Scroller'
import Padder from '../components/Padder'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { View, Alert, StyleSheet } from 'react-native'
import { Divider } from 'react-native-paper'
import configuration from '../configuration'

const styles = StyleSheet.create({
  container: {
    gap: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: configuration.BACKGROUND_COLOR
  },
  inputsContainer: {
    gap: 15,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

const signUpWithPlainAccount = async (userInformation) => {
  const payload = {
    ...userInformation
  }

  const handleError = (data) => {
    if (data.message === "UNAVAILABLE_EMAIL") {
      Alert.alert(
        "Correo ocupado",
        "El correo electrónico que ingresaste ya está en uso"
      )

      return true
    }

    return false
  }

  const session = await requestServer(
    "/customers_service/sign_up_customer_with_plain_account",
    payload,
    handleError
  )

  return session
}

const signUpWithGoogleAccount = async (userInformation, googleUniqueIdentifier) => {
  delete userInformation["email"]
  delete userInformation["password"]

  const payload = {
    ...userInformation,
    google_unique_identifier: googleUniqueIdentifier
  }

  const handleError = (data) => {
    if (data.message === "GOOGLE_ACCOUNT_ALREADY_EXISTS") {
      Alert.alert(
        "Cuanta de Google ocupada",
        "Alguien ya se registró con esta cuenta de Google"
      )

      return true
    }

    return false
  }

  const session = await requestServer(
    "/customers_service/sign_up_customer_with_google_account",
    payload,
    handleError
  )

  return session
}

export default () => {
  const navigation = useNavigation()
  const [_, setSession] = useSession()

  const [signingUpWithPlainAccount, setSigninUpWithPlainAccount] = useState(true)
  const [useUrlPicture, setUseUrlPicture] = useState(false)
  const [googleUniqueIdentifier, setGoogleUniqueIdentifier] = useState(null)
  const [picture, setPicture] = useState(null)

  const handleSignUp = () => {
    if (!form.validate()) {
      Alert.alert(
        "Información incompleta",
        "Ingresa la información necesaria para registrarte"
      )

      return
    }

    if (signingUpWithPlainAccount) {
      signUpWithPlainAccountMutation.mutate({
        picture,
        ...form.fields
      })
    } else {
      signUpWithGoogleAccountMutation.mutate({
        googleUniqueIdentifier,
        picture,
        ...form.fields
      })
    }
  }

  const handleChangePicture = (newPicture) => {
    setUseUrlPicture(false)
    setPicture(newPicture)
  }

  const fillUpFormWithGoogleData = (userInformation) => {
    const [firstSurname, secondSurname] = userInformation.family_name.split(" ", 2)

    form.setField("second_surname")(secondSurname)
    form.setField("first_surname")(firstSurname)
    form.setField("name")(userInformation.given_name)
    form.setField("email")("google@gmail.com")
    form.setField("password")("Google")

    setPicture(_ => userInformation.picture)
    setSigninUpWithPlainAccount(_ => false)
    setUseUrlPicture(_ => true)
    setGoogleUniqueIdentifier(_ => userInformation.id)
  }

  const form = useForm(
    {
      name: "",
      first_surname: "",
      second_surname: "",
      phone_number: "",
      email: "",
      password: ""
    },
    {
      name: makeNotEmptyChecker("Nombre vacío"),
      first_surname: makeNotEmptyChecker("Primer apellido vacío"),
      second_surname: makeNotEmptyChecker("Segundo apellido vacío"),
      phone_number: checkPhoneNumber,
      email: checkEmail,
      password: makeNotEmptyChecker("Contraseña vacía")
    }
  )
  const signUpWithPlainAccountMutation = useMutation(
    (userInformation) => signUpWithPlainAccount(userInformation)
  )
  const signUpWithGoogleAccountMutation = useMutation(
    ({ googleUniqueIdentifier, ...userInformation }) => signUpWithGoogleAccount(
      userInformation, googleUniqueIdentifier
    )
  )

  const signUpData =
    signUpWithPlainAccountMutation.isSuccess ?
    signUpWithPlainAccountMutation.data :
    (
      signUpWithGoogleAccountMutation.isSuccess ?
      signUpWithGoogleAccountMutation.data :
      null
    )
  const isSignUpLoading = (
    (signUpWithPlainAccountMutation.isLoading) ||
    (signUpWithGoogleAccountMutation.isLoading)
  )

  useEffect(() => {
    if (signUpData !== null) {
      setSession({
        token: signUpData.token,
        customerId: signUpData.user_id
      })

      navigation.navigate("Home")
    }
  }, [signUpData])

  return (
    <Scroller>
      <KeyboardAwareScrollView>
        <Padder style={styles.container}>
          <Title>
            Registrarse
          </Title>

          <Subtitle>
            Ingresa tus datos personales
          </Subtitle>

          <PictureInput
            defaultIcon="account"
            picture={picture}
            onChangePicture={handleChangePicture}
            useUrl={useUrlPicture}
          />

          <View style={styles.inputsContainer}>
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
              keyboardType="numeric"
            />

            {
              signingUpWithPlainAccount ?
              (
                <View style={styles.inputsContainer}>
                  <TextField
                    value={form.getField("email")}
                    onChangeText={form.setField("email")}
                    error={form.getError("email")}
                    placeholder="Correo electrónico"
                  />

                  <TextField
                    value={form.getField("password")}
                    onChangeText={form.setField("password")}
                    error={form.getError("password")}
                    placeholder="Contraseña"
                    secureTextEntry
                  />
                </View>
              ) :
              null
            }
          </View>

          <Button
            onPress={handleSignUp}
            disabled={isSignUpLoading}
            style={{ width: "70%" }}
          >
            {
              isSignUpLoading ?
              <LoadingSpinner /> :
              "Registrarse"
            }
          </Button>

          <Divider style={{ width: "90%" }} />

          <Subtitle>
            También puedes registrarte con
          </Subtitle>

          <GoogleSignInButton
            text="Registrate con Google"
            onSignIn={fillUpFormWithGoogleData}
          />
        </Padder>
      </KeyboardAwareScrollView>
    </Scroller>
  )
}
