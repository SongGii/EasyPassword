<template>
  <div class="game-container">
    <div class="game-header">
      <div class="score-container">
        <div class="score-box">
          <div class="label">得分</div>
          <div class="value">{{ score }}</div>
        </div>
        <div class="score-box">
          <div class="label">最高分</div>
          <div class="value">{{ bestScore }}</div>
        </div>
      </div>
      <el-button type="primary" @click="newGame">新游戏</el-button>
    </div>

    <div class="game-board" ref="boardEl" @touchstart="handleTouchStart" @touchmove="handleTouchMove"
      @touchend="handleTouchEnd">
      <div v-for="(row, i) in board" :key="i" class="row">
        <div v-for="(cell, j) in row" :key="j" class="cell" :class="[
          cell ? `cell-${cell}` : '',
          cell && isNew(i, j) ? 'cell-new' : '',
          cell && isMerged(i, j) ? 'cell-merged' : ''
        ]">
          {{ cell || '' }}
        </div>
      </div>
    </div>

    <div class="game-over" v-if="isGameOver">
      <div class="game-over-content">
        <h2>游戏结束!</h2>
        <p>最终得分: {{ score }}</p>
        <el-button type="primary" @click="newGame">再来一局</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 游戏状态
const board = ref<number[][]>([[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]])
const score = ref(0)
const bestScore = ref(0)
const isGameOver = ref(false)
const newCells = ref<Set<string>>(new Set())
const mergedCells = ref<Set<string>>(new Set())

// 触摸相关
const touchStartX = ref(0)
const touchStartY = ref(0)
const boardEl = ref<HTMLElement | null>(null)

// 检查是否是新生成的格子
const isNew = (i: number, j: number) => newCells.value.has(`${i}-${j}`)

// 检查是否是合并的格子
const isMerged = (i: number, j: number) => mergedCells.value.has(`${i}-${j}`)

// 生成新的数字
const generateNumber = () => {
  const emptyCells: [number, number][] = []
  board.value.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === 0) emptyCells.push([i, j])
    })
  })

  if (emptyCells.length === 0) return false

  const [i, j] = emptyCells[Math.floor(Math.random() * emptyCells.length)]
  board.value[i][j] = Math.random() < 0.9 ? 2 : 4
  newCells.value.add(`${i}-${j}`)
  return true
}

// 移动和合并逻辑
const move = (direction: 'left' | 'right' | 'up' | 'down') => {
  newCells.value.clear()
  mergedCells.value.clear()

  let moved = false
  const rows = board.value.length
  const cols = board.value[0].length

  const moveCell = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    if (board.value[fromRow][fromCol] === 0) return false
    if (board.value[toRow][toCol] === 0) {
      board.value[toRow][toCol] = board.value[fromRow][fromCol]
      board.value[fromRow][fromCol] = 0
      return true
    }
    if (board.value[toRow][toCol] === board.value[fromRow][fromCol]) {
      board.value[toRow][toCol] *= 2
      board.value[fromRow][fromCol] = 0
      score.value += board.value[toRow][toCol]
      mergedCells.value.add(`${toRow}-${toCol}`)
      return true
    }
    return false
  }

  if (direction === 'left' || direction === 'right') {
    for (let i = 0; i < rows; i++) {
      if (direction === 'left') {
        for (let j = 1; j < cols; j++) {
          for (let k = j; k > 0; k--) {
            if (moveCell(i, k, i, k - 1)) moved = true
          }
        }
      } else {
        for (let j = cols - 2; j >= 0; j--) {
          for (let k = j; k < cols - 1; k++) {
            if (moveCell(i, k, i, k + 1)) moved = true
          }
        }
      }
    }
  } else {
    for (let j = 0; j < cols; j++) {
      if (direction === 'up') {
        for (let i = 1; i < rows; i++) {
          for (let k = i; k > 0; k--) {
            if (moveCell(k, j, k - 1, j)) moved = true
          }
        }
      } else {
        for (let i = rows - 2; i >= 0; i--) {
          for (let k = i; k < rows - 1; k++) {
            if (moveCell(k, j, k + 1, j)) moved = true
          }
        }
      }
    }
  }

  if (moved) {
    if (!generateNumber()) {
      checkGameOver()
    }
    if (score.value > bestScore.value) {
      bestScore.value = score.value
      localStorage.setItem('2048-best-score', bestScore.value.toString())
    }
  }
}

// 检查游戏是否结束
const checkGameOver = () => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board.value[i][j] === 0) return
      if (i < 3 && board.value[i][j] === board.value[i + 1][j]) return
      if (j < 3 && board.value[i][j] === board.value[i][j + 1]) return
    }
  }
  isGameOver.value = true
}

