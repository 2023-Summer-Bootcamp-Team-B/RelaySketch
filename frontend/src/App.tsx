import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import GuessImagePage from "./pages/GuessImagePage";
import InputTitlePage from "./pages/InputTitlePage";
import LoadingPage from "./pages/LoadingPage";
import MainPage from "./pages/MainPage";
import PlayerRoomPage from "./pages/PlayerRoomPage";
import ResultsPage from "./pages/ResultsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/playerroom/:id" element={<PlayerRoomPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/guess" element={<GuessImagePage />} />
        <Route path="/input" element={<InputTitlePage />} />
      </Routes>
    </Router>
  );
}

export default App;
