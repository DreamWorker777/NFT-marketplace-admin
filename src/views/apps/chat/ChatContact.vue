<template>
  <component
    :is="tag"
    v-on="$listeners"
  >
    <b-avatar
      size="42"
      :src="contact.sender.avatar || defaultImg"
      :badge="true"
      class="badge-minimal"
      :badge-variant="resolveAvatarBadgeVariant(contact.sender.status || 'online')"
      variant="transparent"
    />
    <div class="chat-info flex-grow-1">
      <h5 class="mb-0">
        {{ contact.sender.username }}
      </h5>
      <p class="card-text text-truncate">
        {{ contact.lastMsg.content }}
      </p>
    </div>
    <div
      class="chat-meta text-nowrap"
    >
      <small class="float-right mb-25 chat-time">{{ formatDateToMonthShort(contact.lastMsg.sent_at, { hour: 'numeric', minute: 'numeric' }) }}</small>
      <b-badge
        v-if="contact.unread > 0"
        pill
        variant="primary"
        class="float-right"
      >
        {{ contact.unread }}
      </b-badge>
    </div>
  </component>
</template>

<script>
import { BAvatar, BBadge } from 'bootstrap-vue'
import { formatDateToMonthShort } from '@core/utils/filter'
import useChat from './useChat'

export default {
  components: {
    BAvatar,
    BBadge,
  },
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    contact: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    defaultImg: require('@/assets/images/avatars/avatar.png')
  }),
  setup() {
    const { resolveAvatarBadgeVariant } = useChat()
    return { formatDateToMonthShort, resolveAvatarBadgeVariant }
  },
}
</script>

<style lang="scss" scoped>
	.chat-info {
		width: calc(100% - 92px) !important;
	}
</style>
