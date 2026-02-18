import React, { useRef, useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase';

export default function PhotoUpload({ reportId, section, photos = [], onChange }) {
  const inputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function handleFiles(files) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const urls = [...photos];
    for (const file of Array.from(files)) {
      const path = `reports/${reportId}/${section}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, path);
      await new Promise((resolve, reject) => {
        const task = uploadBytesResumable(storageRef, file);
        task.on('state_changed',
          snap => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
          reject,
          async () => {
            const url = await getDownloadURL(task.snapshot.ref);
            urls.push(url);
            resolve();
          }
        );
      });
    }
    onChange(urls);
    setUploading(false);
    setProgress(0);
  }

  function removePhoto(idx) {
    const updated = photos.filter((_, i) => i !== idx);
    onChange(updated);
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        style={{ display: 'none' }}
        onChange={e => handleFiles(e.target.files)}
      />

      <div className="photo-upload-zone" onClick={() => inputRef.current.click()}>
        {uploading
          ? <p className="text-sm text-muted">Uploading… {progress}%</p>
          : <p className="text-sm text-muted">📷 Tap to take photo or choose from library</p>
        }
      </div>

      {photos.length > 0 && (
        <div className="photo-grid">
          {photos.map((url, i) => (
            <div key={i} className="photo-thumb">
              <img src={url} alt={`${i + 1}`} />
              <button className="remove-photo" onClick={() => removePhoto(i)} title="Remove">✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
