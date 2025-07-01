import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProjectFormProps {
  initialData?: any;
  clients: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  onSubmit: (data: any) => Promise<any>;
  loading?: boolean;
}

export function ProjectForm({
  initialData,
  clients,
  categories,
  onSubmit,
  loading,
}: ProjectFormProps) {
  const [form, setForm] = useState({
    referenceNumber: initialData?.referenceNumber || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
    clientId: initialData?.clientId || '',
    categoryId: initialData?.categoryId || '',
    status: initialData?.status || 'active',
    awardDate: initialData?.awardDate ? initialData.awardDate.slice(0, 10) : '',
    estimatedValue: initialData?.estimatedValue || '',
    department: initialData?.department || '',
    notes: initialData?.notes || '',
  });
  const [errors, setErrors] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs: any = {};
    if (!form.referenceNumber)
      errs.referenceNumber = 'Reference number is required';
    if (!form.title) errs.title = 'Title is required';
    if (!form.clientId) errs.clientId = 'Client is required';
    return errs;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelect = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          name="referenceNumber"
          placeholder="Reference Number"
          value={form.referenceNumber}
          onChange={handleChange}
          required
        />
        {errors.referenceNumber && (
          <div className="text-red-600 text-xs mt-1">
            {errors.referenceNumber}
          </div>
        )}
      </div>
      <div>
        <Input
          name="title"
          placeholder="Project Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        {errors.title && (
          <div className="text-red-600 text-xs mt-1">{errors.title}</div>
        )}
      </div>
      <Textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />
      <div>
        <Select
          value={form.clientId}
          onValueChange={(v) => handleSelect('clientId', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Client" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.clientId && (
          <div className="text-red-600 text-xs mt-1">{errors.clientId}</div>
        )}
      </div>
      <Select
        value={form.categoryId}
        onValueChange={(v) => handleSelect('categoryId', v)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={form.status}
        onValueChange={(v) => handleSelect('status', v)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="on_hold">On Hold</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
      <Input
        name="awardDate"
        type="date"
        placeholder="Award Date"
        value={form.awardDate}
        onChange={handleChange}
      />
      <Input
        name="estimatedValue"
        type="number"
        placeholder="Estimated Value"
        value={form.estimatedValue}
        onChange={handleChange}
      />
      <Input
        name="department"
        placeholder="Department"
        value={form.department}
        onChange={handleChange}
      />
      <Textarea
        name="notes"
        placeholder="Notes"
        value={form.notes}
        onChange={handleChange}
      />
      <Button type="submit" disabled={loading || submitting}>
        {initialData ? 'Update Project' : 'Create Project'}
      </Button>
    </form>
  );
}
