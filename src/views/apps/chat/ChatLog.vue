<template>
  <div class="chats">
    <div
      v-for="(msgGrp, index) in formattedChatData.formattedChatLog"
      :key="msgGrp.senderId+String(index)"
      class="chat"
      :class="{'chat-left': msgGrp.senderId === formattedChatData.contact.id}"
    >
      <div class="chat-avatar">
        <b-avatar
          size="36"
          class="avatar-border-2 box-shadow-1"
          variant="transparent"
          :src="msgGrp.senderId === formattedChatData.contact.id ? formattedChatData.contact.avatar : profileUserAvatar"
        />
      </div>
      <div class="chat-body">
        <div
          v-for="msgData in msgGrp.messages"
          :key="msgData.time"
          class="chat-content"
        >
          <p>{{ msgData.msg }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'
import { BAvatar } from 'bootstrap-vue'

export default {
  components: {
    BAvatar,
  },
  props: {
    chatData: {
      type: Object,
      required: true,
    },
    profileUserAvatar: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const formattedChatData = computed(() => {
      const contact = {
        id: props.chatData.contact.sender._id,
        avatar: props.chatData.contact.sender.avatar || require('@/assets/images/avatars/avatar.png')
      }

      let chatLog = []
      if (props.chatData.chat) {
        chatLog = props.chatData.chat
      }

      const formattedChatLog = []
      let chatMessageSenderId = chatLog[0] ? chatLog[0].sender : undefined
      let msgGroup = {
        senderId: chatMessageSenderId,
        messages: [],
      }

      chatLog.forEach((msg, index) => {
        if (chatMessageSenderId === msg.sender) {
          msgGroup.messages.push({
            msg: msg.content,
            time: msg.sent_at,
          })
        } else {
          chatMessageSenderId = msg.sender
          formattedChatLog.push(msgGroup)
          msgGroup = {
            senderId: msg.sender,
            messages: [{
              msg: msg.content,
              time: msg.sent_at,
            }],
          }
        }
        if (index === chatLog.length - 1) formattedChatLog.push(msgGroup)
      })

      return {
        formattedChatLog,
        contact,
        profileUserAvatar: props.profileUserAvatar,
      }
    })

    return {
      formattedChatData,
    }
  },
}
</script>

<style>

</style>
