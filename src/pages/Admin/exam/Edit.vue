<template>
  <div>
    <div class="q-mb-lg">
      <entity-edit :key="entityEdit"
                   v-model:value="inputs"
                   title="ویرایش اطلاعات آزمون"
                   :api="api"
                   :entity-id-key="entityIdKey"
                   :entity-param-key="entityParamKey"
                   :show-route-name="showRouteName"
                   :before-load-input-data="beforeLoadInputData"
      />
    </div>
    <q-card class="category-card">
      <q-card-section>
        <h6 class="category-header q-ma-md">لیست دفترچه ها</h6>
      </q-card-section>
      <q-separator />
      <q-card-section class="flex">
        <div class="row bg-grey-3 add-category-box">
          <q-select
            v-model="category.title"
            class="q-pa-md col-md-4"
            :value="category"
            label="دفترچه"
            :options="categoryOptions"
            option-value="categoryOptions"
            option-label="title"
            emit-value
            map-options
            :disable="totalCategory"
          />
          <q-input
            v-model="category.order"
            class="q-pa-md col-md-3"
            label="ترتیب"
            :disable="totalCategory"
          />
          <q-input
            v-model="category.time"
            class="q-pa-md col-md-3"
            label="زمان"
            :disable="totalCategory"
          />
          <div class="q-pa-md col-md-2 flex">
            <q-btn class="q-ma-md"
                   icon="add"
                   color="green"
                   flat
                   dense
                   fab-mini
                   :disable="totalCategory"
                   @click="addCategory"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div v-if="inputs[examCategoriesIndex] && inputs[examCategoriesIndex].value.length === 0"
             class="category-list">
          <p class="bg-red-2 alert">در حال حاضر دفترچه ای به آزمون اضافه نشده است !</p>
        </div>
        <div v-if="inputs[examCategoriesIndex] && inputs[examCategoriesIndex].value.length > 0"
             class="row"
        >
          <div v-for="(category , index) in inputs[examCategoriesIndex].value"
               :key="index"
               class="row col-md-12 category-list-row"
          >
            <q-select v-model="category.title"
                      class="q-pa-md col-md-4"
                      :value="category.id"
                      label="دفترچه"
                      :options="categoryOptions"
                      option-value="id"
                      option-label="title"
                      emit-value
                      map-options
            />
            <q-input v-model="category.order"
                     class="q-pa-md col-md-3"
                     label="ترتیب"
            />
            <q-input v-model="category.time"
                     class="q-pa-md col-md-3"
                     label="زمان"
            />
            <div class="q-pa-md col-md-2 flex">
              <q-btn class="q-ma-md"
                     icon="close"
                     color="red"
                     flat
                     dense
                     fab-mini
                     @click="deleteCategory(category.id)"
              />
            </div>
          </div>
        </div>
      </q-card-section>
      <q-inner-loading :showing="detachCategoryLoading">
        <q-spinner-gears size="50px"
                         color="primary" />
      </q-inner-loading>
    </q-card>
  </div>
</template>

<script>
import { EntityEdit } from 'quasar-crud'
import API_ADDRESS from 'src/api/Addresses'

