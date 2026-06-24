import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

// ── Données clients ──
const customers = [
  { name: "Alice", email: "alice@eatquick.io", pass: "alice123" },
  { name: "Bob", email: "bob@eatquick.io", pass: "bob123" },
  { name: "Charlie", email: "charlie@eatquick.io", pass: "charlie123" },
];

// ── Liste complète des ingrédients ──
const ingredients = [
  // Veggies
  { category: "veggies", label: "Salad", price: 5 },
  { category: "veggies", label: "Pasta", price: 6 },
  { category: "veggies", label: "Rice", price: 6 },
  { category: "veggies", label: "Quinoa", price: 7 },
  { category: "veggies", label: "Lentils", price: 6 },
  // Proteins
  { category: "proteins", label: "Tuna", price: 5 },
  { category: "proteins", label: "Eggs", price: 4 },
  { category: "proteins", label: "Tofu", price: 4 },
  { category: "proteins", label: "Chicken", price: 6 },
  // Sauces
  { category: "sauces", label: "Mustard", price: 1 },
  { category: "sauces", label: "Vinegar", price: 1 },
  { category: "sauces", label: "Lemon", price: 1 },
  { category: "sauces", label: "Sweet Curry", price: 2 },
  { category: "sauces", label: "Tandoori", price: 2 },
  // Extras
  { category: "extras", label: "Nuts", price: 1 },
  { category: "extras", label: "Sesame Seeds", price: 0.5 },
  { category: "extras", label: "Dried Fruits", price: 1 },
  { category: "extras", label: "Pickles", price: 0.5 },
  { category: "extras", label: "Feta Cheese", price: 2 },
];

// ── Commandes fictives ──
const orders = [
  {
    orderNumber: "ORD-001",
    pickupTime: "12:30",
    clientName: "Alice",
    clientEmail: "alice@eatquick.io",
    orderDetail: JSON.stringify([
      { name: "Salad", price: 5 },
      { name: "Tuna", price: 5 },
      { name: "Lemon", price: 1 },
      { name: "Feta Cheese", price: 2 },
    ]),
    status: "READY",
    total: 18.99,
    customerEmail: "alice@eatquick.io",
  },
  {
    orderNumber: "ORD-002",
    pickupTime: "13:00",
    clientName: "Bob",
    clientEmail: "bob@eatquick.io",
    orderDetail: JSON.stringify([
      { name: "Quinoa", price: 7 },
      { name: "Chicken", price: 6 },
      { name: "Sweet Curry", price: 2 },
    ]),
    status: "PENDING",
    total: 20.99,
    customerEmail: "bob@eatquick.io",
  },
  {
    orderNumber: "ORD-003",
    pickupTime: "14:15",
    clientName: "Guest User",
    clientEmail: "guest@example.com",
    orderDetail: JSON.stringify([
      { name: "Rice", price: 6 },
      { name: "Tofu", price: 4 },
      { name: "Tandoori", price: 2 },
      { name: "Nuts", price: 1 },
      { name: "Sesame Seeds", price: 0.5 },
    ]),
    status: "PREPARING",
    total: 19.49,
    customerEmail: null, // commande en tant qu'invité
  },
];

async function main() {
  console.log("🌱 Seeding database...\n");

  // Nettoyer la BDD avant le seed
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.ingredient.deleteMany();

  // ── Créer les clients ──
  console.log("👤 Creating customers...");
  for (const c of customers) {
    const created = await prisma.customer.create({ data: c });
    console.log(`   ✓ ${created.name} (${created.email})`);
  }

  // ── Créer les ingrédients ──
  console.log("\n🥗 Creating ingredients...");
  for (const ing of ingredients) {
    await prisma.ingredient.create({ data: ing });
  }
  console.log(`   ✓ ${ingredients.length} ingredients created`);

  // ── Créer les commandes ──
  console.log("\n📦 Creating orders...");
  for (const order of orders) {
    const { customerEmail, ...orderData } = order;

    let customerId: number | undefined = undefined;
    if (customerEmail) {
      const customer = await prisma.customer.findUnique({
        where: { email: customerEmail },
      });
      if (customer) customerId = customer.id;
    }

    const created = await prisma.order.create({
      data: {
        ...orderData,
        customerId: customerId ?? null,
      },
    });
    console.log(
      `   ✓ ${created.orderNumber} - ${created.clientName} (${created.status})`
    );
  }

  console.log("\n✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
