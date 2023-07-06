import { RecoilRoot } from "recoil";
import MainPage from "./pages/MainPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GuessImagePage from "./pages/GuessImagePage";
import InputSubjectPage from "./pages/InputSubjectPage";

function App() {
  return (
    <RecoilRoot>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/guess" element={<GuessImagePage />} />
          <Route path="/input" element={<InputSubjectPage />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
}

export default App;
