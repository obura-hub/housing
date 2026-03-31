export interface Project {
  id: number;
  name: string;
  location: string;
  units: string;
  price: string;
  description: string;
  image: string;
}

export interface UnitType {
  type: string;
  size: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
}

export interface PaymentPlan {
  plan: string;
  discount: string;
  description: string;
}

export interface Project {
  id: number;
  name: string;
  location: string;
  units: number; // assuming integer
  price: string;
  description: string;
  coverImage: string; // URL of the first image (from ProjectImage)
}

// For full details (including related data)
export interface ProjectDetails extends Project {
  address: string;
  longDescription?: string;
  status: string;
  completionDate: string;
  developer: string;
  contact: {
    email: string;
    phone: string;
  };
  images: string[]; // all images
  unitTypes: UnitType[];
  amenities: string[];
  paymentPlans: PaymentPlan[];
}

export interface UnitType {
  type: string;
  size: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
}

export interface PaymentPlan {
  plan: string;
  discount: string;
  description: string;
}
