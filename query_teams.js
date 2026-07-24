import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  projectId: "skunkworks-scouting-zod"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const querySnapshot = await getDocs(collection(db, "events", "2024casj", "teams")); // or whatever event it is
  // The event is probably 2025 testing event, wait, let's list all events to find the ID.
  const eventsSnap = await getDocs(collection(db, "events"));
  eventsSnap.forEach(event => {
    console.log("Event:", event.id);
  });
  
  // let's just query 2025reefscape or whatever it is
}
run();
