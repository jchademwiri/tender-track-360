'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function SetupAdminPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    department: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const res = await fetch('/api/users/setup-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => router.push('/login'), 1500);
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to create admin user');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Setup Admin User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          type="password"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="department"
          value={form.department}
          onChange={handleChange}
          placeholder="Department"
          className="w-full border px-3 py-2 rounded"
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Admin User'}
        </Button>
        {error && <div className="text-red-600">{error}</div>}
        {success && (
          <div className="text-green-600">
            Admin user created! Redirecting to login...
          </div>
        )}
      </form>
    </div>
  );
}
