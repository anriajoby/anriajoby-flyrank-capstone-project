
import type { Trip } from "./types";

const STORAGE_KEY = "triptale-trips";
const TRIPS_EVENT = "triptale-trips-updated";

export function subscribeToTrips(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", callback);
  window.addEventListener(TRIPS_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(TRIPS_EVENT, callback);
  };
}

export function getTripsSnapshot(): string {
  return JSON.stringify(getTrips());
}

export function getServerTripsSnapshot(): string {
  return "[]";
}

function isTrip(value: unknown): value is Trip {
  if (!value || typeof value !== "object") {
    return false;
  }

  const trip = value as Record<string, unknown>;

  return (
    typeof trip.id === "string" &&
    typeof trip.name === "string" &&
    typeof trip.destination === "string" &&
    typeof trip.startDate === "string" &&
    typeof trip.endDate === "string" &&
    typeof trip.budget === "number" &&
    trip.currency === "AED" &&
    Array.isArray(trip.interests) &&
    Array.isArray(trip.activities) &&
    typeof trip.createdAt === "string" &&
    typeof trip.updatedAt === "string"
  );
}

export function getTrips(): Trip[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedData = localStorage.getItem(STORAGE_KEY);

    if (!storedData) {
      return [];
    }

    const parsedData: unknown = JSON.parse(storedData);

    if (!Array.isArray(parsedData)) {
      return [];
    }

    return parsedData.filter(isTrip);
  } catch (error) {
    console.error("Failed to retrieve saved trips:", error);
    return [];
  }
}

export function saveTrips(trips: Trip[]): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    window.dispatchEvent(new Event(TRIPS_EVENT));
    return true;
  } catch (error) {
    console.error("Failed to save trips:", error);
    return false;
  }
}

export function upsertTrip(newTrip: Trip): boolean {
  const trips = getTrips();

  const existingIndex = trips.findIndex(
    (trip) => trip.id === newTrip.id
  );

  if (existingIndex >= 0) {
    trips[existingIndex] = newTrip;
  } else {
    trips.push(newTrip);
  }

  return saveTrips(trips);
}

export function deleteTrip(tripId: string): boolean {
  const trips = getTrips();

  const updatedTrips = trips.filter(
    (trip) => trip.id !== tripId
  );

  return saveTrips(updatedTrips);
}
