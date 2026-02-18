import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import SiteInfo from './steps/SiteInfo';
import TowerInfo from './steps/TowerInfo';
import InspectorSelect from './steps/InspectorSelect';
import SectionForm from './steps/SectionForm';
import ConductivityController from './steps/ConductivityController';
import ChemicalTreatment from './steps/ChemicalTreatment';
import RecordsOnSite from './steps/RecordsOnSite';
import ReviewSubmit from './steps/ReviewSubmit';

const OVERALL_CHECKS = [
  { key: 'structuralIntegrity', label: 'Structural integrity appears sound' },
  { key: 'accessLadders',       label: 'Access ladders / safety rails in good condition' },
  { key: 'fanDeck',             label: 'Fan deck / distribution deck in good condition' },
  { key: 'pipingIntact',        label: 'Piping / valves intact and leak-free' },
  { key: 'noCorrosion',         label: 'No significant corrosion / deterioration visible' },
];

const BASIN_CHECKS = [
  { key: 'waterLevel',      label: 'Water level at proper operating level' },
  { key: 'cleanBasin',      label: 'Basin free of excessive sediment / debris' },
  { key: 'noBiofilm',       label: 'No visible algae or biofilm growth' },
  { key: 'inletScreens',    label: 'Inlet screens present and unobstructed' },
  { key: 'makeupWorking',   label: 'Make-up water valve / float functioning correctly' },
  { key: 'noCorrosion',     label: 'No significant corrosion or scale buildup' },
];

const FILL_CHECKS = [
  { key: 'minFouling',      label: 'Minimal fouling / blockage of fill media' },
  { key: 'noPhysicalDmg',  label: 'No physical damage (cracking, collapse, sagging)' },
  { key: 'noBiofilm',       label: 'No significant biological growth on fill' },
  { key: 'evenDistrib',     label: 'Water distributes evenly across fill' },
];

const DRIFT_CHECKS = [
  { key: 'present',         label: 'Drift eliminators are present' },
  { key: 'properlySeated',  label: 'Properly seated / no gaps' },
  { key: 'noDamage',        label: 'No damage or missing sections' },
  { key: 'clean',           label: 'Clean and not blocked' },
];

const STEPS = [
  { key: 'siteInfo',           label: 'Site Info' },
  { key: 'towerInfo',          label: 'Tower' },
  { key: 'inspector',          label: 'Inspector' },
  { key: 'overallTower',       label: 'Overall' },
  { key: 'basin',              label: 'Basin' },
  { key: 'fill',               label: 'Fill' },
  { key: 'driftEliminators',   label: 'Drift Elim.' },
  { key: 'conductivity',       label: 'Conductivity' },
  { key: 'chemical',           label: 'Chemical' },
  { key: 'records',            label: 'Records' },
  { key: 'review',             label: 'Review' },
];

