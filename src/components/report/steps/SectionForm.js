import React from 'react';
import PhotoUpload from './PhotoUpload';

const CONDITIONS = [
  { value: 'good', label: '✓ Good' },
  { value: 'fair', label: '~ Fair' },
  { value: 'poor', label: '✗ Poor' },
  { value: 'na',   label: 'N/A'    },
];

export default function SectionForm({ title, description, data = {}, onChange, reportId, sectionKey, checkItems = [] }) {
  const f = (field, val) => onChange({ ...data, [field]: val });

  return (
    <div className="flex flex-col gap-2">
      {description && <p className="text-sm text-muted">{description}</p>}

      <div className="form-group">
        <label>Overall Condition</label>
        <div className="condition-group">
          {CONDITIONS.map(c => (
            <button
              key={c.value}
              type="button"
              className={`condition-btn ${data.condition === c.value ? `selected-${c.value}` : ''}`}
              onClick={() => f('condition', c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {checkItems.length > 0 && (
        <div className="form-group">
          <label>Checklist</label>
          {checkItems.map(item => (
            <div key={item.key} className="check-row">
              <input
                type="checkbox"
                id={`${sectionKey}-${item.key}`}
                checked={!!(data.checks && data.checks[item.key])}
                onChange={e => f('checks', { ...(data.checks || {}), [item.key]: e.target.checked })}
              />
              <label htmlFor={`${sectionKey}-${item.key}`}>{item.label}</label>
            </div>
          ))}
        </div>
      )}

      <div className="form-group">
        <label>Observations / Notes</label>
        <textarea
          value={data.notes || ''}
          onChange={e => f('notes', e.target.value)}
          placeholder="Describe findings, deficiencies, or recommendations…"
        />
      </div>

      <div className="form-group">
        <label>Photos</label>
        <PhotoUpload
          reportId={reportId}
          section={sectionKey}
          photos={data.photos || []}
          onChange={urls => f('photos', urls)}
        />
      </div>
    </div>
  );
}
