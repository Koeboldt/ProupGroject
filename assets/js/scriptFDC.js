function getInformation(ingredient) {
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
      $("#nutrients").html("");
      const food = data.foods[0];
      let nutrients = food.foodNutrients;
      var nutrientsObj = {};
      var nutrientsObj2 = {};
      console.log("Ingrident:", food.description, food);
      var name = "";
      food.description.split(" ").forEach((word) => {
        name += word.charAt(0) + word.slice(1).toLowerCase() + " ";
      });
      $("#ingredient").text(name);
      if (food.servingSize) {
        console.log("Serving Size:", food.servingSize, food.servingSizeUnit);
        $("#servingSize").text(food.servingSize + food.servingSizeUnit);
      } else {
        $("#servingSize").text("undefined");
      }
      for (i = 0; i < nutrients.length; i++) {
        $("<li></li>")
          .text(
            `${nutrients[i].nutrientName}: ${
              nutrients[i].value + nutrients[i].unitName.toLowerCase()
            }`
          )
          .appendTo("#nutrients");
        nutrientsObj[nutrients[i].nutrientName] =
          nutrients[i].value + nutrients[i].unitName.toLowerCase();
        nutrientsObj2[nutrients[i].nutrientName] =
          nutrients[i].percentDailyValue || "0";
        nutrientsObj2[nutrients[i].nutrientName] += "%";
      }
      console.log("Nutrients:", nutrientsObj);
      console.log("Nutrients %:", nutrientsObj2);
      $("#modal").css("display", "block");
    });
}

$(document).delegate(".ingredient", "click", (event) => {
  let ingredient = $(event.target).text();
  console.log(ingredient);
  getInformation(ingredient);
});
