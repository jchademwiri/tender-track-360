'use client';

import { useState, useTransition, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Shield,
  Monitor,
  Smartphone,
  MapPin,
  Clock,
  LogOut,
  Loader2,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import {
  SessionInfo,
  getUserSessions,
  revokeSession,
  revokeAllOtherSessions,
} from '../actions';

interface SecuritySettingsProps {
  initialSessions?: SessionInfo[];
}

export function SecuritySettings({
  initialSessions = [],
}: SecuritySettingsProps) {
  const [sessions, setSessions] = useState<SessionInfo[]>(initialSessions);
  const [isPending, startTransition] = useTransition();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showRevokeAllDialog, setShowRevokeAllDialog] = useState(false);
  const [showRevokeDialog, setShowRevokeDialog] = useState<string | null>(null);

  // Load sessions on component mount if not provided
  useEffect(() => {
    if (initialSessions.length === 0) {
      loadSessions();
    }
  }, [initialSessions.length]);

  const loadSessions = async () => {
    setIsRefreshing(true);
    startTransition(async () => {
      try {
        const result = await getUserSessions();
        if (result.success && result.data) {
          setSessions(result.data as SessionInfo[]);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error('Failed to load sessions');
        console.error('Load sessions error:', error);
      } finally {
        setIsRefreshing(false);
      }
    });
  };

  const handleRevokeSession = async (sessionId: string) => {
    startTransition(async () => {
      try {
        const result = await revokeSession(sessionId);
        if (result.success) {
          toast.success(result.message);
          // Remove the revoked session from the list
          setSessions((prev) =>
            prev.filter((session) => session.id !== sessionId)
          );
          setShowRevokeDialog(null);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error('Failed to revoke session');
        console.error('Revoke session error:', error);
      }
    });
  };

  const handleRevokeAllOtherSessions = async () => {
    startTransition(async () => {
      try {
        const result = await revokeAllOtherSessions();
        if (result.success) {
          toast.success(result.message);
          // Keep only the current session
          setSessions((prev) => prev.filter((session) => session.current));
          setShowRevokeAllDialog(false);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error('Failed to sign out other sessions');
        console.error('Revoke all sessions error:', error);
      }
    });
  };

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;

    return date.toLocaleDateString();
  };

  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes('mobile')) {
      return <Smartphone className="h-4 w-4" />;
    }
    return <Monitor className="h-4 w-4" />;
  };

  const otherSessions = sessions.filter((session) => !session.current);
  const currentSession = sessions.find((session) => session.current);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security & Sessions</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadSessions}
              disabled={isPending || isRefreshing}
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
            </Button>
            {otherSessions.length > 0 && (
              <Dialog
                open={showRevokeAllDialog}
                onOpenChange={setShowRevokeAllDialog}
              >
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm" disabled={isPending}>
                    <LogOut className="h-4 w-4" />
                    Sign Out All Other Devices
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      <span>Sign Out All Other Devices?</span>
                    </DialogTitle>
                    <DialogDescription>
                      This will sign you out of all other devices and sessions.
                      You will remain signed in on this device. Other devices
                      will need to sign in again.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      disabled={isPending}
                      onClick={() => setShowRevokeAllDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleRevokeAllOtherSessions}
                      disabled={isPending}
                      variant="destructive"
                    >
                      {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <LogOut className="h-4 w-4 mr-2" />
                      )}
                      Sign Out All Other Devices
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Session */}
        {currentSession && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Current Session
            </h3>
            <div className="border rounded-lg p-4 bg-muted/50">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getDeviceIcon(currentSession.device)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium">
                        {currentSession.device}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        Current
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{currentSession.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {formatLastActive(currentSession.lastActive)}
                        </span>
                      </div>
                    </div>
                    {currentSession.ipAddress && (
                      <p className="text-xs text-muted-foreground mt-1">
                        IP: {currentSession.ipAddress}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Sessions */}
        {otherSessions.length > 0 ? (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Other Sessions ({otherSessions.length})
            </h3>
            <div className="space-y-3">
              {otherSessions.map((session) => (
                <div key={session.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getDeviceIcon(session.device)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{session.device}</p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{session.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatLastActive(session.lastActive)}</span>
                          </div>
                        </div>
                        {session.ipAddress && (
                          <p className="text-xs text-muted-foreground mt-1">
                            IP: {session.ipAddress}
                          </p>
                        )}
                      </div>
                    </div>
                    <Dialog
                      open={showRevokeDialog === session.id}
                      onOpenChange={(open) =>
                        setShowRevokeDialog(open ? session.id : null)
                      }
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isPending}
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Sign Out Device?</DialogTitle>
                          <DialogDescription>
                            This will sign out the session on {session.device}.
                            The device will need to sign in again to access your
                            account.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            disabled={isPending}
                            onClick={() => setShowRevokeDialog(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => handleRevokeSession(session.id)}
                            disabled={isPending}
                            variant="destructive"
                          >
                            {isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <LogOut className="h-4 w-4 mr-2" />
                            )}
                            Sign Out
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Other Sessions
            </h3>
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No other active sessions</p>
              <p className="text-xs mt-1">
                You are only signed in on this device
              </p>
            </div>
          </div>
        )}

        {/* Security Information */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Security Information
          </h3>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Sessions automatically expire after a period of inactivity</p>
            <p>
              • You can sign out of individual sessions or all other sessions at
              once
            </p>
            <p>
              • If you notice any suspicious activity, change your password
              immediately
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
