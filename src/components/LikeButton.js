import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import { IconButton } from 'react-native-paper'
import LoadingSpinner from './LoadingSpinner'

const likePost = async (postId, customerId) => {
  const payload = {
    customer_id: customerId,
    post_id: postId
  }
  const _ = await requestServer(
    "/posts_service/like_post",
    payload
  )
}

export default ({ postId, doesCustomerLikePost, ...iconButtonProps }) => {
  const queryClient = useQueryClient()
  const [session, _] = useSession()

  const [isLiked, setIsLiked] = useState(doesCustomerLikePost)

  const handleLike = () => {
    likePostMutation.mutate({ postId, customerId: session.data.customerId })

    setIsLiked(!isLiked)
  }

  const handleSuccess = () => {
    queryClient.refetchQueries({
      queryKey: ["likedPosts"]
    })
  }

  const likePostMutation = useMutation(
    ({ postId, customerId }) => likePost(postId, customerId),
    {
      onSuccess: handleSuccess
    }
  )

  if (likePostMutation.isLoading || session.isLoading) {
    return (
      <LoadingSpinner />
    )
  }

  return (
    <IconButton
      icon={isLiked ? "heart" : "heart-outline"}
      onPress={handleLike}
      {...iconButtonProps}
    />
  )
}
