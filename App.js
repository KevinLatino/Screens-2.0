import 'react-native-gesture-handler'
import { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useAtom } from 'jotai'
import { sessionAtom } from './src/context'
import { Suspense } from 'react'
import { PaperProvider } from 'react-native-paper'
import { StripeProvider } from '@stripe/stripe-react-native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import configuration from './src/configuration'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ActivityIndicator } from 'react-native'
import Home from './src/screens/Home'
import DeliveriesList from './src/screens/DeliveriesList'
import ChatsList from './src/screens/ChatsList'
import Settings from './src/screens/Settings'
import Chat from './src/screens/Chat'
import Welcome from './src/screens/Welcome'
import SignIn from './src/screens/SignIn'
import SignUp from './src/screens/SignUp'
import ChooseLocation from './src/screens/ChooseLocation'
import AddLocation from './src/screens/AddLocation'
import SearchResults from './src/screens/SearchResults'
import PostView from './src/screens/PostView'
import EditProfile from './src/screens/EditProfile'
import LikedPosts from './src/screens/LikedPosts'
import PurchasesList from './src/screens/PurchasesList'
import ProfileView from './src/screens/ProfileView'
import StoreView from './src/screens/StoreView'
import AppSnackBar from './src/components/AppSnackBar'
import Order from './src/screens/Order'

const queryClient = new QueryClient()
const Stack = createStackNavigator()
const BottomTab = createMaterialBottomTabNavigator()

const theme = {
  "colors": {
    "primary": "rgb(57, 91, 169)",
    "onPrimary": "rgb(255, 255, 255)",
    "primaryContainer": "rgb(218, 226, 255)",
    "onPrimaryContainer": "rgb(0, 25, 71)",
    "secondary": "rgb(49, 93, 168)",
    "onSecondary": "rgb(255, 255, 255)",
    "secondaryContainer": "rgb(216, 226, 255)",
    "onSecondaryContainer": "rgb(0, 26, 65)",
    "tertiary": "rgb(104, 71, 192)",
    "onTertiary": "rgb(255, 255, 255)",
    "tertiaryContainer": "rgb(232, 221, 255)",
    "onTertiaryContainer": "rgb(33, 0, 93)",
    "error": "rgb(186, 26, 26)",
    "onError": "rgb(255, 255, 255)",
    "errorContainer": "rgb(255, 218, 214)",
    "onErrorContainer": "rgb(65, 0, 2)",
    "background": "rgb(254, 251, 255)",
    "onBackground": "rgb(27, 27, 31)",
    "surface": "rgb(254, 251, 255)",
    "onSurface": "rgb(27, 27, 31)",
    "surfaceVariant": "rgb(225, 226, 236)",
    "onSurfaceVariant": "rgb(68, 70, 79)",
    "outline": "rgb(117, 119, 128)",
    "outlineVariant": "rgb(197, 198, 208)",
    "shadow": "rgb(0, 0, 0)",
    "scrim": "rgb(0, 0, 0)",
    "inverseSurface": "rgb(48, 48, 52)",
    "inverseOnSurface": "rgb(242, 240, 244)",
    "inversePrimary": "rgb(177, 197, 255)",
    "elevation": {
      "level0": "transparent",
      "level1": "rgb(244, 243, 251)",
      "level2": "rgb(238, 238, 248)",
      "level3": "rgb(232, 233, 246)",
      "level4": "rgb(230, 232, 245)",
      "level5": "rgb(226, 229, 243)"
    },
    "surfaceDisabled": "rgba(27, 27, 31, 0.12)",
    "onSurfaceDisabled": "rgba(27, 27, 31, 0.38)",
    "backdrop": "rgba(46, 48, 56, 0.4)"
  }
}

