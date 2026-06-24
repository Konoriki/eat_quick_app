"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

// État retourné par l'action
export type PlaceOrderState = {
  error?: string;
  success?: boolean;
};

function generateOrderNumber(): string {
  return (
    "ORD-" +
    Date.now() +
    "-" +
    Math.random().toString(36).substr(2, 9).toUpperCase()
  );
}

const placeOrder = async (
  prevState: PlaceOrderState,
  formData: FormData
): Promise<PlaceOrderState> => {
  // Récupérer les valeurs du formulaire
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const pickupTime = formData.get("pickupTime") as string;
  const ingredientsRaw = formData.get("ingredients") as string;
  const totalRaw = formData.get("total") as string;

  // Vérifier la conformité des données
  if (!name || !email || !phone || !pickupTime) {
    return { error: "Tous les champs sont requis." };
  }

  if (!ingredientsRaw || !totalRaw) {
    return { error: "Données de commande manquantes." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Adresse email invalide." };
  }

  let ingredients;
  try {
    ingredients = JSON.parse(ingredientsRaw);
  } catch {
    return { error: "Format des ingrédients invalide." };
  }

  const total = parseFloat(totalRaw);
  if (isNaN(total) || total <= 0) {
    return { error: "Montant total invalide." };
  }

  // Formatter les données au format attendu par la BDD
  const orderNumber = generateOrderNumber();

  // Chercher si le client existe en BDD (commande connectée vs invité)
  const existingCustomer = await prisma.customer.findUnique({
    where: { email },
  });

  // Appeler le client Prisma pour créer une nouvelle entrée en BDD
  const newOrder = await prisma.order.create({
    data: {
      orderNumber,
      pickupTime,
      clientName: name,
      clientEmail: email,
      orderDetail: JSON.stringify(ingredients),
      status: "PENDING",
      total,
      customerId: existingCustomer?.id ?? null,
    },
  });

  if (newOrder == null) {
    return { error: "Erreur lors de la création de la commande." };
  }

  // Rediriger vers la page de suivi de commande
  // redirect() doit être appelé en dehors du try/catch (doc Next.js)
  redirect(`/tracking-order/${newOrder.orderNumber}`);
};

export default placeOrder;
