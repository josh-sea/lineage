import React from 'react';
import PhotoUpload from './PhotoUpload';

export default function ConductivityController({ data = {}, onChange, reportId }) {
  const f = (field, val) => onChange({ ...data, [field]: val });

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted">Document the conductivity controller / blowdown system.</p>

      <div className="two-col">
        <div className="form-group">
          <label>Manufacturer / Model</label>
          <input type="text" value={data.manufacturer || ''} onChange={e => f('manufacturer', e.target.value)} placeholder="Walchem, Prominent…" />
        </div>
        <div className="form-group">
          <label>Set Point (µS/cm)</label>
          <input type="number" value={data.setPoint || ''} onChange={e => f('setPoint', e.target.value)} placeholder="1500" />
        </div>
      </div>

      <div className="two-col">
        <div className="form-group">
          <label>Reading at Inspection (µS/cm)</label>
          <input type="number" value={data.reading || ''} onChange={e => f('reading', e.target.value)} placeholder="1200" />
        </div>
        <div className="form-group">
          <label>Cycles of Concentration</label>
          <input type="number" value={data.cycles || ''} onChange={e => f('cycles', e.target.value)} placeholder="4" step="0.1" />
        </div>
      </div>

      <div className="form-group">
        <label>Controller Status</label>
        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
          {['Functioning', 'Malfunctioning', 'Not Present'].map(s => (
            <button
              key={s} type="button"
              className={`condition-btn ${data.status === s ? (s === 'Functioning' ? 'selected-good' : 'selected-poor') : ''}`}
              style={{ flex: 'none' }}
              onClick={() => f('status', s)}
            >{s}</button>
          ))}
        </div>
      </div>

      <div className="check-row">
        <input type="checkbox" id="blowdown" checked={!!data.blowdownWorking} onChange={e => f('blowdownWorking', e.target.checked)} />
        <label htmlFor="blowdown">Blowdown valve functioning correctly</label>
      </div>
      <div className="check-row">
        <input type="checkbox" id="probe" checked={!!data.probeClean} onChange={e => f('probeClean', e.target.checked)} />
        <label htmlFor="probe">Conductivity probe clean and properly installed</label>
      </div>
      <div className="check-row">
        <input type="checkbox" id="timer" checked={!!data.timerWorking} onChange={e => f('timerWorking', e.target.checked)} />
        <label htmlFor="timer">Timer / override functioning (if applicable)</label>
      </div>

      <div className="form-group">
        <label>Notes</label>
        <textarea value={data.notes || ''} onChange={e => f('notes', e.target.value)} placeholder="Calibration status, issues found…" />
      </div>

      <div className="form-group">
        <label>Photos</label>
        <PhotoUpload reportId={reportId} section="conductivity" photos={data.photos || []} onChange={urls => f('photos', urls)} />
      </div>
    </div>
  );
}
