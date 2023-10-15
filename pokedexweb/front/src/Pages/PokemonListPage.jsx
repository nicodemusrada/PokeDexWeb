import { useEffect, useState } from "react";
import { PokemonList } from "../Components/PokemonList";
import { PokemonModal } from "../Components/PokemonModal";
import { API_BASE_URL } from "../../ApiConfig";
import { Header } from "../Components/Header";
import { ToolBar } from "../Components/ToolBar";
import { Toast } from "../Components/Toast";

export function PokemonListPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [pokemons, setPokemons] = useState([]);
    const [nameFilter, setNameFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [componentMounted, setComponentMounted] = useState(false);
    const [showNotification, setShowNotification] = useState(false);

    // Effect for fetching data when filters change
    useEffect(() => {
        if (componentMounted) {
            fetchData(true);
        } else {
            setComponentMounted(true);
        }
    }, [nameFilter, typeFilter]);

    // Effect for adding a scroll event listener and cleaning it up
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [nextPageUrl]);

    // Effect for loading data from cache on component mount
    useEffect(() => {
        const cachedData = localStorage.getItem("cachedPokemons");
        const cachedNextPageUrl = localStorage.getItem("nextPageUrl");

        if (cachedData) {
            setPokemons(JSON.parse(cachedData));
        }

        if (cachedNextPageUrl) {
            setNextPageUrl(JSON.parse(cachedNextPageUrl).nextPageUrl);
        }

        if (!cachedData || !cachedNextPageUrl) {
            fetchData(false);
        }
    }, []);

    /**
     * Handle scrolling and check if it's possible to fetch the next page.
     */
    const handleScroll = () => {
        // Check if the user has scrolled to the bottom of the page
        // by comparing the sum of the viewport height and scroll position
        // with the total document height.
        const isAtBottomOfPage = window.innerHeight + window.scrollY >= document.body.scrollHeight; 

        // If the user has reached the bottom of the page, load the next page.
        if (isAtBottomOfPage) {
            loadNextPage();
        }
    };

    /**
     * fetching data
     * @param {*} isInitialFetch 
     */
    const fetchData = async (isInitialFetch = false) => {
        let apiUrl = API_BASE_URL + '/api/pokemons';

        const queryParams = [];

        if (nameFilter) {
            queryParams.push(`name=${nameFilter}`);
        }

        if (typeFilter) {
            queryParams.push(`type=${typeFilter}`);
        }

        if (queryParams.length > 0) {
            apiUrl += `?${queryParams.join('&')}`;
        }

        let response = await fetch(apiUrl);
        let data = await response.json();
        let pokemonList = data.results;

        setPokemons(pokemonList);
        setNextPageUrl(data.next);

        if (!isInitialFetch) {
            localStorage.setItem("cachedPokemons", JSON.stringify(pokemonList));
            localStorage.setItem("nextPageUrl", JSON.stringify({ nextPageUrl: data.next }));
        }
    };

    /**
     * load next page request
     */
    const loadNextPage = async () => {
        if (nextPageUrl) {
            let response = await fetch(nextPageUrl);
            let data = await response.json();
            let pokemonList = data.results;

            setPokemons((prevPokemons) => [...prevPokemons, ...pokemonList]);
            setNextPageUrl(data.next);
        }
    };

    /**
     * on search name
     * @param {*} pokemonName 
     */
    const onSearch = (pokemonName) => {
        setNameFilter(pokemonName);
    };

    /**
     * on filter value change
     * @param {*} selectedType 
     */
    const onFilter = (selectedType) => {
        setTypeFilter(selectedType);
    };

    /**
     * handle editing pokemon and open modal
     * @param {*} pokemon 
     */
    const handleEditClick = (pokemon) => {
        setSelectedPokemon(pokemon);
        setIsModalOpen(true);
    };

    /**
     * handle closing of modal for creating pokemons
     */
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPokemon(null);
    };

    /**
     * 
     * @param {*} updatedPokemon 
     */
    const handleUpdateSuccess = (updatedPokemon) => {
        const updatedIndex = pokemons.findIndex((pokemon) => pokemon.id === updatedPokemon.id);

        if (updatedIndex !== -1) {
            const updatedPokemons = [...pokemons];
            updatedPokemons[updatedIndex] = updatedPokemon;
            setPokemons(updatedPokemons);
        }

        handleCloseModal();
    };

    const handleDeleteSuccess = (deletedPokemon) => {
        setPokemons((currentPokemons) => {
            return currentPokemons.filter((pokemon) => deletedPokemon.id !== pokemon.id);
        });

        localStorage.removeItem('cachedPokemons');
        localStorage.removeItem('nextPageUrl');

        handleCloseModal();

        setShowNotification({
            message: `Pokemon: ${deletedPokemon.english_name} was removed from Pokedex`,
            type: 'success',
          });
    }

    return (
        <>
            <Header/>
            <ToolBar handleNameSearch={onSearch} handleFilterChange={onFilter}/>
            <PokemonList pokemonData={pokemons} onEdit={handleEditClick}/>
            {isModalOpen && (
                <PokemonModal
                    pokemon={selectedPokemon}
                    onClose={handleCloseModal}
                    onPokemonUpdate={handleUpdateSuccess}
                    onPokemonDelete={handleDeleteSuccess}
                />
            )}

            {showNotification && (
                <Toast message={showNotification.message} type={showNotification.type} />
            )}
        </>
    )
}
