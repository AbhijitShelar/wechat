import "./App.css";
import Dashboard from "./components/Dashboard";
import Homepage from "./components/Homepage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {ContextProvider} from "./context/ChatContext"

function App() {
 
  return (
      <ContextProvider>
      <Router>
        <Routes>
          <Route path="/" exact element={<Homepage/>}></Route>
          <Route path="/dashboard" element={<Dashboard/>} />
           
        </Routes>
      </Router>
      </ContextProvider>
  );
}

export default App;
