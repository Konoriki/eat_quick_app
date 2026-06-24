import prisma from "@/lib/prisma";
import Link from "next/link";
import RefreshButton from "./RefreshButton";

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return "***@***.***";
  const masked = local.charAt(0) + "***";
  return `${masked}@${domain}`;
}

function maskName(name: string): string {
  if (name.length <= 2) return name.charAt(0) + "***";
  return name.charAt(0) + "***" + name.charAt(name.length - 1);
}

function getStatusDisplay(status: string) {
  switch (status.toUpperCase()) {
    case "PENDING":
      return { icon: "⏳", label: "Pending", color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-300" };
    case "PREPARING":
      return { icon: "", label: "Preparing", color: "text-blue-600", bg: "bg-blue-50 border-blue-300" };
    case "READY":
      return { icon: "", label: "Ready for Pickup", color: "text-green-600", bg: "bg-green-50 border-green-300" };
    case "PICKED_UP":
      return { icon: "", label: "Picked Up", color: "text-gray-600", bg: "bg-gray-50 border-gray-300" };
    case "CANCELLED":
      return { icon: "", label: "Cancelled", color: "text-red-600", bg: "bg-red-50 border-red-300" };
    default:
      return { icon: "", label: status, color: "text-gray-600", bg: "bg-gray-50 border-gray-300" };
  }
}

export default async function TrackingOrderPage({
  params,
}: {
  params: Promise<{ trackingOrderNumber: string }>;
}) {
  const { trackingOrderNumber } = await params;

  const isInteger = /^\d+$/.test(trackingOrderNumber);
  const isOrdFormat = /^ORD-\d+-[A-Z0-9]+$/.test(trackingOrderNumber);

  if (!isInteger && !isOrdFormat) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <div className="text-7xl mb-6">⚠️</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Invalid Order Format</h1>
        <p className="text-gray-500 mb-2">
          The order number provided is invalid.
        </p>
        <p className="font-mono text-orange-600 font-bold text-lg mb-8 break-all">
          {trackingOrderNumber}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/make-your-own-salad"
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition"
          >
            Place a New Order
          </Link>
        </div>
      </div>
    );
  }

  let order;
  if (isInteger) {
    order = await prisma.order.findUnique({
      where: { id: parseInt(trackingOrderNumber) },
      include: { customer: true },
    });
  } else {
    order = await prisma.order.findUnique({
      where: { orderNumber: trackingOrderNumber },
      include: { customer: true },
    });
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <div className="text-7xl mb-6">🔍</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Not Found</h1>
        <p className="text-gray-500 mb-2">
          No order was found with the number:
        </p>
        <p className="font-mono text-orange-600 font-bold text-lg mb-8 break-all">
          {trackingOrderNumber}
        </p>
        <p className="text-gray-500 mb-8">
          Please double-check the order number or try one of the options below.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/make-your-own-salad"
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition"
          >
            Place a New Order
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl font-bold transition"
          >
            Contact Us
          </Link>
        </div>
      </div>
    );
  }

  const statusDisplay = getStatusDisplay(order.status);
  let orderItems: { name: string; price: number }[] = [];
  try {
    orderItems = JSON.parse(order.orderDetail);
  } catch {
    orderItems = [];
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="text-6xl mb-4">📦</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Tracking</h1>
        <p className="text-gray-500">Follow the status of your order</p>
      </div>

      {/* Numéro de commande */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 mb-6 text-center">
        <p className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-1">
          Order Number
        </p>
        <p className="text-xl font-bold text-orange-600 font-mono break-all">
          {order.orderNumber}
        </p>
      </div>

      {/* Statut */}
      <div className={`border rounded-xl p-5 mb-6 text-center flex flex-col items-center ${statusDisplay.bg}`}>
        <div className="text-4xl mb-2">{statusDisplay.icon}</div>
        <p className={`text-xl font-bold ${statusDisplay.color}`}>
          {statusDisplay.label}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Ordered at {new Date(order.orderTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
        </p>
        <RefreshButton />
      </div>

      {/* Informations client — affichage limité */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <h2 className="font-bold text-gray-900 mb-4">📋 Order Details</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Customer</span>
            <span className="font-semibold text-gray-800">{maskName(order.clientName)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Email</span>
            <span className="font-semibold text-gray-800">{maskEmail(order.clientEmail)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Pickup Time</span>
            <span className="font-semibold text-gray-800">{order.pickupTime} (today)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Type</span>
            <span className="font-semibold text-gray-800">
              {order.customerId ? " Registered" : " Guest"}
            </span>
          </div>
        </div>
      </div>

      {/* Détail des ingrédients */}
      {orderItems.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="font-bold text-gray-900 mb-4"> Your Salad</h2>
          <div className="space-y-2 text-sm">
            {orderItems.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <span className="text-gray-700">{item.name}</span>
                <span className="text-gray-500">+${item.price.toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between font-bold text-orange-600">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/make-your-own-salad"
          className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition text-center"
        >
          New Order
        </Link>
        <Link
          href="/"
          className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl font-bold transition text-center"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
