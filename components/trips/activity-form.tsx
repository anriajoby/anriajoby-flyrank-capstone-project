
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { Trip, TripActivity, TripInterest } from "@/lib/trips/types";
import { validateActivity } from "@/lib/trips/validation";

type ActivityFormProps = {
  trip: Trip;
  onSave: (activity: TripActivity) => void;
  onCancel: () => void;
  initialActivity?: TripActivity;
};

const categories: TripInterest[] = [
  "Sightseeing",
  "Food",
  "Adventure",
  "Shopping",
  "Culture",
  "Nature",
  "Relaxation",
];

export default function ActivityForm({
  trip,
  onSave,
  onCancel,
  initialActivity,
}: ActivityFormProps) {
  const [title, setTitle] = useState(initialActivity?.title ?? "");
  const [description, setDescription] = useState(
    initialActivity?.description ?? ""
  );
  const [date, setDate] = useState(
    initialActivity?.date ?? trip.startDate
  );
  const [estimatedCost, setEstimatedCost] = useState(
    initialActivity?.estimatedCost.toString() ?? ""
  );
  const [category, setCategory] = useState<TripInterest>(
    initialActivity?.category ?? "Sightseeing"
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const activityDetails = {
      title,
      description,
      date,
      estimatedCost: Number(estimatedCost),
      category,
    };

    const validationErrors = validateActivity(activityDetails, trip);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const savedActivity: TripActivity = {
      id: initialActivity?.id ?? crypto.randomUUID(),
      ...activityDetails,
    };

    onSave(savedActivity);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border border-border bg-slate-50 p-5"
    >
      <h3 className="text-lg font-semibold">
        {initialActivity ? "Edit activity" : "Add an activity"}
      </h3>

      <div className="space-y-2">
        <label htmlFor="activity-title" className="font-medium">
          Activity title
        </label>
        <input
          id="activity-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="w-full rounded-lg border border-border bg-white p-3"
          placeholder="e.g. Visit Burj Khalifa"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? "activity-title-error" : undefined}
          required
        />
        {errors.title && (
          <p id="activity-title-error" role="alert" className="text-sm text-red-600">
            {errors.title}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="activity-description" className="font-medium">
          Description
        </label>
        <textarea
          id="activity-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="w-full rounded-lg border border-border bg-white p-3"
          rows={3}
          placeholder="Add some details about this activity..."
          aria-invalid={Boolean(errors.description)}
          required
        />
        {errors.description && (
          <p role="alert" className="text-sm text-red-600">
            {errors.description}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="activity-date" className="font-medium">
          Activity date
        </label>
        <input
          id="activity-date"
          type="date"
          min={trip.startDate}
          max={trip.endDate}
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="w-full rounded-lg border border-border bg-white p-3"
          aria-invalid={Boolean(errors.date)}
          required
        />
        {errors.date && (
          <p role="alert" className="text-sm text-red-600">
            {errors.date}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="activity-category" className="font-medium">
            Category
          </label>
          <select
            id="activity-category"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as TripInterest)
            }
            className="w-full rounded-lg border border-border bg-white p-3"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="activity-cost" className="font-medium">
            Estimated cost (AED)
          </label>
          <input
            id="activity-cost"
            type="number"
            min="0"
            step="0.01"
            value={estimatedCost}
            onChange={(event) => setEstimatedCost(event.target.value)}
            className="w-full rounded-lg border border-border bg-white p-3"
            placeholder="150"
            aria-invalid={Boolean(errors.estimatedCost)}
            required
          />
          {errors.estimatedCost && (
            <p role="alert" className="text-sm text-red-600">
              {errors.estimatedCost}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-border px-4 py-2 hover:bg-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          {initialActivity ? "Update activity" : "Save activity"}
        </button>
      </div>
    </form>
  );
}
