var broccoli = "747447";
var url = "https://api.nal.usda.gov/fdc/v1/food/"+ broccoli +"%20?format=full&nutrients=203&nutrients=204&nutrients=205&api_key=CgqMH6hMOSehsdQ4BUkItOfNsoU7eCCHr4D8YL1h"
fetch(url)
.then(response => response.json())
.then(data => {
    console.log("data :", data);
    console.log("total protein :", data.foodNutrients[0].amount);
    console.log("total fats :", data.foodNutrients[1].amount);
    console.log("Carbohydrates :", data.foodNutrients[2].amount);
})


