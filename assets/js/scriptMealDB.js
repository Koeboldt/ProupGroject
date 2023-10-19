fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
  .then(function (responce) {
    return responce.json();
  })
  .then(function (data) {
    console.log("Categories: ", data);
  });
fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegetarian")
  .then(function (responce) {
    return responce.json();
  })
  .then(function (data) {
    console.log("Meals: ", data);
    var id = data.meals[5].idMeal;
    fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772")
      .then(function (responce) {
        return responce.json();
      })
      .then(function (data) {
        var meal = data.meals[0];
        console.log("Meal: ", meal);
        var ingredients = {};
        for (i = 1; i <= 20; i++) {
          var temp1 = "strIngredient" + i;
          var temp2 = "strMeasure" + i;
          if (meal["strIngredient" + i]) {
            ingredients[meal["strIngredient" + i]] = meal["strMeasure" + i];
          }
        }
        console.log(ingredients);
      });
  });