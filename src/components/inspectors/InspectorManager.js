import React, { useEffect, useState } from 'react';
import {
  collection, getDocs, addDoc, deleteDoc, doc, orderBy, query, serverTimestamp
} from 'firebase/firestore';
import { db } from '../../firebase';

const EMPTY = { name: '', email: '', phone: '', certification: '' };

export default function InspectorManager() {
  const [inspectors, setInspectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function load() {
    const snap = await getDocs(query(collection(db, 'inspectors'), orderBy('name')));
    setInspectors(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.name.trim()) { setError('Name is required.'); return; }
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await addDoc(collection(db, 'inspectors'), { ...form, createdAt: serverTimestamp() });
      setForm(EMPTY);
      setSuccess(`${form.name} added successfully.`);
      await load();
    } catch (err) {
      setError('Failed to add inspector. Please try again.');
    }
    setSaving(false);
  }

  async function handleDelete(inspector) {
    if (!window.confirm(`Remove ${inspector.name} from the inspector list?`)) return;
    await deleteDoc(doc(db, 'inspectors', inspector.id));
    setInspectors(prev => prev.filter(i => i.id !== inspector.id));
  }

  const f = (field, val) => setForm(p => ({ ...p, [field]: val }));

  return (
    <div className="page">
      <h1 className="page-title">Inspector Management</h1>

      {/* Add Form */}
      <div className="card mb-2">
        <div className="card-header">
          <span className="card-title">Add New Inspector</span>
        </div>
        {error   && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleAdd} className="flex flex-col gap-2">
          <div className="two-col">
            <div className="form-group">
              <label>Full Name *</label>
              <input type="text" value={form.name} onChange={e => f('name', e.target.value)} placeholder="Jane Smith" required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={form.email} onChange={e => f('email', e.target.value)} placeholder="jane@company.com" />
            </div>
          </div>
          <div className="two-col">
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" value={form.phone} onChange={e => f('phone', e.target.value)} placeholder="(555) 555-5555" />
            </div>
            <div className="form-group">
              <label>Certification / License #</label>
              <input type="text" value={form.certification} onChange={e => f('certification', e.target.value)} placeholder="CTI Level 1, CWT, etc." />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Adding…' : '+ Add Inspector'}
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <h2 className="section-title">Current Inspectors ({inspectors.length})</h2>
      {loading && <div className="spinner" />}
      {!loading && inspectors.length === 0 && (
        <div className="empty-state"><p>No inspectors on file yet.</p></div>
      )}
      {!loading && inspectors.length > 0 && (
        <div className="flex flex-col gap-1">
          {inspectors.map(insp => (
            <div key={insp.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '.75rem', padding: '.85rem 1.1rem' }}>
              <div>
                <div className="font-semibold">{insp.name}</div>
                {insp.certification && <div className="text-sm text-muted">{insp.certification}</div>}
                {insp.email && <div className="text-xs text-muted">{insp.email}{insp.phone ? ` · ${insp.phone}` : ''}</div>}
              </div>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(insp)}
                style={{ flexShrink: 0 }}
              >Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
