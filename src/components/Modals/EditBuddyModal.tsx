import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';

interface EditBuddyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditBuddyModal: React.FC<EditBuddyModalProps> = ({ isOpen, onClose }) => {
  const { state, updateBuddy, showToast } = useApp();

  const [name, setName] = useState(state.buddy.name);
  const [phone, setPhone] = useState(state.buddy.phone);
  const [relationship, setRelationship] = useState(state.buddy.relationship);
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState(state.buddy.smsAlertsEnabled);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBuddy({
      name,
      phone,
      relationship,
      smsAlertsEnabled,
    });
    onClose();
  };

  const handleTestSms = () => {
    showToast(`Test verification code sent to ${phone}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-md">
      <div className="w-full max-w-sm bg-surface rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-outline-variant/20">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-primary text-xl">handshake</span>
            <h2 className="text-headline-sm font-semibold text-on-surface">Buddy Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="p-4 space-y-4">
          <div>
            <label className="block text-body-sm font-medium text-on-surface mb-1">
              Buddy Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-outline-variant/60 focus:border-primary text-body-md bg-surface"
              required
            />
          </div>

          <div>
            <label className="block text-body-sm font-medium text-on-surface mb-1">
              SMS Phone Number
            </label>
            <div className="flex gap-2">
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="flex-1 p-2.5 rounded-lg border border-outline-variant/60 focus:border-primary text-body-md bg-surface"
                required
              />
              <button
                type="button"
                onClick={handleTestSms}
                className="px-3 py-2 bg-surface-container-high hover:bg-surface-container-highest text-primary rounded-lg text-label-md font-semibold"
              >
                Verify
              </button>
            </div>
          </div>

          <div>
            <label className="block text-body-sm font-medium text-on-surface mb-1">
              Relationship / Role
            </label>
            <select
              value={relationship}
              onChange={e => setRelationship(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-outline-variant/60 focus:border-primary text-body-md bg-surface"
            >
              <option value="Focus Partner">Focus Partner</option>
              <option value="Spouse / Significant Other">Spouse / Significant Other</option>
              <option value="Best Friend">Best Friend</option>
              <option value="Mentor / Coach">Mentor / Coach</option>
              <option value="Colleague">Colleague</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-outline-variant/30">
            <div>
              <p className="text-body-md font-medium text-on-surface">SMS Alerts Active</p>
              <p className="text-body-sm text-on-surface-variant">Send automatic lock override notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={smsAlertsEnabled}
                onChange={e => setSmsAlertsEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:border-outline-variant after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-primary hover:bg-primary-container text-on-primary rounded-lg font-semibold text-body-md transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-outline-variant/60 rounded-lg text-body-md text-on-surface-variant hover:bg-surface-container"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
