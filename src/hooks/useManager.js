import { useEffect, useState } from "react";
import { managerRepository } from "../data/managerRepository";

export function useManager(entity) {
  const [state, setState] = useState({ loading: true, items: [], source: null });

  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true }));
    managerRepository.fetch(entity).then((res) => {
      if (alive) setState({ loading: false, items: res.items || [], source: res.source });
    });
    return () => {
      alive = false;
    };
  }, [entity]);

  return state;
}
