<template>
  <div class="row quiz-page">
    <div class="col "
         :style="{ 'min-height': '100%' }">
      <div class="row main-page"
           :style="{ 'min-width': '100%' }">
        <div class="col btnpre col-md-1 justify-start sm-hide xs-hide">
          <q-btn
            v-if="getQuestionNumberFromId(currentQuestion.id) !== 1"
            flat
            class="q-px-none"
            :style="{ 'width':'64px','height': '400px' }"
            no-shadow
            @click="goToPrevQuestion('onlineQuiz.alaaView')"
          >
            <q-icon
              size="40px"
              name="mdi-chevron-right"
            />
          </q-btn>
        </div>
        <div class="col col-md-10 q-px-sm ">
          <div class="middle-page row">
            <div class="col flex question-header">
              <div class="question-number">
                <p v-if="currentLesson">
                  {{ currentLesson.title }}
                  -
                  سوال شماره
                  {{ getQuestionNumberFromId(currentQuestion.id) }}
                </p>
              </div>
              <div class="question-buttons ">
                <q-btn
                  size="12px"
                  round
                  flat
                  @click="changeStatus(currentQuestion.id, 'o')"
                >
                  <q-icon
                    v-if="!getUserQuestionData(quiz.user_exam_id, currentQuestion.id) || getUserQuestionData(quiz.user_exam_id, currentQuestion.id).status !== 'o'"
                    :style="{ 'width':'24px','height': '24px' }"
                    color="grey-7"
                    size="30px"
                    name="mdi-checkbox-blank-circle-outline"
                  />
                  <q-icon
                    v-if="getUserQuestionData(quiz.user_exam_id, currentQuestion.id) && getUserQuestionData(quiz.user_exam_id, currentQuestion.id).status === 'o'"
                    color="amber"
                    size="30px"
                    name="mdi-checkbox-blank-circle"
                  />
                </q-btn>
                <q-btn
                  size="12px"
                  round
                  flat
                  @click="changeStatus(currentQuestion.id, 'x')"
                >
                  <q-icon
                    size="30px"
                    :color="getUserQuestionData(quiz.user_exam_id, currentQuestion.id) && getUserQuestionData(quiz.user_exam_id, currentQuestion.id).status === 'x' ? 'red' : 'grey-7'"
                    name="mdi-close"
                  />
                </q-btn>
                <q-btn
                  size="12px"
                  flat
                  round
                  @click="changeBookmark(currentQuestion.id)"
                >
                  <q-icon
                    v-if="!getUserQuestionData(quiz.user_exam_id, currentQuestion.id) || !getUserQuestionData(quiz.user_exam_id, currentQuestion.id).bookmarked"
                    size="30px"
                    color="grey-7"
                    name="mdi-bookmark-outline"
                  />
                  <q-icon
                    v-if="getUserQuestionData(quiz.user_exam_id, currentQuestion.id) && getUserQuestionData(quiz.user_exam_id, currentQuestion.id).bookmarked"
                    flat
                    color="blue-6"
                    size="30px"
                    name="mdi-bookmark"
                  />
                </q-btn>
              </div>
            </div>
            <div class="col question-body">
              <div
                v-if="currentQuestion.in_active_category"
                :class="{ ltr: isLtrString(currentQuestion.statement)}"
                class="renderedPanel"
              >
                <div v-if="currentQuestion.parent.id"
                     class="q-pb-md">
                  <vue-katex :input="currentQuestion.parent.statement" />
                </div>
                <vue-katex :input="currentQuestion.statement" />
              </div>
              <q-card
                v-if="!currentQuestion.in_active_category"
                class="col flex align-center justify-center"
              >
                <q-card-section
                  class="WarningSheet flex"
                  :style="{ 'width':'1300px','height': '400px' }"
                >
                  در حال حاضر امکان مشاهده سوالات این دفترچه امکان پذیر نمی باشد
                </q-card-section>
              </q-card>
            </div>
            <div v-if="currentQuestion.in_active_category"
                 class="col question-answers"
            >
              <div
                class="row">
                <div
                  v-for="(item, index) in currentQuestion.choices.list"
                  :key="item.id"
                  class="choice-parent col-12 col-md-6"
                >
                  <choice
                    :choice-number="index+1"
                    :question-id="currentQuestion.id"
                    :choice="item"
                    :is-rtl="!isLtrString(item.title)"
                    @answerClicked="answerClicked"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col btnpre col-md-1 justify-start sm-hide xs-hide"
        >
          <q-btn
            v-if="getQuestionNumberFromId(currentQuestion.id) !== getCurrentExamQuestionsInArray().length"
            flat
            class="q-px-none"
            :style="{ 'width':'64px','height': '400px' }"
            no-shadow
            @click="goToNextQuestion('onlineQuiz.alaaView')"
          >
            <q-icon
              size="40px"
              name="mdi-chevron-left"
            />
          </q-btn>
        </div>
      </div>
    </div>
    <div class="timer-row col">
      <Timer v-if="quiz.accept_at" />
    </div>
  </div>
</template>

<script>
import Assistant from 'src/plugins/assistant'
import VueKatex from 'src/components/VueKatex'
import Choice from 'src/components/OnlineQuiz/Quiz/Choice'
import Timer from 'src/components/OnlineQuiz/Quiz/timer/timer'
import { mixinAuth, mixinQuiz, mixinUserActionOnQuestion, mixinDrawer } from 'src/mixin/Mixins'

