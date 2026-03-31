export interface Unit {
  id: string;
  type: string;
  category: string;
  price: number;
  monthlyRepayment: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  kitchens: number;
}

export interface ProjectUnits {
  id: number;
  name: string;
  location: string;
  images: string[];
  units: Unit[];
}
