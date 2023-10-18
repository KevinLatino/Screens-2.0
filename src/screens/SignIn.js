import { useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '../utilities/hooks'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import { makeNotEmptyChecker, checkEmail } from '../utilities/validators'
import TextField from '../components/TextField'
import GoogleSignInButton from '../components/GoogleSignInButton'
import LoadingSpinner from '../components/LoadingSpinner'
import Title from '../components/Title'
import Subtitle from '../components/Subtitle'
import Button from '../components/Button'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { View, Alert, StyleSheet } from 'react-native'
import { Divider } from 'react-native-paper'
import configuration from '../configuration'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: configuration.BACKGROUND_COLOR
  },
  title: {
    fontSize: 50,
    color: "#344340",
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    color: "gray",
    textAlign: "center",
  },
  thirdText: {
    fontSize: 18,
    color: "#344340",
    fontWeight: "bold",
    textAlign: "center",
  }
})

const signInWithPlainAccount = async (credentials) => {
  const payload = {
    ...credentials
  }

  const handleError = (data) => {
    if (data.message === "INCORRECT_CREDENTIALS") {
      Alert.alert(
        "Credenciales incorrectas",
        "Las credenciales que ingresaste son incorrectas"
      )

      return true
    }

    return false
  }

  const session = await requestServer(
    "/users_service/sign_in_user_with_plain_account",
    payload,
    handleError
  )

  return session
}

const signInWithGoogleAccount = async (googleUniqueIdentifier) => {
  const payload = {
    google_unique_identifier: googleUniqueIdentifier
  }

  const handleError = (data) => {
    if (data.message === "GOOGLE_ACCOUNT_NOT_FOUND") {
      Alert.alert(
        "Cuenta no encontrada",
        "No hay ninguna cuenta registrada con la cuenta de Google que escogiste"
      )

      return true
    }

    return false
  }

  const session = await requestServer(
    "/users_service/sign_in_user_with_google_account",
    payload,
    handleError
  )

  return session
}

export default () => {
  const navigation = useNavigation()
  const [_, setSession] = useSession()

  const handleSignInWithPlainAccount = () => {
    if (!form.validate()) {
      Alert.alert(
        "Información incompleta",
        "Ingresa la información necesaria para iniciar sesión"
      )

      return
    }

    signInWithPlainAccountMutation.mutate({ credentials: form.fields })
  }

  const handleSignInWithGoogleAccount = (userInformation) => {
    const googleUniqueIdentifier = userInformation["id"]

    signInWithGoogleAccountMutation.mutate({ googleUniqueIdentifier })
  }

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
  const signInWithPlainAccountMutation = useMutation(
    ({ credentials }) => signInWithPlainAccount(credentials)
  )
  const signInWithGoogleAccountMutation = useMutation(
    ({ googleUniqueIdentifier }) => signInWithGoogleAccount(googleUniqueIdentifier)
  )

  const signInData =
    signInWithPlainAccountMutation.isSuccess ?
    signInWithPlainAccountMutation.data :
    (
      signInWithGoogleAccountMutation.isSuccess ?
      signInWithGoogleAccountMutation.data :
      null
    )
  const isSignInLoading = (
    (signInWithPlainAccountMutation.isLoading) ||
    (signInWithGoogleAccountMutation.isLoading)
  )

  useEffect(() => {
    if (signInData !== null) {
      setSession({
        token: signInData.token,
        customerId: signInData.user_id
      })

      navigation.navigate("Home")
    }
  }, [signInData])

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
      <View style={styles.container}>
        <Title>
          Bienvenido
        </Title>

        <Subtitle>
          ¡Inicia sesión para comenzar!
        </Subtitle>

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

        <Button
          style={{ width: "80%" }}
          onPress={handleSignInWithPlainAccount}
          disabled={isSignInLoading}
        >
          {
            signInWithPlainAccountMutation.isLoading ?
            <LoadingSpinner /> :
            "Iniciar sesión"
          }
        </Button>

        <Divider style={{ width: "90%", color: configuration.ACCENT_COLOR_1 }} />

        <Subtitle>
          O también
        </Subtitle>

        {
          signInWithGoogleAccountMutation.isLoading ?
          <LoadingSpinner /> :
          <GoogleSignInButton
            text="Continúa con Google"
            onSignIn={handleSignInWithGoogleAccount}
            disabled={isSignInLoading}
          />
        }
      </View>
    </KeyboardAwareScrollView>
  )
}
