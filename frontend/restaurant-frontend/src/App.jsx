import { Route, BrowserRouter, Routes } from "react-router-dom";
import FeaturePage from "./pages/FeaturePage";

function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FeaturePage/>}/>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App;
