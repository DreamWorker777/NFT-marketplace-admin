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

    <div class="feePercent">
        <h4>Current Transaction Fee Percent: <span class="feePercent__num">{{ feePercent }}</span> %</h4>

        <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            v-b-modal.SetFee
        >
            Set Fee
        </b-button>
    </div>

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

    <b-modal
        id="SetFee"
        ok-variant="danger"
        ok-title="Set"
        modal-class="modal-danger"
        centered
        title="Set Transaction Fee"
        @ok="setTransFeePercent"
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
                    name="FeePercent"
                >
                    <b-form-group
                        label="Fee Percent"
                        label-for="FeePercent"
                    >
                        <b-form-input
                            id="FeePercent"
                            autofocus
                            :state="getValidationState(validationContext)"
                            type="range"
                            min="1"
                            max="99"
                            default="10"
                            trim
                            placeholder="Please type the transaction percent."
                            v-model="feePercent_range"
                            />
                    </b-form-group>
                    <div class="mt-2">Value: {{ feePercent_range }} %</div>
                </validation-provider>
            </b-form>
        </validation-observer>
    </b-modal>
  </div>
</template>

<script>
import {
  BLink, BNavbarNav, BNavItemDropdown, BDropdownItem, BDropdownDivider, BAvatar, BButton,
  VBModal, BForm, BFormGroup, BFormInvalidFeedback, BFormInput
} from 'bootstrap-vue'
import DarkToggler from '@core/layouts/components/app-navbar/components/DarkToggler.vue'
import store from '@/store'
import Ripple from 'vue-ripple-directive'
import { mapActions } from 'vuex'

import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { required, alphaNum, email } from '@validations'
import formValidation from '@core/comp-functions/forms/form-validation'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
    components: {
        BLink,
        BNavbarNav,
        BNavItemDropdown,
        BDropdownItem,
        BDropdownDivider,
        BAvatar,
        BButton,
        VBModal,
        BForm, 
        BFormGroup, 
        BFormInvalidFeedback,
        BFormInput,

        // Navbar Components
        DarkToggler,

        // Form Validation
        ValidationProvider,
        ValidationObserver,
    },
    directives: {
        Ripple,
    },
    data: () =>  ({
        userInfo: store.getters['auth/userInfo'],
        feePercent: 0,
        feePercent_range: 0,
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
        ...mapActions('app', [
            'setFeePercent',
            'getFeePercent'
        ]),
        logOutAction() {
            const self = this;
            this.logout().then(( res ) => {
                console.log( 'logout: ', res );
                self.$router.push({ name: 'login' })
            });
        },
        async setTransFeePercent(event) {
            event.preventDefault();

            await this.setFeePercent({ feePercent: this.feePercent_range }).then(res => {
                if( res.data.success ) {
                    this.feePercent = this.feePercent_range;

                    this.$toast({
                        component: ToastificationContent,
                        props: {
                            title: 'Successfully set the marketplace fee percent.',
                            icon: 'CheckIcon',
                            variant: 'success',
                        },
                    })
                }
            }).catch(() => {
                this.$toast({
                    component: ToastificationContent,
                    props: {
                        title: 'Something went wrong!',
                        icon: 'AlertTriangleIcon',
                        variant: 'danger',
                    },
                })  
            })
            this.$bvModal.hide('SetFee')
        },
    },
    async mounted() {
        await this.getFeePercent().then(response => {
            this.feePercent = response.data.percent;
            this.feePercent_range = response.data.percent;
        });
    },
    setup() {
        const {
            refFormObserver,
            getValidationState,
            resetForm
        } = formValidation()

        return {
            refFormObserver,
            getValidationState,
            resetForm
        }
    }
}
</script>

<style lang="scss" scoped>
    .feePercent {
        display: flex;
        align-items: center;

        &__num {
            color: #ff6f6f;
        }

        h4 {
            margin-bottom: 0px !important;
            margin-right: 15px;
        }
    }
</style>