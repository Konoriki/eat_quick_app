import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

function generateOrderNumber(): string {
  return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ingredients, userInfo, total } = body;

    // Validation
    if (!ingredients || !userInfo || !total) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!userInfo.name || !userInfo.email || !userInfo.phone || !userInfo.pickupTime) {
      return NextResponse.json(
        { error: 'Incomplete user information' },
        { status: 400 }
      );
    }

    const orderNumber = generateOrderNumber();

    // Chercher si le client existe en BDD (commande connectée vs invité)
    const existingCustomer = await prisma.customer.findUnique({
      where: { email: userInfo.email },
    });

    // Sauvegarder la commande en base de données
    const order = await prisma.order.create({
      data: {
        orderNumber,
        pickupTime: userInfo.pickupTime,
        clientName: userInfo.name,
        clientEmail: userInfo.email,
        orderDetail: JSON.stringify(ingredients), // Détail stocké en JSON
        status: 'PENDING',
        total,
        customerId: existingCustomer?.id ?? null, // Lié au client si connecté, sinon null (invité)
      },
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      order,
    });
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const orderNumber = request.nextUrl.searchParams.get('orderNumber');

    if (!orderNumber) {
      return NextResponse.json(
        { error: 'Order number is required' },
        { status: 400 }
      );
    }

    // Récupérer la commande depuis la BDD
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { customer: true }, // Inclure les infos du client si lié
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Failed to retrieve order:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve order' },
      { status: 500 }
    );
  }
}
