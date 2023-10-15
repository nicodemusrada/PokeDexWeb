# PokeDexWeb
 A Database of Pokemons


### Prerequisites
- [Python](https://www.python.org/) installed
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed

### Clone the Repository
1. Clone the repository using Git and open your PowerShell:
   ```bash
   git clone <repository_url>
   cd <repository_directory>
### Virtual Environment
1. Create a virtual environment named "env":
   ```bash
   python -m venv env
2. Activate the virtual environment:
    ```bash
   .\env\Scripts\Activate
### Project Dependencies
1. Change your working directory to where the requirements.txt file is located.
    ```bash
    cd <path_to_requirements.txt>
2. Install project dependencies using pip:
    ```bash
    pip install -r requirements.txt
### Backend Setup
1. Navigate to the Django application directory:
    ```bash
    cd .\pokedexweb
2. Apply database migrations:
    ```bash
    python manage.py migrate
3. Run the database seeder using a provided JSON file (e.g., pokedex.json):
    ```bash
    python manage.py import_pokemon_data pokedex.json
4. Start the local development server:
    ```bash
    python manage.py runserver
> [!NOTE] 
> Take note of the local development server URL.
### Frontend Setup
1. Open another terminal.
2. Change your working directory to the frontend directory:
    ```bash
    cd .\pokedexweb\front
3. Install Node.js dependencies using npm:
    ```bash
    npm install
4. Start the frontend development server:
    ```bash
    npm run dev

> [!IMPORTANT]
> Frontend Configuration : 
> Open the .\pokedexweb\front\ApiConfig.js file and update the API_BASE_URL with the value of the Django local development server.
