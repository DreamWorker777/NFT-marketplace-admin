<template>

  <div>

    <user-list-add-new
      :is-add-new-user-sidebar-active.sync="isAddNewUserSidebarActive"
      :role-options="roleOptions"
      :plan-options="planOptions"
      @refetch-data="refetchData"
    />

    <!-- Table Container Card -->
    <b-card
      no-body
      class="mb-0"
    >

      <div class="m-2">

        <!-- Table Top -->
        <b-row>

          <!-- Per Page -->
          <b-col
            cols="12"
            md="6"
            class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
          >
            <label>Show</label>
            <v-select
              v-model="perPage"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="perPageOptions"
              :clearable="false"
              class="per-page-selector d-inline-block mx-50"
            />
            <label>entries</label>
          </b-col>

          <!-- Search -->
          <b-col
            cols="12"
            md="6"
          >
            <div class="d-flex align-items-center justify-content-end">
              <b-form-input
                v-model="searchQuery"
                class="d-inline-block mr-1"
                placeholder="Search..."
              />
            </div>
          </b-col>
        </b-row>

      </div>

      <b-table
        ref="refUserListTable"
        class="position-relative"
        :items="fetchUsers"
        responsive
        :fields="tableColumns"
        primary-key="id"
        :sort-by.sync="sortBy"
        show-empty
        empty-text="No matching records found"
        :sort-desc.sync="isSortDirDesc"
      >

        <!-- Column: User -->
        <template #cell(user)="data">
          <b-media vertical-align="center">
            <template #aside>
              <b-avatar
                size="32"
                :src="data.item.avatar"
                :text="avatarText(data.item.fullName)"
                :variant="`light-${resolveUserRoleVariant(data.item.role)}`"
              />
            </template>
            <b-link
              class="font-weight-bold d-block text-nowrap"
            >
              {{ data.item.first }}
            </b-link>
            <small class="text-muted">@{{ data.item.username }}</small>
          </b-media>
        </template>

        <!-- Column: Role -->
        <template #cell(role)="data">
          <div 
            class="text-nowrap" 
            v-for="(item, idx) in data.item.roles" 
            :key="idx"
            >
            <feather-icon
              :icon="resolveUserRoleIcon(item)"
              size="18"
              class="mr-50"
              :class="`text-${resolveUserRoleVariant(item)}`"
            />
            <span class="align-text-top text-capitalize">{{ item }}</span>
          </div>
        </template>

        <!-- Column: Status -->
        <template #cell(status)="data">
          <b-badge
            pill
            :variant="`light-${resolveUserStatusVariant(data.item.status ? data.item.status : 'active')}`"
            class="text-capitalize"
          >
            {{ data.item.status ? data.item.status : 'active' }}
          </b-badge>
        </template>

        <!-- Column: Actions -->
        <template #cell(actions)="data">
          <b-dropdown
            variant="link"
            no-caret
            :right="$store.state.appConfig.isRTL"
          >

            <template #button-content>
              <feather-icon
                icon="MoreVerticalIcon"
                size="16"
                class="align-middle text-body"
              />
            </template>

            <b-dropdown-item
                v-ripple.400="'rgba(234, 84, 85, 0.15)'"
                v-b-modal.reset-password
                variant="outline-danger"
                @click="() => setResetPasswordUserId( data.item._id )"
                >
                <feather-icon icon="EditIcon" />
                <span class="align-middle ml-50">
                    Reset Password
                </span>
            </b-dropdown-item>
          </b-dropdown>
        </template>

      </b-table>
      <div class="mx-2 mb-2">
        <b-row>

          <b-col
            cols="12"
            sm="6"
            class="d-flex align-items-center justify-content-center justify-content-sm-start"
          >
            <span class="text-muted">Showing {{ dataMeta.from }} to {{ dataMeta.to }} of {{ dataMeta.of }} entries</span>
          </b-col>
          <!-- Pagination -->
          <b-col
            cols="12"
            sm="6"
            class="d-flex align-items-center justify-content-center justify-content-sm-end"
          >

            <b-pagination
              v-model="currentPage"
              :total-rows="totalUsers"
              :per-page="perPage"
              first-number
              last-number
              class="mb-0 mt-1 mt-sm-0"
              prev-class="prev-item"
              next-class="next-item"
            >
              <template #prev-text>
                <feather-icon
                  icon="ChevronLeftIcon"
                  size="18"
                />
              </template>
              <template #next-text>
                <feather-icon
                  icon="ChevronRightIcon"
                  size="18"
                />
              </template>
            </b-pagination>

          </b-col>

        </b-row>
      </div>
    </b-card>

    <b-modal
        id="reset-password"
        ok-variant="danger"
        ok-title="Reset"
        modal-class="modal-danger"
        centered
        title="Reset Password"
        @ok="resetPassword"
        >
        <!-- BODY -->
        <validation-observer
            ref="refFormObserver"
        >
            <!-- Form -->
            <b-form
                class="p-2"
                @submit.prevent
            >
                <validation-provider
                    #default="validationContext"
                    rules="required"
                    name="Password"
                >
                    <b-form-group
                        label="Password"
                        label-for="Password"
                    >
                        <b-form-input
                            id="Password"
                            v-model="userData.password"
                            autofocus
                            :state="getValidationState(validationContext)"
                            type="password"
                            trim
                            placeholder="············"
                            @keyup.enter="resetPassword"
                            />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>
            </b-form>
        </validation-observer>
    </b-modal>
  </div>
