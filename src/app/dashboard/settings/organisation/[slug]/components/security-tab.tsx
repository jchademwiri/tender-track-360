'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import {
  Shield,
  AlertTriangle,
  Activity,
  Clock,
  User,
  Monitor,
  Smartphone,
  Globe,
  Trash2,
  Download,
  Key,
  Lock,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Role } from '@/db/schema';

interface SecurityTabProps {
  organization: {
    id: string;
    name: string;
  };
  userRole: Role;
  currentUser: {
    id: string;
    name: string;
    email: string;
  };
}

// Mock security data - in real implementation, this would come from server
interface SecurityEvent {
  id: string;
  type:
    | 'login'
    | 'role_change'
    | 'member_added'
    | 'member_removed'
    | 'settings_changed';
  description: string;
  user: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

interface ActiveSession {
  id: string;
  userId: string;
  userName: string;
  device: string;
  location: string;
  ipAddress: string;
  lastActive: Date;
  current: boolean;
}

// Helper function to check if user can access security settings
function canAccessSecurity(role: Role): boolean {
  return ['owner', 'admin'].includes(role);
}

// Helper function to check if user can perform dangerous operations
function canPerformDangerousOperations(role: Role): boolean {
  return role === 'owner';
}

// Helper function to get event icon
function getEventIcon(type: string) {
  switch (type) {
    case 'login':
      return User;
    case 'role_change':
      return Key;
    case 'member_added':
      return User;
    case 'member_removed':
      return User;
    case 'settings_changed':
      return Shield;
    default:
      return Activity;
  }
}

// Helper function to get device icon
function getDeviceIcon(device: string) {
  if (
    device.toLowerCase().includes('mobile') ||
    device.toLowerCase().includes('phone')
  ) {
    return Smartphone;
  }
  return Monitor;
}

export function SecurityTab({
  organization,
  userRole,
  currentUser,
}: SecurityTabProps) {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [require2FA, setRequire2FA] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const canAccess = canAccessSecurity(userRole);
  const canDangerous = canPerformDangerousOperations(userRole);

  // Mock data - in real implementation, fetch from server
  React.useEffect(() => {
    if (!canAccess) return;

    const mockEvents: SecurityEvent[] = [
      {
        id: '1',
        type: 'login',
        description: 'User logged in',
        user: currentUser.name,
        timestamp: new Date('2024-12-19T10:30:00'),
        ipAddress: '192.168.1.100',
        userAgent: 'Chrome 120.0.0.0',
      },
      {
        id: '2',
        type: 'role_change',
        description: 'User role changed from Member to Admin',
        user: 'Jane Smith',
        timestamp: new Date('2024-12-18T15:45:00'),
        ipAddress: '192.168.1.101',
      },
      {
        id: '3',
        type: 'member_added',
        description: 'New member added to organization',
        user: 'Bob Johnson',
        timestamp: new Date('2024-12-17T09:15:00'),
        ipAddress: '192.168.1.102',
      },
    ];

    const mockSessions: ActiveSession[] = [
      {
        id: '1',
        userId: currentUser.id,
        userName: currentUser.name,
        device: 'Chrome on Windows',
        location: 'New York, US',
        ipAddress: '192.168.1.100',
        lastActive: new Date(),
        current: true,
      },
      {
        id: '2',
        userId: '2',
        userName: 'Jane Smith',
        device: 'Safari on iPhone',
        location: 'Los Angeles, US',
        ipAddress: '192.168.1.101',
        lastActive: new Date('2024-12-19T09:30:00'),
        current: false,
      },
    ];

    setTimeout(() => {
      setSecurityEvents(mockEvents);
      setActiveSessions(mockSessions);
      setIsLoading(false);
    }, 500);
  }, [canAccess, currentUser]);

  const handleExportSecurityLog = async () => {
    try {
      // TODO: Implement export security log functionality
      console.log('Exporting security log for organization:', organization.id);
      toast.success('Security log exported successfully');
    } catch (error) {
      console.error('Error exporting security log:', error);
      toast.error('Failed to export security log');
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    try {
      // TODO: Implement terminate session functionality
      console.log('Terminating session:', sessionId);
      setActiveSessions((prev) =>
        prev.filter((session) => session.id !== sessionId)
      );
      toast.success('Session terminated successfully');
    } catch (error) {
      console.error('Error terminating session:', error);
      toast.error('Failed to terminate session');
    }
  };

  const handleDeleteOrganization = async () => {
    try {
      // TODO: Implement delete organization functionality
      console.log('Deleting organization:', organization.id);
      toast.success('Organization deletion initiated');
      // In real implementation, this would redirect to a confirmation page
    } catch (error) {
      console.error('Error deleting organization:', error);
      toast.error('Failed to delete organization');
    }
  };

  if (!canAccess) {
    return (
      <div className="text-center py-12">
        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
        <p className="text-muted-foreground">
          You need admin or owner permissions to access security settings.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Overview
          </CardTitle>
          <CardDescription>
            Monitor and configure security settings for your organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="font-medium text-green-900 dark:text-green-100">
                    Security Status
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    All systems secure
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Good
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    Active Sessions
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {activeSessions.length} active sessions
                  </p>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {activeSessions.length}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Configure security policies for your organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <div className="font-medium">
                Require Two-Factor Authentication
              </div>
              <div className="text-sm text-muted-foreground">
                Require all members to enable 2FA for enhanced security
              </div>
            </div>
            <Switch
              checked={require2FA}
              onCheckedChange={setRequire2FA}
              disabled={!canDangerous}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <div className="font-medium">Automatic Session Timeout</div>
              <div className="text-sm text-muted-foreground">
                Automatically log out inactive users after 30 minutes
              </div>
            </div>
            <Switch
              checked={sessionTimeout}
              onCheckedChange={setSessionTimeout}
            />
          </div>

          {!canDangerous && (
            <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
              Some security settings require owner permissions to modify.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Active Sessions
              </CardTitle>
              <CardDescription>
                Monitor and manage active user sessions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeSessions.map((session) => {
              const DeviceIcon = getDeviceIcon(session.device);

              return (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <DeviceIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{session.userName}</p>
                        {session.current && (
                          <Badge variant="secondary" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {session.device} • {session.location}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Last active:{' '}
                        {new Intl.DateTimeFormat('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                        }).format(session.lastActive)}
                      </p>
                    </div>
                  </div>

                  {!session.current && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleTerminateSession(session.id)}
                    >
                      Terminate
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Security Audit Log */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Security Audit Log
              </CardTitle>
              <CardDescription>
                Recent security events and activities
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportSecurityLog}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Log
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityEvents.map((event) => {
              const EventIcon = getEventIcon(event.type);

              return (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-4 border rounded-lg"
                >
                  <EventIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">{event.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span>User: {event.user}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Intl.DateTimeFormat('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                        }).format(event.timestamp)}
                      </span>
                      {event.ipAddress && (
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {event.ipAddress}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone - Owner Only */}
      {canDangerous && (
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible and destructive actions for this organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-red-600 dark:text-red-400">
                      Delete Organization
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete this organization and all its data.
                      This action cannot be undone.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Organization
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Organization Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={async () => {
          await handleDeleteOrganization();
          setShowDeleteDialog(false);
        }}
        title="Delete Organization"
        description={`Are you absolutely sure you want to delete "${organization.name}"? This will permanently delete the organization and all its data, including all members, settings, and associated documents. This action cannot be undone.`}
        confirmText="Delete Organization"
        variant="destructive"
        icon="delete"
      />
    </div>
  );
}
