import React from 'react';

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', gap: '.5rem', padding: '.25rem 0', borderBottom: '1px solid var(--border)' }}>
      <span className="text-muted text-sm" style={{ minWidth: 160 }}>{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}

function ConditionBadge({ v }) {
  if (!v) return <span className="text-muted text-sm">—</span>;
  const map = { good: ['#f0fdf4','#16a34a'], fair: ['#fffbeb','#d97706'], poor: ['#fef2f2','#dc2626'], na: ['#f8fafc','#64748b'] };
  const [bg, color] = map[v] || ['#f8fafc','#64748b'];
  return <span style={{ background: bg, color, padding: '.1rem .5rem', borderRadius: 99, fontSize: '.75rem', fontWeight: 700, textTransform: 'uppercase' }}>{v}</span>;
}

export default function ReviewSubmit({ formData, onSubmit, saving }) {
  const { siteInfo = {}, towerInfo = {}, sections = {}, conductivity = {}, chemical = {} } = formData;

  return (
    <div className="flex flex-col gap-2">
      <div className="alert alert-info">Review all details before submitting. You can go back to any step to make corrections.</div>

      <div className="card">
        <div className="card-header"><span className="card-title">Site Information</span></div>
        <Row label="Facility" value={siteInfo.facilityName} />
        <Row label="Address" value={[siteInfo.address, siteInfo.city, siteInfo.state, siteInfo.zip].filter(Boolean).join(', ')} />
        <Row label="Inspection Date" value={siteInfo.inspectionDate} />
        <Row label="Contact" value={siteInfo.contactName} />
      </div>

      <div className="card">
        <div className="card-header"><span className="card-title">Tower Information</span></div>
        <Row label="Manufacturer" value={towerInfo.manufacturer} />
        <Row label="Model" value={towerInfo.model} />
        <Row label="Serial #" value={towerInfo.serialNumber} />
        <Row label="Capacity" value={towerInfo.capacityTons ? `${towerInfo.capacityTons} tons` : null} />
        <Row label="Type" value={towerInfo.towerType} />
      </div>

      <div className="card">
        <div className="card-header"><span className="card-title">Inspector</span></div>
        <Row label="Name" value={formData.inspectorName} />
        <Row label="Certification" value={formData.inspectorCert} />
      </div>

      <div className="card">
        <div className="card-header"><span className="card-title">Inspection Sections</span></div>
        {[
          ['Overall Tower', sections.overallTower],
          ['Basin', sections.basin],
          ['Packing / Fill', sections.fill],
          ['Drift Eliminators', sections.driftEliminators],
        ].map(([name, sec]) => (
          <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.35rem 0', borderBottom: '1px solid var(--border)' }}>
            <span className="text-sm">{name}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
              <ConditionBadge v={sec?.condition} />
              {sec?.photos?.length > 0 && <span className="text-xs text-muted">📷 {sec.photos.length}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header"><span className="card-title">Conductivity Controller</span></div>
        <Row label="Status" value={conductivity.status} />
        <Row label="Set Point" value={conductivity.setPoint ? `${conductivity.setPoint} µS/cm` : null} />
        <Row label="Reading" value={conductivity.reading ? `${conductivity.reading} µS/cm` : null} />
      </div>

      <div className="card">
        <div className="card-header"><span className="card-title">Chemical Treatment</span></div>
        <Row label="Supplier" value={chemical.supplier} />
        <Row label="Dosing Method" value={chemical.dosingMethod} />
        <Row label="pH" value={chemical.ph} />
      </div>

      <div className="form-group mt-1">
        <label>Overall Report Notes / Recommendations</label>
        <textarea
          value={formData.overallNotes || ''}
          onChange={e => onSubmit({ overallNotes: e.target.value }, false)}
          placeholder="Summary of findings and recommendations for the facility manager…"
        />
      </div>

      <button
        className="btn btn-success w-full mt-1"
        onClick={() => onSubmit({}, true)}
        disabled={saving}
        style={{ fontSize: '1.05rem', padding: '1rem' }}
      >
        {saving ? 'Saving Report…' : '✓ Submit Report'}
      </button>
    </div>
  );
}
