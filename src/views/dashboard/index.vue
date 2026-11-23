<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowRight,
  DataBoard,
  Money,
  ShoppingCart,
  TrendCharts,
  UserFilled
} from '@element-plus/icons-vue'
import { fetchStats } from '@/api/dashboard'
import type { DashboardStats } from '@/types'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const stats = ref<DashboardStats | null>(null)

onMounted(async () => {
  stats.value = await fetchStats()
})

const cards = computed(() => [
  { label: '用户总数', value: (stats.value?.users ?? 0).toLocaleString(), icon: UserFilled, color: '#2563eb' },
  { label: '订单数量', value: (stats.value?.orders ?? 0).toLocaleString(), icon: ShoppingCart, color: '#0f9d75' },
  { label: '本月销售额', value: `¥${(stats.value?.sales ?? 0).toLocaleString()}`, icon: Money, color: '#d97706' },
  { label: '环比增长', value: `+${stats.value?.growth ?? 0}%`, icon: TrendCharts, color: '#7c3aed' }
])
</script>

<template>
  <div>
    <div class="welcome">
      <div>
        <h2>你好，{{ userStore.name || '管理员' }}</h2>
        <p>这是后台管理系统的概览页面，左侧菜单可以切换到用户管理和图表分析。</p>
      </div>
      <el-icon class="welcome-icon"><DataBoard /></el-icon>
    </div>

    <div class="stat-grid">
      <div v-for="card in cards" :key="card.label" class="page-card stat-card">
        <div class="stat-icon" :style="{ background: `${card.color}18`, color: card.color }">
          <el-icon><component :is="card.icon" /></el-icon>
        </div>
        <div>
          <div class="stat-label">{{ card.label }}</div>
          <div class="stat-value">{{ card.value }}</div>
        </div>
      </div>
    </div>

    <div class="page-card quick">
      <h3>快捷入口</h3>
      <div class="quick-row">
        <el-button type="primary" plain @click="router.push('/system/user')">
          前往用户管理
          <el-icon class="quick-icon"><ArrowRight /></el-icon>
        </el-button>
        <el-button plain @click="router.push('/chart')">
          查看图表分析
          <el-icon class="quick-icon"><ArrowRight /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.welcome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border: 1px solid var(--app-border);
  border-radius: 10px;
  padding: 22px 24px;
  margin-bottom: 20px;
}

.welcome h2 {
  font-size: 18px;
  font-weight: 500;
  margin: 0 0 6px;
}

.welcome p {
  color: var(--app-muted);
  font-size: 13px;
  margin: 0;
}

.welcome-icon {
  font-size: 34px;
  color: #c7d2fe;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex: none;
}

.stat-label {
  color: var(--app-muted);
  font-size: 12px;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 22px;
  font-weight: 500;
}

.quick h3 {
  font-size: 15px;
  font-weight: 500;
  margin: 0 0 16px;
}

.quick-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.quick-icon {
  margin-left: 6px;
}
</style>
