<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="wrap">
    <el-card class="crypto-card">
      <template #header>
        <div class="card-header">
          <span class="title">AES 加密/解密工具</span>
        </div>
      </template>

      <div class="content">
        <!-- 密钥输入区域 -->
        <el-input v-model="secretKey" class="key-input" placeholder="请输入至少8位密钥" :maxlength="16" show-word-limit>
          <template #prefix>
            <el-icon>
              <Key />
            </el-icon>
          </template>
        </el-input>

        <!-- 加密/解密切换 -->
        <div class="mode-switch">
          <el-radio-group v-model="mode" size="large">
            <el-radio-button value="encrypt">加密</el-radio-button>
            <el-radio-button value="decrypt">解密</el-radio-button>
          </el-radio-group>
        </div>

        <!-- 输入输出区域 -->
        <div class="text-areas">
          <el-input v-model="inputText" type="textarea" :rows="6"
            :placeholder="mode === 'encrypt' ? '请输入要加密的内容' : '请输入要解密的内容'" />

          <div class="arrow-area">
            <el-button type="primary" :icon="ArrowDown" circle @click="handleCrypto" />
          </div>

          <el-input v-model="outputText" type="textarea" :rows="6" readonly placeholder="输出结果" />
        </div>

        <!-- 操作按钮 -->
        <div class="actions">
          <el-button type="primary" @click="handleCrypto">
            {{ mode === 'encrypt' ? '加密' : '解密' }}
          </el-button>
          <el-button type="info" @click="handleCopy">
            复制结果
          </el-button>
          <el-button @click="handleClear">
            清空
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowDown, Key } from '@element-plus/icons-vue'
import CryptoJS from 'crypto-js'

// 状态定义
const mode = ref<'encrypt' | 'decrypt'>('encrypt')
const secretKey = ref('')
const inputText = ref('')
const outputText = ref('')

// 加密方法
const encrypt = (text: string, key: string): string => {
  try {
    const result = CryptoJS.AES.encrypt(text, key).toString()
    return result
  } catch (error) {
    ElMessage.error('加密失败，请检查输入')
    return ''
  }
}

// 解密方法
const decrypt = (encrypted: string, key: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, key)
    const result = bytes.toString(CryptoJS.enc.Utf8)
    if (!result) {
      throw new Error('解密失败')
    }
    return result
  } catch (error) {
    ElMessage.error('解密失败，请检查输入和密钥是否正确')
    return ''
  }
}

// 处理加密解密
const handleCrypto = () => {
  if (!secretKey.value || secretKey.value.length < 8) {
    ElMessage.warning('请输入至少8位密钥')
    return
  }

  if (!inputText.value) {
    ElMessage.warning('请输入需要处理的内容')
    return
  }

  outputText.value = mode.value === 'encrypt'
    ? encrypt(inputText.value, secretKey.value)
    : decrypt(inputText.value, secretKey.value)
}

// 复制结果
const handleCopy = async () => {
  if (!outputText.value) {
    ElMessage.warning('暂无内容可复制')
    return
  }

  try {
    await navigator.clipboard.writeText(outputText.value)
    ElMessage.success('复制成功')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 清空所有输入
const handleClear = () => {
  inputText.value = ''
  outputText.value = ''
}
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  padding: 20px;

  .crypto-card {
    width: 800px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    :deep(.el-card__header) {
      border-bottom: 2px solid rgba(64, 158, 255, 0.1);
    }

    .card-header {
      display: flex;
      justify-content: center;
      align-items: center;

      .title {
        font-size: 24px;
        color: #409EFF;
        font-weight: bold;
      }
    }

    .content {
      padding: 20px;

      .key-input {
        margin-bottom: 20px;
      }

      .mode-switch {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
      }

      .text-areas {
        .arrow-area {
          display: flex;
          justify-content: center;
          margin: 15px 0;
        }
      }

      .actions {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        gap: 12px;
      }
    }
  }
}

:deep(.el-button.is-circle) {
  padding: 8px;
}

:deep(.el-input__wrapper),
:deep(.el-textarea__inner) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;

  &:hover {
    box-shadow: 0 0 0 1px #409eff inset;
  }

  &.is-focus {
    box-shadow: 0 0 0 1px #409eff inset;
  }
}
</style>
