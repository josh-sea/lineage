import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Link } from 'react-router-dom';

export default function InspectorSelect({ data, onChange }) {
  const [inspectors, setInspectors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const snap = await getDocs(query(collection(db, 'inspectors'), orderBy('name')));
      setInspectors(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }
    load();
  }, []);

  function select(inspector) {
    onChange({
      inspectorId: inspector.id,
      inspectorName: inspector.name,
      inspectorCert: inspector.certification || ''
    });
  }

  if (loading) return <div className="spinner" />;

  if (inspectors.length === 0) {
    return (
      <div className="empty-state">
        <p>No inspectors on file.</p>
        <Link to="/inspectors" className="btn btn-primary mt-2" target="_blank">
          Add Inspectors
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm text-muted mb-1">Select the inspector conducting this inspection:</p>
      {inspectors.map(insp => (
        <div
          key={insp.id}
          onClick={() => select(insp)}
          style={{
            padding: '1rem',
            borderRadius: 'var(--radius)',
            border: `2px solid ${data.inspectorId === insp.id ? 'var(--primary)' : 'var(--border)'}`,
            background: data.inspectorId === insp.id ? '#eff6ff' : 'var(--surface)',
            cursor: 'pointer',
            transition: 'all .15s'
          }}
        >
          <div className="font-semibold">{insp.name}</div>
          {insp.certification && <div className="text-sm text-muted">{insp.certification}</div>}
          {insp.email && <div className="text-xs text-muted">{insp.email}</div>}
        </div>
      ))}
    </div>
  );
}
