var broccoli = "747447";
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
  });

const apiKey = "1";
const apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast`;
const searchBtn = document.getElementById("search-btn");
const mealList = document.getElementById("meal");

//event listenter
searchBtn.addEventListener("click", getMealList);

//fetch meals
function getMealList() {
  let searchInputTxt = document.getElementById("search-input").value.trim();
  fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInputTxt}`
  )
    .then((response) => response.json())
    .then((data) => {
      //delete console log data once set up
      console.log(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInputTxt}`
      );
      console.log(data);
    });
}

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
        getInformation(Object.keys(ingredients));
      });
  });

function getInformation(ingredients) {
  /* for (i = 0; i < ingredients.length; i++)  */ {
    fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=DEMO_KEY&query=${ingredients[0]}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data.foods);
      });
  }
}
