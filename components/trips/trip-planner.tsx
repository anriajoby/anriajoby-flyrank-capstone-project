
"use client";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import TripForm from "./trip-form";
import type { Trip } from "@/lib/trips/types";
import {
  getTripsSnapshot,
  getServerTripsSnapshot,
  subscribeToTrips,
  upsertTrip,
  deleteTrip,
} from "@/lib/trips/storage";

export default function TripPlanner() {
  const tripsSnapshot = useSyncExternalStore(
    subscribeToTrips,
    getTripsSnapshot,
    getServerTripsSnapshot
  );

  const trips = JSON.parse(tripsSnapshot) as Trip[];

  const [message, setMessage] = useState("");

  function handleSaveTrip(trip: Trip): boolean {
    const saved = upsertTrip(trip);
  
    if (!saved) {
      setMessage(
        "Unable to save your trip. Please check your browser storage."
      );
      return false;
    }
  
    setMessage(`${trip.name} was successfully saved!`);
    return true;
  }

  function handleDeleteTrip(tripId: string) {
    const deleted = deleteTrip(tripId);

    if (!deleted) {
      setMessage("Unable to delete this trip. Please try again.");
      return;
    }

    setMessage("Trip successfully deleted.");
  }

  return (
    <main className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to TripTale
        </h1>
        <p className="text-muted">
          Plan your next adventure, organize your itinerary and manage
          your travel budget.
        </p>
      </header>

      {message && (
        <p role="status" className="rounded-lg bg-blue-50 p-3 text-blue-800">
          {message}
        </p>
      )}

      <TripForm onSave={handleSaveTrip} />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          My Trips ({trips.length})
        </h2>

        {trips.length === 0 ? (
          <p className="rounded-lg border border-border bg-white p-6 text-muted">
            You haven&apos;t created any trips yet. Start planning your first
            adventure above!
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {trips.map((trip) => (
              <article
                key={trip.id}
                className="rounded-xl border border-border bg-white p-5"
              >
                <h3 className="text-lg font-semibold">{trip.name}</h3>
                <p className="mt-1 text-muted">{trip.destination}</p>

                <p className="mt-3 text-sm">
                  {trip.startDate} – {trip.endDate}
                </p>

                <p className="mt-2 font-medium">
                  Budget: AED {trip.budget.toLocaleString()}
                </p>

                <p className="mt-2 text-sm text-muted">
                  {trip.activities.length} activities planned
                </p>
                <Link
                href={`/trips/${trip.id}`}
                className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                View Trip
                </Link>
                <button
                  type="button"
                  onClick={() => handleDeleteTrip(trip.id)}
                  className="mt-4 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                >
                  Delete trip
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
