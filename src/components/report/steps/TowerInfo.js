import React from 'react';

export default function TowerInfo({ data, onChange }) {
  const f = (field, val) => onChange({ ...data, [field]: val });

  return (
    <div className="flex flex-col gap-2">
      <div className="two-col">
        <div className="form-group">
          <label>Manufacturer / Make *</label>
          <input type="text" value={data.manufacturer || ''} onChange={e => f('manufacturer', e.target.value)} placeholder="Baltimore Aircoil, Marley…" />
        </div>
        <div className="form-group">
          <label>Model Number</label>
          <input type="text" value={data.model || ''} onChange={e => f('model', e.target.value)} />
        </div>
      </div>

      <div className="two-col">
        <div className="form-group">
          <label>Serial Number</label>
          <input type="text" value={data.serialNumber || ''} onChange={e => f('serialNumber', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Year Installed</label>
          <input type="number" value={data.yearInstalled || ''} onChange={e => f('yearInstalled', e.target.value)} placeholder="2015" min="1950" max="2099" />
        </div>
      </div>

      <div className="two-col">
        <div className="form-group">
          <label>Capacity (tons)</label>
          <input type="number" value={data.capacityTons || ''} onChange={e => f('capacityTons', e.target.value)} placeholder="100" />
        </div>
        <div className="form-group">
          <label>Flow Rate (GPM)</label>
          <input type="number" value={data.flowRateGpm || ''} onChange={e => f('flowRateGpm', e.target.value)} placeholder="300" />
        </div>
      </div>

      <div className="two-col">
        <div className="form-group">
          <label>Number of Cells</label>
          <input type="number" value={data.numCells || ''} onChange={e => f('numCells', e.target.value)} placeholder="1" min="1" />
        </div>
        <div className="form-group">
          <label>Tower Type</label>
          <select value={data.towerType || ''} onChange={e => f('towerType', e.target.value)}>
            <option value="">Select…</option>
            <option value="crossflow">Cross-flow</option>
            <option value="counterflow">Counter-flow</option>
            <option value="natural_draft">Natural Draft</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Fill / Packing Material Type</label>
        <select value={data.fillType || ''} onChange={e => f('fillType', e.target.value)}>
          <option value="">Select…</option>
          <option value="pvc_film">PVC Film Fill</option>
          <option value="pvc_splash">PVC Splash Fill</option>
          <option value="wood">Wood Slat Fill</option>
          <option value="ceramic">Ceramic</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label>Additional Notes</label>
        <textarea value={data.notes || ''} onChange={e => f('notes', e.target.value)} placeholder="Any additional tower details…" />
      </div>
    </div>
  );
}
