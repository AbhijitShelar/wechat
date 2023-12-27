import "./App.css";
import Dashboard from "./components/Dashboard";
import Homepage from "./components/Homepage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ContextProvider } from "./context/ChatContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
 
  return (
    <ContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Homepage  />} />
        </Routes>
      </Router>
      <ToastContainer />
    </ContextProvider>
  );
}

export default App;
