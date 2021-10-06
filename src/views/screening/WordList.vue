<template>
    <b-row>
        <b-col
            md="2"
            sm="4"
            class="my-1"
            >
            <b-form-group
                class="mb-0"
            >
                <label class="d-inline-block text-sm-left mr-50">Per page</label>
                <b-form-select
                    id="perPageSelect"
                    v-model="perPage"
                    size="sm"
                    :options="pageOptions"
                    class="w-50"
                    />
            </b-form-group>
        </b-col>
        <b-col
            md="4"
            sm="8"
            class="my-1"
            >
            <b-form-group
                label="Sort"
                label-cols-sm="3"
                label-align-sm="right"
                label-size="sm"
                label-for="sortBySelect"
                class="mb-0"
            >
                <b-input-group size="sm">
                    <b-form-select
                        id="sortBySelect"
                        v-model="sortBy"
                        :options="sortOptions"
                        class="w-75"
                    >
                        <template v-slot:first>
                        <option value="">
                            -- none --
                        </option>
                        </template>
                    </b-form-select>
                    <b-form-select
                        v-model="sortDesc"
                        size="sm"
                        :disabled="!sortBy"
                        class="w-25"
                    >
                        <option :value="false">
                        Asc
                        </option>
                        <option :value="true">
                        Desc
                        </option>
                    </b-form-select>
                </b-input-group>
            </b-form-group>
        </b-col>
        <b-col
            md="6"
            class="my-1"
            >
            <b-form-group
                label="Filter"
                label-cols-sm="3"
                label-align-sm="right"
                label-size="sm"
                label-for="filterInput"
                class="mb-0"
            >
                <b-input-group size="sm">
                <b-form-input
                    id="filterInput"
                    v-model="filter"
                    type="search"
                    placeholder="Type to Search"
                />
                <b-input-group-append>
                    <b-button
                    :disabled="!filter"
                    @click="filter = ''"
                    >
                    Clear
                    </b-button>
                </b-input-group-append>
                </b-input-group>
            </b-form-group>
        </b-col>

        <b-col md="12" sm="4" class="my-1">
            <b-button
                variant="primary"
                v-b-modal.addNewWord
                class="moveRight"
            >
                <feather-icon icon="PlusCircleIcon" />
                Add
            </b-button>
        </b-col>
        

        <b-col cols="12">
            <b-table
                striped
                hover
                responsive
                :per-page="perPage"
                :current-page="currentPage"
                :items="items"
                :fields="fields"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :sort-direction="sortDirection"
                :filter="filter"
                :filter-included-fields="filterOn"
                @filtered="onFiltered"
            >
                <template #cell(id)="data">
                    {{ data.index + 1 }}
                </template>

                <template #cell(user_id)="data">
                    {{ data.value.username }}
                </template>
            </b-table>
        </b-col>

        <b-col
            cols="12"
            >
            <b-pagination
                v-model="currentPage"
                :total-rows="totalRows"
                :per-page="perPage"
                align="center"
                size="sm"
                class="my-0"
            />
        </b-col>

        <b-modal
            id="addNewWord"
            ok-variant="danger"
            ok-title="Add"
            modal-class="modal-danger"
            centered
            title="Add Bad Word"
            @ok="addBadWord"
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
                        name="newWord"
                    >
                        <b-form-group
                            label="Word"
                            label-for="newWord"
                        >
                            <b-form-input
                                v-model="newWord"
                                autofocus
                                :state="getValidationState(validationContext)"
                                trim
                                placeholder="Please type here."
                                @keyup.enter="addBadWord"
                                />

                            <b-form-invalid-feedback>
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                        </b-form-group>
                    </validation-provider>
                </b-form>
            </validation-observer>
        </b-modal>
    </b-row>
</template>

<script>
import {
    BTable, BAvatar, BBadge, BRow, BCol, BForm, BFormGroup, BFormSelect, BPagination, BInputGroup, BFormInput, BInputGroupAppend, BButton, VBModal, BFormInvalidFeedback
} from 'bootstrap-vue'
import FeatherIcon from '@/@core/components/feather-icon/FeatherIcon.vue'
import { mapActions } from 'vuex'

import { ValidationProvider, ValidationObserver } from 'vee-validate'
import formValidation from '@core/comp-functions/forms/form-validation'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
    name: 'WordList',
    components: {
        BTable,
        BAvatar,
        BBadge,
        BRow,
        BCol,
        BFormGroup,
        BFormSelect,
        BPagination,
        BInputGroup,
        BForm,
        BFormInput,
        BInputGroupAppend,
        BButton,
        FeatherIcon,
        VBModal,

        // Form Validation
        BFormInvalidFeedback,
        ValidationProvider,
        ValidationObserver,
    },
    directives: {
        'b-modal': VBModal,
    },
    data() {
        return {
            perPage: 10,
            pageOptions: [10, 15, 20],
            totalRows: 1,
            currentPage: 1,
            sortBy: '',
            sortDesc: false,
            sortDirection: 'asc',
            filter: null,
            filterOn: [],
            fields: [
                {
                    key: 'id', label: 'Id',
                },
                { key: 'content', label: 'Content', sortable: true },
                { key: 'user_id', label: 'Poster', sortable: true },
            ],
            items: [],

            newWord: '',
        }
    },
    computed: {
        sortOptions() {
            // Create an options list from our fields
            return this.fields
                .filter(f => f.sortable)
                .map(f => ({ text: f.label, value: f.key }))
        },
    },
    setup() {
        const {
            refFormObserver,
            getValidationState,
        } = formValidation()

        return {
            refFormObserver,
            getValidationState,
        }
    },
    mounted() {
        // Set the initial number of items
        this.getBadWordList().then(res => {
            this.items = res.data.all;
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

        this.totalRows = this.items.length
    },
    methods: {
        ...mapActions('app', [
            'addNewBadWord',
            'getBadWordList'
        ]),
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length
            this.currentPage = 1
        },
        async addBadWord(event) {
            event.preventDefault();

            if( this.newWord.length > 0 ) {
                await this.addNewBadWord({ word: this.newWord }).then(res => {
                    if( res.data.success ) {
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: 'Successfully added the word.',
                                icon: 'CheckIcon',
                                variant: 'success',
                            },
                        })
                        
                        this.items = res.data.all;
                    } else {
                        this.$toast({
                            component: ToastificationContent,
                            props: {
                                title: res.data.message,
                                icon: 'AlertTriangleIcon',
                                variant: 'warning',
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

                this.$bvModal.hide('addNewWord');
            }
        }
    },
}
</script>

<style lang="scss" scoped>
    .moveRight {
        float: right;
    }
</style>