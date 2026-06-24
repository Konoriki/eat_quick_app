import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  // Récupérer tous les ingrédients depuis la base de données
  const ingredients = await prisma.ingredient.findMany();

  // Formater les ingrédients par catégorie pour correspondre au format attendu par le front
  // { veggies: [...], proteins: [...], sauces: [...], extras: [...] }
  const formattedIngredients = ingredients.reduce(
    (acc, ingredient) => {
      const category = ingredient.category as keyof typeof acc;
      if (acc[category]) {
        acc[category].push({
          id: `${category.charAt(0)}${acc[category].length + 1}`,
          name: ingredient.label,
          price: ingredient.price,
        });
      }
      return acc;
    },
    {
      veggies: [] as { id: string; name: string; price: number }[],
      proteins: [] as { id: string; name: string; price: number }[],
      sauces: [] as { id: string; name: string; price: number }[],
      extras: [] as { id: string; name: string; price: number }[],
    }
  );

  return NextResponse.json(formattedIngredients);
}
