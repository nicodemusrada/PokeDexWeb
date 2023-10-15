import '../assets/css/modal.css';
import { API_BASE_URL } from '../../ApiConfig';
import { useRef, useEffect, useState } from 'react';
import { ConfirmationModal } from './ConfirmationModal';
import { Toast } from './Toast';

export function PokemonModal({ pokemon, onClose, onPokemonUpdate, onPokemonDelete }) {
    const [pokemonName, setPokemonName] = useState(pokemon.english_name);
    const [currentName, setCurrentName] = useState(pokemon.english_name);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationAction, setConfirmationAction] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const modalRef = useRef();

    useEffect(() => {
        document.addEventListener('click', handleCloseModal);
        return () => {
          document.removeEventListener('click', handleCloseModal);
        };
      }, []);

    const handleCloseModal = (e) => {
        if (e.target === modalRef.current) {
          onClose();
        }
      };

    const handleNameChange = (e) => {
        setPokemonName(e.target.value);
    };

    const handleDeleteClick = () => {
        setConfirmationAction('delete');
        setShowConfirmation(true);
      };
    
      const handleSaveClick = () => {
        setConfirmationAction('save');
        setShowConfirmation(true);
      };
    

    const handleConfirmationConfirm = () => {
        if (confirmationAction === 'delete') {
          deletePokemon();
        } else if (confirmationAction === 'save') {
            if (currentName === pokemonName) {
                onClose();
                return;
            }
            updatePokemon();
        }
        setShowConfirmation(false);
      };

    const updatePokemon = () => {   
        let apiUrl = API_BASE_URL + '/api/pokemons/' + pokemon.id;
        let requestBody = {english_name: pokemonName};
        
        fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
        .then((response) => {
            if (response.ok) {
                const updatedPokemon = { ...pokemon, ...requestBody };
                onPokemonUpdate(updatedPokemon);
                setShowNotification({
                    message: 'Pokemon updated successfully',
                    type: 'success',
                  });
            } else {
                setShowNotification({
                    message: 'Something went wrong',
                    type: 'error',
                  });
                console.error('Failed to update Pokemon');
            }
        })
        .catch((error) => {
            setShowNotification({
                message: 'Something went wrong',
                type: 'error',
              });
            console.error('Error:', error);
        });
    }

    const deletePokemon = () => {   
      let apiUrl = API_BASE_URL + '/api/pokemons/' + pokemon.id;
      
      fetch(apiUrl, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
          }
      })
      .then((response) => {
          if (response.ok) {
            onPokemonDelete(pokemon);
          } else {
              setShowNotification({
                  message: 'Something went wrong',
                  type: 'error',
                });
              console.error('Failed to update Pokemon');
          }
      })
      .catch((error) => {
          setShowNotification({
              message: 'Something went wrong',
              type: 'error',
            });
          console.error('Error:', error);
      });
  }

    return (
      <div className="pokemon-modal" ref={modalRef}>
        <div className="pokemon-modal-content">
          <button className="close-button" onClick={onClose}>
            X
          </button>
          <img
            src={API_BASE_URL + pokemon.image_url}
            alt={pokemon.english_name}
            className="pokemon-thumbnail"
          />
          <input
            type="text"
            value={pokemonName}
            onChange={handleNameChange}
            className="name-input"
          />
          <div className="pokemon-types">
            {pokemon.types.map((type, index) => (
              <span key={index} className="pokemon-type">
                {type}
              </span>
            ))}
          </div>
          <div className="button-container">
            <button type="button" className="delete-button" onClick={handleDeleteClick}>
              Delete
            </button>
            <button type="submit" className="save-button" onClick={handleSaveClick}>
              Save
            </button>
          </div>
          
        </div>
        {showConfirmation && (
          <ConfirmationModal
            message={`Are you sure you want to ${confirmationAction}?`}
            onConfirm={handleConfirmationConfirm}
            onCancel={handleConfirmationConfirm}
          />
        )}

        {showNotification && (
          <Toast message={showNotification.message} type={showNotification.type} />
        )}
      </div>
    );
}
