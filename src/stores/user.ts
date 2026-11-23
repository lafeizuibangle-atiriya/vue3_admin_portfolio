import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getProfile, login as loginApi } from '@/api/auth'
import { getToken, removeToken, setToken } from '@/utils/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(getToken())
  const name = ref('')
  const role = ref('')

  async function login(username: string, password: string): Promise<void> {
    const result = await loginApi({ username, password })
    token.value = result.token
    name.value = result.userInfo.name
    role.value = result.userInfo.role
    setToken(result.token)
  }

  async function loadProfile(): Promise<void> {
    if (!token.value) return
    const profile = await getProfile()
    name.value = profile.name
    role.value = profile.role
  }

  function logout(): void {
    token.value = null
    name.value = ''
    role.value = ''
    removeToken()
  }

  return { token, name, role, login, loadProfile, logout }
})
