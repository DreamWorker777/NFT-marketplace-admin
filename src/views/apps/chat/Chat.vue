<template>
  <!-- Need to add height inherit because Vue 2 don't support multiple root ele -->
	<div style="height: inherit">

		<!-- Main Area -->
		<section class="chat-app-window">

			<!-- Start Chat Logo -->
			<div
				v-if="!activeChat.contact"
				class="start-chat-area"
			>
				<div class="mb-1 start-chat-icon">
					<feather-icon
						icon="MessageSquareIcon"
						size="56"
					/>
				</div>
				<h4
					class="sidebar-toggle start-chat-text"
					@click="startConversation"
				>
					Start Conversation
				</h4>
			</div>

			<!-- Chat Content -->
			<div
				v-else
				class="active-chat"
			>
				<!-- Chat Navbar -->
				<div class="chat-navbar">
					<header class="chat-header">

						<!-- Avatar & Name -->
						<div class="d-flex align-items-center">

							<!-- Toggle Icon -->
							<div class="sidebar-toggle d-block d-lg-none mr-1">
								<feather-icon
									icon="MenuIcon"
									class="cursor-pointer"
									size="21"
									@click="mqShallShowLeftSidebar = true"
								/>
							</div>

							<b-avatar
								size="36"
								:src="require('@/assets/images/avatars/avatar.png')"
								class="mr-1 cursor-pointer badge-minimal"
								badge
								:badge-variant="resolveAvatarBadgeVariant(activeChat.contact.sender.status || 'online')"
							/>
							<h6 class="mb-0">
								{{ activeChat.contact.sender.username }}
							</h6>
						</div>

					</header>
				</div>

				<!-- User Chat Area -->
				<vue-perfect-scrollbar
					ref="refChatLogPS"
					:settings="perfectScrollbarSettings"
					class="user-chats scroll-area"
				>
					<chat-log
						:chat-data="activeChat"
						:profile-user-avatar="profileUserDataMinimal.avatar || require('@/assets/images/avatars/avatar.png')"
					/>
				</vue-perfect-scrollbar>

				<!-- Message Input -->
				<b-form
					class="chat-app-form"
					@submit.prevent="sendMessage"
				>
					<b-input-group class="input-group-merge form-send-message mr-1">
						<b-form-input
							v-model="chatInputMessage"
							placeholder="Enter your message"
						/>
					</b-input-group>
					<b-button
						variant="primary"
						type="submit"
					>
						Send
					</b-button>
				</b-form>
			</div>
		</section>

		<!-- Sidebar -->
		<portal to="content-renderer-sidebar-left">
			<chat-left-sidebar
				:contacts="contacts"
				:active-chat-contact-id="activeChat.contact ? activeChat.contact.ticketId : null"
				:profile-user-minimal-data="profileUserDataMinimal"
				:mq-shall-show-left-sidebar.sync="mqShallShowLeftSidebar"
				@open-chat="openChatOfContact"
			/>
		</portal>
  </div>
</template>

<script>
import store from '@/store'
import {
  	ref, onUnmounted, nextTick,
} from '@vue/composition-api'
import {
  	BAvatar, BDropdown, BDropdownItem, BForm, BInputGroup, BFormInput, BButton,
} from 'bootstrap-vue'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

import { $themeBreakpoints } from '@themeConfig'
import { useResponsiveAppLeftSidebarVisibility } from '@core/comp-functions/ui/app'
import ChatLeftSidebar from './ChatLeftSidebar.vue'
import chatStoreModule from './chatStoreModule'
import ChatLog from './ChatLog.vue'
import useChat from './useChat'

