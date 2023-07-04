import { RecoilRoot } from "recoil"
import MainPage from "./pages/Mainpage"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
<RecoilRoot>
  <Router>
    <Routes>
      <Route path="/" element={<MainPage />} />
    </Routes>
  </Router>
</RecoilRoot>
  )
}

export default App
