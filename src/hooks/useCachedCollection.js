import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import localforage from "localforage";
import { db, reportDatabaseUnavailable } from "../firebaseConfig";

const ONE_HOUR = 60 * 60 * 1000;

const defaultMapDocs = (querySnapshot) =>
  querySnapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));

function useCachedCollection({
  collectionName,
  cacheKey,
  cacheDuration = ONE_HOUR,
  mapDocs = defaultMapDocs,
  errorMessage = "Erro ao carregar dados.",
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cachedData = await localforage.getItem(cacheKey);

        if (cachedData) {
          setData(cachedData.items);

          if (Date.now() - cachedData.lastFetched < cacheDuration) {
            setLoading(false);
            return;
          }
        }

        if (!db) {
          throw new Error("Firebase indisponível.");
        }

        const querySnapshot = await getDocs(collection(db, collectionName));
        const items = mapDocs(querySnapshot);
        setData(items);

        await localforage.setItem(cacheKey, {
          items,
          lastFetched: Date.now(),
        });
      } catch (fetchError) {
        console.error(`Erro ao buscar ${collectionName}:`, fetchError);
        reportDatabaseUnavailable(fetchError);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cacheDuration, cacheKey, collectionName, errorMessage, mapDocs]);

  return { data, loading, error };
}

export default useCachedCollection;
