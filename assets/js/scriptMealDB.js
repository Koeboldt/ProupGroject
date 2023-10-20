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

function saveRecipe(event) {
  event.preventDefault();
  let saved = JSON.parse(localStorage.getItem("recipies")) || [];
  let newRecipe = $("#recipeName").text();
  if (!saved.includes(newRecipe)) {
    saved.push(newRecipe);
    console.log("Saved:", newRecipe);
  } else {
    console.log("Recipe already saved.");
  }
  localStorage.setItem("recipies", JSON.stringify(saved));
}

function showSaved() {
  let saved = JSON.parse(localStorage.getItem("recipies")) || [];
  $("#ingredient-display").html("");
  for (i = 0; i < saved.length; i++) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${saved[i]}`) //Fetch meals based on the ingredient
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.meals && data.meals.length > 0) {
          const meal = data.meals[0];
          const mealDiv = $("<div class='meal-item'></div>");
          $(
            `<img class='meal-image' src="${meal.strMealThumb}" alt="${meal.strMeal}">`
          ).appendTo(mealDiv);
          const mealName = $(`<h3>${meal.strMeal}</h3>`);
          const recipeButton = $("<button>View Recipe</button>");
          recipeButton.on("click", () => {
            window.location = "recipe.html?mealId=" + meal.idMeal;
          });
          mealDiv
            .append(mealName, recipeButton)
            .appendTo("#ingredient-display");
        } else {
          displayModal("No saved recipies.");
        }
      })
      .catch(function (error) {
        console.error("Error fetching data:", error);
      });
  }
}

function searchMeal() {
  //Function to be called when "Search Ingredients" button is clicked
  const searchTerm = $("#mealSearch").val();
  console.log("Searching for:", searchTerm);
  if (!searchTerm) {
    displayModal("Please enter a meal.");
    return;
  }
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`) //Fetch meals based on the ingredient
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.meals && data.meals.length > 0) {
        displayMealsList(data.meals);
      } else {
        displayModal("No meals found with the provided ingredient.");
      }
    })
    .catch(function (error) {
      console.error("Error fetching data:", error);
    });
}

function searchIngredients() {
  //Function to be called when "Search Ingredients" button is clicked
  const searchTerm = $("#ingridentSearch").val();
  console.log("Searching for:", searchTerm);
  if (!searchTerm) {
    displayModal("Please enter an ingredient.");
    return;
  }
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchTerm}`) //Fetch meals based on the ingredient
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.meals && data.meals.length > 0) {
        displayMealsList(data.meals);
      } else {
        displayModal("No meals found with the provided ingredient.");
      }
    })
    .catch(function (error) {
      console.error("Error fetching data:", error);
    });
}

function displayMealsList(meals) {
  //Function to display meals with ingredients
  console.log(meals);
  $("#ingredient-display").html(""); // Clear previous content
  meals.forEach((meal) => {
    //Iterate through meals and display meal details
    const mealDiv = $("<div class='meal-item'></div>");
    $(
      `<img class='meal-image' src="${meal.strMealThumb}" alt="${meal.strMeal}">`
    ).appendTo(mealDiv);
    const mealName = $(`<h3>${meal.strMeal}</h3>`);
    const recipeButton = $("<button>View Recipe</button>");
    recipeButton.on("click", () => {
      window.location = "recipe.html?mealId=" + meal.idMeal;
    });
    mealDiv.append(mealName, recipeButton).appendTo("#ingredient-display");
    // $("#ingredient-display").append(mealDiv);
  });
}

function displayIngredients(meal) {
  //Function to display ingredients for a meal
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal["strIngredient" + i];
    const measure = meal["strMeasure" + i];
    if (ingredient) {
      $(`<li>${ingredient}: ${measure}</li>`).appendTo("#ingredientsList");
    }
  }
}

// Function to display a recipe
function displayRecipe(mealId) {
  if (!mealId) {
    return; // Do nothing if there's no mealId
  }
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.meals && data.meals.length > 0) {
        const meal = data.meals[0];
        $("#recipeName").text(meal.strMeal);
        for (let i = 1; i <= 20; i++) {
          const ingredient = meal["strIngredient" + i];
          const measure = meal["strMeasure" + i];
          if (ingredient && measure) {
            $(
              `<li><span class='ingredient'>${ingredient}</span>: ${measure}</li>`
            ).appendTo("#ingridentsList");
          }
        }

        // Display instructions
        $("#recipeInstructions").text(meal.strInstructions);
      } else {
        alert("Recipe not found.");
      }
    })
    .catch((error) => {
      console.error("Error fetching recipe:", error);
    });
}

$("#closeBtn").on("click", () => {
  window.location = "index.html";
});
$("#saveRecipe").on("click", saveRecipe);
$(document).delegate(".ingredient", "click", (event) => {
  console.log($(event.target).text());
});
