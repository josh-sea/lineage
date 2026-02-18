import React from 'react';
import PhotoUpload from './PhotoUpload';

export default function ChemicalTreatment({ data = {}, onChange, reportId }) {
  const f = (field, val) => onChange({ ...data, [field]: val });

  return (
    <div className="flex flex-col gap-2">
      <div className="two-col">
        <div className="form-group">
          <label>Chemical Supplier</label>
          <input type="text" value={data.supplier || ''} onChange={e => f('supplier', e.target.value)} placeholder="ChemTreat, Nalco…" />
        </div>
        <div className="form-group">
          <label>Service Rep / Contact</label>
          <input type="text" value={data.repName || ''} onChange={e => f('repName', e.target.value)} />
        </div>
      </div>

      <div className="form-group">
        <label>Chemicals in Use</label>
        <textarea value={data.chemicals || ''} onChange={e => f('chemicals', e.target.value)} placeholder="Scale inhibitor: Product A&#10;Biocide: Product B (oxidizing)&#10;Biocide: Product C (non-oxidizing)" style={{ minHeight: 80 }} />
      </div>

      <div className="form-group">
        <label>Dosing Method</label>
        <select value={data.dosingMethod || ''} onChange={e => f('dosingMethod', e.target.value)}>
          <option value="">Select…</option>
          <option value="continuous">Continuous feed pump</option>
          <option value="batch">Batch / timer-based</option>
          <option value="blowdown_proportional">Blowdown-proportional</option>
          <option value="manual">Manual addition</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="divider" />
      <p className="font-semibold text-sm">Residual Readings at Inspection</p>

      <div className="two-col">
        <div className="form-group">
          <label>Inhibitor Residual (ppm)</label>
          <input type="number" value={data.inhibitorPpm || ''} onChange={e => f('inhibitorPpm', e.target.value)} step="0.1" />
        </div>
        <div className="form-group">
          <label>Oxidizing Biocide (ppm Cl₂ or Br₂)</label>
          <input type="number" value={data.oxidizingBiocidePpm || ''} onChange={e => f('oxidizingBiocidePpm', e.target.value)} step="0.1" />
        </div>
      </div>

      <div className="two-col">
        <div className="form-group">
          <label>pH</label>
          <input type="number" value={data.ph || ''} onChange={e => f('ph', e.target.value)} step="0.1" min="0" max="14" />
        </div>
        <div className="form-group">
          <label>Last Biocide Slug Date</label>
          <input type="date" value={data.lastSlugDate || ''} onChange={e => f('lastSlugDate', e.target.value)} />
        </div>
      </div>

      <div className="form-group">
        <label>Notes / Recommendations</label>
        <textarea value={data.notes || ''} onChange={e => f('notes', e.target.value)} placeholder="Describe treatment program adequacy, any changes recommended…" />
      </div>

      <div className="form-group">
        <label>Photos</label>
        <PhotoUpload reportId={reportId} section="chemical" photos={data.photos || []} onChange={urls => f('photos', urls)} />
      </div>
    </div>
  );
}
