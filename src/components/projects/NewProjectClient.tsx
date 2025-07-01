'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertTriangle, Link, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ProjectForm } from './project-form';

interface Tender {
  id: string;
  title: string;
  referenceNumber: string;
  description?: string;
  clientId: string;
  categoryId?: string;
  awardDate?: string;
  estimatedValue?: string;
  department?: string;
  notes?: string;
  status: string;
}

interface Client {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface NewProjectClientProps {
  clients: Client[];
  categories: Category[];
  tenders: Tender[];
}

export default function NewProjectClient({
  clients,
  categories,
  tenders,
}: NewProjectClientProps) {
  const router = useRouter();
  const [selectedTenderId, setSelectedTenderId] = useState<string>('');
  const [autofill, setAutofill] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Filter tenders to only show those that can be converted to projects
  const availableTenders = tenders.filter(
    (tender) => tender.status === 'closed' || tender.status === 'evaluated'
  );

  const selectedTender = selectedTenderId
    ? tenders.find((t) => t.id === selectedTenderId)
    : null;

  const handleTenderChange = (tenderId: string) => {
    setSelectedTenderId(tenderId);

    if (tenderId) {
      const tender = tenders.find((t) => t.id === tenderId);
      if (tender) {
        // Create autofill data from tender
        setAutofill({
          referenceNumber: `PRJ-${
            tender.referenceNumber?.replace('TDR-', '') ||
            new Date().getFullYear()
          }-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
          title: tender.title,
          description: tender.description || '',
          clientId: tender.clientId,
          categoryId: tender.categoryId || '',
          status: 'active',
          awardDate: tender.awardDate || undefined,
          estimatedValue: tender.estimatedValue || '',
          department: tender.department || '',
          notes: tender.notes
            ? `Converted from tender: ${tender.referenceNumber}\n\n${tender.notes}`
            : `Converted from tender: ${tender.referenceNumber}`,
        });
      }
    } else {
      setAutofill(null);
    }
  };

  const handleSubmit = async (data: any) => {
    setLoading(true);

    // Clean numeric fields
    const cleanData = {
      ...data,
      estimatedValue:
        data.estimatedValue === '' || data.estimatedValue == null
          ? null
          : Number(data.estimatedValue),
      // Add similar logic for other numeric fields if needed
    };

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...cleanData,
          tenderId: selectedTenderId || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create project');
      }

      const result = await response.json();

      toast.success('Project created successfully!');
      router.push('/dashboard/admin/projects');
      router.refresh();
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to create project'
      );
    } finally {
      setLoading(false);
    }
  };

  const clearSelection = () => {
    setSelectedTenderId('');
    setAutofill(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create New Project</h1>
          <p className="text-muted-foreground mt-1">
            Create a new project from scratch or convert an existing tender
          </p>
        </div>
      </div>

      {/* Tender Selection Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Link to Existing Tender
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Optionally create this project from an existing tender to autofill
            fields
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Select
                value={selectedTenderId}
                onValueChange={handleTenderChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a tender to convert (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {availableTenders.length === 0 ? (
                    <SelectItem disabled value="no-tenders">
                      No available tenders
                    </SelectItem>
                  ) : (
                    availableTenders.map((tender) => (
                      <SelectItem key={tender.id} value={tender.id}>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>{tender.title}</span>
                          <Badge variant="outline" className="ml-auto">
                            {tender.referenceNumber}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            {selectedTenderId && (
              <Button variant="outline" onClick={clearSelection}>
                Clear
              </Button>
            )}
          </div>

          {/* Tender Details Preview */}
          {selectedTender && (
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium">{selectedTender.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedTender.referenceNumber}
                  </p>
                </div>
                <Badge
                  variant={
                    selectedTender.status === 'closed' ? 'default' : 'secondary'
                  }
                >
                  {selectedTender.status}
                </Badge>
              </div>
              {selectedTender.description && (
                <p className="text-sm text-muted-foreground mt-2">
                  {selectedTender.description.substring(0, 150)}
                  {selectedTender.description.length > 150 ? '...' : ''}
                </p>
              )}
            </div>
          )}

          {/* Warning Alert */}
          {selectedTenderId && (
            <div className="flex items-center gap-3 border border-amber-200 bg-amber-50 rounded-md p-4">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <div className="text-amber-800">
                <strong>Note:</strong> This project will be linked to the
                selected tender. The tender will be marked as{' '}
                <strong>awarded</strong> and project fields will be
                automatically populated with tender information.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Project Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Project Details
          </CardTitle>
          {selectedTenderId && (
            <p className="text-sm text-muted-foreground">
              Fields below have been pre-filled from the selected tender. You
              can modify them as needed.
            </p>
          )}
        </CardHeader>
        <CardContent>
          <ProjectForm
            initialData={autofill}
            clients={clients}
            categories={categories}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
