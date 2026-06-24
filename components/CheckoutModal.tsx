'use client';

import { useState, useEffect, useActionState } from 'react';
import placeOrder, { type PlaceOrderState } from '@/actions/placeOrder';

interface Ingredient {
  id: string;
  name: string;
  price: number;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIngredients: Ingredient[];
  totalPrice: number;
}

type ModalStep = 'order-info' | 'payment';

const BASE_PRICE = 5.99;

export default function CheckoutModal({
  isOpen,
  onClose,
  selectedIngredients,
  totalPrice,
}: CheckoutModalProps) {
  const [step, setStep] = useState<ModalStep>('order-info');

  const [checkoutData, setCheckoutData] = useState({
    orderType: 'guest',
    name: '',
    email: '',
    phone: '',
    pickupTime: '',
  });

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardType: 'visa',
    expiration: '',
    cvv: '',
    cardholderName: '',
  });

  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});

  // useActionState — couplé avec la Server Action placeOrder
  const initialState: PlaceOrderState = {};
  const [state, formAction, isPending] = useActionState(placeOrder, initialState);

  // Reset à l'ouverture
  useEffect(() => {
    if (isOpen) {
      setStep('order-info');
      setCheckoutData({ orderType: 'guest', name: '', email: '', phone: '', pickupTime: '' });
      setPaymentData({ cardNumber: '', cardType: 'visa', expiration: '', cvv: '', cardholderName: '' });
      setPaymentErrors({});
    }
  }, [isOpen]);

  // Fermer avec Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Extras = ingrédients en dehors de veggie, protéine, sauce
  const extras = selectedIngredients.filter((ing) => ing.id.startsWith('e'));
  const baseIngredients = selectedIngredients.filter((ing) => !ing.id.startsWith('e'));
  const extrasTotal = extras.reduce((s, e) => s + e.price, 0);
  const baseTotal = BASE_PRICE + baseIngredients.reduce((s, i) => s + i.price, 0);

  const handleCheckoutChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCheckoutData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({ ...prev, [name]: value }));
    setPaymentErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      checkoutData.name &&
      checkoutData.email &&
      checkoutData.phone &&
      checkoutData.pickupTime
    ) {
      setStep('payment');
    }
  };

  const validatePayment = (): boolean => {
    const errors: Record<string, string> = {};
    const cardNum = paymentData.cardNumber.replace(/\s/g, '');
    if (cardNum.length < 13 || cardNum.length > 19 || !/^\d+$/.test(cardNum)) {
      errors.cardNumber = 'Invalid card number';
    }
    if (!/^\d{2}\/\d{2}$/.test(paymentData.expiration)) {
      errors.expiration = 'Format: MM/YY';
    }
    if (!/^\d{3,4}$/.test(paymentData.cvv)) {
      errors.cvv = 'Invalid CVV (3-4 digits)';
    }
    if (paymentData.cardholderName.trim().length < 2) {
      errors.cardholderName = 'Invalid name';
    }
    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Indicateur d'étapes
  const steps = [
    { id: 'order-info', label: 'Your Info' },
    { id: 'payment', label: 'Payment' },
  ];
  const currentStepIndex = steps.findIndex((s) => s.id === step);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Order checkout"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header modale */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-xl font-bold text-gray-900">Complete Your Order</h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition text-xl"
          >
            ×
          </button>
        </div>

        {/* Indicateur de progression */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center justify-center gap-2">
            {steps.map((s, idx) => (
              <div key={s.id} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 ${idx <= currentStepIndex ? 'text-orange-600' : 'text-gray-400'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold border-2 transition ${
                    idx < currentStepIndex
                      ? 'bg-orange-600 border-orange-600 text-white'
                      : idx === currentStepIndex
                      ? 'border-orange-600 text-orange-600'
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    {idx < currentStepIndex ? '✓' : idx + 1}
                  </div>
                  <span className="text-xs font-semibold hidden sm:inline">{s.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`h-px w-8 sm:w-12 ${idx < currentStepIndex ? 'bg-orange-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 pb-6 pt-2">

          {/* ── ÉTAPE 1 : Infos commande ── */}
          {step === 'order-info' && (
            <div>
              {/* Récapitulatif ingrédients */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
                <h3 className="font-bold text-gray-900 mb-3">🥗 Your Salad</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Base</span>
                    <span>${BASE_PRICE.toFixed(2)}</span>
                  </div>
                  {baseIngredients.map((ing) => (
                    <div key={ing.id} className="flex justify-between text-gray-700">
                      <span>{ing.name}</span>
                      <span>+${ing.price.toFixed(2)}</span>
                    </div>
                  ))}
                  {extras.length > 0 && (
                    <>
                      <div className="border-t border-orange-200 my-2" />
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Extras</p>
                      {extras.map((ing) => (
                        <div key={ing.id} className="flex justify-between text-gray-700">
                          <span>{ing.name}</span>
                          <span>+${ing.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
                <div className="border-t border-orange-300 mt-3 pt-3 flex justify-between font-bold text-orange-700">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                {/* Type de commande */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Continue as:</label>
                  <div className="flex gap-4">
                    <label className={`flex-1 flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition ${checkoutData.orderType === 'guest' ? 'border-orange-600 bg-orange-50' : 'border-gray-300 hover:border-gray-400'}`}>
                      <input type="radio" name="orderType" value="guest" checked={checkoutData.orderType === 'guest'} onChange={handleCheckoutChange} className="sr-only" />
                      <span className="text-xl">👤</span>
                      <span className="font-semibold text-sm">Guest</span>
                    </label>
                    <label className={`flex-1 flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition ${checkoutData.orderType === 'login' ? 'border-orange-600 bg-orange-50' : 'border-gray-300 hover:border-gray-400'}`}>
                      <input type="radio" name="orderType" value="login" checked={checkoutData.orderType === 'login'} onChange={handleCheckoutChange} className="sr-only" />
                      <span className="text-xl">🔑</span>
                      <span className="font-semibold text-sm">Sign In</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Full Name *</label>
                    <input type="text" name="name" value={checkoutData.name} onChange={handleCheckoutChange} required placeholder="John Doe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Email *</label>
                    <input type="email" name="email" value={checkoutData.email} onChange={handleCheckoutChange} required placeholder="john@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Phone *</label>
                    <input type="tel" name="phone" value={checkoutData.phone} onChange={handleCheckoutChange} required placeholder="+33 6 12 34 56 78"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Pickup Time (today) *</label>
                    <input type="time" name="pickupTime" value={checkoutData.pickupTime} onChange={handleCheckoutChange} required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                    <p className="text-xs text-gray-500 mt-1">Orders can only be placed for today</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={onClose}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition text-sm">
                    Cancel
                  </button>
                  <button type="submit"
                    className="flex-1 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold transition text-sm">
                    Continue to Payment →
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── ÉTAPE 2 : Paiement — utilise la Server Action via useActionState ── */}
          {step === 'payment' && (
            <div>
              {/* Montant */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Amount to pay</p>
                  <p className="text-3xl font-bold text-orange-600">${totalPrice.toFixed(2)}</p>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p>Base: ${baseTotal.toFixed(2)}</p>
                  {extrasTotal > 0 && <p>Extras: +${extrasTotal.toFixed(2)}</p>}
                </div>
              </div>

              {/* Erreur de la Server Action */}
              {state?.error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {state.error}
                </div>
              )}

              {paymentErrors.general && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {paymentErrors.general}
                </div>
              )}

              {/* Formulaire avec action= Server Action (placeOrder via useActionState) */}
              <form
                action={formAction}
                onSubmit={(e) => {
                  // Valider le paiement côté client avant d'envoyer au serveur
                  if (!validatePayment()) {
                    e.preventDefault();
                  }
                }}
                className="space-y-4"
              >
                {/* ── Champs cachés : données de commande passées à la Server Action ── */}
                <input type="hidden" name="name" value={checkoutData.name} />
                <input type="hidden" name="email" value={checkoutData.email} />
                <input type="hidden" name="phone" value={checkoutData.phone} />
                <input type="hidden" name="pickupTime" value={checkoutData.pickupTime} />
                <input type="hidden" name="ingredients" value={JSON.stringify(selectedIngredients)} />
                <input type="hidden" name="total" value={totalPrice.toString()} />

                {/* Mode de paiement */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Payment method</label>
                  <div className="flex gap-3">
                    {['visa', 'mastercard', 'amex'].map((type) => (
                      <label key={type}
                        className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-lg border-2 cursor-pointer transition text-xs font-bold uppercase ${paymentData.cardType === type ? 'border-orange-600 bg-orange-50 text-orange-700' : 'border-gray-300 hover:border-gray-400 text-gray-600'}`}>
                        <input type="radio" name="cardType" value={type} checked={paymentData.cardType === type} onChange={handlePaymentChange} className="sr-only" />
                        <span className="text-2xl">{type === 'visa' ? '💳' : type === 'mastercard' ? '🔴' : '🔵'}</span>
                        {type === 'amex' ? 'Amex' : type.charAt(0).toUpperCase() + type.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Card Number *</label>
                  <input type="text" name="cardNumber" value={paymentData.cardNumber} onChange={handlePaymentChange}
                    placeholder="1234 5678 9012 3456" maxLength={19}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${paymentErrors.cardNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'}`} />
                  {paymentErrors.cardNumber && <p className="text-red-500 text-xs mt-1">{paymentErrors.cardNumber}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Expiration (MM/YY) *</label>
                    <input type="text" name="expiration" value={paymentData.expiration} onChange={handlePaymentChange}
                      placeholder="12/27" maxLength={5}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${paymentErrors.expiration ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'}`} />
                    {paymentErrors.expiration && <p className="text-red-500 text-xs mt-1">{paymentErrors.expiration}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">CVV *</label>
                    <input type="text" name="cvv" value={paymentData.cvv} onChange={handlePaymentChange}
                      placeholder="123" maxLength={4}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${paymentErrors.cvv ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'}`} />
                    {paymentErrors.cvv && <p className="text-red-500 text-xs mt-1">{paymentErrors.cvv}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Cardholder Name *</label>
                  <input type="text" name="cardholderName" value={paymentData.cardholderName} onChange={handlePaymentChange}
                    placeholder="JOHN DOE"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${paymentErrors.cardholderName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'}`} />
                  {paymentErrors.cardholderName && <p className="text-red-500 text-xs mt-1">{paymentErrors.cardholderName}</p>}
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setStep('order-info')}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition text-sm">
                    ← Back
                  </button>
                  <button type="submit" disabled={isPending}
                    className="flex-1 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-lg font-bold transition text-sm flex items-center justify-center gap-2">
                    {isPending ? (
                      <>
                        <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        Processing...
                      </>
                    ) : (
                      '💳 Pay & Place Order'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
