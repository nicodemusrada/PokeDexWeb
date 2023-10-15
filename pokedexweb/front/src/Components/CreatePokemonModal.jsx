import { useState, useEffect } from 'react';
import '../assets/css/create-pokemon-modal.css';
import { API_BASE_URL } from '../../ApiConfig';
import { POKEMON_TYPES } from '../types';
import { Toast } from './Toast';

export function CreatePokemonModal({ onClose, onCreate }) {
  const [formData, setFormData] = useState({
    english_name: '',
    types: [],
    image: null,
  });
  const [enteredTypes, setEnteredTypes] = useState([]);
  const [currentType, setCurrentType] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);

  useEffect(() => {
    const handleKeyEvents = (e) => {
      if (suggestions.length > 0) {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedSuggestion((prev) => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedSuggestion((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (selectedSuggestion !== -1) {
            handleSuggestionClick(suggestions[selectedSuggestion]);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyEvents);

    return () => {
      window.removeEventListener('keydown', handleKeyEvents);
    };
  }, [suggestions, selectedSuggestion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTypeChange = (e) => {
    if (formData.types.length < 2) {
      setCurrentType(e.target.value);
    }

    // Filter the suggestions based on the typed value and prevent duplicates
    const trimmedType = e.target.value.trim();
    const filteredSuggestions = POKEMON_TYPES
      .filter((type) => type.toLowerCase().startsWith(trimmedType.toLowerCase()))
      .filter((type) => !formData.types.includes(type) && !enteredTypes.includes(type));

    if (trimmedType === '') {
      setSuggestions([]);
      return;
    }

    setSuggestions(filteredSuggestions);
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    
    if (imageFile) {
      // Check if the selected file is an image
      if (imageFile.type.startsWith('image/')) {
        setFormData({ ...formData, image: imageFile });
      } else {
        // Display an error message or alert the user
        setShowNotification({
          message: 'Please select a valid image file.',
          type: 'error',
        });
        // Optionally, you can clear the input
        e.target.value = null;
      }
    }
  };
  

  const handleSuggestionClick = (suggestion) => {
    if (formData.types.length < 2) {
      setFormData({
        ...formData,
        types: [...formData.types, suggestion],
      });
    }
    setCurrentType('');
    setSuggestions([]);
  };

  const handleRemoveType = (type) => {
    setFormData({
      ...formData,
      types: formData.types.filter((t) => t !== type),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { english_name, types, image } = formData;
  
    if (english_name.trim() === '') {
      return setShowNotification({
        message: 'English Name is required.',
        type: 'error',
      });
    }
  
    if (types.length === 0) {
      return setShowNotification({
        message: 'At least one Type is required.',
        type: 'error',
      });
    }
  
    if (types.length > 2) {
      return setShowNotification({
        message: 'You can only select up to 2 Types.',
        type: 'error',
      });
    }
  
    if (!image) {
      return setShowNotification({
        message: 'Image is required.',
        type: 'error',
      });
    }
  
    const pokemonData = new FormData();
    pokemonData.append('english_name', english_name);
    pokemonData.append('types', JSON.stringify(types));
    pokemonData.append('image', image);
  
    try {
      const response = await fetch(`${API_BASE_URL}/api/pokemons`, {
        method: 'POST',
        body: pokemonData,
      });
  
      if (response.ok) {
        const newPokemon = await response.json();
        onCreate(newPokemon);
        onClose();
      } else {
        setShowNotification({
          message: 'Failed to create Pokemon',
          type: 'error',
        });
        console.error('Failed to create Pokemon');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="create-pokemon-modal">
      <div className="create-pokemon-modal-content">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <h2>Add Pokemon</h2>
        <form onSubmit={handleSubmit} className="create-form">
          <div className="form-group">
            <label htmlFor="english_name">English Name:</label>
            <input
              type="text"
              id="english_name"
              name="english_name"
              value={formData.english_name}
              onChange={handleChange}
              required
              autoComplete="off"
            />
          </div>
          <div className="form-group">
            <label htmlFor="types">Types:</label>
            <div className="entered-types">
              {formData.types.map((type, index) => (
                <div key={index} className="type-capsule">
                  {type}
                  <button
                    type="button"
                    className="remove-type"
                    onClick={() => handleRemoveType(type)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
            <input
              type="text"
              id="types"
              name="types"
              value={currentType}
              onChange={handleTypeChange}
              autoComplete="off"
              disabled={formData.types.length >= 2}
              placeholder={formData.types.length >= 2 ? "You can only set 2 types for a Pokemon" : ""}
            />
            {
              <ul className='type-suggestions'>
                {suggestions.map((suggestion, index) => (
                  <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`type-suggestion ${index === selectedSuggestion ? 'selected' : ''}`}
                >
                  {suggestion}
                </li>
                ))}
              </ul>
            }
          </div>
          <div className="form-group">
            <label htmlFor="image">Image:</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <button type="submit" className="create-button">
            Create Pokemon
          </button>
        </form>
      </div>

      {showNotification && (
        <Toast message={showNotification.message} type={showNotification.type} />
      )}
    </div>
  );
}
