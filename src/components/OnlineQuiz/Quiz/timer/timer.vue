<template>
  <div>
    <mobile-timer
      v-if="windowSize.x < 1024"
      class="Mobiletimer"
      :passed-time="passedTime"
      :remaining-time="remainTime"
      :current-cat="currentCat"
    />
    <pc-timer
      v-else
      class="Pctimer"
      :passed-time="passedTime"
      :remaining-time="remainTime"
      :current-cat="currentCat"
      @timerOpen="passEvent"
    />
  </div>
</template>

<script>
import pcTimer from 'src/components/OnlineQuiz/Quiz/timer/pcTimer'
import mobileTimer from 'src/components/OnlineQuiz/Quiz/timer/mobileTimer'
import { mixinQuiz } from 'src/mixin/Mixins'
import Time from 'src/plugins/time'
import Assistant from 'src/plugins/assistant'
export default {
  name: 'timer',
  components: {
    pcTimer,
    mobileTimer
  },
  mixins: [mixinQuiz],
  data: () => ({
    currentCat: null,
    interval: null,
    passedTime: '00:00:00',
    remainTime: false
  }),
  mounted () {
    const that = this
    this.interval = setInterval(() => {
      const newCat = Time.getCurrentCategoryAcceptAt(that.quiz.categories)
      that.calcRemainAndPassedTime(newCat)
      that.doActionsOnChangeCategory(newCat)
    }, 1000)
    // requestAnimationFrame(this.timer.updateTimer) // webpack-internal:///./src/models/Timer.js:58 Uncaught TypeError: Cannot read property 'updateDiffs' of undefined
  },
  unmounted () {
    clearInterval(this.interval)
  },
  computed: {
    windowSize () {
      return this.$store.getters['AppLayout/windowSize']
    }
  },
  methods: {
    passEvent (value) {
      this.$emit('timerOpen', value)
    },
    calcRemainAndPassedTime (newCat) {
      this.passedTime = Time.getPassedTime(this.quiz.created_at)
      this.calcRemainTime(newCat)
    },
    calcRemainTime (newCat) {
      if (newCat) {
        this.remainTime = Time.getRemainTime(newCat.accept_at)
      } else {
        this.remainTime = false
      }
    },
    doActionsOnChangeCategory (newCat) {
      const newCategoryIsCurrentCategory = !!(newCat && this.currentCat && Assistant.getId(newCat.id) === Assistant.getId(this.currentCat.id))
      if (newCategoryIsCurrentCategory) {
        return
      }
      if (this.quiz.categories.list.length === 0) {
        return
      }
      this.currentCat = newCat
      this.$store.commit('Exam/setActiveStateOfExamCategories')
      this.goToCategory(this.currentCat.id)
      Time.setStateOfQuestionsBasedOnActiveCategory(this.quiz, this.getCurrentExamQuestions())
      this.setExamAcceptAtIsPassedWhenAllCategoryIsPassed()
    },
    setExamAcceptAtIsPassedWhenAllCategoryIsPassed () {
      const newCat = Time.getCurrentCategoryAcceptAt(this.quiz.categories)
      if (!newCat && this.quiz.categories.length > 0) {
        this.$store.commit('Exam/setExamAcceptAtIsPassed')
      }
    }
  }
}
</script>

<style scoped>
.Pctimer {
  position: sticky;
  position: -webkit-sticky;
  bottom: 0px;
}
.Mobiletimer {
  position: static;
  bottom: 0;
  min-width: 100%;
}
</style>
