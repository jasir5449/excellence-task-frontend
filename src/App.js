import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Test from "./pages/Test";
import Uploadcsv from "./pages/Uploadcsv";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
           <Route path='/' element={<Home />} />
           <Route path='/upload' element={<Uploadcsv />} />
           <Route path='/test' element={<Test />} />
        </Routes>
      </BrowserRouter>
 
    </div>
  );
}






export default App;