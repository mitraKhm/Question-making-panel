<template>
  <q-list>
    <q-item v-for="item in 5"
            active-class="active-route"
            :key="item"
            clickable
            v-ripple
    >
      <span class="indicator"
      />
      <q-item-section>Single line item : {{item}}</q-item-section>
    </q-item>
  </q-list>
</template>

<script>
export default {
  name: 'navigationList'
}
</script>

<style scoped lang="scss">

//&.active-route {
//  .indicator {
//    height: 8px;
//    width: 8px;
//    background-color: white;
//    border-radius: 50%;
//    margin: auto;
//  }
//}
</style>
