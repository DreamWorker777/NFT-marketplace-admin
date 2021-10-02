<template>
  <div class="auth-wrapper auth-v2">
    <b-row class="auth-inner m-0">

      <!-- Brand logo-->
      <b-link class="brand-logo">
        <vuexy-logo />
        <h2 class="brand-text text-primary ml-1">
          Truhelix Admin
        </h2>
      </b-link>
      <!-- /Brand logo-->

      <!-- Left Text-->
      <b-col
        lg="8"
        class="d-none d-lg-flex align-items-center p-5"
      >
        <div class="w-100 d-lg-flex align-items-center justify-content-center px-5">
          <b-img
            fluid
            :src="imgUrl"
            alt="Login V2"
          />
        </div>
      </b-col>
      <!-- /Left Text-->

      <!-- Login-->
      <b-col
        lg="4"
        class="d-flex align-items-center auth-bg px-2 p-lg-5"
      >
        <b-col
          sm="8"
          md="6"
          lg="12"
          class="px-xl-2 mx-auto"
          v-show="!optPage"
        >
          <b-card-title
            title-tag="h2"
            class="font-weight-bold mb-1"
          >
            Welcome to Marketplace Admin Panel! 👋
          </b-card-title>
          <b-card-text class="mb-2">
            Please sign-in to your account and start the adventure
          </b-card-text>

        <!-- login form -->
          <validation-observer ref="loginValidation" >
            <b-form
              class="auth-login-form mt-2"
              @submit.prevent
            >
              <!-- username -->
              <b-form-group
                label="Username"
                label-for="login-username"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Username"
                  rules="required"
                >
                  <b-form-input
                    id="login-username"
                    v-model="userName"
                    :state="errors.length > 0 ? false:null"
                    name="login-username"
                    placeholder="happyCreator"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- password -->
              <b-form-group>
                <validation-provider
                  #default="{ errors }"
                  name="Password"
                  rules="required"
                >
                  <b-input-group
                    class="input-group-merge"
                    :class="errors.length > 0 ? 'is-invalid':null"
                  >
                    <b-form-input
                      id="login-password"
                      v-model="password"
                      :state="errors.length > 0 ? false:null"
                      class="form-control-merge"
                      :type="passwordFieldType"
                      name="login-password"
                      placeholder="············"
                    />
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- submit buttons -->
              <b-button
                type="submit"
                variant="primary"
                block
                @click="validationForm"
              >
                Sign in
              </b-button>
            </b-form>
          </validation-observer>

        </b-col>

        <b-col
          sm="8"
          md="6"
          lg="12"
          class="px-xl-2 mx-auto centerAlign"
          v-show="optPage"
        >
            <b-card-title
                title-tag="h2"
                class="font-weight-bold mb-1"
            >
                Two-Factor Authentication
            </b-card-title>
            <b-card-text class="mb-2">
                Scan the QR code or enter the secret in Google Authenticator
            </b-card-text>

            <!-- opt form -->
            <validation-observer ref="optValidation">
                <img :src="twofactor.dataURL" alt="..." class="img-thumbnail" style="width: 70%">
                <p>Secret - {{twofactor.tempSecret}}</p>
                <p>Type - TOTP</p>

                <b-form
                    class="auth-login-form mt-2"
                    @submit.prevent
                    >
                    <!-- username -->
                    <b-form-group
                        label="Enter OTP:"
                        label-for="opt-token"
                    >
                        <validation-provider
                        #default="{ errors }"
                        name="OTP"
                        rules="required"
                        >
                        <b-form-input
                            id="opt-token"
                            v-model="optToken"
                            type="password"
                            :state="errors.length > 0 ? false : null"
                            name="opt-token"
                            placeholder="Please enter OTP here."
                        />
                        <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                    </b-form-group>
                    
                    <!-- submit buttons -->
                    <b-button
                        type="submit"
                        variant="primary"
                        block
                        @click="optVerify"
                    >
                        Submit OTP
                    </b-button>
                </b-form>
            </validation-observer>
        </b-col>
      </b-col>
    <!-- /Login-->
    </b-row>
  </div>
</template>

<script>
/* eslint-disable global-require */
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import VuexyLogo from '@core/layouts/components/Logo.vue'
import {
  BRow, BCol, BLink, BFormGroup, BFormInput, BInputGroupAppend, BInputGroup, BFormCheckbox, BCardText, BCardTitle, BImg, BForm, BButton,
} from 'bootstrap-vue'
import { required } from '@validations'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import store from '@/store/index'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { mapActions } from 'vuex'

export default {
  components: {
    BRow,
    BCol,
    BLink,
    BFormGroup,
    BFormInput,
    BInputGroupAppend,
    BInputGroup,
    BFormCheckbox,
    BCardText,
    BCardTitle,
    BImg,
    BForm,
    BButton,
    VuexyLogo,
    ValidationProvider,
    ValidationObserver,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      password: '',
      userName: '',
      sideImg: require('@/assets/images/pages/login-v2.svg'),

      // validation rulesimport store from '@/store/index'
      required,

      optPage: false,
      optToken: '',
      twofactor: {},
      userId: ''
    }
  },
  computed: {
    passwordToggleIcon() {
        return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sideImg = require('@/assets/images/pages/login-v2-dark.svg')
        return this.sideImg
      }
      return this.sideImg
    },
  },
  methods: {
    ...mapActions('auth', [
        'login',
        'twofactorVerify'
    ]),
    validationForm() {

        this.$refs.loginValidation.validate().then(success => {
            if (success) {
                const formData = {
                    username: this.userName,
                    password: this.password
                }
                this.login( formData ).then(res => {
                    const userData = res.data;

                    if( userData.success ) {

                        this.optPage = true;
                        this.twofactor = userData.twofactor;
                        this.userId = userData.id;

                        
                    } else {
                        this.$toast({
                            component: ToastificationContent,
                            position: 'top-right',
                            props: {
                                icon: 'HomeIcon',
                                variant: 'danger',
                                title: userData.message,
                            },
                        })
                    }
                }).catch(err => {
                    console.warn('login Error: ', err);
                    this.$toast({
                        component: ToastificationContent,
                        position: 'top-right',
                        props: {
                            icon: 'HomeIcon',
                            variant: 'danger',
                            title: `Something went wrong.`,
                        },
                    })
                });
            }
        })
    },
    optVerify() {
        
        this.$refs.optValidation.validate().then(success => {
            const self = this;
            
            if( success ) {
                const formData = {
                    id: this.userId,
                    token: this.optToken,
                };

                this.twofactorVerify( formData ).then(res => {
                    const userData = res.data;

                    if( userData.success ) {
                        
                        self.$router.push({ name: 'home' })

                        this.$toast({
                            component: ToastificationContent,
                            position: 'top-right',
                            props: {
                                title: `Welcome ${userData.fullName || userData.username}`,
                                icon: 'CoffeeIcon',
                                variant: 'success',
                                text: `You have successfully logged in as Admin. Now you can start to explore!`,
                            },
                        })

                    } else {
                        this.$toast({
                            component: ToastificationContent,
                            position: 'top-right',
                            props: {
                                icon: 'HomeIcon',
                                variant: 'danger',
                                title: userData.message,
                            },
                        })
                    }
                }).catch(err => {
                    console.warn('otp verify Error: ', err);
                    this.$toast({
                        component: ToastificationContent,
                        position: 'top-right',
                        props: {
                            icon: 'HomeIcon',
                            variant: 'danger',
                            title: `Something went wrong.`,
                        },
                    })
                })
            }
        })
    }
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';

.centerAlign {
    text-align: center;
}
</style>
