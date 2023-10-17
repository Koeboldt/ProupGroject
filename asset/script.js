//Function to be called when "Search Ingredients" button is clicked
function searchIngredients() {
    var searchTerm = document.getElementById('search-input').value;
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
            } else {
                displayModal('No meals found with the provided ingredient.');
            }
        })
        .catch(function (error) {
            console.error('Error fetching data:', error);
        });
}

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

// Function to fetch meal details by ID
function fetchMealDetails(mealId) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];
            console.log("Meal: ", meal);
            displayIngredients(meal);
        });
}

// Function to display ingredients for a meal
function displayIngredients(meal) {
    const ingredientsDiv = document.getElementById('ingredient-display');
    ingredientsDiv.innerHTML = '';  // Clear previous content

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

// Function to display a modal with a message
function displayModal(message) {
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');

    // Set the message content
    modalMessage.textContent = message;

    // Display the modal
    modal.style.display = 'block';

    // Close the modal when the user clicks on the "x" button
    const closeBtn = document.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close the modal when the user clicks anywhere outside of the modal
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
}

// Function to display meals with ingredients
function displayMealsWithIngredients(meals) {
    const ingredientsDisplay = document.getElementById('ingredient-display');
    ingredientsDisplay.innerHTML = ''; // Clear previous content

    // Iterate through meals and display meal details
    meals.forEach(meal => {
        const mealDiv = document.createElement('div');
        mealDiv.className = 'meal-item';

        const mealImage = document.createElement('img');
        mealImage.src = meal.strMealThumb; // Add the meal image source
        mealImage.alt = meal.strMeal; // Add alt text for accessibility
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
    const recipeDisplay = document.getElementById('recipe-display');
    recipeDisplay.innerHTML = '';  // Clear previous content

    if (!mealId) {
        return;  // Do nothing if there's no mealId
    }

    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(response => response.json())
        .then(data => {
            if (data.meals && data.meals.length > 0) {
                const meal = data.meals[0];
                const recipeDiv = document.createElement('div');
                recipeDiv.className = 'recipe-item';

                const recipeName = document.createElement('h3');
                recipeName.textContent = meal.strMeal;

                // Display ingredients
                const ingredientsHeader = document.createElement('h4');
                ingredientsHeader.textContent = 'Ingredients:';
                recipeDiv.appendChild(ingredientsHeader);

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
                recipeDiv.appendChild(ingredientsList);

                // Display instructions
                const instructionsHeader = document.createElement('h4');
                instructionsHeader.textContent = 'Instructions:';
                recipeDiv.appendChild(instructionsHeader);

                const recipeInstructions = document.createElement('p');
                recipeInstructions.textContent = meal.strInstructions;

                recipeDiv.appendChild(recipeName);
                recipeDiv.appendChild(recipeInstructions);

                // Add a "Close" button
                const closeButton = document.createElement('button');
                closeButton.textContent = 'Close';
                closeButton.addEventListener('click', () => {
                    recipeDisplay.innerHTML = ''; // Clear the recipe display
                });
                recipeDiv.appendChild(closeButton);

                recipeDisplay.appendChild(recipeDiv);
            } else {
                alert('Recipe not found.');
            }
        })
        .catch(error => {
            console.error('Error fetching recipe:', error);
        });
}




