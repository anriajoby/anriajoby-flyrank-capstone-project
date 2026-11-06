
"use client";

import { useState, useSyncExternalStore } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import ActivityForm from "@/components/trips/activity-form";
import type { Trip, TripActivity } from "@/lib/trips/types";

import {
  getTripsSnapshot,
  getServerTripsSnapshot,
  subscribeToTrips,
  upsertTrip,
} from "@/lib/trips/storage";

export default function TripDetailsPage() {
  const params = useParams<{ tripId: string }>();
  const tripId = params.tripId;

  const tripsSnapshot = useSyncExternalStore(
    subscribeToTrips,
    getTripsSnapshot,
    getServerTripsSnapshot
  );

  const trips = JSON.parse(tripsSnapshot) as Trip[];

  const trip = trips.find((item) => item.id === tripId);

  const [showActivityForm, setShowActivityForm] = useState(false);
  const [editingActivity, setEditingActivity] =
  useState<TripActivity | null>(null);
  const [message, setMessage] = useState("");

  function handleSaveActivity(activity: TripActivity) {
    if (!trip) return;

    const updatedTrip: Trip = {
      ...trip,
      activities: [...trip.activities, activity],
      updatedAt: new Date().toISOString(),
    };

    const saved = upsertTrip(updatedTrip);

    if (!saved) {
      setMessage(
        "Unable to save this activity. Please try again."
      );
      return;
    }

    setShowActivityForm(false);
    setMessage("Activity successfully added!");
  }
  function handleUpdateActivity(activity: TripActivity) {
    if (!trip) return;
  
    const updatedTrip: Trip = {
      ...trip,
      activities: trip.activities.map((item) =>
        item.id === activity.id ? activity : item
      ),
      updatedAt: new Date().toISOString(),
    };
  
    const saved = upsertTrip(updatedTrip);
  
    if (!saved) {
      setMessage("Unable to update this activity. Please try again.");
      return;
    }
  
    setEditingActivity(null);
    setMessage("Activity successfully updated!");
  }
  function handleDeleteActivity(activityId: string) {
    if (!trip) return;

    const updatedTrip: Trip = {
      ...trip,
      activities: trip.activities.filter(
        (activity) => activity.id !== activityId
      ),
      updatedAt: new Date().toISOString(),
    };

    const saved = upsertTrip(updatedTrip);

    if (!saved) {
      setMessage("Unable to delete this activity. Please try again.");
      return;
    }

    setMessage("Activity successfully deleted!");
  }

  if (!trip) {
    return (
      <main className="space-y-4">
        <h1 className="text-2xl font-bold">Trip not found</h1>
        <p className="text-muted">
          This trip may have been deleted or does not exist.
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          Back to My Trips
        </Link>
      </main>
    );
  }

  return (
    <main className="space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-blue-600 hover:underline"
      >
        ← Back to My Trips
      </Link>

      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">
          {trip.name}
        </h1>

        <p className="text-lg text-muted">
          {trip.destination}
        </p>

        <div className="grid gap-4 rounded-xl border border-border bg-white p-5 sm:grid-cols-3">
          <div>
            <p className="text-sm text-muted">Start date</p>
            <p className="font-medium">{trip.startDate}</p>
          </div>

          <div>
            <p className="text-sm text-muted">End date</p>
            <p className="font-medium">{trip.endDate}</p>
          </div>

          <div>
            <p className="text-sm text-muted">Total budget</p>
            <p className="font-medium">
              AED {trip.budget.toLocaleString()}
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-semibold">Your interests</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {trip.interests.map((interest) => (
              <span
                key={interest}
                className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </header>

      {message && (
        <p
          role="status"
          className="rounded-lg bg-blue-50 p-3 text-blue-800"
        >
          {message}
        </p>
      )}

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">
              Your Itinerary
            </h2>
            <p className="text-sm text-muted">
              {trip.activities.length} activities planned
            </p>
          </div>

          {!showActivityForm && (
            <button
              type="button"
              onClick={() => setShowActivityForm(true)}
              className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              + Add Activity
            </button>
          )}
        </div>

        {(showActivityForm || editingActivity) && (
        <ActivityForm
        key={editingActivity?.id ?? "new-activity"}
        trip={trip}
        initialActivity={editingActivity ?? undefined}
        onSave={
        editingActivity ? handleUpdateActivity : handleSaveActivity
        }
        onCancel={() => {
        setShowActivityForm(false);
        setEditingActivity(null);
            }}
        />
        )}

        {trip.activities.length === 0 ? (
          <p className="rounded-xl border border-border bg-white p-6 text-muted">
            No activities planned yet. Start building your itinerary
            by adding your first activity!
          </p>
        ) : (
          <div className="space-y-4">
            {trip.activities.map((activity) => (
              <article
                key={activity.id}
                className="rounded-xl border border-border bg-white p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {activity.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted">
                      {activity.description}
                    </p>
                  </div>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
                    {activity.category}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  <p>
                    <span className="text-muted">Date:</span>{" "}
                    {activity.date}
                  </p>

                  <p>
                    <span className="text-muted">Estimated cost:</span>{" "}
                    AED {activity.estimatedCost.toLocaleString()}
                  </p>
                </div>
                <button
                type="button"
                onClick={() => {
                setEditingActivity(activity);
                setShowActivityForm(false);
                }}
                className="mt-4 mr-2 rounded-lg border border-blue-300 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                Edit Activity
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteActivity(activity.id)}
                  className="mt-4 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                >
                  Delete Activity
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}