</template>

<script>
import {
  BCard, BRow, BCol, BFormInput, BButton, BTable, BMedia, BAvatar, BLink,
  BBadge, BDropdown, BDropdownItem, BPagination, BModal, VBModal, BCardText,
  BForm, BFormGroup, BFormInvalidFeedback
} from 'bootstrap-vue'
import BCardCode from '@core/components/b-card-code'
import Ripple from 'vue-ripple-directive'

import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { required, alphaNum, email } from '@validations'
import formValidation from '@core/comp-functions/forms/form-validation'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'


import vSelect from 'vue-select'
import store from '@/store'
import { ref, onUnmounted } from '@vue/composition-api'
import { avatarText } from '@core/utils/filter'
import UsersListFilters from './UsersListFilters.vue'
import useUsersList from './useUsersList'
import userStoreModule from '../userStoreModule'
import UserListAddNew from './UserListAddNew.vue'

// set ripple zIndex to 1 so it doesn't overlap on modal
Ripple.zIndex = 1

export default {
  components: {
    UsersListFilters,
    UserListAddNew,

    BCard,
    BRow,
    BCol,
    BFormInput,
    BButton,
    BTable,
    BMedia,
    BAvatar,
    BLink,
    BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,

    BCardCode,
    BButton,
    BCardText,
    BModal,

    BForm, 
    BFormGroup,
    BFormInvalidFeedback,

    vSelect,

    // Form Validation
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },
  data: () => ({
        userData: {
            id: '',
            password: ''
        }
  }),
  setup() {
    const USER_APP_STORE_MODULE_NAME = 'app-user'

    // Register module
    if (!store.hasModule(USER_APP_STORE_MODULE_NAME)) store.registerModule(USER_APP_STORE_MODULE_NAME, userStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(USER_APP_STORE_MODULE_NAME)) store.unregisterModule(USER_APP_STORE_MODULE_NAME)
    })

    const isAddNewUserSidebarActive = ref(false)

    const roleOptions = [
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' },
    ]

    const planOptions = [
      { label: 'Basic', value: 'basic' },
      { label: 'Company', value: 'company' },
      { label: 'Enterprise', value: 'enterprise' },
      { label: 'Team', value: 'team' },
    ]

    const statusOptions = [
      { label: 'Pending', value: 'pending' },
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ]

    const {
      fetchUsers,
      tableColumns,
      perPage,
      currentPage,
      totalUsers,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refUserListTable,
      refetchData,

      // UI
      resolveUserRoleVariant,
      resolveUserRoleIcon,
      resolveUserStatusVariant,

      // Extra Filters
      roleFilter,
      planFilter,
      statusFilter,
    } = useUsersList()

    const blankUserData = {
        fullName: '',
        username: '',
        email: '',
        role: null,
        currentPlan: null,
        company: '',
        country: '',
        contact: '',
    }

    const userData = ref(JSON.parse(JSON.stringify(blankUserData)))
    const resetuserData = () => {
      userData.value = JSON.parse(JSON.stringify(blankUserData))
    }

    const {
        refFormObserver,
        getValidationState,
    } = formValidation()

    return {

        // Sidebar
        isAddNewUserSidebarActive,

        fetchUsers,
        tableColumns,
        perPage,
        currentPage,
        totalUsers,
        dataMeta,
        perPageOptions,
        searchQuery,
        sortBy,
        isSortDirDesc,
        refUserListTable,
        refetchData,

        // Filter
        avatarText,

        // UI
        resolveUserRoleVariant,
        resolveUserRoleIcon,
        resolveUserStatusVariant,

        roleOptions,
        planOptions,
        statusOptions,

        // Extra Filters
        roleFilter,
        planFilter,
        statusFilter,

        refFormObserver,
        getValidationState,
    }
  },
  methods: {
    setResetPasswordUserId(id) {
        this.userData.id = id;
    },
    resetPassword(event) {
        event.preventDefault()
        if( this.userData.password.length > 0 ) {

          store.dispatch('app-user/resetPassword', {
                id: this.userData.id,
                password: this.userData.password
            })
            .then(response => {
                if( response.data.success ) {
                    this.$toast({
                        component: ToastificationContent,
                        props: {
                            title: 'Successfully reset the user password.',
                            icon: 'CheckIcon',
                            variant: 'success',
                        },
                    })
                    this.$bvModal.hide('reset-password')
                }
            })
            .catch(() => {
                this.$toast({
                    component: ToastificationContent,
                    props: {
                        title: 'Error resetting user password',
                        icon: 'AlertTriangleIcon',
                        variant: 'danger',
                    },
                })
            })
            
            this.$bvModal.hide('reset-password')
        }
    }
  }
}
</script>

<style lang="scss" scoped>
.per-page-selector {
    width: 90px;
}
</style>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
