import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';

function fmt(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const q = query(
          collection(db, 'reports'),
          where('createdBy', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        setReports(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    load();
  }, [currentUser]);

  return (
    <div className="page">
      <div className="flex items-center justify-between mb-2">
        <h1 className="page-title" style={{ marginBottom: 0 }}>Inspection Reports</h1>
        <Link to="/reports/new" className="btn btn-primary btn-sm">+ New Report</Link>
      </div>

      {loading && <div className="spinner" />}

      {!loading && reports.length === 0 && (
        <div className="empty-state">
          <p style={{ fontSize: '2rem', marginBottom: '.5rem' }}>📋</p>
          <p>No reports yet.</p>
          <Link to="/reports/new" className="btn btn-primary mt-2">Create your first report</Link>
        </div>
      )}

      {!loading && reports.length > 0 && (
        <div className="flex flex-col gap-2">
          {reports.map(r => (
            <Link
              key={r.id}
              to={`/reports/${r.id}`}
              className={`report-card ${r.status}`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="report-card-title">
                  {r.siteInfo?.facilityName || 'Untitled Report'}
                </span>
                <span className={`badge badge-${r.status}`}>{r.status}</span>
              </div>
              <div className="report-card-meta">
                {r.siteInfo?.address && <span>{r.siteInfo.address} · </span>}
                <span>{fmt(r.inspectionDate || r.createdAt)}</span>
                {r.inspectorName && <span> · {r.inspectorName}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
