document.addEventListener('DOMContentLoaded', () => {
    const apiBase = 'https://www.themealdb.com/api/json/v1/1/';

    // Sidebar navigation
    const links = {
        searchLink: 'search',
        categoryLink: 'category',
        areaLink: 'area',
        ingredientsLink: 'ingredients',
        contactLink: 'contact'
    };

    Object.keys(links).forEach(linkId => {
        document.getElementById(linkId).addEventListener('click', () => {
            document.querySelectorAll('.content > div').forEach(section => section.classList.add('hidden'));
            document.getElementById(links[linkId]).classList.remove('hidden');
        });
    });

    // Fetch and display 20 meals on the homepage
    fetch(apiBase + 'search.php?s=')
        .then(response => response.json())
        .then(data => {
            const mealList = document.getElementById('mealList');
            mealList.innerHTML = data.meals.slice(0, 20).map(meal => `
                <div class="col-md-3">
                    <div class="card meal-card" onclick="showMealDetails(${meal.idMeal})">
                        <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                        <div class="card-overlay">
                            <h5 class="card-title">${meal.strMeal}</h5>
                        </div>
                    </div>
                </div>
            `).join('');
        });
    // Search functionality
    document.getElementById('searchByName').addEventListener('input', (e) => {
        fetch(apiBase + 'search.php?s=' + e.target.value)
            .then(response => response.json())
            .then(data => displayMeals(data.meals, 'searchResults'));
    });

    document.getElementById('searchByLetter').addEventListener('input', (e) => {
        fetch(apiBase + 'search.php?f=' + e.target.value)
            .then(response => response.json())
            .then(data => displayMeals(data.meals, 'searchResults'));
    });

    // Helper function to display meals
    function displayMeals(meals, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = meals.map(meal => `
            <div class="col-md-3">
                <div class="card meal-card" onclick="showMealDetails(${meal.idMeal})">
                    <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                    <div class="card-overlay">
                        <h5 class="card-title">${meal.strMeal}</h5>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Show meal details
    window.showMealDetails = function (idMeal) {
        fetch(apiBase + 'lookup.php?i=' + idMeal)
            .then(response => response.json())
            .then(data => {
                const meal = data.meals[0];
                const mealList = document.getElementById('mealList');
                mealList.innerHTML = `
                    <div class="col-md-12">
                        <div class="card mb-4">
                            <img src="${meal.strMealThumb}" class="card-img-top w-25 h-25" alt="${meal.strMeal}">
                            <div class="card-body">
                                <h5 class="card-title text-white">${meal.strMeal}</h5>
                                <div>
                                <h6 class="card-title text-white">Instructions</h6>
                                <p class="card-text text-white">${meal.strInstructions}"</p>
                                </div>
                                <p class="card-text text-white mt-4">Area : ${meal.strArea}</p>
                                <p class="card-text text-white">Category : ${meal.strCategory}</p>
                                <div>
                                <h6 class="card-title text-white">Recipes :</h6>
                                <p class="card-text text-white">${meal.strIngredient1}</p>
                                <p class="card-text text-white">${meal.strIngredient2}</p>
                                <p class="card-text text-white">${meal.strIngredient3}</p>
                                <p class="card-text text-white">${meal.strIngredient4}</p>
                                </div>
                                <a href="${meal.strYoutube}" class="btn btn-danger">Watch on YouTube</a>
                            </div>
                        </div>
                    </div>
                `;
            });
    };
    // Fetch and display categories
    document.getElementById('categoryLink').addEventListener('click', () => {
        fetch(apiBase + 'categories.php')
            .then(response => response.json())
            .then(data => {
                const categoryList = document.getElementById('categoryList');
                categoryList.innerHTML = data.categories.map(category => `
                    <div class="col-md-3">
                        <div class="card" onclick="showCategoryMeals('${category.strCategory}')">
                            <img src="${category.strCategoryThumb}" class="card-img-top" alt="${category.strCategory}">
                            <div class="card-overlay">
                                <h5 class="card-title text-center text-white">${category.strCategory}</h5>
                            </div>
                        </div>
                    </div>
                `).join('');
            });
    });

    // Show meals of a category
    window.showCategoryMeals = function (category) {
        fetch(apiBase + 'filter.php?c=' + category)
            .then(response => response.json())
            .then(data => displayMeals(data.meals, 'categoryList'));
    };

    // Fetch and display areas
    document.getElementById('areaLink').addEventListener('click', () => {
        fetch(apiBase + 'list.php?a=list')
            .then(response => response.json())
            .then(data => {
                const areaList = document.getElementById('areaList');
                areaList.innerHTML = data.meals.map(area => `
                    <div class="col-md-3">
                        <div class="card" onclick="showAreaMeals('${area.strArea}')">
                            <i class="fa-solid fa-house-laptop text-center fs-1 text-white"></i>
                            <div class="card-overlay">
                                <h5 class="card-title text-center text-white">${area.strArea}</h5>
                            </div>
                        </div>
                    </div>
                `).join('');
            });
    });

    // Show meals of an area
    window.showAreaMeals = function (area) {
        fetch(apiBase + 'filter.php?a=' + area)
            .then(response => response.json())
            .then(data => displayMeals(data.meals, 'areaList'));
    };

    // Fetch and display ingredients
    document.getElementById('ingredientsLink').addEventListener('click', () => {
        fetch(apiBase + 'list.php?i=list')
            .then(response => response.json())
            .then(data => {
                const ingredientsList = document.getElementById('ingredientsList');
                ingredientsList.innerHTML = data.meals.map(ingredient => `
                    <div class="col-md-3">
                        <div class="card" onclick="showIngredientMeals('${ingredient.strIngredient}')">
                            <i class="fa-solid fa-drumstick-bite text-center fs-1 text-white"></i>
                            <div class="card-overlay">
                                <h5 class="card-title text-center text-white">${ingredient.strIngredient}</h5>
                            </div>
                        </div>
                    </div>
                `).join('');
            });
    });

    // Show meals of an ingredient
    window.showIngredientMeals = function (ingredient) {
        fetch(apiBase + 'filter.php?i=' + ingredient)
            .then(response => response.json())
            .then(data => displayMeals(data.meals, 'ingredientsList'));
    };
    const sidebar = document.getElementById('sidebar');
    const newSidebar = document.getElementById('newSidebar');
    const toggleSidebarIcon = document.getElementById('toggleSidebarIcon');
    let isSidebarVisible = false;
    toggleSidebarIcon.addEventListener('click', () => {
        isSidebarVisible = !isSidebarVisible;
        sidebar.style.display = isSidebarVisible ? 'block' : 'none';
        toggleSidebarIcon.innerHTML = isSidebarVisible ? '<i class="fa fa-times"></i>' : '<i class="fa fa-bars"></i>';
    });
    function checkForm() {
        const inputs = document.querySelectorAll('#contact-form input');
        const submitButton = document.getElementById('submit-button');
        
        let allFilled = true;
        inputs.forEach(input => {
            if (input.value === '') {
                allFilled = false;
            }
        });
        
        if (allFilled) {
            submitButton.style.display = 'block';
        } else {
            submitButton.style.display = 'none';
        }
    }
    
})
