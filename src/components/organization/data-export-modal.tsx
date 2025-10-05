'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Download,
  Database,
  FileText,
  Users,
  FileCheck,
  Building,
  Settings,
} from 'lucide-react';

interface DataExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
  organizationName: string;
  onExport: (format: 'json' | 'csv') => Promise<void>;
}

export function DataExportModal({
  isOpen,
  onClose,
  organizationId: _organizationId, // eslint-disable-line @typescript-eslint/no-unused-vars
  organizationName,
  onExport,
}: DataExportModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [format, setFormat] = useState<'json' | 'csv'>('json');
  const [includeData, setIncludeData] = useState({
    members: true,
    tenders: true,
    contracts: true,
    followUps: true,
    settings: true,
    auditLogs: false,
  });

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const handleExport = async () => {
    setIsLoading(true);
    try {
      await onExport(format);
      handleClose();
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const dataTypes = [
    {
      key: 'members',
      label: 'Members & Roles',
      icon: Users,
      description: 'User accounts and role assignments',
    },
    {
      key: 'tenders',
      label: 'Tenders',
      icon: FileCheck,
      description: 'All tender submissions and details',
    },
    {
      key: 'contracts',
      label: 'Contracts',
      icon: FileText,
      description: 'Contract information and documents',
    },
    {
      key: 'followUps',
      label: 'Follow-ups',
      icon: Building,
      description: 'Communication logs and follow-up records',
    },
    {
      key: 'settings',
      label: 'Organization Settings',
      icon: Settings,
      description: 'Configuration and preferences',
    },
    {
      key: 'auditLogs',
      label: 'Audit Logs',
      icon: Database,
      description: 'Security and activity logs (sensitive)',
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Organization Data
          </DialogTitle>
          <DialogDescription>
            Export data for <strong>{organizationName}</strong>. Choose the
            format and data types to include in your export.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Format */}
          <div className="space-y-3">
            <Label>Export Format</Label>
            <RadioGroup
              value={format}
              onValueChange={(value: string) =>
                setFormat(value as 'json' | 'csv')
              }
            >
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="json" id="json" className="mt-1" />
                <div className="space-y-1">
                  <Label htmlFor="json" className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    JSON Format
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Complete data structure with relationships. Best for backup
                    and migration.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="csv" id="csv" className="mt-1" />
                <div className="space-y-1">
                  <Label htmlFor="csv" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    CSV Format
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Spreadsheet-compatible format. Best for analysis and
                    reporting.
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Data Types */}
          <div className="space-y-3">
            <Label>Data to Include</Label>
            <div className="space-y-2">
              {dataTypes.map((dataType) => {
                const Icon = dataType.icon;
                return (
                  <div
                    key={dataType.key}
                    className="flex items-start space-x-3 p-3 border rounded-lg"
                  >
                    <Checkbox
                      id={dataType.key}
                      checked={
                        includeData[dataType.key as keyof typeof includeData]
                      }
                      onCheckedChange={(checked) =>
                        setIncludeData({
                          ...includeData,
                          [dataType.key]: checked as boolean,
                        })
                      }
                      className="mt-1"
                    />
                    <div className="space-y-1 flex-1">
                      <Label
                        htmlFor={dataType.key}
                        className="flex items-center gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        {dataType.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {dataType.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Export Info */}
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <p className="text-sm font-medium">Export Information:</p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Export will include data from all selected categories</p>
              <p>
                • Personal information will be included for compliance purposes
              </p>
              <p>• Export file will be available for download for 7 days</p>
              <p>• This operation is logged for security purposes</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={isLoading || !Object.values(includeData).some(Boolean)}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export Data
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
