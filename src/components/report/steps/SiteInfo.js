import React from 'react';

export default function SiteInfo({ data, onChange }) {
  const f = (field, val) => onChange({ ...data, [field]: val });

  return (
    <div className="flex flex-col gap-2">
      <div className="form-group">
        <label>Facility / Building Name *</label>
        <input type="text" value={data.facilityName || ''} onChange={e => f('facilityName', e.target.value)} placeholder="Acme Corp – Building A" />
      </div>

      <div className="form-group">
        <label>Street Address</label>
        <input type="text" value={data.address || ''} onChange={e => f('address', e.target.value)} placeholder="123 Main St" />
      </div>

      <div className="two-col">
        <div className="form-group">
          <label>City</label>
          <input type="text" value={data.city || ''} onChange={e => f('city', e.target.value)} />
        </div>
        <div className="form-group">
          <label>State</label>
          <input type="text" value={data.state || ''} onChange={e => f('state', e.target.value)} placeholder="CA" maxLength={2} />
        </div>
      </div>

      <div className="two-col">
        <div className="form-group">
          <label>ZIP Code</label>
          <input type="text" value={data.zip || ''} onChange={e => f('zip', e.target.value)} placeholder="90210" />
        </div>
        <div className="form-group">
          <label>Date of Inspection *</label>
          <input type="date" value={data.inspectionDate || ''} onChange={e => f('inspectionDate', e.target.value)} />
        </div>
      </div>

      <div className="divider" />

      <div className="two-col">
        <div className="form-group">
          <label>Contact Name</label>
          <input type="text" value={data.contactName || ''} onChange={e => f('contactName', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Contact Phone</label>
          <input type="tel" value={data.contactPhone || ''} onChange={e => f('contactPhone', e.target.value)} placeholder="(555) 555-5555" />
        </div>
      </div>

      <div className="form-group">
        <label>Contact Email</label>
        <input type="email" value={data.contactEmail || ''} onChange={e => f('contactEmail', e.target.value)} placeholder="contact@facility.com" />
      </div>
    </div>
  );
}
