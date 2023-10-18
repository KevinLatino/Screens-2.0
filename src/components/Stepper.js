import { useState } from 'react'
import StepIndicator from 'react-native-step-indicator'
import { View } from 'react-native'
import configuration from '../configuration'

const customStepIndicatorStyles = {
  stepStrokeCurrentColor: configuration.ACCENT_COLOR_1,
  stepStrokeFinishedColor: configuration.ACCENT_COLOR_1,
  stepStrokeUnFinishedColor: configuration.ACCENT_COLOR_1,
  separatorFinishedColor: configuration.ACCENT_COLOR_1,
  separatorUnFinishedColor: configuration.BACKGROUND_COLOR,
  stepIndicatorFinishedColor: configuration.ACCENT_COLOR_1,
  stepIndicatorUnFinishedColor: configuration.BACKGROUND_COLOR,
  stepIndicatorCurrentColor: configuration.ACCENT_COLOR_1,
  stepIndicatorLabelCurrentColor: "white",
  stepIndicatorLabelFinishedColor: "white",
  stepIndicatorLabelUnFinishedColor: "white",
  labelColor: "white",
  currentStepLabelColor: configuration.ACCENT_COLOR_1
}

export const useStepper = (stepCount) => {
  const [position, setPosition] = useState(0)

  const setNextPosition = () => {
    const newPosition = (position + 1) <= stepCount ?
      position + 1 :
      position

    setPosition(newPosition)
  }

  return {
    position,
    setPosition,
    setNextPosition
  }
}

export default ({ ...stepIndicatorProps }) => {
  return (
    <View style={{ width: "100%" }}>
      <StepIndicator
        {...stepIndicatorProps}
        customStyles={customStepIndicatorStyles}
      />
    </View>
  )
}
