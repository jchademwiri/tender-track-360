'use client';
import { useState } from 'react';
import { useAuth } from '@/auth/AuthProvider';
import { Button } from '@/components/ui/button';

export default function AddUserForm() {
  const { role } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'viewer',
    department: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!['admin', 'tender_manager'].includes(role)) {
    return <div>You do not have permission to add users.</div>;
  }

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const res = await fetch('/api/users/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSuccess(true);
      setForm({
        email: '',
        password: '',
        fullName: '',
        role: 'viewer',
        department: '',
      });
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to create user');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        type="password"
        required
      />
      <input
        name="fullName"
        value={form.fullName}
        onChange={handleChange}
        placeholder="Full Name"
      />
      <input
        name="department"
        value={form.department}
        onChange={handleChange}
        placeholder="Department"
      />
      <label htmlFor="role">Role</label>
      <select id="role" name="role" value={form.role} onChange={handleChange}>
        <option value="admin">Admin</option>
        <option value="tender_manager">Manager</option>
        <option value="tender_specialist">Specialist</option>
        <option value="viewer">Viewer</option>
      </select>
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </Button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>User created!</div>}
    </form>
  );
}
