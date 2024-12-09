<template>
  <div class="home-container">
    <div class="content">
      <h1 class="title">今天想要做什么？</h1>
      <div class="button-group">
        <el-button type="primary" size="large" class="choice-button" @click="router.push('/fish')">
          摸鱼
        </el-button>
        <el-button type="success" size="large" class="choice-button" @click="router.push('/encrypt')">
          加密
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style lang="scss" scoped>
.home-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);

  .content {
    text-align: center;
    padding: 40px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 16px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);

    .title {
      font-size: 32px;
      color: #2c3e50;
      margin-bottom: 40px;
      font-weight: 600;
    }

    .button-group {
      display: flex;
      gap: 24px;
      justify-content: center;

      .choice-button {
        min-width: 120px;
        font-size: 18px;
        padding: 16px 32px;
        border-radius: 8px;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        &:active {
          transform: translateY(0);
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .home-container {
    .content {
      padding: 24px;
      width: 90%;

      .title {
        font-size: 24px;
        margin-bottom: 30px;
      }

      .button-group {
        flex-direction: column;
        gap: 16px;

        .choice-button {
          width: 100%;
        }
      }
    }
  }
}
</style>
