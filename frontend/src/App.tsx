import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";

import LoadingPage from "./pages/LoadingPage";
import MainPage from "./pages/MainPage";
import ResultsPage from "./pages/ResultsPage";
import GuessImagePage from "./pages/GuessImagePage";
import InputSubjectPage from "./pages/InputSubjectPage";

function App() {
  return (
    <RecoilRoot>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/guess" element={<GuessImagePage />} />
          <Route path="/input" element={<InputSubjectPage />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
}

export default App;
