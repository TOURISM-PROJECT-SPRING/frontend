import { useEffect, useState } from "react";
import { repository } from "../data/repository";

// Generic async resource hook. `fetcher` returns { items, source }.
export function useResource(fetcher, deps = []) {
  const [state, setState] = useState({
    loading: true,
    error: null,
    items: [],
    source: null,
  });

  // oxlint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true }));
    Promise.resolve(fetcher())
      .then((res) => {
        if (!alive) return;
        setState({ loading: false, error: res.error || null, items: res.items || [], source: res.source });
      })
      .catch((e) => {
        if (alive) setState({ loading: false, error: e, items: [], source: null });
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}

export const useTours = () => useResource(() => repository.getTours(), []);
export const useHotels = () => useResource(() => repository.getHotels(), []);
export const useRestaurants = () => useResource(() => repository.getRestaurants(), []);
export const useDestinations = () => useResource(() => repository.getDestinations(), []);
export const useCategories = () => useResource(() => repository.getCategories(), []);
export const useTour = (id) => useResource(() => repository.getTour(id), [id]);
export const useHotel = (id) => useResource(() => repository.getHotel(id), [id]);
export const useRestaurant = (id) => useResource(() => repository.getRestaurant(id), [id]);
export const useBookings = () => useResource(() => repository.getBookings(), []);
export const useDashboardStats = () => useResource(() => repository.getDashboardStats(), []);

// Recommendations return a { hotels, restaurants } object rather than a flat list.
export function useTourRecommendations(tour) {
  const [state, setState] = useState({ loading: true, hotels: [], restaurants: [], source: null });
  const key = tour ? `${tour.id}` : "";
  useEffect(() => {
    if (!tour) return;
    let alive = true;
    setState((s) => ({ ...s, loading: true }));
    repository.getRecommendationsForTour(tour).then((res) => {
      if (alive) setState({ loading: false, hotels: res.hotels, restaurants: res.restaurants, source: res.source });
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return state;
}