export default {
  name: 'AlaaView',
  components: {
    Choice,
    VueKatex,
    Timer
  },
  mixins: [mixinAuth, mixinQuiz, mixinUserActionOnQuestion, mixinDrawer],
  data () {
    return {
      userExamId: null
    }
  },
  beforeRouteUpdate () {
    this.getLatestUserAnswersFromServer()
  },
  created () {
    this.userExamId = this.$route.params.quizId
  },
  mounted () {
    this.updateOverlay(true)
    this.showAppBar()
    this.updateDrawerBasedOnWindowSize()
    this.startExamProcess()
  },
  computed: {
    windowSize () {
      return this.$store.getters['AppLayout/windowSize']
    }
  },
  methods: {
    startExamProcess () {
      const retake = this.$route.name === 'onlineQuiz.alaaView.retake'
      const personal = this.$route.name === 'onlineQuiz.alaaView.personal'
      this.startExam(this.$route.params.quizId, 'onlineQuiz.alaaView', retake, personal)
        .then(() => {
          this.setSocket(this.$store.getters['Auth/accessToken'], this.quiz.id)
          if (!this.getCurrentExamQuestionsInArray() || this.getCurrentExamQuestionsInArray().length === 0) {
            this.$q.notify({
              type: 'negative',
              message: 'مشکلی در دریافت سوالات آزمون رخ داده است.',
              position: 'top'
            })
            this.$store.commit('Exam/clearExamData', this.userExamId)
            this.$router.push({ name: 'User.Exam.List' })
          }
          this.updateOverlay(false)
        }).catch((err) => {
          Assistant.reportErrors(err)
          this.$router.push({ name: 'User.Exam.List' })
          this.updateOverlay(false)
        })
    },
    updateOverlay (value) {
      this.$store.dispatch('loading/overlayLoading', value)
    },
    redirect () {
      this.$router.push({
        name: 'konkoorView',
        params: {
          quizId: this.$route.params.quizId
        }
      })
    },
    showAppBar () {
      this.$store.commit('AppLayout/updateLayoutHeaderVisible', true)
    },
    updateDrawerBasedOnWindowSize () {
      if (this.windowSize.x > 1263) {
        this.$store.commit('AppLayout/updateLayoutLeftDrawerVisible', true)
      }
    }
  }
}
</script>

<style>
.quiz-page strong em strong {
  font-weight: normal;
  font-style: normal;
  text-decoration: none !important;
}
.WarningSheet{
  color: white;
  justify-content: center;
  align-content: center;
  background: darkorange;
}
.ltr .renderedPanel {
  direction: ltr !important;
}

.q-navigation-drawer.mapOfQuestions .q-navigation-drawer__content {
  overflow-y: scroll;
}

.quiz-page .katex-display {
  display: inline-block;
  direction: rtl;
}

.base.textstyle.uncramped {
  display: flex;
  flex-wrap: wrap;
}

</style>

<style lang="scss" scoped>
.quiz-page {
  background: #f1f1f1;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0 0 0 12px;
  min-height: calc( 100vh - 100px );
  .timer-row {
    //max-width: calc(75% - 150px);
    width: calc(75% - 150px);
    position: absolute;
    bottom: 0;
    min-width: 130px;
    right: 100px;
    //@media screen and (max-width: 1024px) {
    //  width: calc(84% - 150px);
    //}
  }
  .main-page{
    display: flex;
    flex-direction: row;
    .btnpre {
      display: flex;
      padding: 12px 12px 12px 24px;
    }
    .middle-page{
      display: flex;
      flex-direction: column;
      padding-bottom: 103px;
      .question-header {
        display: flex;
        color: var(--text-2);
        flex-direction: row;
        justify-content: space-between;
        position: sticky;
        padding-top: 20px;
        z-index: 1;
        margin: -12px -12px -12px -12px;
        background: #f1f1f1;
        .question-number p {
          margin-bottom: 0;
          line-height: 40px;
          font-size: 16px;
        }

        .question-buttons button {
          margin-left: 20px;
          height: 24px;
          width: 24px;
          size: 12px;
        }
        .question-buttons {
          :deep(.q-btn) {
            .q-btn__content {
              margin-top: 0;
              margin-bottom: 0;
            }
          }
        }
        @media only screen and (max-width: 600px) {
          .question-buttons button {
            margin-left: 0;
          }
        }
      }
      @media only screen and (max-width: 335px) {
        .question-header {
          justify-content: center;
        }
      }
      .question-body {
        padding: 0px 0px 0px 12px;
        margin-top: 50px;
        margin-left: -12px;
        margin-right: -12px;
        font-size: 16px;
        text-rendering: optimizeLegibility;
        line-height: 35px;
        display: inline-block;
        direction: inherit;
        box-sizing: inherit;
        color: var(--text-2);
      }
      @media only screen and (max-width: 1024px) {
        .question-body {
          margin-top: 20px;
        }
      }
      .question-answers {
        margin-top: 90px;
        margin-left: -12px;
        margin-right: -12px;
        .choice-parent{
          padding: 12px;
        }
      }
    }
  }
}
</style>
