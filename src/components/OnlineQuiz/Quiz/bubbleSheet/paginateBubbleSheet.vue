<template>
  <div
    class="bubbleSheet"
  >
    <div
      ref="bubbleSheet"
      class="row bubbleSheet-body q-col-gutter bubble-sheet questions-list"
      :class="{
        'pasokh-nameh': info.type === 'pasokh-nameh',
        'pasokh-barg': info.type === 'pasokh-barg',
      }"
    >
      <div v-for="(group, index) in questionsInGroups"
           :key="index"
           class="col col-auto question-group"
           :class="{'none-question-in-list': !group.length}"
      >
        <div v-for="question in group"
             :key="question.id"
             class="question-in-list"
        >
          <div :class="{
            'question-number-in-list': true,
            circle: getUserQuestionData(question.id) && getUserQuestionData(question.id).status === 'o',
            cross: getUserQuestionData(question.id) && getUserQuestionData(question.id).status === 'x',
            bookmark: getUserQuestionData(question.id) && getUserQuestionData(question.id).bookmarked
          }"
          >
            <span>
              {{ question.order }}
            </span>
          </div>
          <div v-for="choice in question.choices.list"
               :key="choice.id"
               :class="{
                 'choice-in-list': true,
                 active: getUserQuestionData(question.id) && choice.id === getUserQuestionData(question.id).answered_choice_id,
                 answer: choice.answer
               }"
          >
            <q-icon v-if="info.type === 'pasokh-nameh' && choice.answer"
                    size="12"
                    icon="mdi-check"
                    :color="getUserQuestionData(question.id) && choice.id === getUserQuestionData(question.id).answered_choice_id ? '#fff' : '#00c753'"
            />
            <q-icon v-if="info.type === 'pasokh-nameh' && getUserQuestionData(question.id) && choice.id === getUserQuestionData(question.id).answered_choice_id && !choice.answer"
                    size="12"
                    icon="mdi-close"
                    color="#fff"
            />
          </div>
        </div>
      </div>
      <q-resize-observer @resize="setBubbleSheetDimensions" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import moment from 'moment-jalaali'
import { QuestionList } from 'src/models/Question'
import { mixinQuiz, mixinUserActionOnQuestion } from 'src/mixin/Mixins'

