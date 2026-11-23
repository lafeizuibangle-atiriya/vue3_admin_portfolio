<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowDown,
  DataBoard,
  Fold,
  Expand,
  SwitchButton,
  TrendCharts,
  UserFilled,
  User
} from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const activeMenu = computed(() => route.path)
const pageTitle = computed(() => (route.meta.title as string | undefined) || '后台管理')

onMounted(() => {
  void userStore.loadProfile().catch(() => undefined)
})

async function handleCommand(command: string): Promise<void> {
  if (command !== 'logout') return
  try {
    await ElMessageBox.confirm('确认退出当前账号？', '提示', {
      type: 'warning',
      confirmButtonText: '退出',
      cancelButtonText: '取消'
    })
    userStore.logout()
    await router.push('/login')
    ElMessage.success('已退出登录')
  } catch {
    // 用户取消时不处理
  }
}
</script>

<template>
  <el-container class="admin-layout">
    <el-aside :width="appStore.collapsed ? '64px' : '210px'" class="aside">
      <div class="logo">
        <div class="logo-mark">V3</div>
        <span v-show="!appStore.collapsed" class="logo-text">Vue3 Admin</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="appStore.collapsed"
        :collapse-transition="false"
        router
        class="menu"
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataBoard /></el-icon>
          <template #title>数据概览</template>
        </el-menu-item>
        <el-sub-menu index="/system">
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="/system/user">
            <el-icon><User /></el-icon>
            <template #title>用户管理</template>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/chart">
          <el-icon><TrendCharts /></el-icon>
          <template #title>图表分析</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-icon class="fold-btn" @click="appStore.toggle">
            <Fold v-if="!appStore.collapsed" />
            <Expand v-else />
          </el-icon>
          <span class="page-title">{{ pageTitle }}</span>
        </div>
        <el-dropdown trigger="click" @command="handleCommand">
          <div class="user-info">
            <el-avatar :size="30" class="avatar">{{ (userStore.name || '管').charAt(0) }}</el-avatar>
            <span class="user-name">{{ userStore.name || '未登录' }}</span>
            <el-icon><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item disabled>{{ userStore.role || '管理员' }}</el-dropdown-item>
              <el-dropdown-item command="logout" divided>
                <el-icon><SwitchButton /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main class="main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.admin-layout {
  height: 100%;
}

.aside {
  background: #fff;
  border-right: 1px solid var(--app-border);
  transition: width 0.2s ease;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 18px;
  border-bottom: 1px solid var(--app-border);
  overflow: hidden;
}

.logo-mark {
  flex: none;
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: var(--app-primary);
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
}

.menu {
  border-right: none;
}

.header {
  height: 60px;
  background: #fff;
  border-bottom: 1px solid var(--app-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.fold-btn {
  font-size: 18px;
  cursor: pointer;
  color: var(--app-muted);
}

.page-title {
  font-size: 15px;
  font-weight: 500;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  outline: none;
}

.avatar {
  background: var(--app-primary);
}

.user-name {
  font-size: 13px;
}

.main {
  background: var(--app-bg);
  padding: 20px;
  overflow-y: auto;
}
</style>
