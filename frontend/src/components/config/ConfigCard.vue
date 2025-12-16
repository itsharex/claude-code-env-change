<template>
  <div
    :class="['config-item group', { active: isActive }]"
    @click="$emit('click')"
  >
    <!-- Active Badge -->
    <div v-if="isActive" class="absolute -top-1 -right-1 z-10">
      <div class="bg-foreground text-background text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
        <i class="fas fa-check text-[8px]"></i>
        Active
      </div>
    </div>

    <!-- Header: Icon + Name + Provider Badge -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3 min-w-0 flex-1">
        <div class="w-10 h-10 rounded flex items-center justify-center flex-shrink-0 text-xl bg-background">
          {{ config.icon || '📦' }}
        </div>
        <div class="min-w-0 flex-1">
          <h4 class="font-bold text-[15px] truncate leading-tight mb-1 font-mono tracking-tight" :title="config.name">{{ config.name }}</h4>
          <span class="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-foreground bg-transparent border border-border">
            {{ providerLabel }}
          </span>
        </div>
      </div>
    </div>

    <!-- Description -->
    <p v-if="config.description" class="text-xs text-muted-foreground mb-4 line-clamp-2 h-8 leading-relaxed font-mono" :title="config.description">
      {{ config.description }}
    </p>
    <div v-else class="h-8 mb-4"></div>

    <!-- Details Grid -->
    <div class="grid grid-cols-2 gap-3 mb-4">
      <div class="p-2 rounded bg-muted/50">
        <div class="text-[9px] text-muted-foreground uppercase mb-1 font-bold tracking-widest">Model</div>
        <div class="text-xs font-mono truncate" :title="modelValue">{{ modelValue || '-' }}</div>
      </div>
      <div class="p-2 rounded bg-muted/50">
        <div class="text-[9px] text-muted-foreground uppercase mb-1 font-bold tracking-widest">Base URL</div>
        <div class="text-xs font-mono truncate" :title="baseUrlValue">{{ baseUrlValue || '-' }}</div>
      </div>
    </div>

    <!-- Action Bar -->
    <div class="flex items-center gap-2 pt-3 border-t border-dashed border-border mt-auto">
       <button
        class="flex-1 h-8 rounded border border-border hover:bg-foreground hover:text-background transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
        @click.stop="$emit('apply')"
      >
        <i class="fas fa-play text-[10px]"></i> Apply
      </button>

      <div class="flex gap-1">
        <button
          class="w-8 h-8 rounded border border-transparent hover:border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
          title="Test Latency"
          @click.stop="$emit('testLatency')"
        >
          <i class="fas fa-tachometer-alt text-xs"></i>
        </button>
        <button
          class="w-8 h-8 rounded border border-transparent hover:border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
          title="Duplicate"
          @click.stop="$emit('duplicate')"
        >
          <i class="fas fa-copy text-xs"></i>
        </button>
        <button
          class="w-8 h-8 rounded border border-transparent hover:border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
          title="Edit"
          @click.stop="$emit('edit')"
        >
          <i class="fas fa-pen text-xs"></i>
        </button>
         <button
          class="w-8 h-8 rounded border border-transparent hover:border-destructive hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center text-muted-foreground transition-all"
          title="Delete"
          @click.stop="$emit('delete')"
        >
          <i class="fas fa-trash text-xs"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { EnvConfig } from '@/types'

interface Props {
  config: EnvConfig
  isActive?: boolean
}

const props = defineProps<Props>()

defineEmits<{
  click: []
  apply: []
  duplicate: []
  edit: []
  delete: []
  testLatency: []
}>()

const providerLabel = computed(() => {
  const labels: Record<string, string> = {
    claude: 'Claude',
    codex: 'Codex',
    gemini: 'Gemini'
  }
  return labels[props.config.provider] || props.config.provider
})

const modelValue = computed(() => {
  const provider = props.config.provider || 'claude'
  const vars = props.config.variables || {}

  if (provider === 'claude') {
    return vars.ANTHROPIC_MODEL || ''
  } else if (provider === 'codex') {
    return vars.model || ''
  } else if (provider === 'gemini') {
    return vars.GEMINI_MODEL || ''
  }
  return ''
})

const baseUrlValue = computed(() => {
  const provider = props.config.provider || 'claude'
  const vars = props.config.variables || {}

  if (provider === 'claude') {
    return vars.ANTHROPIC_BASE_URL || ''
  } else if (provider === 'codex') {
    return vars.base_url || ''
  } else if (provider === 'gemini') {
    return vars.GOOGLE_GEMINI_BASE_URL || ''
  }
  return ''
})
</script>
