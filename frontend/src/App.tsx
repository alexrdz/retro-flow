import { Routes, Route, BrowserRouter } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Home from "./components/Home/Home";
import Session from "./components/Session/Session";

export default function App() {
    return <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/session/:sessionId" element={<Session />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
}
