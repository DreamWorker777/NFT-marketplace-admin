<template>
  <div class="sidebar-left">
    <div class="sidebar">

      <!-- Sidebar Content -->
      <div
        class="sidebar-content"
        :class="{'show': mqShallShowLeftSidebar}"
      >
        <!-- Header -->
        <div class="chat-fixed-search">
          <div class="d-flex align-items-center w-100">
            <div class="sidebar-profile-toggle">
              <b-avatar
                size="42"
                class="cursor-pointer badge-minimal avatar-border-2"
                :src="profileUserMinimalData.avatar || defaultImg"
                variant="transparent"
                badge
                badge-variant="success"
              />
            </div>
            <!-- Search -->
            <b-input-group class="input-group-merge ml-1 w-100 round">
              <b-input-group-prepend is-text>
                <feather-icon
                  icon="SearchIcon"
                  class="text-muted"
                />
              </b-input-group-prepend>
              <b-form-input
                v-model="searchQuery"
                placeholder="Search..."
              />
            </b-input-group>
          </div>
        </div>

        <!-- ScrollArea: Chat & Contacts -->
        <vue-perfect-scrollbar
          :settings="perfectScrollbarSettings"
          class="chat-user-list-wrapper list-group scroll-area"
        >
          <!-- Contacts Title -->
          <h4 class="chat-list-title">
            Contacts
          </h4>

          <!-- Contacts -->
          <ul class="chat-users-list contact-list media-list">
            <chat-contact
              v-for="contact in filteredContacts"
              :key="contact.ticketId"
              :contact="contact"
              :class="{'active': activeChatContactId === contact.ticketId}"
              tag="li"
              @click="$emit('open-chat', contact.ticketId)"
            />
          </ul>
        </vue-perfect-scrollbar>
      </div>

    </div>
  </div>
</template>

<script>
import {
  BAvatar, BInputGroup, BInputGroupPrepend, BFormInput,
} from 'bootstrap-vue'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { ref, computed } from '@vue/composition-api'
import ChatContact from './ChatContact.vue'

export default {
  components: {

    // BSV
    BAvatar,
    BInputGroup,
    BInputGroupPrepend,
    BFormInput,

    // 3rd party
    VuePerfectScrollbar,

    // SFC
    ChatContact,
  },
  props: {
    contacts: {
      type: Array,
      required: true,
    },
    profileUserMinimalData: {
      type: Object,
      required: true,
    },
    activeChatContactId: {
      type: String,
      default: null,
    },
    mqShallShowLeftSidebar: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    defaultImg: require('@/assets/images/avatars/avatar.png')
  }),
  setup(props) {
    const perfectScrollbarSettings = {
      maxScrollbarLength: 150,
    }

    // Search Query
    const searchQuery = ref('')

    const searchFilterFunction = contact => contact.sender.username.toLowerCase().includes(searchQuery.value.toLowerCase())
    const filteredContacts = computed(() => props.contacts.filter(searchFilterFunction))

    return {
      // Search Query
      searchQuery,
      filteredContacts,

      // UI
      perfectScrollbarSettings,
    }
  },
}
</script>
