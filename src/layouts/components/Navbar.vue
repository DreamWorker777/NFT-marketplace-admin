<template>
  <div class="navbar-container d-flex content align-items-center">

    <!-- Nav Menu Toggler -->
    <ul class="nav navbar-nav d-xl-none">
      <li class="nav-item">
        <b-link
          class="nav-link"
          @click="toggleVerticalMenuActive"
        >
          <feather-icon
            icon="MenuIcon"
            size="21"
          />
        </b-link>
      </li>
    </ul>

    <b-navbar-nav class="nav align-items-center ml-auto">
      <b-nav-item-dropdown
        right
        toggle-class="d-flex align-items-center dropdown-user-link"
        class="dropdown-user"
      >
        <template #button-content>
          <div class="d-sm-flex d-none user-nav">
            <p class="user-name font-weight-bolder mb-0">
              {{ userInfo.username }}
            </p>
            <span class="user-status">Admin</span>
          </div>
          <b-avatar
            size="40"
            variant="light-primary"
            badge
            :src="require('@/assets/images/avatars/avatar.png')"
            class="badge-minimal"
            badge-variant="success"
          />
        </template>

        <b-dropdown-item 
            link-class="d-flex align-items-center"
            @click.prevent="logOutAction"
            >
            <feather-icon
                size="16"
                icon="LogOutIcon"
                class="mr-50"
            />
            <span>Logout</span>
        </b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </div>
</template>

<script>
import {
  BLink, BNavbarNav, BNavItemDropdown, BDropdownItem, BDropdownDivider, BAvatar,
} from 'bootstrap-vue'
import DarkToggler from '@core/layouts/components/app-navbar/components/DarkToggler.vue'
import store from '@/store'
import { mapActions } from 'vuex'

export default {
    components: {
        BLink,
        BNavbarNav,
        BNavItemDropdown,
        BDropdownItem,
        BDropdownDivider,
        BAvatar,

        // Navbar Components
        DarkToggler,
    },
    data: () =>  ({
        userInfo: store.getters['auth/userInfo']
    }),
    props: {
        toggleVerticalMenuActive: {
            type: Function,
            default: () => {},
        },
    },
    methods: {
        ...mapActions('auth', [
            'logout',
        ]),
        logOutAction() {
            const self = this;
            this.logout().then(( res ) => {
                console.log( 'logout: ', res );
                self.$router.push({ name: 'login' })
            });
        }
    }
}
</script>
