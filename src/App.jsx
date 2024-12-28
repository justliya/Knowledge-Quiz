import { Routes, Route } from 'react-router-dom';
import Quiz from "./components/Quiz"; 
import HomePage from "./components/HomePage";
import ResultsSection from "./components/ResultsSection";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz" element={<Quiz />} />  
        <Route path="/results-section" element={<ResultsSection />} /> 
      </Routes>
    </>
  );
}

export default App;
