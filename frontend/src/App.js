/** @format */

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Components/Login/login";
import ChatBot from "./Components/chatBot/chatbot";
import Header from "./Components/Header/header";
function App() {
  return (
    <div className="App">
      <Header />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/chatbot" element={<ChatBot />} />
          <Route path="/" element={<ChatBot />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
