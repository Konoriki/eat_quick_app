import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const dataDirectory = path.join(process.cwd(), 'data', 'menu-offer');

export interface MenuItem {
  slug: string;
  title: string;
  category: string;
  price?: number;
  image?: string;
  content: string;
  ingredients?: string[];
  calories?: number;
}

export function getAllMenuItems(): MenuItem[] {
  // On lit tous les fichiers du dossier
  const fileNames = fs.readdirSync(dataDirectory).filter(name => name.endsWith('.md'));
  
  const allData = fileNames.map((fileName) => {
    // Le "slug" (l'URL) sera le nom du fichier sans ".md"
    const slug = fileName.replace(/\.md$/, '');

    // On lit le contenu du fichier
    const fullPath = path.join(dataDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Gray-matter sépare le frontmatter (les données) du contenu (le texte)
    const matterResult = matter(fileContents);

    return {
      slug: matterResult.data.slug || slug,
      content: matterResult.content,
      title: matterResult.data.title || slug.replace(/-/g, ' '),
      category: matterResult.data.category?.toLowerCase() || 'other',
      price: matterResult.data.price,
      image: matterResult.data.imageSrc,
      ingredients: matterResult.data.ingredients || [],
      calories: matterResult.data.calories,
    } as MenuItem;
  });

  return allData;
}

export function getMenuItemBySlug(slug: string): MenuItem | null {
  const items = getAllMenuItems();
  return items.find(item => item.slug === slug) || null;
}

export function getMenuItemsByCategory(category: string): MenuItem[] {
  const items = getAllMenuItems();
  const normalizedCategory = category.toLowerCase().replace('-', '-');
  return items.filter(item => item.category === normalizedCategory);
}

export function getCategories(): string[] {
  const items = getAllMenuItems();
  const categories = new Set(items.map(item => item.category));
  return Array.from(categories).sort();
}