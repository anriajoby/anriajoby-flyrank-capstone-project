
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { Trip, TripInterest } from "@/lib/trips/types";
import { validateTrip } from "@/lib/trips/validation";

type TripFormProps = {
  onSave: (trip: Trip) => boolean;
};

const availableInterests: TripInterest[] = [
  "Sightseeing",
  "Food",
  "Adventure",
  "Shopping",
  "Culture",
  "Nature",
  "Relaxation",
];

export default function TripForm({ onSave }: TripFormProps) {
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [interests, setInterests] = useState<TripInterest[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function toggleInterest(interest: TripInterest) {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const tripDetails = {
      name,
      destination,
      startDate,
      endDate,
      budget: Number(budget),
      interests,
    };

    const validationErrors = validateTrip(tripDetails);

    if (
      startDate &&
      startDate < new Date().toISOString().split("T")[0]
    ) {
      validationErrors.startDate = "Start date cannot be in the past.";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const now = new Date().toISOString();

    const newTrip: Trip = {
      id: crypto.randomUUID(),
      ...tripDetails,
      currency: "AED",
      activities: [],
      createdAt: now,
      updatedAt: now,
    };

    const saved = onSave(newTrip);
    if (saved) {
      setName("");
      setDestination("");
      setStartDate("");
      setEndDate("");
      setBudget("");
      setInterests([]);
      setErrors({});
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border border-border bg-white p-6"
    >
      <div>
        <h2 className="text-xl font-semibold">Create a new trip</h2>
        <p className="mt-1 text-sm text-muted">
          Tell us about your next adventure.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="trip-name" className="block font-medium">
          Trip name
        </label>
        <input
          id="trip-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Summer Holiday"
          className="w-full rounded-lg border border-border p-3"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "trip-name-error" : undefined}
          required
        />
        {errors.name && (
          <p id="trip-name-error" className="text-sm text-red-600" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="destination" className="block font-medium">
          Destination
        </label>
        <input
          id="destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="e.g. Dubai, UAE"
          className="w-full rounded-lg border border-border p-3"
          aria-invalid={Boolean(errors.destination)}
          aria-describedby={
            errors.destination ? "destination-error" : undefined
          }
          required
        />
        {errors.destination && (
          <p id="destination-error" className="text-sm text-red-600" role="alert">
            {errors.destination}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="start-date" className="block font-medium">
            Start date
          </label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-lg border border-border p-3"
            aria-invalid={Boolean(errors.startDate)}
            required
          />
          {errors.startDate && (
            <p className="text-sm text-red-600" role="alert">
              {errors.startDate}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="end-date" className="block font-medium">
            End date
          </label>
          <input
            id="end-date"
            type="date"
            min={startDate || undefined}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-lg border border-border p-3"
            aria-invalid={Boolean(errors.endDate)}
            required
          />
          {errors.endDate && (
            <p className="text-sm text-red-600" role="alert">
              {errors.endDate}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="budget" className="block font-medium">
          Total budget (AED)
        </label>
        <input
          id="budget"
          type="number"
          min="1"
          step="0.01"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="5000"
          className="w-full rounded-lg border border-border p-3"
          aria-invalid={Boolean(errors.budget)}
          required
        />
        {errors.budget && (
          <p className="text-sm text-red-600" role="alert">
            {errors.budget}
          </p>
        )}
      </div>

      <fieldset className="space-y-3">
        <legend className="font-medium">What interests you?</legend>

        <div className="flex flex-wrap gap-3">
          {availableInterests.map((interest) => (
            <label
              key={interest}
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-2"
            >
              <input
                type="checkbox"
                checked={interests.includes(interest)}
                onChange={() => toggleInterest(interest)}
              />
              {interest}
            </label>
          ))}
        </div>

        {errors.interests && (
          <p className="text-sm text-red-600" role="alert">
            {errors.interests}
          </p>
        )}
      </fieldset>

      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
      >
        Create Trip
      </button>
    </form>
  );
}
