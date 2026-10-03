import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({ isOpen, onClose }) => {
  const { state, updatePaymentMethod } = useApp();

  const [cards] = useState([
    { brand: 'VISA', last4: '4242', expiry: '12/28' },
    { brand: 'Mastercard', last4: '8890', expiry: '09/27' },
    { brand: 'Amex', last4: '1004', expiry: '04/26' },
  ]);

  const [customLast4, setCustomLast4] = useState('');
  const [customBrand, setCustomBrand] = useState('VISA');
  const [isAddingNew, setIsAddingNew] = useState(false);

  if (!isOpen) return null;

  const handleSelectCard = (card: { brand: string; last4: string; expiry: string }) => {
    updatePaymentMethod(card);
    onClose();
  };

  const handleAddCustomCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (customLast4.length === 4) {
      updatePaymentMethod({
        brand: customBrand,
        last4: customLast4,
        expiry: '11/29',
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-md">
      <div className="w-full max-w-sm bg-surface rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-outline-variant/20">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-primary text-xl">
              account_balance_wallet
            </span>
            <h2 className="text-headline-sm font-semibold text-on-surface">Escrow Payment Source</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="p-4 space-y-4">
          <p className="text-body-sm text-on-surface-variant">
            Funds are only debited if you knowingly hold through the friction timer to override a blocked app.
          </p>

          {/* Cards List */}
          <div className="space-y-2">
            {cards.map(card => {
              const isSelected = state.paymentMethod.last4 === card.last4;
              return (
                <div
                  key={card.last4}
                  onClick={() => handleSelectCard(card)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'border-2 border-primary bg-primary-fixed/20'
                      : 'border-outline-variant/40 hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-6 bg-surface-container-high rounded flex items-center justify-center font-bold text-xs text-secondary tracking-tighter shadow-2xs">
                      {card.brand}
                    </div>
                    <div>
                      <p className="text-body-md font-semibold text-on-surface">
                        {card.brand} •••• {card.last4}
                      </p>
                      <p className="text-label-sm text-outline">Expires {card.expiry}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <span
                      className="material-symbols-outlined text-primary text-lg"
                      data-weight="fill"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add New Card Toggle */}
          {!isAddingNew ? (
            <button
              onClick={() => setIsAddingNew(true)}
              className="w-full py-2.5 rounded-lg border border-dashed border-outline-variant/80 hover:border-primary text-body-sm text-primary font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>Add another card</span>
            </button>
          ) : (
            <form onSubmit={handleAddCustomCard} className="space-y-3 pt-2 border-t border-outline-variant/20">
              <div className="flex gap-2">
                <select
                  value={customBrand}
                  onChange={e => setCustomBrand(e.target.value)}
                  className="p-2 border border-outline-variant/50 rounded-lg text-body-sm bg-surface"
                >
                  <option value="VISA">VISA</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="Amex">Amex</option>
                </select>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="Last 4 digits"
                  value={customLast4}
                  onChange={e => setCustomLast4(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 p-2 border border-outline-variant/50 rounded-lg text-body-sm"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-primary text-on-primary rounded-lg text-label-md font-semibold"
                >
                  Save Card
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-3 py-2 border border-outline-variant/50 rounded-lg text-label-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="flex items-center gap-2 p-2.5 bg-surface-container-low rounded-lg text-label-sm text-outline">
            <span className="material-symbols-outlined text-base text-primary">security</span>
            <span>Escrow charges processed via Stripe 256-bit encryption.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
