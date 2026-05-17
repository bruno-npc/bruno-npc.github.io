import { useCallback, useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

function useAdminCollection(collectionName, errorLabel) {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchItems = useCallback(async () => {
    try {
      if (!db) {
        throw new Error("Firebase indisponível.");
      }

      const querySnapshot = await getDocs(collection(db, collectionName));
      setItems(querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })));
    } catch (error) {
      console.error(`Erro ao buscar ${errorLabel}:`, error);
    }
  }, [collectionName, errorLabel]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openNew = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const closeModal = (reload = false) => {
    setShowModal(false);
    setEditingItem(null);
    if (reload) {
      fetchItems();
    }
  };

  const deleteItem = async (id) => {
    try {
      if (!db) {
        throw new Error("Firebase indisponível.");
      }

      await deleteDoc(doc(db, collectionName, id));
      fetchItems();
    } catch (error) {
      console.error(`Erro ao excluir ${errorLabel}:`, error);
    }
  };

  return {
    items,
    showModal,
    editingItem,
    openNew,
    openEdit,
    closeModal,
    deleteItem,
  };
}

export default useAdminCollection;
