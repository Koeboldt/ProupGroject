const apiKey = '1';
const apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast`;
const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');


//event listenter
searchBtn.addEventListener('click', getMealList);

//fetch meals
function getMealList(){
    let searchInputTxt = document.getElementById('search-input').value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
    .then(response => response.json())
    .then(data => {
        //delete console log data once set up
        console.log(data);
    })
}
