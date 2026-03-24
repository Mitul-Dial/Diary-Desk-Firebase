import NoteContext from "./noteContext";
import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, serverTimestamp, Timestamp } from "firebase/firestore";
import { auth, db } from "../../firebase";

const NoteState = (props) => {
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);
  const [isLoading, setIsLoading] = useState(false);

  const getUid = () => {
    return auth.currentUser?.uid;
  };

  const isAuthenticated = () => {
    return !!auth.currentUser;
  };

  // Get all Notes from Firestore
  const getNotes = async () => {
    if (!isAuthenticated()) {
      setNotes([]);
      return;
    }

    setIsLoading(true);
    try {
      const uid = getUid();
      // Only filter by userId — no orderBy to avoid requiring a composite index
      const notesQuery = query(
        collection(db, "notes"),
        where("userId", "==", uid)
      );

      const querySnapshot = await getDocs(notesQuery);
      const fetchedNotes = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        fetchedNotes.push({
          _id: docSnap.id,
          ...data,
          // Convert Firestore Timestamps to ISO strings for the UI
          date: data.date instanceof Timestamp ? data.date.toDate().toISOString() : data.date,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
        });
      });

      // Sort client-side by date descending (newest first)
      fetchedNotes.sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      });

      setNotes(fetchedNotes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setNotes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (props.isAuthenticated) {
      getNotes();
    } else {
      setNotes([]);
    }
    // eslint-disable-next-line
  }, [props.isAuthenticated]);

  // Add a Note
  const addNote = async (title, description, tag) => {
    if (!isAuthenticated()) {
      return false;
    }

    try {
      const uid = getUid();
      const noteData = {
        title: title.trim(),
        description: description.trim(),
        tag: tag ? tag.trim() : "General",
        userId: uid,
        date: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "notes"), noteData);

      // Add to local state with a client-side date for immediate display
      const newNote = {
        _id: docRef.id,
        ...noteData,
        date: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setNotes((prevNotes) => {
        const currentNotes = Array.isArray(prevNotes) ? prevNotes : [];
        return [newNote, ...currentNotes];
      });
      return true;
    } catch (error) {
      console.error("Error adding note:", error);
      return false;
    }
  };

  // Delete a Note
  const deleteNote = async (id) => {
    if (!isAuthenticated()) {
      return false;
    }

    try {
      await deleteDoc(doc(db, "notes", id));

      setNotes((prevNotes) => {
        const currentNotes = Array.isArray(prevNotes) ? prevNotes : [];
        return currentNotes.filter((note) => note._id !== id);
      });
      return true;
    } catch (error) {
      console.error("Error deleting note:", error);
      return false;
    }
  };

  // Edit a Note
  const editNote = async (id, title, description, tag) => {
    if (!isAuthenticated()) {
      return false;
    }

    try {
      const noteRef = doc(db, "notes", id);
      await updateDoc(noteRef, {
        title: title.trim(),
        description: description.trim(),
        tag: tag ? tag.trim() : "General",
        updatedAt: serverTimestamp(),
      });

      setNotes((prevNotes) => {
        const currentNotes = Array.isArray(prevNotes) ? prevNotes : [];
        return currentNotes.map((note) => {
          if (note._id === id) {
            return {
              ...note,
              title: title.trim(),
              description: description.trim(),
              tag: tag ? tag.trim() : "General",
              updatedAt: new Date().toISOString(),
            };
          }
          return note;
        });
      });
      return true;
    } catch (error) {
      console.error("Error editing note:", error);
      return false;
    }
  };

  return (
    <NoteContext.Provider value={{
      notes,
      addNote,
      deleteNote,
      editNote,
      getNotes,
      isLoading,
      isAuthenticated: props.isAuthenticated
    }}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;