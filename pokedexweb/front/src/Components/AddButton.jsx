
import { useState } from 'react';
import addButton from '../assets/add.svg';
import { CreatePokemonModal } from './CreatePokemonModal';
import { Toast } from './Toast';

export function AddButton() {
  const [isCreatePokemonModalVisible, setIsCreatePokemonModalVisible] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const handleCreateNewPokemon = () => {
    setIsCreatePokemonModalVisible(true);
  };

  const handleCloseCreatePokemonModal = () => {
    setIsCreatePokemonModalVisible(false);
  };

  const handleCreatePokemon = (newPokemon) => {
    setShowNotification({
      message: `Pokemon: ${newPokemon.english_name} added to Pokedex!`,
      type: 'success',
    });
  }


  return (
      <>
        <button className="add-button" onClick={handleCreateNewPokemon}>
          <img 
            src={addButton} 
            alt="Create New Pokemon"  
            title="Create New Pokemon"
            className="button-icon"
            />
        </button>
        {isCreatePokemonModalVisible && (
          <CreatePokemonModal onClose={handleCloseCreatePokemonModal} onCreate={handleCreatePokemon} />
        )}
        {showNotification && (
          <Toast message={showNotification.message} type={showNotification.type} />
        )}
      </>
  );
}