// 开始新游戏
const newGame = () => {
  board.value = Array(4).fill(0).map(() => Array(4).fill(0))
  score.value = 0
  isGameOver.value = false
  newCells.value.clear()
  mergedCells.value.clear()
  generateNumber()
  generateNumber()
}

// 触摸事件处理
const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
}

const handleTouchMove = (e: TouchEvent) => {
  e.preventDefault()
}

const handleTouchEnd = (e: TouchEvent) => {
  const touchEndX = e.changedTouches[0].clientX
  const touchEndY = e.changedTouches[0].clientY

  const dx = touchEndX - touchStartX.value
  const dy = touchEndY - touchStartY.value

  if (Math.abs(dx) > Math.abs(dy)) {
    if (Math.abs(dx) > 10) {
      move(dx > 0 ? 'right' : 'left')
    }
  } else {
    if (Math.abs(dy) > 10) {
      move(dy > 0 ? 'down' : 'up')
    }
  }
}

// 键盘事件处理
const handleKeydown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowLeft':
      move('left')
      break
    case 'ArrowRight':
      move('right')
      break
    case 'ArrowUp':
      move('up')
      break
    case 'ArrowDown':
      move('down')
      break
  }
}

// 生命周期钩子
onMounted(() => {
  bestScore.value = parseInt(localStorage.getItem('2048-best-score') || '0')
  window.addEventListener('keydown', handleKeydown)
  newGame()
})
</script>

<style lang="scss" scoped>
.game-container {
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;

  .game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .score-container {
      display: flex;
      gap: 20px;

      .score-box {
        background: #bbada0;
        padding: 10px 20px;
        border-radius: 6px;
        text-align: center;

        .label {
          color: #eee4da;
          font-size: 14px;
          margin-bottom: 4px;
        }

        .value {
          color: white;
          font-size: 20px;
          font-weight: bold;
        }
      }
    }
  }

  .game-board {
    background: #bbada0;
    padding: 15px;
    border-radius: 8px;
    touch-action: none;

    .row {
      display: flex;
      gap: 15px;
      margin-bottom: 15px;

      &:last-child {
        margin-bottom: 0;
      }

      .cell {
        width: 60px;
        height: 60px;
        background: rgba(238, 228, 218, 0.35);
        border-radius: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        font-weight: bold;
        color: #776e65;
        transition: all 0.15s ease;

        &.cell-new {
          animation: appear 0.2s ease;
        }

        &.cell-merged {
          animation: pop 0.2s ease;
        }

        @for $i from 1 through 11 {
          $value: pow(2, $i);

          &.cell-#{$value} {
            background: get-tile-color($value);
            color: get-tile-text-color($value);
          }
        }
      }
    }
  }

  .game-over {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;

    .game-over-content {
      background: white;
      padding: 30px;
      border-radius: 8px;
      text-align: center;

      h2 {
        margin-bottom: 15px;
        color: #776e65;
      }

      p {
        margin-bottom: 20px;
        color: #776e65;
      }
    }
  }
}

@function pow($base, $exponent) {
  $result: 1;

  @for $_ from 1 through $exponent {
    $result: $result * $base;
  }

  @return $result;
}

@function get-tile-color($value) {
  @if $value ==2 {
    @return #eee4da;
  }

  // 浅米色
  @if $value ==4 {
    @return #ede0c8;
  }

  // 浅棕色
  @if $value ==8 {
    @return #f2b179;
  }

  // 橙色
  @if $value ==16 {
    @return #f59563;
  }

  // 深橙色
  @if $value ==32 {
    @return #f67c5f;
  }

  // 橙红色
  @if $value ==64 {
    @return #f65e3b;
  }

  // 红色
  @if $value ==128 {
    @return #edcf72;
  }

  // 浅黄色
  @if $value ==256 {
    @return #edcc61;
  }

  // 黄色
  @if $value ==512 {
    @return #edc850;
  }

  // 深黄色
  @if $value ==1024 {
    @return #edc53f;
  }

  // 金黄色
  @if $value ==2048 {
    @return #edc22e;
  }

  // 明黄色
  @return #3c3a32; // 深灰色（用于更大的数值）
}


@function get-tile-text-color($value) {
  @if $value <=4 {
    @return #776e65; // 深灰色
  }

  @return white; // 白色
}

@keyframes appear {
  0% {
    transform: scale(0);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes pop {
  0% {
    transform: scale(0.8);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}

@media (max-width: 500px) {
  .game-container {
    padding: 10px;

    .game-board {
      padding: 10px;

      .row {
        gap: 10px;
        margin-bottom: 10px;

        .cell {
          width: calc((100vw - 80px) / 4);
          height: calc((100vw - 80px) / 4);
          font-size: 20px;

          @for $i from 1 through 11 {
            $value: pow(2, $i);

            &.cell-#{$value} {
              background: get-tile-color($value);
              color: get-tile-text-color($value);
            }
          }
        }
      }
    }
  }
}
</style>
