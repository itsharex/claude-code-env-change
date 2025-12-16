<template>
  <AppModal v-model="isOpen" size="xl" :close-on-overlay="false">
    <template #header>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <i class="fas fa-server text-primary"></i>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-lg font-semibold">MCP 服务器</h3>
            <McpStatusBadge />
          </div>
          <p class="text-xs text-muted-foreground">管理 Model Context Protocol 服务器</p>
        </div>
      </div>
    </template>

    <!-- Toolbar -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex gap-2">
        <button class="btn btn-primary btn-sm" @click="showAddModal">
          <i class="fas fa-plus mr-2"></i>
          添加
        </button>
        <button class="btn btn-outline btn-sm" @click="showJsonImport = true">
          <i class="fas fa-file-import mr-2"></i>
          JSON 导入
        </button>
      </div>
      <button
        class="btn btn-outline btn-sm"
        :disabled="mcpStore.isTestingAll || mcpStore.servers.length === 0"
        @click="testAll"
      >
        <i :class="['fas mr-2', mcpStore.isTestingAll ? 'fa-circle-notch fa-spin' : 'fa-bolt']"></i>
        {{ mcpStore.isTestingAll ? '检测中...' : '全部检测' }}
      </button>
    </div>

    <!-- Empty State -->
    <div
      v-if="mcpStore.servers.length === 0 && !mcpStore.isLoading"
      class="flex flex-col items-center justify-center py-12 text-muted-foreground"
    >
      <i class="fas fa-server text-4xl mb-4"></i>
      <p class="text-sm">暂无 MCP 服务器</p>
      <p class="text-xs">点击「添加」或「JSON 导入」添加服务器</p>
    </div>

    <!-- Loading -->
    <div v-else-if="mcpStore.isLoading" class="flex items-center justify-center py-12">
      <i class="fas fa-circle-notch fa-spin text-2xl text-muted-foreground"></i>
    </div>

    <!-- Server List -->
    <div v-else class="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
      <McpServerCard
        v-for="(server, index) in mcpStore.servers"
        :key="server.name"
        :server="server"
        :test-result="mcpStore.getTestResult(server.name)"
        :is-testing="testingIndex === index"
        @test="testSingle(index)"
        @edit="editServer(index)"
        @delete="deleteServer(index)"
      />
    </div>

    <!-- Edit Modal -->
    <McpEditModal
      v-model="showEditModal"
      :edit-server="editingServer"
      :edit-index="editingIndex"
      @saved="onServerSaved"
    />

    <!-- JSON Import Modal -->
    <McpJsonImport
      v-model="showJsonImport"
      @imported="onServersImported"
    />
  </AppModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { MCPServer } from '@/types'
import { useMcpStore } from '@/stores/mcpStore'
import { useConfirm } from '@/composables/useConfirm'
import { useToast } from '@/composables/useToast'
import AppModal from '@/components/common/AppModal.vue'
import McpStatusBadge from './McpStatusBadge.vue'
import McpServerCard from './McpServerCard.vue'
import McpEditModal from './McpEditModal.vue'
import McpJsonImport from './McpJsonImport.vue'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const mcpStore = useMcpStore()
const confirm = useConfirm()
const toast = useToast()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const showEditModal = ref(false)
const showJsonImport = ref(false)
const editingServer = ref<MCPServer | null>(null)
const editingIndex = ref<number | undefined>(undefined)
const testingIndex = ref<number | null>(null)

// 打开弹窗时加载服务器并自动检测
watch(isOpen, async (open) => {
  if (open) {
    await mcpStore.loadServers()
    // 自动检测所有服务器
    if (mcpStore.servers.length > 0) {
      mcpStore.testAllServers()
    }
  } else {
    // 关闭时清除测试结果
    mcpStore.clearTestResults()
  }
})

function showAddModal() {
  editingServer.value = null
  editingIndex.value = undefined
  showEditModal.value = true
}

function editServer(index: number) {
  editingServer.value = mcpStore.servers[index]
  editingIndex.value = index
  showEditModal.value = true
}

async function deleteServer(index: number) {
  const server = mcpStore.servers[index]
  const confirmed = await confirm.show(
    '删除 MCP 服务器',
    `确定要删除 "${server.name}" 吗？`,
    'danger'
  )
  if (!confirmed) return

  try {
    await mcpStore.deleteServer(index)
    toast.success('MCP 服务器已删除')
  } catch (e: any) {
    toast.error('删除失败: ' + e.message)
  }
}

async function testSingle(index: number) {
  testingIndex.value = index
  try {
    const server = mcpStore.servers[index]
    const result = await mcpStore.testServer(server)
    if (result.success) {
      toast.success(`${server.name}: ${result.message} (${result.latency}ms)`)
    } else {
      toast.error(`${server.name}: ${result.message}`)
    }
  } catch (e: any) {
    toast.error('测试失败: ' + e.message)
  } finally {
    testingIndex.value = null
  }
}

function testAll() {
  mcpStore.testAllServers()
}

function onServerSaved() {
  // 保存后重新加载
  mcpStore.loadServers()
}

function onServersImported() {
  // 导入后重新加载并检测
  mcpStore.loadServers().then(() => {
    mcpStore.testAllServers()
  })
}
</script>

<style scoped>
.btn-sm {
  @apply h-8 px-3 text-xs;
}
</style>
