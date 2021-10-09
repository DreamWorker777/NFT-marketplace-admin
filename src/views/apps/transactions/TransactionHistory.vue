<template>
  <div>
    <div class="custom-search">

      <!-- advance search input -->
      <b-row>
        <b-col md="4">
          <b-form-group>
            <label>Search:</label>
            <b-form-input
              placeholder="Search here..."
              type="text"
              class="d-inline-block"
              @input="advanceSearch"
            />
          </b-form-group>
        </b-col>
      </b-row>
    </div>

    <!-- table -->
    <vue-good-table
      :columns="columns"
      :rows="rows"
      :rtl="direction"
      :search-options="{
        enabled: true,
        externalQuery: searchTerm }"
      :select-options="{
        enabled: true,
        selectOnCheckboxOnly: true, // only select when checkbox is clicked instead of the row
        selectionInfoClass: 'custom-class',
        selectionText: 'rows selected',
        clearSelectionText: 'clear',
        disableSelectInfo: true, // disable the select info panel on top
        selectAllByGroup: true, // when used in combination with a grouped table, add a checkbox in the header row to check/uncheck the entire group
      }"
      :pagination-options="{
        enabled: true,
        perPage:pageLength
      }"
      theme="my-theme"
      @on-row-click="onRowClick"
    >
		<!-- <template
			slot="table-row"
			slot-scope="props"
		>
			<span
				v-if="props.column.field === 'transactionHash'"
				class="text-nowrap"
			>
				<span>{{ shortenString(props.row.transactionHash, 30) }}</span>
			</span>
		</template> -->
	

      <!-- pagination -->
      <template
        slot="pagination-bottom"
        slot-scope="props"
      >
        <div class="d-flex justify-content-between flex-wrap">
          <div class="d-flex align-items-center mb-0 mt-1">
            <span class="text-nowrap">
              Showing 1 to
            </span>
            <b-form-select
              v-model="pageLength"
              :options="['10','15','20']"
              class="mx-1"
              @input="(value)=>props.perPageChanged({currentPerPage:value})"
            />
            <span class="text-nowrap"> of {{ props.total }} entries </span>
          </div>
          <div>
            <b-pagination
              :value="1"
              :total-rows="props.total"
              :per-page="pageLength"
              first-number
              last-number
              align="right"
              prev-class="prev-item"
              next-class="next-item"
              class="mt-1 mb-0"
              @input="(value)=>props.pageChanged({currentPage:value})"
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
          </div>
        </div>
      </template>
    </vue-good-table>
  </div>
</template>

<script>
import {
  BAvatar, BPagination, BFormGroup, BFormInput, BFormSelect, BRow, BCol,
} from 'bootstrap-vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { VueGoodTable } from 'vue-good-table'
import store from '@/store/index'
import { mapActions } from 'vuex'

export default {
  components: {
    VueGoodTable,
    BAvatar,
    BPagination,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BRow,
    BCol,
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
  },
  data() {
    return {
      pageLength: 10,
      dir: false,
      columns: [
        {
          label: 'TransactionHash',
          field: 'transactionHash',
        },
        {
          label: 'Date',
          field: 'date',
        },
        {
          label: 'From',
          field: 'from',
        },
        {
          label: 'To',
          field: 'to',
        },
        {
          label: 'Amount(BNB)',
          field: 'amount',
        },
        {
          label: 'Type',
          field: 'type',
        },
		{
          label: 'IPFS_Hash',
          field: 'IPFS',
        },
      ],
      rows: [],
      searchTerm: '',
    }
  },
  computed: {
    direction() {
      if (store.state.appConfig.isRTL) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.dir = true
        return this.dir
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.dir = false
      return this.dir
    },
  },
  created() {
	this.getTransactions().then(res => {
		this.rows = res.data.transactions;
		console.log(this.rows);
	});
  },
  methods: {
    ...mapActions('app', [
        'getTransactions',
    ]),
    advanceSearch(val) {
      this.searchTerm = val
    },
    onRowClick(params) {
      this.$toast({
        component: ToastificationContent,
        props: {
          title: `Hello user! You have clicked on row ${params.row._id}`,
          icon: 'UserIcon',
          variant: 'success',
        },
      })
    },
	shortenString(str, len) {
		if( str.length < len ) {
			return str;
		} else {
			return str.slice(0, len) + '..';
		}
	}
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-good-table.scss';

::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}
/* Track */
::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
    -webkit-border-radius: 6px;
    border-radius: 6px;
}
/* Handle */
::-webkit-scrollbar-thumb {
    -webkit-border-radius: 6px;
    border-radius: 6px;
    background: rgba(92, 55, 97, 0.8); 
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); 
}
::-webkit-scrollbar-thumb:window-inactive {
    background: rgba(130, 72, 138, 0.8); 
}
</style>