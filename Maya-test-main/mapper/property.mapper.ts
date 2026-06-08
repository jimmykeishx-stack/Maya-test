export interface PropertyRow {
  id: number;
  title: string;
  location: string;
  price: number;
  area_sqft: number;
  created_at: string;
}

export function normalizeProperty(row: PropertyRow) {
  return {
    id: row.id,
    title: row.title,
    location: row.location,
    price: row.price,
    areaSqft: row.area_sqft,
    createdAt: row.created_at,
  };
}