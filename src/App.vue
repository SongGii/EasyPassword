<template>
  <div class="app">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
let num = 2
if (num === 2) {
  num = 4
}
</script>

<style lang="scss" scoped></style>
