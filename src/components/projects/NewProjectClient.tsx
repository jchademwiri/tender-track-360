'use client';
import { useState } from 'react';
import { ProjectForm } from './project-form';
import { Button } from '@/components/ui/button';

export default function NewProjectClient({ clients, categories, tenders }) {
  const [selectedTenderId, setSelectedTenderId] = useState('');
  const [autofill, setAutofill] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTenderChange = async (tenderId: string) => {
    setSelectedTenderId(tenderId);
    if (tenderId) {
      const tender = tenders.find((t) => t.id === tenderId);
      if (tender) {
        setAutofill({
          referenceNumber: tender.referenceNumber,
          title: tender.title,
          description: tender.description,
          clientId: tender.clientId,
          categoryId: tender.categoryId,
          status: 'active',
          awardDate: tender.awardDate,
          estimatedValue: tender.estimatedValue,
          department: tender.department,
          notes: tender.notes,
        });
      }
    } else {
      setAutofill(null);
    }
  };

  async function handleSubmit(data: any) {
    setLoading(true);
    await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        tenderId: selectedTenderId || undefined,
      }),
    });
    window.location.href = '/dashboard/admin/projects';
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
      <div className="mb-4">
        <label htmlFor="tender-select" className="block mb-1 font-medium">
          Link to Tender (optional)
        </label>
        <select
          id="tender-select"
          className="w-full border rounded px-3 py-2"
          value={selectedTenderId}
          onChange={(e) => handleTenderChange(e.target.value)}
        >
          <option value="">-- Create from scratch --</option>
          {tenders.map((tender) => (
            <option key={tender.id} value={tender.id}>
              {tender.title} (Ref: {tender.referenceNumber})
            </option>
          ))}
        </select>
      </div>
      {selectedTenderId && (
        <div className="mb-4 p-3 rounded bg-yellow-100 text-yellow-800 border border-yellow-300">
          <b>Warning:</b> This project will be linked to the selected tender,
          which will be marked as <b>awarded</b>. Project fields will be
          autofilled from the tender.
        </div>
      )}
      <ProjectForm
        initialData={autofill || {}}
        clients={clients}
        categories={categories}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}
