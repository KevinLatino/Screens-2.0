import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import { formatBase64String, formatDate } from '../utilities/formatting'
import TextField from '../components/TextField'
import Button from '../components/Button'
import Empty from '../components/Empty'
import LoadingSpinner from '../components/LoadingSpinner'
import CommentTile from '../components/CommentTile'
import SecondaryTitle from '../components/SecondaryTitle'
import LikeButton from '../components/LikeButton'
import VividIconButton from '../components/VividIconButton'
import { SafeAreaView } from 'react-native-safe-area-context'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { ImageSlider } from 'react-native-image-slider-banner'
import { Body, Caption1 } from 'react-native-ios-kit'
import {
  View,
  ScrollView as ReactNativeScrollview,
  StyleSheet
} from 'react-native'
import {
  Divider,
  IconButton,
  Chip
} from 'react-native-paper'
import configuration from '../configuration'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    columnGap: 20,
    backgroundColor: "white"
  },
  informationView: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "flex-start",
    gap: 8,
    padding: 16
  },
  categoriesChipsView: {
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    gap: 10
  },
  commentsScrollView: {
    flex: 1,
    paddingVertical: 15,
    gap: 20
  },
  commentInputView: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: 16,
    width: "100%",
  },
  buttonsView: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10
  }
})

const fetchPost = async (postId, customerId) => {
  const payload = {
    post_id: postId,
    customer_id: customerId
  }
  const post = await requestServer(
    "/posts_service/get_post_by_id",
    payload
  )

  return post
}

const fetchPostComments = async (postId) => {
  const payload = {
    post_id: postId
  }
  const comments = await requestServer(
    "/comments_service/get_post_comments",
    payload
  )

  return comments
}

const addPostComment = async (postId, customerId, text) => {
  const payload = {
    post_id: postId,
    user_id: customerId,
    text
  }
  const _ = await requestServer(
    "/comments_service/add_comment",
    payload
  )
}

const formatPostDate = (isoDateString) => {
  const formatted = `Publicado el ${formatDate(isoDateString)}`

  return formatted
}

const formatPostAmount = (amount) => {
  if (amount === 1) {
    return ""
  }

  const formatted = `${amount} unidades disponibles`

  return formatted
}

const CommentInput = ({ postId, customerId }) => {
  const queryClient = useQueryClient()

  const [text, setText] = useState("")

  const handleCommentSubmit = async () => {
    setText("")

    addCommentMutation.mutate({
      postId,
      customerId,
      text
    })
  }

  const addCommentMutation = useMutation(
    ({ postId, customerId, text }) => addPostComment(postId, customerId, text),
    {
      onSuccess: () => queryClient.refetchQueries({
        queryKey: ["postComments"]
      })
    }
  )

  return (
    <View style={styles.commentInputView}>
      <TextField
        value={text}
        onChangeText={setText}
        placeholder="Escribe un comentario"
        multiline
        light
        style={{ color: "black" }}
      />

      {
        addCommentMutation.isLoading ?
        <LoadingSpinner /> :
        <VividIconButton
          icon="send"
          disabled={text === ""}
          onPress={handleCommentSubmit}
        />
      }
    </View>
  )
}

const CommentsScrollView = ({ postId }) => {
  const [session, _] = useSession()

  const commentsQuery = useQuery({
    queryKey: ["postComments"],
    queryFn: () => fetchPostComments(postId)
  })

  if (commentsQuery.isLoading || session.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  const commentsTiles = commentsQuery.data.map((comment) => {
    return (
      <CommentTile
        key={comment.comment_id}
        comment={comment}
      />
    )
  })

  return (
    <View style={styles.commentsScrollView}>
      <CommentInput
        customerId={session.data.customerId}
        postId={postId}
      />

      <View>
        {
          commentsTiles.length === 0 ?
          <Empty icon="comment" message="No hay comentarios" /> :
          commentsTiles
        }
      </View>
    </View>
  )
}

const PostView = ({ postId }) => {
  const navigation = useNavigation()
  const [session, _] = useSession()

  const navigateToStoreView = () => {
    navigation.navigate("StoreView", {
      storeId: postQuery.data.store_id
    })
  }

  const navigateToOrder = () => {
    navigation.navigate("Order", {
      postId: post.post_id
    })
  }

  const postQuery = useQuery({
    queryKey: ["post"],
    queryFn: () => fetchPost(postId, session.data.customerId)
  })

  if (postQuery.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  const categoriesChips = postQuery.data.categories.map((category) => {
    return (
      <Chip
        key={category}
        mode="flat"
        icon="pound"
        style={{ backgroundColor: configuration.BACKGROUND_COLOR }}
        textStyle={{ color: "white" }}
      >
        {category}
      </Chip>
    )
  })

  const post = postQuery.data
  const imageSliderData = post.multimedia.map((image) => {
    return {
      img: formatBase64String(image)
    }
  })

  return (
    <View style={{ flex: 1 }}>
      <ImageSlider
        data={imageSliderData}
        autoPlay={false}
      />

      <View style={styles.informationView}>
        <SecondaryTitle>
          {post.title}
        </SecondaryTitle>

        <Body>
          {post.description}
        </Body>

        <Caption1
          style={{ color: "gray" }}
        >
          {formatPostDate(post.publication_date)}
        </Caption1>

        <Caption1
          style={{ color: "gray" }}
        >
          {
            formatPostAmount(post.amount)
          }
        </Caption1>

        <Caption1
          style={{ color: configuration.ACCENT_COLOR_1 }}
        >
          ₡{post.price}
        </Caption1>

        <ReactNativeScrollview
          horizontal
          contentContainerStyle={styles.categoriesChipsView}
        >
          {categoriesChips}
        </ReactNativeScrollview>

        <View style={styles.buttonsView}>
          <IconButton
            icon="store-outline"
            iconColor={configuration.ACCENT_COLOR_1}
            style={{ backgroundColor: "white" }}
            onPress={navigateToStoreView}
          />

          <LikeButton
            postId={postId}
            doesCustomerLikePost={post.does_customer_like_post}
            iconColor={configuration.ACCENT_COLOR_1}
            style={{ backgroundColor: "white" }}
          />
        </View>

        <Button
          style={{ width: "100%" }}
          onPress={navigateToOrder}
        >
          Comprar
        </Button>
      </View>
    </View>
  )
}

export default () => {
  const route = useRoute()

  const { postId } = route.params

  return (
    <KeyboardAwareScrollView style={{ flex: 1, flexGrow: 1 }}>
        <SafeAreaView style={styles.container}>
          <PostView postId={postId} />

          <Divider style={{ color: configuration.ACCENT_COLOR_1 }}/>

          <CommentsScrollView postId={postId} />
        </SafeAreaView>
    </KeyboardAwareScrollView>
  )
}
