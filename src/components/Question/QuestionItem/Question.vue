<template>
  <div class="question-component">
    <div class="question-container">
      <q-skeleton v-if="loading"
                  height="25px" />
      <q-skeleton v-if="loading"
                  class="q-mt-sm"
                  width="50%"
                  height="25px" />
      <vue-katex
        v-if="question.statement"
        :input="question.statement"
      />
      <div v-else-if="question.statement_photo?.length > 0">
        <div
          v-for="(photo, index) in question.statement_photo"
          :key="index"
          class="img-container"
        >
          <q-img class="img"
                 :src="photo">
            <template v-slot:error>
              <div class="error-img">
                <div class="content bg-negative text-white q-pa-md">
                  عکس لود نمیشود
                </div>
              </div>
            </template>
          </q-img>
        </div>
      </div>
    </div>

    <div class="multiple-choices-container">
      <template v-if="question.loading">
        <div
          v-for="item in 4"
          :key="item"
          class="choice-column col-3"
        >
          <div class="flex items-center">
            <div class="question-choice bg-primary">
              {{ item }}
            </div>
            <q-skeleton
              type="text"
              width="200px"
              height="25px"
            />
          </div>

        </div>
      </template>

      <div
        v-else-if="question.choices.list"
        class="multiple-choices"
      >
        <multiple-choices-template
          v-for="(choice , index) in question.choices.list"
          id="test"
          ref="questionChoice"
          :key="index"
          class=" col-lg-3 col-md-3 col-sm-12"
          :class="questionCol"
          :isLtr="isLtrQuestion()"
          :dir="isLtrQuestion()? 'ltr':''"
          :choice="choice"
        />
      </div>

      <div v-else-if="question.answer_photos?.length>0">
        <div
          v-for="(photo, index) in question.answer_photos"
          :key="index"
          class="img-container"
        >
          <q-img  class="img"
                  :src="photo"
          >
            <template v-slot:error>
              <div class="error-img">
                <div class="content bg-negative text-white q-pa-md">
                  عکس لود نمیشود
                </div>
              </div>
            </template>
          </q-img>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueKatex from 'src/components/VueKatex'
import MultipleChoicesTemplate from 'components/Question/QuestionItem/MultipleChoicesTemplate'
import { Question } from 'src/models/Question'

export default {
  name: 'Question',
  components: { VueKatex, MultipleChoicesTemplate },
  props: {
    question: {
      type: Question,
      default: new Question()
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    name: '',
    questionCol: ''
  }),

  mounted () {
    this.setChoiceCol()
  },

  methods: {
    setChoiceCol () {
      const el = this.$refs.questionChoice
      if (!el) {
        return
      }
      el.forEach(choice => {
        if (window.innerWidth < 1024) {
          return null
        }
        if (!this.isSingleLine(choice.$el)) {
          this.questionCol = 'col-lg-6 col-sm-6'
        }
      })
    },

    checkLines (el) {
      if (!this.isSingleLine(el)) {
        this.questionCol = 'col-lg-12 col-sm-12'
      }
    },

    getElementHeight (choiceBoxElement, computed) {
      const padding = parseInt(computed.paddingTop) + parseInt(computed.paddingBottom)
      return choiceBoxElement.clientHeight - padding
    },

    isSingleLine (choiceBoxElement) {
      const choiceContentElement = choiceBoxElement.childNodes[1]
      const computed = getComputedStyle(choiceContentElement)
      const height = this.getElementHeight(choiceBoxElement, computed)
      const choiceContentLineHeight = parseInt(computed.lineHeight)
      return height <= choiceContentLineHeight
    },

    isLtrQuestion () {
      const string = this.question.statement
      if (!string) {
        return false
      }
      const persianRegex = /[\u0600-\u06FF]/
      return !string.match(persianRegex)
    }
  }
}
</script>

<style lang="scss" scoped>
.error-img{
  max-height: 100px;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  background: transparent;
  .content{
    border-radius: 15px;
  }
}
.img-container{
  min-height: 50px;
  :deep(.q-img){
    width: 100%;
    div{
      //padding-bottom: 0!important;
    }
  }
}

.question-component {
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #434765;

  .multiple-choices-container{
    .question-choice{
      color: white;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;
    }

    .img-container{
      height: max-content;
      .img{
        max-height: 100%;
      }
    }
  }

  .question-container {
    margin-bottom: 20px;

    .img-container{
      height: max-content;
      .img{
        max-height: 100%;
      }
    }

    @media only screen and (max-width: 1439px) {
      margin-bottom: 24px;
    }

    @media only screen and (max-width: 1023px) {
      margin-bottom: 10px;
    }

    &:deep(.html-katex) {
      p {
        margin-bottom: 0;
      }
    }

  }
}
</style>
