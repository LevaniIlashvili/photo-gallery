import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import HistoryPage from "./pages/HistoryPage";
import Navbar from "./components/Navbar";
import { useState } from "react";
import PhotoModal from "./components/PhotoModal";

function App() {
  const [openedPhoto, setOpenedPhoto] = useState<string | null>(null);

  return (
    <Router>
      {openedPhoto && (
        <PhotoModal photoId={openedPhoto} setOpenedPhoto={setOpenedPhoto} />
      )}
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={<HomePage setOpenedPhoto={setOpenedPhoto} />}
        />
        <Route
          path="/history"
          element={<HistoryPage setOpenedPhoto={setOpenedPhoto} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
