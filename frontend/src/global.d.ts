import type { EnvConfig, Config, MCPServer, MCPTestResult } from '@/types'

declare global {
  interface Window {
    go: {
      main: {
        App: {
          GetConfig(): Promise<Config>
          AddEnv(config: EnvConfig): Promise<void>
          UpdateEnv(oldName: string, config: EnvConfig): Promise<void>
          DeleteEnv(name: string): Promise<void>
          SwitchToEnv(name: string): Promise<void>
          ApplyCurrentEnv(): Promise<string>
          ReorderEnvs(names: string[]): Promise<void>
          RefreshConfig(): Promise<void>
          TestLatency(url: string): Promise<number>
          ClearAllEnv(): Promise<void>
          ClearClaudeSettings(): Promise<void>
          ClearCodexSettings(): Promise<void>
          ClearGeminiSettings(): Promise<void>
          GetClaudeSettings(): Promise<Record<string, string>>
          GetCodexSettings(): Promise<Record<string, string>>
          GetGeminiSettings(): Promise<Record<string, string>>
          ExportConfig(path: string): Promise<void>
          ImportConfig(path: string): Promise<void>
        }
        MCPService: {
          ListServers(): Promise<MCPServer[]>
          SaveServers(servers: MCPServer[]): Promise<void>
          TestServer(server: MCPServer): Promise<MCPTestResult>
          ImportFromJSON(jsonStr: string): Promise<MCPServer[]>
          AddServers(servers: MCPServer[]): Promise<void>
        }
      }
    }
    runtime: {
      WindowMinimise(): void
      WindowToggleMaximise(): void
      Quit(): void
    }
  }
}

declare module 'sortablejs' {
  interface SortableEvent {
    oldIndex?: number
    newIndex?: number
  }

  interface SortableOptions {
    animation?: number
    ghostClass?: string
    dragClass?: string
    onEnd?: (evt: SortableEvent) => void
  }

  class Sortable {
    constructor(el: HTMLElement, options?: SortableOptions)
    static create(el: HTMLElement, options?: SortableOptions): Sortable
    destroy(): void
  }

  export default Sortable
}

export {}
