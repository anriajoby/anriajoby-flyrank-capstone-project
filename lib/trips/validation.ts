
import type { Trip, TripActivity } from "./types";

export type TripValidationErrors = Partial<
  Record<
    "name" | "destination" | "startDate" | "endDate" | "budget" | "interests",
    string
  >
>;

export function validateTrip(
  trip: Pick<
    Trip,
    | "name"
    | "destination"
    | "startDate"
    | "endDate"
    | "budget"
    | "interests"
  >,
): TripValidationErrors {
  const errors: TripValidationErrors = {};

  if (!trip.name.trim()) {
    errors.name = "Trip name is required.";
  }

  if (!trip.destination.trim()) {
    errors.destination = "Destination is required.";
  }

  if (!trip.startDate) {
    errors.startDate = "Start date is required.";
  }

  if (!trip.endDate) {
    errors.endDate = "End date is required.";
  }

  if (
    trip.startDate &&
    trip.endDate &&
    trip.endDate < trip.startDate
  ) {
    errors.endDate = "End date must be after the start date.";
  }

  if (!Number.isFinite(trip.budget) || trip.budget <= 0) {
    errors.budget = "Enter a valid budget greater than zero.";
  }

  if (trip.interests.length === 0) {
    errors.interests = "Select at least one travel interest.";
  }

  return errors;
}

export type ActivityValidationErrors = Partial<
  Record<
    "title" | "description" | "date" | "estimatedCost" | "category",
    string
  >
>;

export function validateActivity(
  activity: Omit<TripActivity, "id">,
  trip: Pick<Trip, "startDate" | "endDate">,
): ActivityValidationErrors {
  const errors: ActivityValidationErrors = {};

  if (!activity.title.trim()) {
    errors.title = "Activity title is required.";
  }

  if (!activity.description.trim()) {
    errors.description = "Activity description is required.";
  }

  if (!activity.date) {
    errors.date = "Activity date is required.";
  } else if (
    activity.date < trip.startDate ||
    activity.date > trip.endDate
  ) {
    errors.date = "Activity date must fall within your trip dates.";
  }

  if (
    !Number.isFinite(activity.estimatedCost) ||
    activity.estimatedCost < 0
  ) {
    errors.estimatedCost = "Enter a valid non-negative activity cost.";
  }

  const validCategories = [
    "Sightseeing",
    "Food",
    "Adventure",
    "Shopping",
    "Culture",
    "Nature",
    "Relaxation",
  ];

  if (!validCategories.includes(activity.category)) {
    errors.category = "Choose a valid activity category.";
  }

  return errors;
}

