
export type TripInterest =
  | "Sightseeing"
  | "Food"
  | "Adventure"
  | "Shopping"
  | "Culture"
  | "Nature"
  | "Relaxation";

export type TripActivity = {
  id: string;
  title: string;
  description: string;
  date: string;
  estimatedCost: number;
  category: TripInterest;
};

export type Trip = {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: "AED";
  interests: TripInterest[];
  activities: TripActivity[];
  createdAt: string;
  updatedAt: string;
};
