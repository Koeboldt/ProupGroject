//Function to display a modal with a message
function displayModal(message) {
  $("#modal-message").text(message); //Set the message content
  $("#modal").css("display", "block"); //Display the modal
  $(".close").on("click", () => {
    //Close the modal when the user clicks on the "x" button
    $("#modal").css("display", "none");
  });
  $(window).on("click", (event) => {
    //Close the modal when the user clicks anywhere outside of the modal
    if ($(event.target).attr("id") == "modal") {
      $("#modal").css("display", "none");
    }
  });
}

function saveRecipe(event) {
  event.preventDefault();
  let saved = JSON.parse(localStorage.getItem("recipes")) || [];
  let newRecipe = $("#recipeName").text();
  if (!saved.includes(newRecipe)) {
    saved.push(newRecipe);
    console.log("Saved:", newRecipe);
  } else {
    console.log("Recipe already saved.");
  }
  localStorage.setItem("recipes", JSON.stringify(saved));
}

function showSaved() {
  let saved = JSON.parse(localStorage.getItem("recipes")) || [];
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
            window.location =
              "recipe.html?mealId=" + meal.idMeal + "&searchType=saved";
          });
          mealDiv
            .append(mealName, recipeButton)
            .appendTo("#ingredient-display");
        } else {
          displayModal("No saved recipes.");
        }
      })
      .catch(function (error) {
        console.error("Error fetching data:", error);
      });
  }
}

function searchMeal(event) {
  if (event) {
    event.preventDefault();
  }
  //Function to be called when "Search Ingredients" button is clicked
  const searchTerm = $("#mealSearch").val();
  console.log("Searching for:", searchTerm);
  if (!searchTerm) {
    displayModal("Please enter a recipe name.");
    return;
  }
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`) //Fetch meals based on the ingredient
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.meals && data.meals.length > 0) {
        displayMealsList(data.meals, "recipe", searchTerm);
      } else {
        displayModal("No recipes found with the provided name.");
      }
    })
    .catch(function (error) {
      console.error("Error fetching data:", error);
    });
}

function searchIngredients(event) {
  if (event) {
    event.preventDefault();
  }
  //Function to be called when "Search Ingredients" button is clicked
  const searchTerm = $("#ingredientSearch").val();
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
        displayMealsList(data.meals, "ingredient", searchTerm);
      } else {
        displayModal("No meals found with the provided ingredient.");
      }
    })
    .catch(function (error) {
      console.error("Error fetching data:", error);
    });
}

function displayMealsList(meals, searchType, searchQuerry) {
  //Function to display meals with ingredients
  console.log(meals);
  $("#ingredient-display").html(""); // Clear previous content
  $("#nutritionFax").empty();
  meals.forEach((meal) => {
    //Iterate through meals and display meal details
    const mealDiv = $("<div class='meal-item'></div>");
    $(
      `<img class='meal-image' src="${meal.strMealThumb}" alt="${meal.strMeal}">`
    ).appendTo(mealDiv);
    const mealName = $(`<h3>${meal.strMeal}</h3>`);
    const recipeButton = $("<button>View Recipe</button>");
    recipeButton.on("click", () => {
      window.location =
        "recipe.html?mealId=" +
        meal.idMeal +
        "&searchType=" +
        searchType +
        "&searchQuerry=" +
        searchQuerry;
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
            ).appendTo("#ingredientsList");
          }
        }
        $("#recipeImg").attr("src", meal.strMealThumb); //Add the meal image source
        $("#recipeImg").attr("alt", meal.strMeal);
        $("#recipeInstructions").text(meal.strInstructions); // Display instructions
        $("title").text(meal.strMeal);
      } else {
        alert("Recipe not found.");
      }
    })
    .catch((error) => {
      console.error("Error fetching recipe:", error);
    });
}
