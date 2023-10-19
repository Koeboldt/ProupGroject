/* fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
  .then(function (responce) {
    return responce.json();
  })
  .then(function (data) {
    console.log("Categories: ", data);
  }); */

/* fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list") //less information
  .then(function (responce) {
    return responce.json();
  })
  .then(function (data) {
    console.log("Categories2: ", data);
  });
fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list")
  .then(function (responce) {
    return responce.json();
  })
  .then(function (data) {
    console.log("Areas: ", data);
  });
fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list")
  .then(function (responce) {
    return responce.json();
  })
  .then(function (data) {
    var ingredients = [];
    for (i = 0; i < data.meals.length; i++) {
      ingredients.push(data.meals[i].strIngredient);
    }
    console.log("Ingredients: ", ingredients);
  }); */

var ingredients = {};
fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=chicken")
  .then(function (responce) {
    return responce.json();
  })
  .then(function (data) {
    console.log("Meals: ", data);
    var id =
      data.meals[0 /* Math.floor(Math.random() * data.meals.length) */].idMeal;
    fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id)
      .then(function (responce) {
        return responce.json();
      })
      .then(function (data) {
        var meal = data.meals[0];
        console.log("Meal: ", meal.strMeal, meal);
        ingredients = {};
        for (i = 1; i <= 20; i++) {
          var temp1 = "strIngredient" + i;
          var temp2 = "strMeasure" + i;
          if (meal["strIngredient" + i]) {
            ingredients[meal["strIngredient" + i]] = meal["strMeasure" + i];
          }
        }
        console.log("Ingridents:", ingredients);
        console.log("Ingridents list:", Object.keys(ingredients));
        // getInformation(Object.keys(ingredients));
      });
  });

function saveRecipe(event) {
  event.preventDefault();
  let saved = JSON.parse(localStorage.getItem("recipies")) || [];
  let newRecipe = $(".recipeName").text();
  if (!saved.includes(newRecipe)) {
    saved.push(newRecipe);
    console.log("Saved Recipies:", saved);
  }
  localStorage.setItem("recipies", JSON.stringify(saved));
}

$(document).delegate("#saveRecipe", "click", saveRecipe);

/* //Function to initialize the page
function initializePage() {
  displaySearchHistory();
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
 */

//Function to be called when "Search Ingredients" button is clicked
function searchIngredients() {
  const searchTerm = document.getElementById("search-input").value;
  if (!searchTerm) {
    displayModal("Please enter an ingredient.");
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
        /* addToSearchHistory(searchTerm);
        displaySearchHistory(); //Display search history after adding a new term */
      } else {
        displayModal("No meals found with the provided ingredient.");
      }
    })
    .catch(function (error) {
      console.error("Error fetching data:", error);
    });
}

//Function to display ingredients for a meal
function displayIngredients(meal) {
  const ingredientsDiv = document.getElementById("ingredient-display");
  ingredientsDiv.innerHTML = ""; //Clear previous content

  const ingredientsList = document.createElement("ul");

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal["strIngredient" + i];
    const measure = meal["strMeasure" + i];
    if (ingredient) {
      const listItem = document.createElement("li");
      listItem.textContent = `${ingredient}: ${measure}`;
      ingredientsList.appendChild(listItem);
    }
  }

  ingredientsDiv.appendChild(ingredientsList);
}

//Function to display a modal with a message
function displayModal(message) {
  const modal = document.getElementById("modal");
  const modalMessage = document.getElementById("modal-message");

  //Set the message content
  modalMessage.textContent = message;

  //Display the modal
  modal.style.display = "block";

  //Close the modal when the user clicks on the "x" button
  const closeBtn = document.querySelector(".close");
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  //Close the modal when the user clicks anywhere outside of the modal
  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
}

//Function to display meals with ingredients
function displayMealsWithIngredients(meals) {
  const ingredientsDisplay = document.getElementById("ingredient-display");
  ingredientsDisplay.innerHTML = ""; // Clear previous content

  //Iterate through meals and display meal details
  meals.forEach((meal) => {
    const mealDiv = document.createElement("div");
    mealDiv.className = "meal-item";

    const mealImage = document.createElement("img");
    mealImage.src = meal.strMealThumb; //Add the meal image source
    mealImage.alt = meal.strMeal; //Add alt text for accessibility
    mealImage.className = "meal-image";
    mealDiv.appendChild(mealImage);

    const mealName = document.createElement("h3");
    mealName.textContent = meal.strMeal;

    const ingredientsList = document.createElement("ul");
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal["strIngredient" + i];
      const measure = meal["strMeasure" + i];
      if (ingredient && measure) {
        const listItem = document.createElement("li");
        listItem.textContent = `${ingredient}: ${measure}`;
        ingredientsList.appendChild(listItem);
      }
    }

    const recipeButton = document.createElement("button");
    recipeButton.textContent = "View Recipe";
    recipeButton.addEventListener("click", () => {
      window.location = "recipe.html?mealId=" + meal.idMeal;
    });

    mealDiv.appendChild(mealName);
    mealDiv.appendChild(ingredientsList);
    mealDiv.appendChild(recipeButton);
    ingredientsDisplay.appendChild(mealDiv);
  });
}

// Function to display a recipe
function displayRecipe(mealId) {
  const recipeDisplay = document.getElementById("recipe-display");
  recipeDisplay.innerHTML = ""; // Clear previous content

  if (!mealId) {
    return; // Do nothing if there's no mealId
  }

  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.meals && data.meals.length > 0) {
        const meal = data.meals[0];
        const recipeDiv = document.createElement("div");
        recipeDiv.className = "recipe-item";

        const recipeName = document.createElement("h3");
        recipeName.textContent = meal.strMeal;

        // Display ingredients
        const ingredientsHeader = document.createElement("h4");
        ingredientsHeader.textContent = "Ingredients:";
        recipeDiv.appendChild(ingredientsHeader);

        const ingredientsList = document.createElement("ul");
        for (let i = 1; i <= 20; i++) {
          const ingredient = meal["strIngredient" + i];
          const measure = meal["strMeasure" + i];
          if (ingredient && measure) {
            const listItem = document.createElement("li");
            listItem.textContent = `${ingredient}: ${measure}`;
            ingredientsList.appendChild(listItem);
          }
        }
        recipeDiv.appendChild(ingredientsList);

        // Display instructions
        const instructionsHeader = document.createElement("h4");
        instructionsHeader.textContent = "Instructions:";
        recipeDiv.appendChild(instructionsHeader);

        const recipeInstructions = document.createElement("p");
        recipeInstructions.textContent = meal.strInstructions;

        recipeDiv.appendChild(recipeName);
        recipeDiv.appendChild(recipeInstructions);

        // Add a "Close" button
        const closeButton = document.createElement("button");
        closeButton.textContent = "Close";
        closeButton.addEventListener("click", () => {
          window.location = "index.html";
        });
        recipeDiv.appendChild(closeButton);

        recipeDisplay.appendChild(recipeDiv);
      } else {
        alert("Recipe not found.");
      }
    })
    .catch((error) => {
      console.error("Error fetching recipe:", error);
    });
}
