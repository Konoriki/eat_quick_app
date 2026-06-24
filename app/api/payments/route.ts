import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cardNumber, cardType, expiration, cvv, cardholderName, amount, orderNumber } = body;

    // Validation côté serveur
    if (!cardNumber || !cardType || !expiration || !cvv || !cardholderName || !amount || !orderNumber) {
      return NextResponse.json(
        { error: 'Missing required payment information' },
        { status: 400 }
      );
    }

    // Validate card number length (simple Luhn check would be more robust)
    if (cardNumber.replace(/\s/g, '').length < 13 || cardNumber.replace(/\s/g, '').length > 19) {
      return NextResponse.json(
        { error: 'Invalid card number' },
        { status: 400 }
      );
    }

    // Validate expiration format
    const expirationRegex = /^\d{2}\/\d{2}$/;
    if (!expirationRegex.test(expiration)) {
      return NextResponse.json(
        { error: 'Invalid expiration format' },
        { status: 400 }
      );
    }

    // Validate CVV (3-4 digits)
    if (!/^\d{3,4}$/.test(cvv)) {
      return NextResponse.json(
        { error: 'Invalid CVV' },
        { status: 400 }
      );
    }

    // Validate cardholder name
    if (cardholderName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Invalid cardholder name' },
        { status: 400 }
      );
    }

    // Simulate payment processing (in production: use a real payment gateway like Stripe)
    // For demo purposes, we'll accept all valid payments
    const paymentId = 'PAY-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    return NextResponse.json({
      success: true,
      paymentId,
      orderNumber,
      amount,
      message: 'Payment processed successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    );
  }
}
