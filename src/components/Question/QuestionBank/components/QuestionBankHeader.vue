<template>
  <q-card class="filter-card custom-card"
          flat>
    <q-card-section class="search-section">
      <q-input
        v-model="searchInput"
        filled
        class="backGround-gray-input search-input"
        placeholder="جستجو در سوال ها..."
      >
        <template v-slot:append>
          <q-btn
            flat
            rounded
            icon="isax:search-normal"
          />
        </template>
      </q-input>
    </q-card-section>

    <q-card-section class="filter-section">
      <q-select
        v-model="searchInput"
        filled
        dropdown-icon="isax:arrow-down-1"
        label="جدیدترین"
        class="backGround-gray-input filter-input"
      >
      </q-select>
      <!--      <q-btn-->
      <!--        @click="this.FilterOptionDialog = !this.FilterOptionDialog"-->
      <!--        class="filter-btn"-->
      <!--        icon="isax:setting-4"-->
      <!--        flat-->
      <!--      />-->
    </q-card-section>
  </q-card>
  <q-dialog
    v-model="FilterOptionDialog"
    class="dialog-filter-card"
    persistent
    maximized
    transition-show="slide-right"
    transition-hide="slide-left"
  >
    <q-card class="dialog-filter-card-container">
      <div class="questions-filter">
        <div class="filter-headerOption-container">
          <div class="filter-header">
            <div class="filter-header-title"> فیلتر سوالات</div>
            <div class="close-filter-section">
              <q-btn
                flat
                label="بازگشت"
                icon-right="isax:arrow-left-2"
                @click="this.FilterOptionDialog = !this.FilterOptionDialog"
              />
            </div>
          </div>
          <div class="filter-options">
            <question-filter-expansion
              header-title="درس و مبحث"
            >
              salam
            </question-filter-expansion>
            <question-filter-expansion
              header-title="نوع سوال"
            >
              <!--              <tree-->
              <!--                ref="tree"-->
              <!--                tick-strategy="strict"-->
              <!--                :get-node-by-id="getNodeById"-->
              <!--              />-->
            </question-filter-expansion>
            <question-filter-expansion
              header-title="سختی سوال"
            >
              <!--              <tree-->
              <!--                ref="tree1"-->
              <!--                tick-strategy="strict"-->
              <!--                :get-node-by-id="getNodeById"-->
              <!--              />-->
            </question-filter-expansion>
            <question-filter-expansion
              header-title="تاریخ تالیف"
            >
              <div>
                salam
              </div>
            </question-filter-expansion>
          </div>
        </div>
        <div class="filter-actions">
          <div class="delete-all-filters-container">
            <q-btn
              class="delete-all-filters"
              label="حذف همه"
            />
          </div>
          <div class="set-filters-container">
            <q-btn
              label="اعمال فیلتر"
              class="set-filters"
            />
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import QuestionFilterExpansion from 'components/Question/QuestionBank/QuestionFilterExpansion'
export default {
  name: 'QuestionBankHeader',
  components: { QuestionFilterExpansion },
  data () {
    return {
      FilterOptionDialog: false,
      maximizedToggle: true,
      searchInput: null
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-card {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: #f4f6f9;

    @media only screen and (max-width: 600px) {
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
    }

    &:deep(.q-card__section) {
      padding: 0;

      .q-field--filled .q-field__inner .q-field__control {
        background: #FFFFFF;
      }

      .q-field--filled .q-field__inner .q-field__control .q-field__append, .q-field--filled .q-field__inner .q-field__control .q-field__prepend {
        padding-right: 16px;
        padding-left: 12px;
      }

      @media only screen and (max-width: 599px) {
        width: 100%;
      }
    }

    .search-section {
      .search-input {
        width: 300px;
        background-color: white;

        &:deep(.q-field__append) {
          padding-right: 8px !important;

          .q-icon {
            color: #6D708B;
            cursor: pointer;
          }
        }

        &:deep(.q-field__control) {
          background-color: white;
        }

        //&:deep(.q-field--filled .q-field__inner .q-field__control .q-field__append, .q-field--filled .q-field__inner .q-field__control .q-field__prepend ){
        //
        //}
        @media only screen and (max-width: 1023px) {
          width: 352px;
        }
        @media only screen and (max-width: 599px) {
          width: 100%;
        }

        .search {
          color: #6D708B;

          :deep(.q-field__inner .q-field__control .q-field__append .q-icon) {
            color: #6D708B;
          }
        }
      }
    }

    .filter-section {
      display: flex;
      flex-direction: row;

      :deep(.q-field--filled .q-field__inner .q-field__control .q-field__label) {
        margin-top: -10px;
      }

      :deep(.q-field--filled .q-field__inner .q-field__control .q-field__native, .q-field--filled .q-field__inner .q-field__control .q-field__prefix, .q-field--filled .q-field__inner .q-field__control .q-field__suffix, .q-field--filled .q-field__inner .q-field__control .q-field__input) {
        padding-left: 16px;
        padding-right: 0;
        min-height: 40px;
      }

      .filter-input {
        width: 160px;
        @media only screen and (max-width: 1023px) {
          width: 164px;
        }
        @media only screen and (max-width: 599px) {
          width: 100%;
          padding-top: 16px;
        }
      }

    }
  }
</style>
<!--<template>-->
<!--    <q-card class="headerBankCard custom-card">-->
<!--      <q-card-section>-->
<!--        <div class="row search-section">-->
<!--          <div class="search-box-container col-sm col-xs-12">-->
<!--            <q-card-actions>-->
<!--              <div class="search-box">-->
<!--                <q-input-->
<!--                  v-model="searchInput"-->
<!--                  filled-->
<!--                  class="backGround-gray-input"-->
<!--                  label="جستجو در سوال ها...">-->
<!--                  <template v-slot:append>-->
<!--                    <q-btn-->
<!--                      flat-->
<!--                      rounded-->
<!--                      icon="isax:search-normal" />-->
<!--                  </template>-->
<!--                </q-input>-->
<!--              </div>-->
<!--            </q-card-actions>-->
<!--          </div>-->
<!--          <div class="select-box col-sm  col-xs-6">-->
<!--            <q-select-->
<!--              filled-->
<!--              dropdown-icon="isax:arrow-down-1"-->
<!--              v-model="searchInput"-->
<!--              label="جدیدترین"-->
<!--              class="backGround-gray-input"-->
<!--            >-->
<!--            </q-select>-->
<!--          </div>-->
<!--          <div class="question-filter-btn col-sm col-xs-6 " >-->
<!--            <q-btn-->
<!--              @click="this.FilterOptionDialog = !this.FilterOptionDialog"-->
<!--              class="filter-btn"-->
<!--              icon="isax:setting-4"-->
<!--              flat-->
<!--            />-->
<!--          </div>-->
<!--        </div>-->
<!--      </q-card-section>-->
<!--    </q-card>-->
<!--</template>-->

<!--<style lang="scss" scoped>-->
<!--//.headerBankCard{-->
<!--//  &:deep(.q-card__section){-->
<!--//    padding: 0;-->
<!--//  }-->
<!--//  .search-section {-->
<!--//    padding: 12px 60px 12px 60px;-->
<!--//    .search-box-container{-->
<!--//      display: flex;-->
<!--//      &:deep(.q-card__actions){-->
<!--//        padding: 0;-->
<!--//      }-->
<!--//      .search-box {-->
<!--//        width: 300px;-->
<!--//        &:deep(.q-field__label){-->
<!--//          padding-left: 0!important;-->
<!--//          font-style: normal;-->
<!--//          font-weight: 400;-->
<!--//          font-size: 14px;-->
<!--//          line-height: 24px;-->
<!--//        }-->
<!--//        &:deep(.q-btn-item){-->
<!--//          height: 36px;-->
<!--//          width: 36px;-->
<!--//          justify-content: center;-->
<!--//        }-->
<!--//      //  &:deep(.q-field__control){-->
<!--//      //  height: 40px;-->
<!--//      //  align-items: center;-->
<!--//      //}-->
<!--//      }-->
<!--//    }-->
<!--//    .select-box{-->
<!--//      display: flex;-->
<!--//      justify-content: flex-end;-->
<!--//      align-items: center;-->
<!--//      //.q-select {-->
<!--//      //  width: 160px;-->
<!--//      //  &:deep(.q-field__control){-->
<!--//      //    align-items: center;-->
<!--//      //    min-height: 40px;-->
<!--//      //    max-height: 40px;-->
<!--//      //    padding-left: 20px;-->
<!--//      //  }-->
<!--//      //  &:deep(.q-field__control-container){-->
<!--//      //    padding-top: 0;-->
<!--//      //  }-->
<!--//      //  &:deep(.q-field__label){-->
<!--//      //    top: 0;-->
<!--//      //    font-style: normal;-->
<!--//      //    font-weight: 400;-->
<!--//      //    font-size: 14px;-->
<!--//      //    line-height: 24px-->
<!--//      //  }-->
<!--//      //}-->
<!--//    }-->
<!--//    .question-filter-btn{-->
<!--//      display: none;-->
<!--//    }-->
<!--//  }-->
<!--//}-->
<!--//@media only screen and (max-width: 1439px) {-->
<!--//  .headerBankCard{-->
<!--//    .search-section {-->
<!--//      padding: 12px 40px 12px 60px;-->
<!--//    }-->
<!--//  }-->
<!--//}-->
<!--//@media only screen and (max-width: 1023px) {-->
<!--//  .headerBankCard{-->
<!--//    .search-section {-->
<!--//      padding: 16px 16px 16px 18px;-->
<!--//      .search-box-container{-->
<!--//        justify-content: flex-start;-->
<!--//        padding-left: 18px;-->
<!--//        .search-box{-->
<!--//          width: 274px;-->
<!--//        }-->
<!--//      }-->
<!--//      .question-filter-btn{-->
<!--//        order: -1;-->
<!--//        display: flex;-->
<!--//        .filter-btn{-->
<!--//          width: 40px;-->
<!--//          height: 40px;-->
<!--//          background: #F4F5F6;-->
<!--//        }-->
<!--//        max-width: 40px;-->
<!--//      }-->
<!--//      .select-box{-->
<!--//        max-width: 160px;-->
<!--//      }-->
<!--//    }-->
<!--//  }-->
<!--//  .dialog-filter-card{-->
<!--//    .dialog-filter-card-container{-->
<!--//      background: #F4F5F6;-->
<!--//      .questions-filter{-->
<!--//        padding: 20px 30px 40px 30px;-->
<!--//        justify-content: space-between;-->
<!--//        display: flex;-->
<!--//        flex-direction: column;-->
<!--//        height: 100%;-->
<!--//        .filter-headerOption-container{-->
<!--//          .filter-header{-->
<!--//            display: flex;-->
<!--//            align-items: center;-->
<!--//            justify-content: space-between;-->
<!--//            margin-bottom: 28px;-->
<!--//            .filter-header-title{-->
<!--//              font-weight: 500;-->
<!--//              font-size: 16px;-->
<!--//              line-height: 28px;-->
<!--//              color: #23263B;-->
<!--//            }-->
<!--//            .close-filter-section{-->
<!--//            }-->
<!--//          }-->
<!--//        }-->
<!--//        .filter-actions{-->
<!--//          display: flex;-->
<!--//          justify-content: space-between;-->
<!--//          .delete-all-filters-container{-->
<!--//            width: 262px;-->
<!--//            .delete-all-filters{-->
<!--//              width: 100%;-->
<!--//              border: 1px solid #E86562;-->
<!--//              background: #FFFFFF;-->
<!--//              font-style: normal;-->
<!--//              font-weight: 400;-->
<!--//              font-size: 14px;-->
<!--//              line-height: 24px;-->
<!--//              text-align: center;-->
<!--//              color: #E86562;-->
<!--//            }-->
<!--//          }-->
<!--//          .set-filters-container{-->
<!--//            width: 262px;-->
<!--//            .set-filters{-->
<!--//              width: 100%;-->
<!--//              background-color: var(&#45;&#45;3a-Primary);-->
<!--//              color: #FFFFFF;-->
<!--//            }-->
<!--//          }-->
<!--//        }-->
<!--//      }-->
<!--//    }-->
<!--//  }-->
<!--//}-->
<!--//@media only screen and (max-width: 599px) {-->
<!--//  .headerBankCard{-->
<!--//    .search-section {-->
<!--//      padding: 16px !important;-->
<!--//      justify-content: space-between;-->
<!--//      .search-box-container{-->
<!--//        padding-left: 0;-->
<!--//        &:deep(.q-card__actions){-->
<!--//          width: 100%;-->
<!--//        }-->
<!--//        padding-bottom: 12px;-->
<!--//        order: -1;-->
<!--//        .search-box{-->
<!--//          width: 100%;-->
<!--//        }-->
<!--//      }-->
<!--//      .select-box{-->
<!--//        min-width: 160px;-->
<!--//      }-->
<!--//    }-->
<!--//  }-->
<!--//  .dialog-filter-card{-->
<!--//    .dialog-filter-card-container{-->
<!--//      .questions-filter{-->
<!--//        padding: 20px 16px 30px 16px;-->
<!--//        .filter-headerOption-container{-->
<!--//          .filter-header{-->
<!--//            margin-bottom: 32px;-->
<!--//            .filter-header-title{-->
<!--//            }-->
<!--//            .close-filter-section{-->
<!--//            }-->
<!--//          }-->
<!--//        }-->
<!--//        .filter-actions{-->
<!--//          .delete-all-filters-container{-->
<!--//            width: 151px;-->
<!--//            .delete-all-filters{-->
<!--//            }-->
<!--//          }-->
<!--//          .set-filters-container{-->
<!--//            width: 151px;-->
<!--//            .set-filters{-->
<!--//-->
<!--//            }-->
<!--//          }-->
<!--//        }-->
<!--//      }-->
<!--//    }-->
<!--//  }-->
<!--//}-->
<!--</style>-->
