import { Header } from "./Components/Header";
import { PokemonListPage } from "./Pages/PokemonListPage";
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";

export function App() {
    return (
        <Router>
            <Routes>    
                <Route path="/" element={<PokemonListPage/>} />
            </Routes>
        </Router>
    );
}