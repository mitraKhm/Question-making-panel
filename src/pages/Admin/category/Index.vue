<template>
  <div>
    <entity-index
      v-model:value="inputs"
      title="لیست دفترچه ها"
      :api="api"
      :table="table"
      :table-keys="tableKeys"
      :create-route-name="'Admin.Category.Create'"
    >
      <template #entity-index-table-cell="{inputData, showConfirmRemoveDialog}">
        <template v-if="inputData.col.name === 'thumbnail'">
          <q-avatar
            round
            font-size="30px"
            text-color="white"
            icon="mdi-card-text"
            color="grey"
          />
        </template>
        <template v-else-if="inputData.col.name === 'actions'">
          <q-btn round
                 flat
                 dense
                 size="md"
                 color="info"
                 icon="info"
                 :to="{name:'Admin.Category.Show', params: {id: inputData.props.row.id}}">
            <q-tooltip>
              مشاهده
            </q-tooltip>
          </q-btn>
          <q-btn v-if="false"
                 round
                 flat
                 dense
                 size="md"
                 color="negative"
                 icon="delete"
                 class="q-ml-md"
                 @click="showConfirmRemoveDialog(inputData.props.row, 'id', getRemoveMessage(inputData.props.row))">
            <q-tooltip>
              حذف
            </q-tooltip>
          </q-btn>
        </template>
        <template v-else>
          {{ inputData.col.value }}
        </template>
      </template>
    </entity-index>
  </div>
</template>

<script>
import { EntityIndex } from 'quasar-crud'
import API_ADDRESS from 'src/api/Addresses'

export default {
  name: 'Index',
  components: { EntityIndex },
  data () {
    return {
      expanded: true,
      api: API_ADDRESS.questionCategory.base,
      tableKeys: {
        data: 'data',
        total: 'count',
        currentPage: 'current',
        perPage: 'per_page',
        pageKey: 'page'
      },
      table: {
        columns: [
          {
            name: 'thumbnail',
            required: true,
            label: '',
            align: 'left',
            field: row => row.id
          },
          {
            name: 'title',
            required: true,
            label: 'عنوان',
            align: 'left',
            field: row => row.title
          },
          {
            name: 'actions',
            required: true,
            label: '',
            align: 'left',
            field: ''
          }
        ],
        data: []
      },
      inputs: []
    }
  },
  methods: {
    getRemoveMessage (row) {
      const title = row.title
      const categoryTitle = row.category_info.title
      return 'آیا از حذف ' + title + ' در درسته ' + categoryTitle + ' اطمینان دارید؟'
    }
  }
}
</script>

<style scoped>

</style>
