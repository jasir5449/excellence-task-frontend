import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Test from "./pages/Test";
import Uploadcsv from "./pages/Uploadcsv";
import Settings from "./pages/Settings";
import PageNotFound from "./pages/PageNotFound";



function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
           <Route path='/' element={<Home />} />
           <Route path='/upload' element={<Uploadcsv />} />
           <Route path='/settings' element={<Settings />} />
           <Route path='/test' element={<Test />} />
           <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
 
    </div>
  );
}






export default App;