<template>
  <AppModal v-model="isOpen" title="导入 MCP 服务器" size="lg">
    <div class="space-y-4">
      <p class="text-sm text-muted-foreground">
        粘贴 Claude Desktop 格式的 MCP 配置 JSON，支持以下格式：
      </p>

      <div class="text-xs text-muted-foreground bg-muted p-3 rounded-lg font-mono">
        <p>• mcpServers 对象: {"mcpServers": {...}}</p>
        <p>• 服务器列表对象: {"server1": {...}, "server2": {...}}</p>
        <p>• 单个服务器: {"command": "npx", "args": [...]}</p>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1.5">JSON 内容</label>
        <textarea
          v-model="jsonInput"
          class="input h-64 font-mono text-xs"
          placeholder='{"mcpServers": {"filesystem": {"command": "npx", "args": ["-y", "@modelcontextprotocol/server-filesystem"]}}}'
        ></textarea>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <button type="button" class="btn btn-secondary" @click="isOpen = false">
          取消
        </button>
        <button
          type="button"
          class="btn btn-primary"
          :disabled="isImporting"
          @click="handleImport"
        >
          <i v-if="isImporting" class="fas fa-circle-notch fa-spin mr-2"></i>
          导入
        </button>
      </div>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useMcpStore } from '@/stores/mcpStore'
import { useToast } from '@/composables/useToast'
import AppModal from '@/components/common/AppModal.vue'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  imported: []
}>()

const mcpStore = useMcpStore()
const toast = useToast()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const jsonInput = ref('')
const isImporting = ref(false)

// Reset when modal closes
watch(isOpen, (open) => {
  if (!open) {
    jsonInput.value = ''
  }
})

async function handleImport() {
  if (!jsonInput.value.trim()) {
    toast.error('请输入 JSON 内容')
    return
  }

  isImporting.value = true
  try {
    const servers = await mcpStore.importFromJSON(jsonInput.value)
    if (!servers || servers.length === 0) {
      toast.error('没有找到有效的服务器配置')
      return
    }

    await mcpStore.addServers(servers)
    toast.success(`成功导入 ${servers.length} 个 MCP 服务器`)
    isOpen.value = false
    emit('imported')
  } catch (e: any) {
    toast.error('导入失败: ' + e.message)
  } finally {
    isImporting.value = false
  }
}
</script>

<style scoped>
textarea.input {
  resize: vertical;
}
</style>