const BottomTabNavigator = () => {
  return (
    <BottomTab.Navigator>
      <BottomTab.Screen
        name="Home"
        options={{
          tabBarLabel: "Inicio",
          tabBarIcon: "home-variant"
        }}
      >
        {() => <Home />}
      </BottomTab.Screen>

      <BottomTab.Screen
        name="DeliveriesList"
        options={{
          tabBarLabel: "Entregas",
          tabBarIcon: "moped"
        }}
      >
        {() => <DeliveriesList />}
      </BottomTab.Screen>

      <BottomTab.Screen
        name="ChatsList"
        options={{
          tabBarLabel: "Mensajes",
          tabBarIcon: "chat"
        }}
      >
        {() => <ChatsList />}
      </BottomTab.Screen>

      <BottomTab.Screen
        name="Settings"
        options={{
          tabBarLabel: "Ajustes",
          tabBarIcon: "cog"
        }}
      >
        {() => <Settings />}
      </BottomTab.Screen>

      <BottomTab.Screen
        name="ProfileView"
        options={{
          tabBarLabel: "Mi Perfil",
          tabBarIcon: "account"
        }}
      >
        {() => <ProfileView />}
      </BottomTab.Screen>
    </BottomTab.Navigator>
  )
}

const Loader = () => {
  const navigation = useNavigation()

  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)
  const [_, setAtomSession] = useAtom(sessionAtom)

  useEffect(() => {
    AsyncStorage.getItem("session")
      .then((item) => {
        setSession(_ => item ?? null)
        setLoading(_ => false)
      })
  }, [])

  if (loading) {
    return (
      <ActivityIndicator />
    )
  }

  if (session === null) {
    navigation.navigate("Welcome")
  } else {
    setAtomSession(session).then((_) => {
      navigation.navigate("Home")
    })
  }
}

const Main = () => {
  const [session, _] = useAtom(sessionAtom)

  console.log(session)

  return (
    <StripeProvider
      publishableKey={configuration.STRIPE_PUBLISHABLE_KEY}
    >
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={theme}>
          <SafeAreaProvider>
              <NavigationContainer>
                <Stack.Navigator
                  initialRouteName={"Loader"}
                  screenOptions={{
                    headerShown: false
                  }}
                >
                  <Stack.Screen
                    name="Loader"
                  >
                    {() => <Loader />}
                  </Stack.Screen>

                  <Stack.Screen
                    name="Welcome"
                  >
                    {() => <Welcome />}
                  </Stack.Screen>

                  <Stack.Screen
                    name="SignIn"
                  >
                    {() => <SignIn />}
                  </Stack.Screen>

                  <Stack.Screen
                    name="SignUp"
                  >
                    {() => <SignUp />}
                  </Stack.Screen>

                  <Stack.Screen
                    name="Home"
                  >
                    {() => <BottomTabNavigator />}
                  </Stack.Screen>

                  <Stack.Screen
                    name="DeliveriesList"
                  >
                    {() => <DeliveriesList />}
                  </Stack.Screen>

                  <Stack.Screen
                    name="ChatsList"
                  >
                    {() => <ChatsList />}
                  </Stack.Screen>

                  <Stack.Screen
                    name="Chat"
                  >
                    {() => <Chat />}
                  </Stack.Screen>

                  <Stack.Screen
                    name="ChooseLocation"
                  >
                    {() => <ChooseLocation />}
                  </Stack.Screen>

                  <Stack.Screen
                    name="AddLocation"
                  >
                    {() => <AddLocation />}
                  </Stack.Screen>

                  <Stack.Screen
                    name="SearchResults"
                  >
                    {() => <SearchResults />}
                  </Stack.Screen>

                  <Stack.Screen
                    name="PostView"
                  >
                    {() => <PostView />}
                  </Stack.Screen>

                  <Stack.Screen
                    name="EditProfile"
                  >
                    {() => <EditProfile />}
                  </Stack.Screen>

                  <Stack.Screen
                    name="LikedPosts"
                  >
                    {() => <LikedPosts />}
                  </Stack.Screen>

                  <Stack.Screen
                    name="PurchasesList"
                  >
                    {() => <PurchasesList />}
                  </Stack.Screen>

                  <Stack.Screen
                    name="ProfileView"
                  >
                    {() => <ProfileView />}
                  </Stack.Screen>

                  <Stack.Screen
                    name="StoreView"
                  >
                    {() => <StoreView />}
                  </Stack.Screen>

                  <Stack.Screen
                    name="Order"
                  >
                    {() => <Order />}
                  </Stack.Screen>
                </Stack.Navigator>
              </NavigationContainer>
          </SafeAreaProvider>

          <AppSnackBar />
        </PaperProvider>
      </QueryClientProvider>
    </StripeProvider>
  )
}

export default () => {
  return (
    <Suspense fallback={null}>
      <Main />
    </Suspense>
  )
}