export default {
	components: {

		// BSV
		BAvatar,
		BDropdown,
		BDropdownItem,
		BForm,
		BInputGroup,
		BFormInput,
		BButton,

		// 3rd Party
		VuePerfectScrollbar,

		// SFC
		ChatLeftSidebar,
		ChatLog,
	},
	data: () => ({
		userInfo: store.getters['auth/userInfo'],
	}),
	setup() {
		const CHAT_APP_STORE_MODULE_NAME = 'app-chat'

		// Register module
		if (!store.hasModule(CHAT_APP_STORE_MODULE_NAME)) store.registerModule(CHAT_APP_STORE_MODULE_NAME, chatStoreModule)

		// UnRegister on leave
		onUnmounted(() => {
			if (store.hasModule(CHAT_APP_STORE_MODULE_NAME)) store.unregisterModule(CHAT_APP_STORE_MODULE_NAME)
		})

		const { resolveAvatarBadgeVariant } = useChat()

		// Scroll to Bottom ChatLog
		const refChatLogPS = ref(null)
		const scrollToBottomInChatLog = () => {
			const scrollEl = refChatLogPS.value.$el || refChatLogPS.value
			scrollEl.scrollTop = scrollEl.scrollHeight
		}

		// ------------------------------------------------
		// Chats & Contacts
		// ------------------------------------------------
		const contacts = ref([])

		const fetchContacts = () => {
			store.dispatch('app-chat/fetchContacts')
				.then(response => {
					contacts.value = response.data.contacts
				})
		}

		fetchContacts()

		// ------------------------------------------------
		// Single Chat
		// ------------------------------------------------
		const activeChat = ref({})
		const chatInputMessage = ref('')

		const openChatOfContact = ticketId => {
			// Reset send message input value
			chatInputMessage.value = ''

			store.dispatch('app-chat/getChat', { ticketId })
				.then(response => {
					activeChat.value = response.data
					
					// Set unseenMsgs to 0
					const contact = contacts.value.find(c => c.ticketId === ticketId)

					if (contact) contact.unread = 0

					activeChat.value.contact = {...contact};
					// Scroll to bottom
					nextTick(() => { scrollToBottomInChatLog() })
				})

			// if SM device =>  Close Chat & Contacts left sidebar
			// eslint-disable-next-line no-use-before-define
			mqShallShowLeftSidebar.value = false
		}

		const sendMessage = () => {

			if (!chatInputMessage.value) return;
			const payload = {
				receiverId: activeChat.value.contact.sender._id,
				message: chatInputMessage.value,
			}
			store.dispatch('app-chat/sendMessage', payload)
				.then(response => {
					const { chat } = response.data
					activeChat.value.chat = chat;

					// Reset send message input value
					chatInputMessage.value = ''

					// Set Last Message for active contact
					const contact = contacts.value.find(c => c.ticketId === activeChat.value.contact.ticketId)
					contact.lastMsg = chat[chat.length - 1];

					// Scroll to bottom
					nextTick(() => { scrollToBottomInChatLog() })
				})
		}

		const perfectScrollbarSettings = {
			maxScrollbarLength: 150,
		}

		// ? Will contain id, name and avatar & status
		const profileUserDataMinimal = ref({})

		profileUserDataMinimal.value = store.getters['auth/userInfo']

		// UI + SM Devices
		// Left Sidebar Responsiveness
		const { mqShallShowLeftSidebar } = useResponsiveAppLeftSidebarVisibility()
		const startConversation = () => {
			if (store.state.app.windowWidth < $themeBreakpoints.lg) {
				mqShallShowLeftSidebar.value = true
			}
		}

		return {
			// Filters
			// formatDate,

			// useChat
			resolveAvatarBadgeVariant,

			// Contacts
			contacts,

			// Single Chat
			refChatLogPS,
			activeChat,
			chatInputMessage,
			openChatOfContact,
			sendMessage,

			// Profile User Minimal Data
			profileUserDataMinimal,

			// UI
			perfectScrollbarSettings,

			// UI + SM Devices
			startConversation,
			mqShallShowLeftSidebar,
		}
	},
}
</script>

<style lang="scss" scoped>

</style>

<style lang="scss">
@import "~@core/scss/base/pages/app-chat.scss";
@import "~@core/scss/base/pages/app-chat-list.scss";
</style>