export default {
  name: 'PaginateBubbleSheet',
  mixins: [
    mixinQuiz,
    mixinUserActionOnQuestion
  ],
  emits: ['loaded'],
  props: {
    questions: {
      default: null
    },
    info: {
      default: null
    },
    delayTime: {
      default: 2000
    }
  },
  data: () => ({
    showDateOfAnsweredAt: false,
    overlay: false,
    bubbleSheetDimensions: {
      x: 0,
      y: 0
    },
    bubbleSheet: ref(null)
  }),
  computed: {
    questionsInGroups () {
      const groups = []
      const chunk = 10
      const questions = new QuestionList(this.questions)
      for (let i = 0, j = 300; i < j; i += chunk) {
        groups.push(questions.list.slice(i, i + chunk))
      }

      return groups
    }
  },
  mounted () {
    this.checkForShowDateOfAnsweredAt()
  },
  watch: {
    overlay () {
      if (this.overlay) {
        this.$store.dispatch('loading/overlayLoading', true)
      } else {
        this.$store.dispatch('loading/overlayLoading', false)
      }
    }
  },
  methods: {
    onBubbleSheetLoaded () {
      this.$emit('loaded')
    },
    setBubbleSheetHeight () {
      const that = this
      setTimeout(() => {
        if (that.$refs.bubbleSheet) {
          that.$refs.bubbleSheet.style.height = that.sheetsListHeight() - 24 + 'px'
        }
        that.overlay = false
        that.onBubbleSheetLoaded()
      }, this.delayTime)
    },
    sheetsListHeight () {
      // box is a col-7 with 12px padding
      const boxXPadding = 2 * 12
      const boxYPadding = 2 * 12
      const bubbleGroupWidth = 140
      const bubbleGroupHeight = 182
      const width = this.bubbleSheetDimensions.x - boxXPadding
      const horizontalGroupAmounts = Math.ceil(width / bubbleGroupWidth)
      const verticalGroupCount = Math.ceil(this.questionsInGroups.length / horizontalGroupAmounts)
      this.overlay = false
      return (verticalGroupCount * bubbleGroupHeight) + boxYPadding
    },
    showAnsweredAt (answeredAt) {
      let formatString = 'HH:mm:ss'
      if (this.showDateOfAnsweredAt) {
        formatString = 'HH:mm:ss jYYYY/jMM/jDD'
      }
      return moment(new Date(answeredAt)).format(formatString)
    },
    checkForShowDateOfAnsweredAt () {
      let dateTime = ''
      const that = this
      this.questionsInGroups.forEach(groupItem => {
        groupItem.forEach(questionItem => {
          const userQuestionData = that.getUserQuestionData(questionItem.id)
          if (userQuestionData && userQuestionData.answered_at) {
            if (dateTime === '') {
              dateTime = moment(new Date(userQuestionData.answered_at))
            } else {
              const dayDiff = dateTime.diff(moment(new Date(userQuestionData.answered_at)), 'days')
              if (dayDiff !== 0) {
                that.showDateOfAnsweredAt = true
              }
            }
          }
        })
      })
    },
    getUserQuestionData (questionId) {
      return false
      // if (typeof questionId === 'undefined') {
      //   questionId = this.currentQuestion.id
      // }
      // if (!this.quiz.user_exam_id || !questionId || !this.userQuizListData[this.quiz.user_exam_id]) {
      //   return false
      // }
      // return this.userQuizListData[this.quiz.user_exam_id][questionId]
    },
    AnswerClicked (payload) {
      if (this.info.type !== 'pasokh-nameh') {
        this.answerClicked(payload)
        this.clickChoice(payload.questionId)
      }
    },
    ClickQuestionNumber (questionId) {
      if (this.info.type !== 'pasokh-nameh') {
        this.clickQuestionNumber(questionId)
      }
    },
    clickChoice (questionId) {
      this.$emit('clickChoice', questionId)
    },
    clickQuestionNumber (questionId) {
      this.$emit('scrollTo', questionId)
    },
    setBubbleSheetDimensions (val) {
      if (!val) {
        return
      }

      this.bubbleSheetDimensions.x = val.width
      this.setBubbleSheetHeight()
    }
  }
}
</script>

<style lang="scss" scoped>
.bubbleSheet {
  height: 100%;
  overflow: auto;
  padding: 12px;
  .bubbleSheet-body {
    height: 910px;
    //max-height: calc(100vh - 150px);
    &.pasokh-nameh {
      .choice-in-list {
        position: relative;
        cursor: auto;

        &.answer {
          border: solid 1px #00c753;
          background-color: #00c753;
        }

        &.active {
          border: solid 1px #ff4243;
          background-color: #ff4243;
        }
      }
    }

    &.questions-list {
      direction: rtl;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      align-items: center;
    }

    .question-group {
      background: #fff;
      border-radius: 10px;
      margin: 5px;
      padding: 5px 10px;
      width: 130px;
      font-size: 11px;
      max-height: 175px;

      .question-in-list {
        margin: 2px 0;
        display: flex;
        flex-direction: row;
        height: 14px;

        .choice-in-list {
          width: 19%;
          margin: 2px;
          border-radius: 6px;
          border: 1px solid #ffda6a;
          cursor: pointer;

          &.active {
            background: #888;
          }
        }

        .question-number-in-list {
          position: relative;
          width: 24%;
          cursor: pointer;

          &.circle {
            &:after {
              content: "\F0130";
              position: absolute;
              font: normal normal normal 24px/1 "Material Design Icons";
              text-rendering: auto;
              line-height: inherit;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
              color: #ffda6a;
              right: -13px;
              font-size: 14px;
              top: -5px;
            }
          }

          &.cross {
            &:after {
              content: "\F0156";
              position: absolute;
              font: normal normal normal 24px/1 "Material Design Icons";
              text-rendering: auto;
              line-height: inherit;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
              color: red;
              right: -13px;
              font-size: 14px;
              top: -5px;
            }
          }

          &.bookmark {
            &::before {
              content: "\F00C3";
              position: absolute;
              font: normal normal normal 24px/1 "Material Design Icons";
              text-rendering: auto;
              line-height: inherit;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
              color: #2196F3;
              right: -13px;
              font-size: 14px;
              top: -5px;
            }
          }
        }
      }
    }

    .none-question-in-list {
      display: none;
    }
  }
}

</style>
