<template>
  <div class="warp">
    <el-container>
      <el-header>Header</el-header>
      <el-main>Main</el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
let num = 2
if (num === 2) {
  num = 4
}
</script>

<style lang="scss" scoped>
.warp {
  width: 100vw;
  height: 100vh;
}
</style>
