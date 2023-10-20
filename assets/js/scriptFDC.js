/* var broccoli = "747447";
var url = "https://api.nal.usda.gov/fdc/v1/food/"+ broccoli +"%20?format=full&nutrients=203&nutrients=204&nutrients=205&api_key=CgqMH6hMOSehsdQ4BUkItOfNsoU7eCCHr4D8YL1h"
fetch(url)
.then(response => response.json())
.then(data => {
    console.log("data :", data);
    console.log("total protein :", data.foodNutrients[0].amount);
    console.log("total fats :", data.foodNutrients[1].amount);
    console.log("Carbohydrates :", data.foodNutrients[2].amount);
}) */

function getInformation(ingredient) {
  ingredient = ingredient.replace(" ", "%");
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
      var nutrientsObj2 = {};
      console.log("Ingrident:", food.ingredients, food);
      console.log("Serving Size:", food.servingSize + food.servingSizeUnit);
      for (i = 0; i < nutrients.length; i++) {
        nutrientsObj[nutrients[i].nutrientName] =
          nutrients[i].value + nutrients[i].unitName.toLowerCase();
        nutrientsObj2[nutrients[i].nutrientName] =
          nutrients[i].percentDailyValue || "0";
        nutrientsObj2[nutrients[i].nutrientName] += "%";
      }
      console.log("Nutrients:", nutrientsObj);
      console.log("Nutrients %:", nutrientsObj2);
    });
}

getInformation("Shallots");
