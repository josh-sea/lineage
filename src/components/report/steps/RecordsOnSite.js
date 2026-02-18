import React from 'react';

export default function RecordsOnSite({ data = {}, onChange }) {
  const f = (field, val) => onChange({ ...data, [field]: val });

  const checks = [
    { key: 'treatmentLogs',    label: 'Chemical treatment logs present and current' },
    { key: 'inspectionLogs',   label: 'Inspection / maintenance logs present and current' },
    { key: 'waterTestResults', label: 'Water test results on file' },
    { key: 'labAnalysis',      label: 'Third-party lab analysis on file' },
    { key: 'riskAssessment',   label: 'Legionella risk assessment / water management plan on site' },
    { key: 'certifications',   label: 'Service technician certifications on file' },
    { key: 'sds',              label: 'Chemical SDS sheets accessible' },
  ];

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted">Verify that required documentation is maintained on site.</p>

      {checks.map(item => (
        <div key={item.key} className="check-row">
          <input
            type="checkbox"
            id={item.key}
            checked={!!(data[item.key])}
            onChange={e => f(item.key, e.target.checked)}
          />
          <label htmlFor={item.key}>{item.label}</label>
        </div>
      ))}

      <div className="form-group mt-1">
        <label>Date of Last Lab Analysis</label>
        <input type="date" value={data.lastLabDate || ''} onChange={e => f('lastLabDate', e.target.value)} />
      </div>

      <div className="form-group">
        <label>Notes</label>
        <textarea value={data.notes || ''} onChange={e => f('notes', e.target.value)} placeholder="Any missing records, deficiencies, or recommendations…" />
      </div>
    </div>
  );
}
