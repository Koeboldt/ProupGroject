//Function to initialize the page
function initializePage() {
    displaySearchHistory();
}

//Function to be called when "Search Ingredients" button is clicked
function searchIngredients() {
    const searchTerm = document.getElementById('search-input').value;
    if (!searchTerm) {
        displayModal('Please enter an ingredient.');
        return;
    }

    //Fetch meals based on the ingredient
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchTerm}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.meals && data.meals.length > 0) {
                displayMealsWithIngredients(data.meals);
                addToSearchHistory(searchTerm);
                displaySearchHistory();  //Display search history after adding a new term
            } else {
                displayModal('No meals found with the provided ingredient.');
            }
        })
        .catch(function (error) {
            console.error('Error fetching data:', error);
        });
}

//Function to add a search term to the search history
function addToSearchHistory(searchTerm) {
    const searchHistory = getSearchHistory();
    searchHistory.push(searchTerm);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    displaySearchHistory();
}

//Function to get the search history from local storage
function getSearchHistory() {
    const searchHistoryJSON = localStorage.getItem('searchHistory');
    return searchHistoryJSON ? JSON.parse(searchHistoryJSON) : [];
}

//Function to display the search history
function displaySearchHistory() {
    const searchHistory = getSearchHistory();
    const searchHistoryDiv = document.getElementById('search-history');
    searchHistoryDiv.innerHTML = '';

    //Add heading for the search history
    const heading = document.createElement('h4');
    heading.textContent = 'Search History:';
    searchHistoryDiv.appendChild(heading);

    //Iterate through the search history and display each item
    searchHistory.forEach((searchTerm, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.textContent = searchTerm;
        historyItem.addEventListener('click', () => {
            document.getElementById('search-input').value = searchTerm;
            searchIngredients();
        });
        searchHistoryDiv.appendChild(historyItem);
    });
}

//Function to clear the search history
function clearSearchHistory() {
    localStorage.removeItem('searchHistory');
    displaySearchHistory();  //Refresh the displayed search history
}

//Add event listener to the Clear History button
const clearHistoryButton = document.getElementById('clear-history-button');
clearHistoryButton.addEventListener('click', clearSearchHistory);


function fetchCategories() {
    //can switch to categoriesto seach if need
    fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
        .then(response => response.json())
        .then(data => {
            console.log("Categories: ", data);
        });
}

function fetchVegetarianMeals() {
    //can switch to veggie to search if need
    fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegetarian")
        .then(response => response.json())
        .then(data => {
            console.log("Meals: ", data);
            const mealId = data.meals[5].idMeal;
            fetchMealDetails(mealId);
        });
}

//Function to fetch meal details by ID
function fetchMealDetails(mealId) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];
            console.log("Meal: ", meal);
            displayIngredients(meal);
        });
}

//Function to display ingredients for a meal
function displayIngredients(meal) {
    const ingredientsDiv = document.getElementById('ingredient-display');
    ingredientsDiv.innerHTML = '';  //Clear previous content

    const ingredientsList = document.createElement('ul');

    for (let i = 1; i <= 20; i++) {
        const ingredient = meal["strIngredient" + i];
        const measure = meal["strMeasure" + i];
        if (ingredient) {
            const listItem = document.createElement('li');
            listItem.textContent = `${ingredient}: ${measure}`;
            ingredientsList.appendChild(listItem);
        }
    }

    ingredientsDiv.appendChild(ingredientsList);
}

//Function to display a modal with a message
function displayModal(message) {
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');

    //Set the message content
    modalMessage.textContent = message;

    //Display the modal
    modal.style.display = 'block';

    //Close the modal when the user clicks on the "x" button
    const closeBtn = document.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    //Close the modal when the user clicks anywhere outside of the modal
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
}


//Function to display meals with ingredients
function displayMealsWithIngredients(meals) {
    const ingredientsDisplay = document.getElementById('ingredient-display');
    ingredientsDisplay.innerHTML = ''; // Clear previous content

    //Iterate through meals and display meal details
    meals.forEach(meal => {
        const mealDiv = document.createElement('div');
        mealDiv.className = 'meal-item';

        const mealImage = document.createElement('img');
        mealImage.src = meal.strMealThumb; //Add the meal image source
        mealImage.alt = meal.strMeal; //Add alt text for accessibility
        mealImage.className = 'meal-image';
        mealDiv.appendChild(mealImage);

        const mealName = document.createElement('h3');
        mealName.textContent = meal.strMeal;

        const ingredientsList = document.createElement('ul');
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal['strIngredient' + i];
            const measure = meal['strMeasure' + i];
            if (ingredient && measure) {
                const listItem = document.createElement('li');
                listItem.textContent = `${ingredient}: ${measure}`;
                ingredientsList.appendChild(listItem);
            }
        }

        const recipeButton = document.createElement('button');
        recipeButton.textContent = 'View Recipe';
        recipeButton.addEventListener('click', () => {
            displayRecipe(meal.idMeal);
        });

        mealDiv.appendChild(mealName);
        mealDiv.appendChild(ingredientsList);
        mealDiv.appendChild(recipeButton);
        ingredientsDisplay.appendChild(mealDiv);
    });
}

// Function to display a recipe
function displayRecipe(mealId) {
    const recipeModal = document.getElementById('recipe-modal'); // Add an HTML element with the ID 'recipe-modal' in your HTML.
    if (!mealId) {
        return; // Do nothing if there's no mealId.
    }

    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(response => response.json())
        .then(data => {
            if (data.meals && data.meals.length > 0) {
                const meal = data.meals[0];

                // Construct the recipe content
                const recipeContent = `
                    <h3>${meal.strMeal}</h3>
                    <h4>Ingredients:</h4>
                    <ul>
                        ${getIngredientsList(meal)}
                    </ul>
                    <h4>Instructions:</h4>
                    <p>${meal.strInstructions}</p>
                    <button id="close-recipe">Close</button>
                `;

                recipeModal.innerHTML = recipeContent;

                // Display the modal
                recipeModal.style.display = 'block';

                // Close the modal when the "Close" button is clicked
                const closeButton = document.getElementById('close-recipe');
                closeButton.addEventListener('click', () => {
                    recipeModal.style.display = 'none';
                });
            } else {
                alert('Recipe not found.');
            }
        })
        .catch(error => {
            console.error('Error fetching recipe:', error);
        });
}

function getIngredientsList(meal) {
    let ingredientsList = '';
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal['strIngredient' + i];
        const measure = meal['strMeasure' + i];
        if (ingredient && measure) {
            ingredientsList += `<li>${ingredient}: ${measure}</li>`;
        }
    }
    return ingredientsList;
}




