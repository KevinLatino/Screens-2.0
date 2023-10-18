import { Slider as ImportedSlider } from '@miblanchard/react-native-slider'
import configuration from '../configuration'

export default ({
  minimumValue,
  maximumValue,
  selectedMinimumValue,
  selectedMaximumValue,
  onChange,
  theme,
  ...sliderProps
}) => {
  return (
    <ImportedSlider
      minimumValue={minimumValue}
      maximumValue={maximumValue}
      value={[selectedMinimumValue, selectedMaximumValue]}
      onValueChange={onChange}
      {...sliderProps}

      thumbStyle={{ backgroundColor: configuration.SECONDARY_COLOR }}
      trackStyle={{ backgroundColor: configuration.ACCENT_COLOR_1 }}
    />
  )
}
