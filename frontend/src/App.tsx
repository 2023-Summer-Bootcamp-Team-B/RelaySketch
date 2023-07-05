import { RecoilRoot } from "recoil";
import MainPage from "./pages/MainPage";
import ResultsPage from "./pages/ResultsPage";
import LoadingPage from "./pages/LoadingPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <RecoilRoot>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/loading" element={<LoadingPage />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
}

export default App;
