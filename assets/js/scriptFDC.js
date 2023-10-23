function getNutrition(ingredient) {
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
  getNutrition(ingredient);
});

function getInformation(searchQuery) {
  fetch(
    `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${keys.fdcKey2}&query=${searchQuery}`
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log(
          "Error URL:",
          `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${keys.fdcKey2}&query=${searchQuery}`
        );
      }
    })
    .then((data) => {
      console.log(
        "URL:",
        `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${keys.fdcKey2}&query=${searchQuery}`
      );
      const food = data.foods[0];
      let nutrients = food.foodNutrients;
      var nutrientsObj = {};
      var nutrientsObj2 = {};
      console.log("Ingrident:", food.ingredients, food);
      console.log("Serving Size:", food.servingSize + food.servingSizeUnit);
      for (var i1 = 0; i1 < 6; i1++) {
        var foodListItem = $("<li>");
        foodListItem.addClass("foodDescription");
        foodListItem.attr("data-FDCID", data.foods[i1].fdcId);
        foodListItem.attr(
          "data-protein",
          "protein: " +
            data.foods[i1].foodNutrients[0].value +
            data.foods[i1].foodNutrients[0].unitName
        );
        foodListItem.attr(
          "data-fat",
          "total fat: " +
            data.foods[i1].foodNutrients[1].value +
            data.foods[i1].foodNutrients[1].unitName
        );
        foodListItem.attr(
          "data-carbs",
          "carbs: " +
            data.foods[i1].foodNutrients[2].value +
            data.foods[i1].foodNutrients[2].unitName
        );
        foodListItem.attr("id", "foodDesc-" + i1);
        foodListItem.text(data.foods[i1].description);
        $("#nutritionFax").append(foodListItem);
      }
      /* for (i = 0; i < nutrients.length; i++) {
        nutrientsObj[nutrients[i].nutrientName] =
          nutrients[i].value + nutrients[i].unitName.toLowerCase();
        nutrientsObj2[nutrients[i].nutrientName] =
          nutrients[i].percentDailyValue || "0";
        nutrientsObj2[nutrients[i].nutrientName] += "%";
      }
      console.log("Nutrients:", nutrientsObj);
      console.log("Nutrients %:", nutrientsObj2);*/
    });
}
var nutritionOptionsEl = $("#nutritionFax");

$("#nutritionFax").on("click", ".foodDescription", function () {
  $("#nutritionFax").empty();
  console.log($(this).attr("data-protein"));
  $("#nutritionFax").append($(`<li>${$(this).attr("data-protein")}</li>`));
  $("#nutritionFax").append($(`<li>${$(this).attr("data-fat")}</li>`));
  $("#nutritionFax").append($(`<li>${$(this).attr("data-carbs")}</li>`));
});

$("#nutrientSearchBtn").click(function () {
  $("#nutritionFax").empty();
  getInformation($(".nutrientSearch").val());
});