export default {
  name: 'Edit',
  components: { EntityEdit },
  computed: {
    examCategoriesIndex () {
      return this.inputs.findIndex(item => item.name === 'categories')
    },
    totalCategory () {
      return false
      // return this.inputs[this.examCategoriesIndex].value && this.inputs[this.examCategoriesIndex].value.length >= 3
    }
  },
  data () {
    return {
      entityEdit: Date.now(),
      detachCategoryLoading: false,
      api: API_ADDRESS.exam.base(),
      entityIdKey: 'data.id',
      entityParamKey: 'data.id',
      showRouteName: 'Admin.Exam.Show',
      options: null,
      inputs: [
        {
          type: 'formBuilder',
          col: 'col-md-4',
          value: [
            {
              type: 'file',
              name: 'photo',
              responseKey: 'data.photo',
              label: 'پیش نمایش تصویر',
              col: 'col-md-6',
              placeholder: ' ',
              filled: true
            }
          ]
        },
        {
          type: 'formBuilder',
          col: 'col-md-8',
          value: [
            { type: 'input', name: 'title', responseKey: 'data.title', label: 'عنوان', col: 'col-md-12', placeholder: ' ', filled: true },
            { type: 'dateTime', name: 'start_at', responseKey: 'data.start_at', label: 'زمان شروع', calendarIcon: ' ', col: 'col-md-6', placeholder: 'زمان شروع', filled: true }
          ]
        },
        {
          type: 'Select',
          name: 'type_id',
          responseKey: 'data.type.id',
          label: ' انتخاب نوع آزمون',
          col: 'col-md-3',
          options: [],
          optionValue: 'id',
          optionLabel: 'value',
          placeholder: ' ',
          filled: true
        },
        { type: 'input', name: 'delay_time', responseKey: 'data.delay_time', label: 'زمان تاخیر(دقیقه)', col: 'col-md-3', placeholder: ' ', filled: true },
        { type: 'Checkbox', name: 'enable', responseKey: 'data.enable', label: 'فعال', col: 'col-md-3' },
        { type: 'Checkbox', name: 'is_free', responseKey: 'data.is_free', label: 'رایگان', col: 'col-md-3' },
        { type: 'Checkbox', name: 'is_register_open', responseKey: 'data.is_register_open', label: 'ثبت نام باز است.', col: 'col-md-3' },
        { type: 'Checkbox', name: 'is_open', responseKey: 'data.is_open', label: 'شرکت در آزمون باز است.', col: 'col-md-3' },
        { type: 'Checkbox', name: 'confirm', responseKey: 'data.confirm', label: 'تولید خودکار کارنامه', col: 'col-md-3' },
        { type: 'Checkbox', name: 'generate_questions_automatically', responseKey: 'data.generate_questions_automatically', label: 'تولید خودکار سوال', col: 'col-md-3' },
        { type: 'hidden', name: 'categories', responseKey: 'data.categories', value: [] }
      ],
      category: { title: '', id: '', order: 0, time: 0 },
      categoryOptions: []
    }
  },
  created () {
    this.$store.commit('AppLayout/updateLastBreadcrumb', {
      loading: true
    })
    this.api += '/' + this.$route.params.id
    this.getOptions()
    this.getCategoryList()
  },
  methods: {
    beforeLoadInputData (response) {
      if (!response) {
        return
      }
      this.getCategories(response)
    },
    getCategories (response) {
      const responseCategories = response.data.categories
      const categoriesIndex = this.inputs.findIndex(item => item.name === 'categories')
      this.inputs[categoriesIndex].value = responseCategories
    },
    getCategoryList() {
      this.detachCategoryLoading = true
      this.$axios.get(API_ADDRESS.questionCategory.base)
        .then((response) => {
          this.detachCategoryLoading = false
          this.categoryOptions = response.data.data
        })
        .catch(() => {
          this.detachCategoryLoading = false
        })
    },
    setExamTypeOptions (options) {
      const examTypeInputIndex = this.inputs.findIndex(item => item.name === 'type_id')
      if (examTypeInputIndex === -1) {
        return
      }
      this.inputs[examTypeInputIndex].options = options
    },
    getOptions () {
      this.detachCategoryLoading = true
      this.$axios.get(API_ADDRESS.option.base)
        .then((response) => {
          const options = response.data.data.filter(data => data.type === 'exam_type')
          this.setExamTypeOptions(options)
          this.addBreadcrumb()
          this.detachCategoryLoading = false
        })
        .catch(() => {
          this.detachCategoryLoading = false
        })
    },
    deleteCategory (id) {
      this.detachCategoryLoading = true
      this.$axios.delete(API_ADDRESS.exam.detachCategory(this.$route.params.id, id))
        .then(() => {
          this.entityEdit = Date.now()
          this.getCategoryList()
        })
        .catch(() => {
          this.entityEdit = Date.now()
          this.getCategoryList()
        })
    },
    addCategory () {
      if (this.totalCategory) {
        return
      }

      if (this.category.title.id) {
        this.category.id = this.category.title.id
        this.category.title = this.category.title.title
      }

      this.detachCategoryLoading = true
      this.$axios.post(API_ADDRESS.exam.attachCategories(this.$route.params.id), { categories: [this.category] })
        .then(() => {
          this.inputs[this.examCategoriesIndex].value = this.inputs[this.examCategoriesIndex].value.concat(this.category)
          this.category = { title: '', id: '', order: 0, time: 0 }
          this.entityEdit = Date.now()
          this.getCategoryList()
        })
        .catch(() => {
          this.entityEdit = Date.now()
          this.getCategoryList()
        })
    },
    addBreadcrumb () {
      const inputsIndex = this.inputs.findIndex(item => item.name === 'title')
      this.$store.commit('AppLayout/updateLastBreadcrumb', {
        loading: false,
        title: 'ویرایش ' + this.inputs[inputsIndex].value
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.category-card{
  display: flex;
  flex-direction: column;
  .category-header{
    margin: auto;
  }
  .add-btn {
    float: right;
  }
  .category-list{
    display: flex;
    padding: 20px;
    margin: auto;
    .alert{
      height: 40px;
      margin: auto;
      text-align: center;
      padding: 10px;
    }
  }
  .add-category-box{
    width: 70%;
    margin: auto;
  }
}
</style>
