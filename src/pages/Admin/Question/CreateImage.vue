<template>
  <div class="page-container">
    <div class="row">
      <div class="col flex justify-between">
        <span>
          برای ثبت سوال جدید میتوانید تصویر صورت سوال را در این صفحه آپلود کنید یا به صورت مستقیم آن ها را تایپ کنید.
          <!--          Todo : codes below are suspended ( no current design )-->
          <!--          <q-btn-->
          <!--            icon-right="isax:info-circle"-->
          <!--            label="بیشتر بخوانید"-->
          <!--            flat-->
          <!--            rounded-->
          <!--            color="primary"-->
          <!--          />-->
        </span>
        <div class="action-buttons">
          <q-btn
            label="تایپ سوال"
            color="primary"
            class="change-type"
            :to="{ name: 'Admin.Question.Create.Text.MultipleChoice' }"
            unelevated
          />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <upload-image v-model="question"
                      title="صورت سوال"
                      field-key="statement_photo" />
      </div>
      <div class="col-6">
        <upload-image v-model="question"
                      title="پاسخ سوال"
                      field-key="answer_photos" />
      </div>
    </div>
    <div class="relative-position">
      <div class="attach-btn row">
        <question-identifier
          ref="questionIdentifier"
          editable
          class="col-12"
          :exams="examList"
          :lessons="subCategoriesList"
          :categories="categoryList"
          :gradesList="gradesList"
          :groups-list="lessonGroupList"
          :lessons-list="lessonsList"
          :major-list="majorList"
          :authorship-dates-list="authorshipDatesList"
          :question-authors-list="questionAuthorsList"
          :question-target-list="questionTargetList"
          :buffer="true"
          @gradeSelected="getLessonsList"
          @groupSelected="getLessonsList"
          @attach="attachExam"
          @detach="detachExam"
          @tags-collected="setTagsOnCreate"
        />
      </div>
      <question-video-answer :contentId="question.content_id"
                             :timePointId="question.time_point_id"
                             @update-value="updateQuestionContent($event)" />
      <btn-box
        class="col-12"
        @saveQuestion="createQuestionImage(question)"
      />
    </div>
  </div>
</template>

<script>
import BtnBox from 'components/Question/QuestionPage/BtnBox'
import uploadImage from 'src/components/Question/QuestionPage/UploadImage'
import { Question } from 'src/models/Question'
import { computed } from 'vue'
import { AdminActionOnQuestion } from 'src/mixin/Mixins'
import { ExamList } from 'src/models/Exam'
import { QuestSubcategoryList } from 'src/models/QuestSubcategory'
import { QuestionStatusList } from 'src/models/QuestionStatus'
import { QuestCategoryList } from 'src/models/QuestCategory'
import QuestionIdentifier from 'components/Question/QuestionPage/QuestionIdentifier'
import mixinTree from 'src/mixin/Tree'
import QuestionVideoAnswer from 'components/Question/QuestionPage/QuestionVideoAnswer.vue'

export default {
  name: 'CreateImage',
  components: {
    QuestionIdentifier,
    uploadImage,
    BtnBox,
    QuestionVideoAnswer
  },
  mixins: [
    AdminActionOnQuestion,
    mixinTree
  ],
  data () {
    return {
      question: new Question(),
      examList: new ExamList(),
      subCategoriesList: new QuestSubcategoryList(),
      questionStatuses: new QuestionStatusList(),
      categoryList: new QuestCategoryList(),
      questionVideoAnswerDialog: false
    }
  },
  beforeRouteUpdate () {
    this.getPageReady()
  },
  created () {
    this.getPageReady()
    this.getGradesList()
    this.loadQuestionAuthors()
    this.loadQuestionTargets()
    this.loadAuthorshipDates()
    this.loadMajorList()
  },
  updated () {
  },
  mounted () {
  },
  provide () {
    return {
      providedQuestion: computed(() => this.question)
    }
  },
  methods: {
    updateQuestionContent(data) {
      this.question.content_id = data.content_id
      this.question.time_point_id = data.time_point_id
    }
  }
}
</script>

<style scoped lang="scss">
.page-container {
  //padding: 40px 100px;
  padding-top: 20px;
  display: flex;
  flex-direction: column;

  .change-type {
    width: 144px;
    height: 40px;
    border-radius: 10px;
  }
}
</style>
