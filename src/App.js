import "./App.css";
import Dashboard from "./components/Dashboard";
import Homepage from "./components/Homepage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {ContextProvider} from "./context/ChatContext"

import Login from "./components/Login";
function App() {
 
  return (
      <ContextProvider>
      <Router>
        <Routes>
          <Route path="/" exact Component={Homepage}></Route>
          <Route path="/dashboard" Component={Dashboard} />
          <Route path="/login" Component={Login} />
        </Routes>
      </Router>
      </ContextProvider>
  );
}

export default App;
