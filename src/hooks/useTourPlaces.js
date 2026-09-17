import { useCallback, useEffect, useState } from "react";
import { entityMeta } from "../data/managerData";
import { tourPlaceService } from "../services/tourPlaceService";
import { pickPlaceImage, toNumber } from "../lib/format";

// Cards persist locally (demo mode) under this key so offline CRUD survives refresh.
const KEY = "sdn.manager.tour-places";

function toCard(t) {
  return {
    id: t.id,
    name: t.name,
    category: t.placeCategory?.name || t.category || "—",
    district: t.district?.name || t.address || t.district || "—",
    rating: toNumber(t.rating),
    status: t.status === "INACTIVE" ? "Inactive" : t.status === "ACTIVE" ? "Active" : t.status || "Active",
    description: t.description || t.address || "",
    _image: pickPlaceImage(t.placeImages),
  };
}

function readStored() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStored(items) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* storage may be unavailable — ignore */
  }
}

export function useTourPlaces() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("demo");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await tourPlaceService.getAllTourPlaces();
        if (alive && Array.isArray(list) && list.length) {
          setItems(list.map(toCard));
          setSource("api");
          setLoading(false);
          return;
        }
      } catch {
        /* fall through to demo */
      }
      if (alive) {
        setItems(readStored() || entityMeta("tour-places").demo);
        setSource("demo");
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const create = useCallback(async (data, images) => {
    const preview = images?.length ? URL.createObjectURL(images[0]) : null;
    try {
      const created = await tourPlaceService.createTourPlace(data, images);
      setItems((prev) => [{ ...toCard(created), id: created.id }, ...prev]);
      return { ok: true };
    } catch {
      const row = { ...data, id: `P-${Date.now()}`, ...(preview ? { _image: preview } : {}) };
      setItems((prev) => {
        const next = [row, ...prev];
        writeStored(next);
        return next;
      });
      return { ok: true };
    }
  }, []);

  const update = useCallback(async (id, data, images) => {
    let preview = images?.length ? URL.createObjectURL(images[0]) : null;
    try {
      await tourPlaceService.updateTourPlace(id, data, images);
      if (images?.length) {
        const imgs = await tourPlaceService.getTourPlaceImages(id).catch(() => []);
        const picked = pickPlaceImage(imgs);
        if (picked) preview = picked;
      }
    } catch {
      /* demo mode — update locally */
    }
    setItems((prev) => {
      const next = prev.map((it) =>
        String(it.id) === String(id)
          ? { ...it, ...data, id, ...(preview ? { _image: preview } : {}) }
          : it
      );
      writeStored(next);
      return next;
    });
    return { ok: true };
  }, []);

  const remove = useCallback(async (id) => {
    try {
      await tourPlaceService.deleteTourPlace(id);
    } catch {
      /* demo mode — remove locally */
    }
    setItems((prev) => {
      const next = prev.filter((it) => String(it.id) !== String(id));
      writeStored(next);
      return next;
    });
    return { ok: true };
  }, []);

  return { items, loading, source, create, update, remove };
}