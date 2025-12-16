import { GetUsageStats, GetHeatmapData, GetRecentLogs, GetLogDirectory } from '../../wailsjs/go/main/LogService'

export interface UsageRecord {
  timestamp: string
  model: string
  input_tokens: number
  output_tokens: number
  cache_read_tokens: number
  cache_write_tokens: number
  total_cost: number
  session_id: string
  project_path: string
}

export interface HourlyStat {
  hour: string
  requests: number
  input_tokens: number
  output_tokens: number
  cost: number
}

export interface ModelStats {
  requests: number
  tokens: number
  cost: number
}

export interface UsageStats {
  total_requests: number
  total_input_tokens: number
  total_output_tokens: number
  total_cache_read: number
  total_cache_write: number
  total_cost: number
  by_model: Record<string, ModelStats>
  series: HourlyStat[]
}

export interface HeatmapData {
  date: string
  requests: number
  tokens: number
  cost: number
}

export async function getUsageStats(days: number = 7): Promise<UsageStats> {
  return await GetUsageStats(days)
}

export async function getHeatmapData(days: number = 30): Promise<HeatmapData[]> {
  return await GetHeatmapData(days)
}

export async function getRecentLogs(limit: number = 50): Promise<UsageRecord[]> {
  return await GetRecentLogs(limit)
}

export async function getLogDirectory(): Promise<string> {
  return await GetLogDirectory()
}
