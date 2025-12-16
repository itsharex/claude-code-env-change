import { ref, onMounted, watch } from 'vue'

const isDark = ref(false)

export function useTheme() {
  const toggle = () => {
    isDark.value = !isDark.value
  }

  const setDark = (value: boolean) => {
    isDark.value = value
  }

  // 初始化时从 localStorage 读取
  onMounted(() => {
    const stored = localStorage.getItem('theme')
    if (stored) {
      isDark.value = stored === 'dark'
    } else {
      // 默认跟随系统偏好，如果没有则使用亮色
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      isDark.value = prefersDark
    }
  })

  // 监听变化并更新 DOM 和 localStorage
  watch(isDark, (value) => {
    if (value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', value ? 'dark' : 'light')
  }, { immediate: true })

  return {
    isDark,
    toggle,
    setDark
  }
}
