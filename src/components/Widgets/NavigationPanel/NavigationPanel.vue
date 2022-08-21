<template>
  <div class="navigation-panel bg-primary text-white">
    <navigation-list />
  </div>

</template>

<script>
import NavigationList from 'src/components/Widgets/NavigationPanel/navigationList'
export default {
  name: 'NavigationPanel',
  components: {
    NavigationList
  }
}
</script>

<style scoped lang="scss">
.navigation-panel{
  width: 277px;
  border-radius: 20px;
  padding: 24px;

}
</style>
