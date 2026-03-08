import { useParams, useNavigate, useSearchParams } from 'react-router';
import { CheckCircle, CreditCard } from 'lucide-react';
import { NoiseButton } from '@/components/ui/noise-button';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useApp } from '../context/AppContext';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);
  const { orders } = useApp();

  const paymentId = searchParams.get('payment');
  const isDemoMode = searchParams.get('demo') === 'true';
  const order = orders.find(o => o._id === orderId);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.success-icon', {
        scale: 0,
        rotation: -180,
        duration: 0.8,
        ease: 'back.out(1.7)'
      });
      
      gsap.from('.order-details', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: 'power3.out'
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center">
        <CheckCircle size={120} className="success-icon mx-auto mb-8 text-green-500" />
        
        <div className="order-details space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Order Confirmed!
          </h1>
          
          <p className="text-xl opacity-70">
            Thank you for your purchase
          </p>
          
          <div className="bg-gray-100 rounded-3xl p-8 space-y-4">
            <div>
              <p className="text-sm opacity-70 mb-2">Order Number</p>
              <p className="text-2xl font-bold">{order?.orderNumber || orderId}</p>
            </div>
            
            {paymentId && (
              <div className="border-t pt-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CreditCard size={16} className="opacity-70" />
                  <p className="text-sm opacity-70">Payment ID</p>
                </div>
                <p className="text-lg font-mono font-medium">{paymentId}</p>
                <p className="text-xs text-green-600 mt-2">✓ Payment Successful</p>
              </div>
            )}
            
            {isDemoMode && (
              <div className="border-t pt-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 font-medium">
                    ⚠️ DEMO MODE - No Payment Processed
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    This order was created without Razorpay payment. Configure Razorpay to accept real payments.
                  </p>
                </div>
              </div>
            )}
            
            {order && (
              <div className="border-t pt-4 text-left">
                <p className="text-sm opacity-70 mb-3">Order Summary</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="opacity-70">Items:</span>
                    <span>{order.items.length} items</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-70">Total Amount:</span>
                    <span className="font-bold">₹{order.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-70">Status:</span>
                    <span className="capitalize px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <p className="text-lg opacity-80 max-w-md mx-auto">
            We've sent a confirmation email to{' '}
            <span className="font-medium">{order?.customerEmail}</span> with your order details. 
            You'll receive another email once your order ships.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <NoiseButton
              onClick={() => navigate('/orders')}
              containerClassName="w-fit"
            >
              Track Your Order
            </NoiseButton>
            <NoiseButton
              onClick={() => navigate('/shop')}
              containerClassName="w-fit"
            >
              Continue Shopping
            </NoiseButton>
          </div>
        </div>
      </div>
    </div>
  );
}