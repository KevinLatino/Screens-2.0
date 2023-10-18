import { TouchableRipple, Avatar } from 'react-native-paper'
import { formatBase64String } from '../utilities/formatting'
import { selectPictureFromGallery } from '../utilities/camera'
import configuration from '../configuration'

export default ({ picture, defaultIcon, onChangePicture, useUrl, ...avatarProps }) => {
  const handleChangePicture = async () => {
    const newPicture = await selectPictureFromGallery()

    if (newPicture === null) {
      return
    }

    onChangePicture(newPicture)
  }

  const source = useUrl ? picture : formatBase64String(picture)

  return (
    <TouchableRipple
      onPress={handleChangePicture}
    >
      {
        picture !== null ?
        (
          <Avatar.Image
            source={{ uri: source }}
            size={80}
            {...avatarProps}
          />
        ) :
        (
          <Avatar.Icon
            icon={defaultIcon}
            size={80}
            color="white"
            style={{ backgroundColor: configuration.ACCENT_COLOR_2, color: "white" }}
          />
        )
      }
    </TouchableRipple>
  )
}
