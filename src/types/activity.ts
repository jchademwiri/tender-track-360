// Activity types for recent activity tracking

export type ActivityType =
  | 'member_joined'
  | 'member_left'
  | 'organization_created'
  | 'organization_updated'
  | 'role_changed'
  | 'invitation_sent'
  | 'invitation_accepted';

export interface RecentActivity {
  id: string;
  organizationId: string;
  organizationName: string;
  type: ActivityType;
  description: string;
  timestamp: Date;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  metadata?: Record<string, any>;
}

export interface ActivitySummary {
  organizationId: string;
  lastActivity: Date;
  activityCount: number;
  recentMembers: number;
}

export interface RecentActivityResponse {
  activities: RecentActivity[];
  hasMore: boolean;
  totalCount: number;
}
