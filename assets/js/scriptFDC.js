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
          `https://api.nal.usda.gov/fdc/v1/foods/search?&api_key=${keys.fdcKey2}&query=${ingredient}`
        );
      }
    })
    .then((data) => {
      console.log(
        "URL:",
        `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${keys.fdcKey2}&query=${ingredient}`
      );
      $("#nutrients").html("");
      const food = data.foods[1];
      let nutrients = food.foodNutrients;
      var nutrientsObj = {};
      var nutrientsObj2 = {};
      console.log("Ingredient:", food.description, food);
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
        if(nutrients[i].nutrientId === 1003){
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
      else if(nutrients[i].nutrientId ===1005){
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
      else if(nutrients[i].nutrientId === 1004){
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
        else if(nutrients[i].nutrientId === 1008){
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
    `https://api.nal.usda.gov/fdc/v1/foods/search?nutrients=203&nutrients=204&nutrients=205&api_key=${keys.fdcKey2}&query=${searchQuery}`
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log(
          "Error URL:",
          `https://api.nal.usda.gov/fdc/v1/foods/search?nutrients=203&nutrients=204&nutrients=205&api_key=${keys.fdcKey2}&query=${searchQuery}`
        );
      }
    })
    .then((data) => {
      console.log(
        "URL:",
        `https://api.nal.usda.gov/fdc/v1/foods/search?nutrients=203&nutrients=204&nutrients=205&api_key=${keys.fdcKey2}&query=${searchQuery}`
      );
      const food = data.foods[0];
      let nutrients = food.foodNutrients;
      var nutrientsObj = {};
      var nutrientsObj2 = {};
      console.log("Ingredient:", food.ingredients, food);
      console.log("Serving Size:", food.servingSize + food.servingSizeUnit);
      for (var i1 = 0; i1 < 6; i1++) {
        var foodListItem = $("<li>");
        foodListItem.addClass("foodDescription");
        foodListItem.attr("data-FDCID", data.foods[i1].fdcId);
        for(var i2 = 0; i2 < data.foods[i1].foodNutrients.length; i2++){
          if(data.foods[i1].foodNutrients[i2].nutrientId === 1003){
        foodListItem.attr(
          "data-protein",
          data.foods[i1].foodNutrients[i2].nutrientName + ": " +
            data.foods[i1].foodNutrients[i2].value +
            data.foods[i1].foodNutrients[i2].unitName
        );}
        else if(data.foods[i1].foodNutrients[i2].nutrientId === 1004){
          foodListItem.attr(
            "data-fat",
            data.foods[i1].foodNutrients[i2].nutrientName + ": " +
              data.foods[i1].foodNutrients[i2].value +
              data.foods[i1].foodNutrients[i2].unitName
          );}
          else if(data.foods[i1].foodNutrients[i2].nutrientId === 1005){
            foodListItem.attr(
              "data-carbs",
              data.foods[i1].foodNutrients[i2].nutrientName + ": " +
                data.foods[i1].foodNutrients[i2].value +
                data.foods[i1].foodNutrients[i2].unitName
            );}
        foodListItem.attr("id", "foodDesc-" + i1);
        foodListItem.text(data.foods[i1].description);
        $("#nutritionFax").append(foodListItem);
      }}
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
