import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import NavBar from './components/NavBar';
import Inventory from "./components/Inventory";
import Recipes from "./components/Recipes";
import ViewRecipe from "./components/ViewRecipe";
import EditIngredient from "./components/EditIngredient";
import PurchaseRecipe from "./components/PurchaseRecipe";
import Home from "./components/Home";

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar/>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/inventory" element={<Inventory />} />
          <Route exact path="/editingredient/:id" element={<EditIngredient />} />
          <Route exact path="/recipes" element={<Recipes />} />
          <Route exact path="/viewrecipe/:id" element={<ViewRecipe />} />
          <Route exact path="/purchaserecipe" element={<PurchaseRecipe />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
