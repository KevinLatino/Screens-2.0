import 'react-native-gesture-handler'
import { Suspense } from 'react'
import { PaperProvider } from 'react-native-paper'
import { ThemeProvider as IosKitProvider } from 'react-native-ios-kit'
import { ApplicationProvider as UiKittenProvider } from '@ui-kitten/components'
import { StripeProvider } from '@stripe/stripe-react-native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useSession } from './src/context'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useFonts } from 'expo-font'
import * as eva from '@eva-design/eva'
import configuration from './src/configuration'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import LoadingSpinner from './src/components/LoadingSpinner'
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
import PictureSearchResults from './src/screens/PictureSearchResults'
import PostView from './src/screens/PostView'
import EditProfile from './src/screens/EditProfile'
import LikedPosts from './src/screens/LikedPosts'
import PurchasesList from './src/screens/PurchasesList'
import ProfileView from './src/screens/ProfileView'
import StoreView from './src/screens/StoreView'
import Order from './src/screens/Order'
import MultimediaView from './src/screens/MultimediaView'
import StorePosts from './src/screens/StorePosts'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 0
    }
  }
})
const Stack = createStackNavigator()
const BottomTab = createBottomTabNavigator()

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
    <BottomTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: configuration.BACKGROUND_COLOR,
        },
        tabBarActiveTintColor: configuration.ACCENT_COLOR_1,
        tabBarInactiveTintColor: "white"
      }}
    >
      <BottomTab.Screen
        name="Home"
        options={{
          tabBarLabel: "Inicio",
          tabBarIcon: (props) => <MaterialCommunityIcons name="home-variant" {...props} />
        }}
      >
        {() => <Home />}
      </BottomTab.Screen>

      <BottomTab.Screen
        name="DeliveriesList"
        options={{
          tabBarLabel: "Entregas",
          tabBarIcon: (props) => <MaterialCommunityIcons name="moped" {...props} />
        }}
      >
        {() => <DeliveriesList />}
      </BottomTab.Screen>

      <BottomTab.Screen
        name="ChatsList"
        options={{
          tabBarLabel: "Mensajes",
          tabBarIcon: (props) => <MaterialCommunityIcons name="chat" {...props} />
        }}
      >
        {() => <ChatsList />}
      </BottomTab.Screen>

      <BottomTab.Screen
        name="Settings"
        options={{
          tabBarLabel: "Ajustes",
          tabBarIcon: (props) => <MaterialCommunityIcons name="cog" {...props} />
        }}
      >
        {() => <Settings />}
      </BottomTab.Screen>

      <BottomTab.Screen
        name="ProfileView"
        options={{
          tabBarLabel: "Mi Perfil",
          tabBarIcon: (props) => <MaterialCommunityIcons name="account" {...props} />
        }}
      >
        {() => <ProfileView />}
      </BottomTab.Screen>
    </BottomTab.Navigator>
  )
}

const Main = () => {
  const [loaded] = useFonts({
    Galada: require("./assets/fonts/Galada-Regular.ttf"),
    Roboto: require("./assets/fonts/Roboto-Regular.ttf")
  })
  const [session, _] = useSession()

  console.log(session)

  if (session.isLoading || (!loaded)) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  return (
    <StripeProvider
      publishableKey={configuration.STRIPE_PUBLISHABLE_KEY}
    >
      <QueryClientProvider client={queryClient}>
        <UiKittenProvider {...eva} theme={eva.light}>
          <IosKitProvider>
            <PaperProvider theme={theme}>
              <SafeAreaProvider>
                  <NavigationContainer>
                    <Stack.Navigator
                      initialRouteName="Welcome"
                      screenOptions={{
                        headerShown: false
                      }}
                    >
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
                        name="PictureSearchResults"
                      >
                        {() => <PictureSearchResults />}
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
                        name="StorePosts"
                      >
                        {() => <StorePosts />}
                      </Stack.Screen>

                      <Stack.Screen
                        name="MultimediaView"
                      >
                        {() => <MultimediaView />}
                      </Stack.Screen>

                      <Stack.Screen
                        name="Order"
                      >
                        {() => <Order />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  </NavigationContainer>
              </SafeAreaProvider>
            </PaperProvider>
          </IosKitProvider>
        </UiKittenProvider>
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