function genId() {
  return `report_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export default function NewReport() {
  const { id: existingId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [reportId] = useState(existingId || genId());
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    siteInfo: {},
    towerInfo: {},
    inspectorId: '',
    inspectorName: '',
    inspectorCert: '',
    sections: {
      overallTower: {},
      basin: {},
      fill: {},
      driftEliminators: {},
    },
    conductivity: {},
    chemical: {},
    records: {},
    overallNotes: '',
    status: 'draft',
  });

  // Load existing report for edit mode
  useEffect(() => {
    if (!existingId) return;
    async function load() {
      const snap = await getDoc(doc(db, 'reports', existingId));
      if (snap.exists()) setFormData(snap.data());
    }
    load();
  }, [existingId]);

  // Auto-save draft every time step advances
  async function saveDraft(data) {
    try {
      await setDoc(doc(db, 'reports', reportId), {
        ...data,
        createdBy: currentUser.uid,
        updatedAt: serverTimestamp(),
        ...(!data.createdAt ? { createdAt: serverTimestamp() } : {}),
      }, { merge: true });
    } catch (e) {
      console.error('Auto-save failed', e);
    }
  }

  function updateSection(sectionKey, val) {
    setFormData(prev => ({
      ...prev,
      sections: { ...prev.sections, [sectionKey]: val }
    }));
  }

  async function goNext() {
    const updated = { ...formData };
    await saveDraft(updated);
    setStep(s => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo(0, 0);
  }

  function goBack() {
    setStep(s => Math.max(s - 1, 0));
    window.scrollTo(0, 0);
  }

  async function handleReviewUpdate(patch, submit) {
    if (!submit) {
      setFormData(prev => ({ ...prev, ...patch }));
      return;
    }
    setSaving(true);
    setError('');
    try {
      const final = { ...formData, status: 'complete', completedAt: serverTimestamp() };
      await setDoc(doc(db, 'reports', reportId), {
        ...final,
        createdBy: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
      navigate(`/reports/${reportId}`);
    } catch (e) {
      setError('Failed to save report. Check your connection and try again.');
      console.error(e);
    }
    setSaving(false);
  }

  const currentStep = STEPS[step];

  function renderStep() {
    switch (currentStep.key) {
      case 'siteInfo':
        return <SiteInfo data={formData.siteInfo} onChange={v => setFormData(p => ({ ...p, siteInfo: v }))} />;
      case 'towerInfo':
        return <TowerInfo data={formData.towerInfo} onChange={v => setFormData(p => ({ ...p, towerInfo: v }))} />;
      case 'inspector':
        return (
          <InspectorSelect
            data={{ inspectorId: formData.inspectorId, inspectorName: formData.inspectorName }}
            onChange={v => setFormData(p => ({ ...p, ...v }))}
          />
        );
      case 'overallTower':
        return (
          <SectionForm
            title="Overall Tower"
            description="Assess the general condition of the cooling tower structure and ancillary equipment."
            data={formData.sections.overallTower}
            onChange={v => updateSection('overallTower', v)}
            reportId={reportId}
            sectionKey="overallTower"
            checkItems={OVERALL_CHECKS}
          />
        );
      case 'basin':
        return (
          <SectionForm
            title="Cold Water Basin"
            description="Inspect the cold water collection basin for cleanliness, biological growth, and mechanical condition."
            data={formData.sections.basin}
            onChange={v => updateSection('basin', v)}
            reportId={reportId}
            sectionKey="basin"
            checkItems={BASIN_CHECKS}
          />
        );
      case 'fill':
        return (
          <SectionForm
            title="Packing Material (Fill)"
            description="Evaluate the condition of the heat transfer fill / packing media."
            data={formData.sections.fill}
            onChange={v => updateSection('fill', v)}
            reportId={reportId}
            sectionKey="fill"
            checkItems={FILL_CHECKS}
          />
        );
      case 'driftEliminators':
        return (
          <SectionForm
            title="Drift Eliminators"
            description="Inspect drift eliminators for presence, completeness, and condition. Mark N/A if not applicable."
            data={formData.sections.driftEliminators}
            onChange={v => updateSection('driftEliminators', v)}
            reportId={reportId}
            sectionKey="driftEliminators"
            checkItems={DRIFT_CHECKS}
          />
        );
      case 'conductivity':
        return (
          <ConductivityController
            data={formData.conductivity}
            onChange={v => setFormData(p => ({ ...p, conductivity: v }))}
            reportId={reportId}
          />
        );
      case 'chemical':
        return (
          <ChemicalTreatment
            data={formData.chemical}
            onChange={v => setFormData(p => ({ ...p, chemical: v }))}
            reportId={reportId}
          />
        );
      case 'records':
        return (
          <RecordsOnSite
            data={formData.records}
            onChange={v => setFormData(p => ({ ...p, records: v }))}
          />
        );
      case 'review':
        return (
          <ReviewSubmit
            formData={formData}
            onSubmit={handleReviewUpdate}
            saving={saving}
          />
        );
      default:
        return null;
    }
  }

  const stepTitles = {
    siteInfo: 'Site Information',
    towerInfo: 'Tower Information',
    inspector: 'Inspector Selection',
    overallTower: 'Overall Tower',
    basin: 'Cold Water Basin',
    fill: 'Packing Material (Fill)',
    driftEliminators: 'Drift Eliminators',
    conductivity: 'Conductivity Controller',
    chemical: 'Chemical Treatment',
    records: 'Records on Site',
    review: 'Review & Submit',
  };

  return (
    <div className="page">
      <h1 className="page-title">{existingId ? 'Edit Report' : 'New Inspection Report'}</h1>

      {/* Stepper */}
      <div className="stepper no-print">
        {STEPS.map((s, i) => (
          <div
            key={s.key}
            className={`step-item ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}
          >
            <div className="step-dot">{i < step ? '✓' : i + 1}</div>
            <span className="step-label">{s.label}</span>
          </div>
        ))}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Step card */}
      <div className="card">
        <div className="card-header">
          <span style={{ fontSize: '1.2rem' }}>
            {['🏢','🏗️','👤','🏛️','💧','🧱','💨','⚡','🧪','📋','✅'][step]}
          </span>
          <span className="card-title">{stepTitles[currentStep.key]}</span>
          <span className="text-xs text-muted" style={{ marginLeft: 'auto' }}>
            Step {step + 1} of {STEPS.length}
          </span>
        </div>

        {renderStep()}
      </div>

      {/* Navigation */}
      {currentStep.key !== 'review' && (
        <div className="flex justify-between mt-2 no-print">
          <button
            className="btn btn-secondary"
            onClick={goBack}
            disabled={step === 0}
          >
            ← Back
          </button>
          <button
            className="btn btn-primary"
            onClick={goNext}
          >
            {step === STEPS.length - 2 ? 'Review →' : 'Next →'}
          </button>
        </div>
      )}

      {currentStep.key === 'review' && (
        <button className="btn btn-secondary mt-2 no-print" onClick={goBack}>← Back</button>
      )}
    </div>
  );
}
