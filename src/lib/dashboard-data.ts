import { getTenderStats, getRecentActivity, getUpcomingDeadlines } from '@/server/tenders'
import { getClientStats } from '@/server/clients'
import { getProjectStats } from '@/server/projects'

export interface DashboardData {
  tenderStats: Awaited<ReturnType<typeof getTenderStats>>['stats']
  clientStats: Awaited<ReturnType<typeof getClientStats>>['stats']
  projectStats: Awaited<ReturnType<typeof getProjectStats>>['stats']
  recentActivity: Awaited<ReturnType<typeof getRecentActivity>>['activity']
  upcomingDeadlines: Awaited<ReturnType<typeof getUpcomingDeadlines>>['deadlines']
}

export async function getDashboardData(organizationId: string): Promise<DashboardData> {
  try {
    const [tenderStatsResult, clientStatsResult, projectStatsResult, recentActivityResult, upcomingDeadlinesResult] = await Promise.all([
      getTenderStats(organizationId),
      getClientStats(organizationId),
      getProjectStats(organizationId),
      getRecentActivity(organizationId, 10),
      getUpcomingDeadlines(organizationId, 10)
    ])

    return {
      tenderStats: tenderStatsResult.stats,
      clientStats: clientStatsResult.stats,
      projectStats: projectStatsResult.stats,
      recentActivity: recentActivityResult.activity,
      upcomingDeadlines: upcomingDeadlinesResult.deadlines,
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    throw new Error('Failed to fetch dashboard data')
  }
}

// Helper functions for formatting dashboard data
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

// Chart data formatters
export function getTenderStatusChartData(tenderStats: DashboardData['tenderStats']) {
  return [
    { name: 'Draft', value: tenderStats.statusCounts.draft, fill: '#8884d8' },
    { name: 'Submitted', value: tenderStats.statusCounts.submitted, fill: '#82ca9d' },
    { name: 'Won', value: tenderStats.statusCounts.won, fill: '#ffc658' },
    { name: 'Lost', value: tenderStats.statusCounts.lost, fill: '#ff7c7c' },
    { name: 'Pending', value: tenderStats.statusCounts.pending, fill: '#8dd1e1' },
  ].filter(item => item.value > 0)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getMonthlyTrendsData(tenderStats: DashboardData['tenderStats']) {
  // This would typically fetch historical data from the database
  // For now, we'll create sample data based on current stats
  const currentMonth = new Date()
  const months = []

  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - i, 1)
    months.push({
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      tenders: Math.floor(Math.random() * 20) + 5, // Sample data
      value: Math.floor(Math.random() * 100000) + 20000, // Sample data
    })
  }

  return months
}