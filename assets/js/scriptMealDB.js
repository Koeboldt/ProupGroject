/* var broccoli = "747447";
var url =
  "https://api.nal.usda.gov/fdc/v1/food/" +
  broccoli +
  "%20?format=full&nutrients=203&nutrients=204&nutrients=205&api_key=CgqMH6hMOSehsdQ4BUkItOfNsoU7eCCHr4D8YL1h";
fetch(url)
  .then((response) => response.json())
  .then((data) => {
    console.log("data :", data);
    console.log("total protein :", data.foodNutrients[0].amount);
    console.log("total fats :", data.foodNutrients[1].amount);
    console.log("Carbohydrates :", data.foodNutrients[2].amount);
  }); */

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

/* function getInformation(ingredients) {
  for (i = 0; i < ingredients.length; i++) {
    let ingredient = ingredients[i].replace(" ", "-");
    fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${keys.fdcKey2}&query=${ingredient}`
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.log(
            "Error URL:",
            `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${keys.fdcKey2}&query=${ingredient}`
          );
        }
      })
      .then((data) => {
        console.log(
          "URL:",
          `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${keys.fdcKey2}&query=${ingredient}`
        );
        const food = data.foods[0];
        let nutrients = food.foodNutrients;
        var nutrientsObj = {};
        console.log("Ingrident:", food.ingredients);
        console.log("Serving Size:", food.servingSize + food.servingSizeUnit);
        for (i = 0; i < nutrients.length; i++) {
          nutrientsObj[nutrients[i].nutrientName] =
            nutrients[i].nutrientNumber + nutrients[i].unitName.toLowerCase();
        }
        console.log("Nutrients:", nutrientsObj);
      });
  }
} */

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
  let ingredient = $(event.target).text();
  console.log(ingredient);
  getInformation(ingredient);
});
