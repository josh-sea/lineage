import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useReactToPrint } from 'react-to-print';

function fmt(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function ConditionBadge({ v }) {
  if (!v) return <span style={{ color: '#94a3b8' }}>—</span>;
  const map = {
    good: ['#f0fdf4','#16a34a','Good'],
    fair: ['#fffbeb','#d97706','Fair'],
    poor: ['#fef2f2','#dc2626','Poor'],
    na:   ['#f8fafc','#64748b','N/A'],
  };
  const [bg, color, label] = map[v] || ['#f8fafc','#64748b',v];
  return (
    <span style={{ background: bg, color, padding: '.2rem .65rem', borderRadius: 99, fontSize: '.8rem', fontWeight: 700, display: 'inline-block' }}>
      {label}
    </span>
  );
}

function SectionBlock({ title, icon, data = {} }) {
  if (!data.condition && !data.notes && !(data.photos?.length)) return null;
  return (
    <div className="card print-section" style={{ marginBottom: '1rem' }}>
      <div className="card-header">
        <span style={{ fontSize: '1.1rem' }}>{icon}</span>
        <span className="card-title">{title}</span>
        <span style={{ marginLeft: 'auto' }}><ConditionBadge v={data.condition} /></span>
      </div>

      {data.checks && Object.keys(data.checks).length > 0 && (
        <div style={{ marginBottom: '.75rem' }}>
          {Object.entries(data.checks).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.2rem 0', fontSize: '.85rem' }}>
              <span style={{ color: v ? 'var(--success)' : 'var(--danger)', fontWeight: 700 }}>{v ? '✓' : '✗'}</span>
              <span style={{ textTransform: 'none' }}>{k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</span>
            </div>
          ))}
        </div>
      )}

      {data.notes && (
        <p style={{ fontSize: '.9rem', marginBottom: '.75rem', whiteSpace: 'pre-wrap' }}>{data.notes}</p>
      )}

      {data.photos && data.photos.length > 0 && (
        <div className="print-photo-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px,1fr))', gap: '.5rem' }}>
          {data.photos.map((url, i) => (
            <img key={i} src={url} alt={`${title} ${i+1}`} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 6 }} />
          ))}
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', gap: '.5rem', padding: '.3rem 0', borderBottom: '1px solid var(--border)', fontSize: '.9rem' }}>
      <span style={{ minWidth: 160, color: 'var(--text-muted)', flexShrink: 0 }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}

export default function ReportView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, 'reports', id));
      if (snap.exists()) setReport({ id: snap.id, ...snap.data() });
      setLoading(false);
    }
    load();
  }, [id]);

  const handlePrint = useReactToPrint({ content: () => printRef.current });

  async function handleDelete() {
    if (!window.confirm('Delete this report permanently?')) return;
    setDeleting(true);
    await deleteDoc(doc(db, 'reports', id));
    navigate('/');
  }

  if (loading) return <div className="page"><div className="spinner" /></div>;
  if (!report) return <div className="page"><div className="alert alert-danger">Report not found.</div></div>;

  const { siteInfo = {}, towerInfo = {}, sections = {}, conductivity = {}, chemical = {}, records = {} } = report;

  return (
    <div className="page">
      {/* Action bar */}
      <div className="flex items-center justify-between mb-2 no-print">
        <Link to="/" className="btn btn-secondary btn-sm">← Reports</Link>
        <div className="flex gap-1">
          <Link to={`/reports/${id}/edit`} className="btn btn-ghost btn-sm">Edit</Link>
          <button className="btn btn-secondary btn-sm" onClick={handlePrint}>🖨 Print / PDF</button>
          <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={deleting}>Delete</button>
        </div>
      </div>

      <div ref={printRef}>
        {/* Report Header */}
        <div className="card" style={{ marginBottom: '1rem', borderTop: '4px solid var(--primary)' }}>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.5px', color: 'var(--primary-dark)' }}>
              Tower<span style={{ color: 'var(--primary-light)' }}>Pro</span>
            </h1>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '.25rem' }}>Cooling Tower Inspection Report</h2>
            <span className={`badge badge-${report.status}`} style={{ marginTop: '.4rem' }}>{report.status}</span>
          </div>

          <div className="two-col">
            <div>
              <p className="font-semibold text-sm" style={{ marginBottom: '.4rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '.7rem', letterSpacing: '.06em' }}>Site Information</p>
              <InfoRow label="Facility" value={siteInfo.facilityName} />
              <InfoRow label="Address" value={[siteInfo.address, siteInfo.city, siteInfo.state, siteInfo.zip].filter(Boolean).join(', ')} />
              <InfoRow label="Contact" value={siteInfo.contactName} />
              <InfoRow label="Phone" value={siteInfo.contactPhone} />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ marginBottom: '.4rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '.7rem', letterSpacing: '.06em' }}>Inspection Details</p>
              <InfoRow label="Inspection Date" value={siteInfo.inspectionDate} />
              <InfoRow label="Inspector" value={report.inspectorName} />
              <InfoRow label="Certification" value={report.inspectorCert} />
              <InfoRow label="Report Date" value={fmt(report.completedAt || report.createdAt)} />
            </div>
          </div>
        </div>

        {/* Tower Info */}
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div className="card-header"><span>🏗️</span><span className="card-title">Tower Information</span></div>
          <div className="two-col">
            <div>
              <InfoRow label="Manufacturer" value={towerInfo.manufacturer} />
              <InfoRow label="Model" value={towerInfo.model} />
              <InfoRow label="Serial #" value={towerInfo.serialNumber} />
              <InfoRow label="Year Installed" value={towerInfo.yearInstalled} />
            </div>
            <div>
              <InfoRow label="Capacity" value={towerInfo.capacityTons ? `${towerInfo.capacityTons} tons` : null} />
              <InfoRow label="Flow Rate" value={towerInfo.flowRateGpm ? `${towerInfo.flowRateGpm} GPM` : null} />
              <InfoRow label="Tower Type" value={towerInfo.towerType} />
              <InfoRow label="# of Cells" value={towerInfo.numCells} />
            </div>
          </div>
          {towerInfo.notes && <p style={{ marginTop: '.75rem', fontSize: '.9rem', whiteSpace: 'pre-wrap' }}>{towerInfo.notes}</p>}
        </div>

        {/* Inspection Sections */}
        <SectionBlock title="Overall Tower" icon="🏛️" data={sections.overallTower} />
        <SectionBlock title="Cold Water Basin" icon="💧" data={sections.basin} />
        <SectionBlock title="Packing Material (Fill)" icon="🧱" data={sections.fill} />
        <SectionBlock title="Drift Eliminators" icon="💨" data={sections.driftEliminators} />

        {/* Conductivity */}
        {(conductivity.status || conductivity.setPoint || conductivity.notes) && (
          <div className="card print-section" style={{ marginBottom: '1rem' }}>
            <div className="card-header"><span>⚡</span><span className="card-title">Conductivity Controller</span>
              {conductivity.status && (
                <span style={{ marginLeft: 'auto' }}>
                  <span style={{
                    background: conductivity.status === 'Functioning' ? '#f0fdf4' : '#fef2f2',
                    color: conductivity.status === 'Functioning' ? 'var(--success)' : 'var(--danger)',
                    padding: '.2rem .65rem', borderRadius: 99, fontSize: '.8rem', fontWeight: 700
                  }}>{conductivity.status}</span>
                </span>
              )}
            </div>
            <div className="two-col">
              <div>
                <InfoRow label="Manufacturer" value={conductivity.manufacturer} />
                <InfoRow label="Set Point" value={conductivity.setPoint ? `${conductivity.setPoint} µS/cm` : null} />
                <InfoRow label="Reading" value={conductivity.reading ? `${conductivity.reading} µS/cm` : null} />
                <InfoRow label="Cycles" value={conductivity.cycles} />
              </div>
              <div>
                <InfoRow label="Blowdown" value={conductivity.blowdownWorking != null ? (conductivity.blowdownWorking ? 'Functioning' : 'Not functioning') : null} />
                <InfoRow label="Probe" value={conductivity.probeClean != null ? (conductivity.probeClean ? 'Clean' : 'Needs cleaning') : null} />
              </div>
            </div>
            {conductivity.notes && <p style={{ marginTop: '.75rem', fontSize: '.9rem', whiteSpace: 'pre-wrap' }}>{conductivity.notes}</p>}
            {conductivity.photos?.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px,1fr))', gap: '.5rem', marginTop: '.75rem' }}>
                {conductivity.photos.map((url, i) => (
                  <img key={i} src={url} alt={`Conductivity controller ${i+1}`} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 6 }} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Chemical */}
        {(chemical.supplier || chemical.notes) && (
          <div className="card print-section" style={{ marginBottom: '1rem' }}>
            <div className="card-header"><span>🧪</span><span className="card-title">Chemical Treatment</span></div>
            <div className="two-col">
              <div>
                <InfoRow label="Supplier" value={chemical.supplier} />
                <InfoRow label="Service Rep" value={chemical.repName} />
                <InfoRow label="Dosing Method" value={chemical.dosingMethod} />
                <InfoRow label="Last Biocide Slug" value={chemical.lastSlugDate} />
              </div>
              <div>
                <InfoRow label="Inhibitor Residual" value={chemical.inhibitorPpm != null && chemical.inhibitorPpm !== '' ? `${chemical.inhibitorPpm} ppm` : null} />
                <InfoRow label="Oxidizing Biocide" value={chemical.oxidizingBiocidePpm != null && chemical.oxidizingBiocidePpm !== '' ? `${chemical.oxidizingBiocidePpm} ppm` : null} />
                <InfoRow label="pH" value={chemical.ph} />
              </div>
            </div>
            {chemical.chemicals && <p style={{ marginTop: '.75rem', fontSize: '.9rem', whiteSpace: 'pre-wrap' }}>{chemical.chemicals}</p>}
            {chemical.notes && <p style={{ marginTop: '.5rem', fontSize: '.9rem', whiteSpace: 'pre-wrap' }}>{chemical.notes}</p>}
            {chemical.photos?.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px,1fr))', gap: '.5rem', marginTop: '.75rem' }}>
                {chemical.photos.map((url, i) => (
                  <img key={i} src={url} alt={`Chemical treatment ${i+1}`} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 6 }} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Records */}
        {records && Object.keys(records).length > 0 && (
          <div className="card print-section" style={{ marginBottom: '1rem' }}>
            <div className="card-header"><span>📋</span><span className="card-title">Records on Site</span></div>
            {[
              ['treatmentLogs',    'Chemical treatment logs'],
              ['inspectionLogs',   'Inspection / maintenance logs'],
              ['waterTestResults', 'Water test results'],
              ['labAnalysis',      'Third-party lab analysis'],
              ['riskAssessment',   'Legionella risk assessment / WMP'],
              ['certifications',   'Technician certifications'],
              ['sds',              'Chemical SDS sheets'],
            ].map(([k, label]) => records[k] != null && (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.25rem 0', fontSize: '.87rem', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: records[k] ? 'var(--success)' : 'var(--danger)', fontWeight: 700 }}>{records[k] ? '✓' : '✗'}</span>
                <span>{label}</span>
              </div>
            ))}
            {records.lastLabDate && <p style={{ marginTop: '.5rem', fontSize: '.85rem', color: 'var(--text-muted)' }}>Last lab analysis: {records.lastLabDate}</p>}
            {records.notes && <p style={{ marginTop: '.5rem', fontSize: '.9rem', whiteSpace: 'pre-wrap' }}>{records.notes}</p>}
          </div>
        )}

        {/* Overall Notes */}
        {report.overallNotes && (
          <div className="card print-section" style={{ marginBottom: '1rem' }}>
            <div className="card-header"><span>📝</span><span className="card-title">Overall Notes & Recommendations</span></div>
            <p style={{ fontSize: '.95rem', whiteSpace: 'pre-wrap' }}>{report.overallNotes}</p>
          </div>
        )}

        {/* Signature block */}
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div className="two-col" style={{ gap: '2rem' }}>
            <div>
              <p className="text-sm font-semibold" style={{ marginBottom: '.25rem' }}>Inspector Signature</p>
              <div style={{ borderBottom: '1.5px solid var(--text)', height: 48, marginBottom: '.25rem' }} />
              <p className="text-xs text-muted">{report.inspectorName}</p>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ marginBottom: '.25rem' }}>Date</p>
              <div style={{ borderBottom: '1.5px solid var(--text)', height: 48, marginBottom: '.25rem' }} />
              <p className="text-xs text-muted">{siteInfo.inspectionDate}</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-center text-muted" style={{ padding: '.5rem 0' }}>
          Generated by TowerPro · {fmt(report.completedAt || report.createdAt)}
        </p>
      </div>
    </div>
  );
}
