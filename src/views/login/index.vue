<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { ArrowRight, Lock, User } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const formRef = ref<FormInstance>()
const loading = ref(false)
const form = reactive({ username: 'admin', password: '123456' })

const rules: FormRules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

async function handleLogin(): Promise<void> {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    return
  }

  loading.value = true
  try {
    await userStore.login(form.username, form.password)
    ElMessage.success('登录成功')
    const redirect = route.query.redirect as string | undefined
    await router.push(redirect || '/')
  } catch {
    loading.value = false
  }
}

function fillDemo(): void {
  form.username = 'admin'
  form.password = '123456'
}
</script>

<template>
  <div class="login-page">
    <div class="login-panel">
      <div class="brand">
        <div class="brand-mark">V3</div>
        <h1>Vue3 Admin</h1>
        <p>Vue 3 · TypeScript · Element Plus · Pinia</p>
        <ul>
          <li>路由守卫与登录鉴权</li>
          <li>表格增删改查与分页检索</li>
          <li>ECharts 数据可视化</li>
        </ul>
      </div>
      <div class="form-side">
        <h2>账号登录</h2>
        <p class="subtitle">欢迎回来，请输入账号和密码</p>
        <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keyup.enter="handleLogin">
          <el-form-item label="账号" prop="username">
            <el-input v-model="form.username" :prefix-icon="User" placeholder="请输入账号" size="large" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="form.password"
              :prefix-icon="Lock"
              type="password"
              show-password
              placeholder="请输入密码"
              size="large"
            />
          </el-form-item>
          <el-button type="primary" size="large" class="submit" :loading="loading" @click="handleLogin">
            登录
            <el-icon class="btn-icon"><ArrowRight /></el-icon>
          </el-button>
        </el-form>
        <div class="demo-tip">
          演示账号 <strong>admin / 123456</strong>
          <el-button link type="primary" @click="fillDemo">一键填入</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #eef2f8;
}

.login-panel {
  width: 880px;
  max-width: 100%;
  min-height: 480px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: #fff;
  border: 1px solid var(--app-border);
  border-radius: 14px;
  overflow: hidden;
}

.brand {
  padding: 56px 44px;
  background: #f8faff;
  border-right: 1px solid var(--app-border);
}

.brand-mark {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: var(--app-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 15px;
  margin-bottom: 24px;
}

.brand h1 {
  font-size: 24px;
  font-weight: 500;
  margin: 0 0 8px;
}

.brand p {
  color: var(--app-muted);
  font-size: 13px;
  margin: 0 0 32px;
}

.brand ul {
  margin: 0;
  padding-left: 18px;
  color: var(--app-muted);
  font-size: 13px;
  line-height: 2;
}

.form-side {
  padding: 64px 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-side h2 {
  font-size: 21px;
  font-weight: 500;
  margin: 0 0 6px;
}

.subtitle {
  color: var(--app-muted);
  font-size: 13px;
  margin: 0 0 28px;
}

.submit {
  width: 100%;
  margin-top: 6px;
}

.btn-icon {
  margin-left: 6px;
}

.demo-tip {
  margin-top: 22px;
  font-size: 12px;
  color: var(--app-muted);
  text-align: center;
}

@media (max-width: 760px) {
  .login-panel {
    grid-template-columns: 1fr;
  }

  .brand {
    display: none;
  }
}
</style>
