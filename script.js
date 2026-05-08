// ========== RECIPE DATABASE (ALL YOUR RECIPES INTACT) ==========
let recipes = [
  { id: 0, name: "Paneer Butter Masala", category: "Indian", image: "https://img.freepik.com/premium-photo/delicious-paneer-butter-masala-photography_928503-851.jpg?w=2000", ingredients: ["paneer cubes", "butter", "fenugreek leaves", "tomato gravy"], prep: "40 min", steps: "Make rich tomato gravy, add paneer, finish with butter & cream." },
  { id: 1, name: "Dal Tadka", category: "Indian", image: "https://spicecravings.com/wp-content/uploads/2021/05/Dal-Tadka-Featured.jpg", ingredients: ["yellow lentils", "spices", "ghee", "garlic"], prep: "35 min", steps: "Cook lentils, temper with ghee and spices, garnish with coriander." },
  { id: 2, name: "Butter Chicken", category: "Indian", image: "https://www.licious.in/blog/wp-content/uploads/2020/10/butter-chicken-.jpg", ingredients: ["chicken thighs", "butter", "tomato puree", "cream"], prep: "45 min", steps: "Marinate chicken, simmer in buttery tomato gravy." },
  { id: 3, name: "Biryani", category: "Indian", image: "https://www.sidechef.com/recipe/f2a39578-450f-4077-8c5c-3790415d3d0c.jpeg?d=1408x1120", ingredients: ["basmati rice", "chicken", "spices", "saffron"], prep: "60 min", steps: "Layer spiced rice & meat, slow cook (dum style)." },
  { id: 4, name: "Cheeseburger", category: "Fast Food", image: "https://www.kitchensanctuary.com/wp-content/uploads/2021/05/Double-Cheeseburger-tall1-44.webp", ingredients: ["burger bun", "cheese", "tomato", "beef patty"], prep: "20 min", steps: "Grill patty, add cheese, assemble with sauce." },
  { id: 5, name: "Pepperoni Pizza", category: "Fast Food", image: "https://cdn.shopify.com/s/files/1/0567/1213/4726/products/ThreeCheese_Pizza_Beauty_d3eeea98-1706-4092-8171-60738ac55937_1200x1200.jpg?v=1658703750", ingredients: ["pizza dough", "tomato sauce", "cheese", "pepperoni"], prep: "25 min", steps: "Top dough with sauce, cheese, pepperoni; bake until crispy." },
  { id: 6, name: "French Fries", category: "Fast Food", image: "https://wallpapercave.com/wp/wp2148252.jpg", ingredients: ["potatoes", "vegetable oil", "salt"], prep: "15 min", steps: "Cut, soak, fry twice until golden, salt." },
  { id: 7, name: "Hot Dog", category: "Fast Food", image: "https://thriftyveggiemama.com/wp-content/uploads/2024/11/michigan-hot-dog-recipe-1730811885.jpg", ingredients: ["sausage", "hot dog bun", "mustard", "ketchup"], prep: "15 min", steps: "Cook sausage, place in bun, top with mustard & ketchup." },
  { id: 8, name: "Chocolate Brownie", category: "Dessert", image: "https://www.cookingclassy.com/wp-content/uploads/2019/05/brownies-21.jpg", ingredients: ["dark chocolate", "butter", "flour", "eggs"], prep: "30 min", steps: "Melt chocolate, mix batter, bake until fudgy." },
  { id: 9, name: "Ice Cream Sundae", category: "Dessert", image: "https://cdn.britannica.com/50/80550-050-5D392AC7/Scoops-kinds-ice-cream.jpg", ingredients: ["vanilla ice cream", "chocolate sauce", "cherries"], prep: "10 min", steps: "Scoop ice cream, drizzle sauce, top with cherry." },
  { id: 10, name: "Gulab Jamun", category: "Dessert", image: "https://northshore.noveltysweets.co.nz/wp-content/uploads/2024/10/Gulab-Jamun-1.jpg", ingredients: ["khoya", "flour", "sugar syrup"], prep: "40 min", steps: "Make dough balls, deep fry, soak in sugar syrup." },
  { id: 11, name: "Fruit Custard", category: "Dessert", image: "https://vismaifood.com/storage/app/uploads/public/736/8b7/c2d/thumb__1200_0_0_0_auto.jpg", ingredients: ["milk", "custard powder", "seasonal fruits"], prep: "25 min", steps: "Boil milk, add custard, chill and add fresh fruits." }
];

// ========== SEARCH FUNCTIONALITY ==========
function searchRecipes() {
  const searchTerm = document.getElementById("navSearchInput").value.trim().toLowerCase();
  if(searchTerm === "") {
    alert("🔍 Please enter a recipe name to search!");
    return;
  }
  
  const matchedRecipes = recipes.filter(recipe => 
    recipe.name.toLowerCase().includes(searchTerm)
  );
  
  const searchResultsDiv = document.getElementById("searchResultsContainer");
  const searchSection = document.getElementById("searchResultsSection");
  
  if(matchedRecipes.length === 0) {
    searchResultsDiv.innerHTML = `<div style="width:100%; text-align:center; padding:40px; color:white; font-size:1.5rem;">😕 No recipes found matching "${escapeHtml(searchTerm)}"</div>`;
  } else {
    searchResultsDiv.innerHTML = matchedRecipes.map(recipe => createFlipCard(recipe)).join("");
    attachFlipEventsToResults();
  }
  
  searchSection.style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeSearchResults() {
  document.getElementById("searchResultsSection").style.display = "none";
  document.body.style.overflow = "auto";
  document.getElementById("navSearchInput").value = "";
}

function clearSearch() {
  document.getElementById("navSearchInput").value = "";
}

function attachFlipEventsToResults() {
  document.querySelectorAll("#searchResultsContainer .card").forEach(card => {
    card.removeEventListener("click", flipHandler);
    card.addEventListener("click", flipHandler);
  });
}

// ========== FAVORITES SYSTEM ==========
let favorites = JSON.parse(localStorage.getItem("cravingFavsComplete")) || [];
function saveFavs() { localStorage.setItem("cravingFavsComplete", JSON.stringify(favorites)); }
function isFav(id) { return favorites.includes(id); }

function toggleFavorite(recipeId) {
  if (favorites.includes(recipeId)) {
    favorites = favorites.filter(id => id !== recipeId);
  } else {
    favorites.push(recipeId);
  }
  saveFavs();
  renderAllSections();
  renderIngredientResults();
  renderIngredientResultsPage();
}

function escapeHtml(str) { 
  if(!str) return ''; 
  return str.replace(/[&<>]/g, function(m) {
    if(m === '&') return '&amp;';
    if(m === '<') return '&lt;';
    if(m === '>') return '&gt;';
    return m;
  });
}

function createFlipCard(recipe) {
  const favStatus = isFav(recipe.id);
  const favText = favStatus ? "❤️ Remove from Fav" : "🤍 Add to Fav";
  return `
    <div class="card" data-id="${recipe.id}">
      <div class="card-inner">
        <div class="card-front">
          <img src="${recipe.image}" alt="${recipe.name}" onerror="this.src='https://placehold.co/400x300?text=Yummy+${recipe.name}'">
        </div>
        <div class="card-back">
          <h3>${escapeHtml(recipe.name)}</h3>
          <p><strong>⏱️ Prep:</strong> ${recipe.prep}</p>
          <p><strong>🥣 Ingredients:</strong></p>
          <ul class="ingredients">
            ${recipe.ingredients.map(ing => `<li>✓ ${escapeHtml(ing)}</li>`).join("")}
          </ul>
          <p><strong>📌 Steps:</strong></p>
          <p class="steps">${escapeHtml(recipe.steps)}</p>
          <button class="fav-btn" onclick="event.stopPropagation(); toggleFavorite(${recipe.id})">${favText}</button>
        </div>
      </div>
    </div>
  `;
}

function attachFlipEvents(containerId) {
  const container = document.getElementById(containerId);
  if(!container) return;
  container.querySelectorAll(".card").forEach(card => {
    card.removeEventListener("click", flipHandler);
    card.addEventListener("click", flipHandler);
  });
}

function flipHandler(e) { 
  if(e.target.classList && (e.target.classList.contains("fav-btn") || e.target.closest(".fav-btn"))) return; 
  this.classList.toggle("flipped"); 
}

// ========== RENDER ALL SECTIONS ==========
function renderAllSections() {
  // Home - All Recipes
  const allDiv = document.getElementById("allRecipesHome");
  if(allDiv) {
    allDiv.innerHTML = recipes.map(r => createFlipCard(r)).join("");
    attachFlipEvents("allRecipesHome");
  }
  
  // Home - Indian
  const indianDiv = document.getElementById("indianContainer");
  if(indianDiv) {
    indianDiv.innerHTML = recipes.filter(r => r.category === "Indian").map(r => createFlipCard(r)).join("");
    attachFlipEvents("indianContainer");
  }
  
  // Home - Fast Food
  const fastDiv = document.getElementById("fastContainer");
  if(fastDiv) {
    fastDiv.innerHTML = recipes.filter(r => r.category === "Fast Food").map(r => createFlipCard(r)).join("");
    attachFlipEvents("fastContainer");
  }
  
  // Home - Dessert
  const dessertDiv = document.getElementById("dessertContainer");
  if(dessertDiv) {
    dessertDiv.innerHTML = recipes.filter(r => r.category === "Dessert").map(r => createFlipCard(r)).join("");
    attachFlipEvents("dessertContainer");
  }
  
  // Home - Favorites
  const favDiv = document.getElementById("homeFavContainer");
  if(favDiv) {
    const favRecipes = recipes.filter(r => favorites.includes(r.id));
    if(favRecipes.length === 0) {
      favDiv.innerHTML = `<div style="width:100%; text-align:center; padding:40px;">💖 No favorites yet. Click "Add to Fav" on any recipe card above to see them here!</div>`;
    } else {
      favDiv.innerHTML = favRecipes.map(r => createFlipCard(r)).join("");
      attachFlipEvents("homeFavContainer");
    }
  }
  
  // Indian Page
  const indianDetailed = document.getElementById("indianDetailedContainer");
  if(indianDetailed) {
    indianDetailed.innerHTML = recipes.filter(r => r.category === "Indian").map(r => createFlipCard(r)).join("");
    attachFlipEvents("indianDetailedContainer");
  }
  
  // Fast Food Page
  const fastDetailed = document.getElementById("fastDetailedContainer");
  if(fastDetailed) {
    fastDetailed.innerHTML = recipes.filter(r => r.category === "Fast Food").map(r => createFlipCard(r)).join("");
    attachFlipEvents("fastDetailedContainer");
  }
  
  // Dessert Page
  const dessertDetailed = document.getElementById("dessertDetailedContainer");
  if(dessertDetailed) {
    dessertDetailed.innerHTML = recipes.filter(r => r.category === "Dessert").map(r => createFlipCard(r)).join("");
    attachFlipEvents("dessertDetailedContainer");
  }
  
  // Favorites Page
  const favPage = document.getElementById("favPageContainer");
  if(favPage) {
    const favRecipes = recipes.filter(r => favorites.includes(r.id));
    if(favRecipes.length === 0) {
      favPage.innerHTML = `<div style="width:100%; text-align:center; padding:40px;">💖 No favorites yet. Click "Add to Fav" on any recipe to build your collection!</div>`;
    } else {
      favPage.innerHTML = favRecipes.map(r => createFlipCard(r)).join("");
      attachFlipEvents("favPageContainer");
    }
  }
}

// ========== ADD RECIPE (Home Page) ==========
function addNewRecipe() {
  const name = document.getElementById("recipeName").value.trim();
  const category = document.getElementById("recipeCategory").value.trim();
  const ingredientsRaw = document.getElementById("recipeIngredients").value.trim();
  const imageUrl = document.getElementById("recipeImage").value.trim();
  const steps = document.getElementById("recipeSteps").value.trim();
  
  if(!name || !category || !ingredientsRaw) {
    alert("❌ Please fill Name, Category and Ingredients!");
    return;
  }
  if(!["Indian","Fast Food","Dessert"].includes(category)) {
    alert("❌ Category must be exactly: Indian, Fast Food, or Dessert");
    return;
  }
  
  const newId = Date.now();
  const newRecipe = {
    id: newId,
    name: name,
    category: category,
    image: imageUrl || "https://placehold.co/400x300?text=New+Recipe",
    ingredients: ingredientsRaw.split(",").map(i => i.trim()),
    prep: "Custom",
    steps: steps || "Enjoy this homemade creation!"
  };
  recipes.push(newRecipe);
  renderAllSections();
  renderIngredientResults();
  renderIngredientResultsPage();
  clearAddForm();
  alert(`✅ "${name}" added successfully!`);
}

function clearAddForm() {
  document.getElementById("recipeName").value = "";
  document.getElementById("recipeCategory").value = "";
  document.getElementById("recipeIngredients").value = "";
  document.getElementById("recipeImage").value = "";
  document.getElementById("recipeSteps").value = "";
}

// ========== ADD RECIPE (Add Page) ==========
function addNewRecipeFromPage() {
  const name = document.getElementById("recipeNameAdd").value.trim();
  const category = document.getElementById("recipeCategoryAdd").value.trim();
  const ingredientsRaw = document.getElementById("recipeIngredientsAdd").value.trim();
  const imageUrl = document.getElementById("recipeImageAdd").value.trim();
  const steps = document.getElementById("recipeStepsAdd").value.trim();
  
  if(!name || !category || !ingredientsRaw) {
    alert("❌ Please fill Name, Category and Ingredients!");
    return;
  }
  if(!["Indian","Fast Food","Dessert"].includes(category)) {
    alert("❌ Category must be exactly: Indian, Fast Food, or Dessert");
    return;
  }
  
  const newId = Date.now();
  const newRecipe = {
    id: newId,
    name: name,
    category: category,
    image: imageUrl || "https://placehold.co/400x300?text=New+Recipe",
    ingredients: ingredientsRaw.split(",").map(i => i.trim()),
    prep: "Custom",
    steps: steps || "Enjoy this homemade creation!"
  };
  recipes.push(newRecipe);
  renderAllSections();
  renderIngredientResults();
  renderIngredientResultsPage();
  clearAddFormPage();
  alert(`✅ "${name}" added successfully!`);
}

function clearAddFormPage() {
  document.getElementById("recipeNameAdd").value = "";
  document.getElementById("recipeCategoryAdd").value = "";
  document.getElementById("recipeIngredientsAdd").value = "";
  document.getElementById("recipeImageAdd").value = "";
  document.getElementById("recipeStepsAdd").value = "";
}

// ========== FIND BY INGREDIENTS (Home) ==========
let activeIngredientFilters = [];

function addIngredientFilter() {
  let ingVal = document.getElementById("ingredientSearch").value.trim().toLowerCase();
  if(!ingVal) return;
  if(!activeIngredientFilters.includes(ingVal)) {
    activeIngredientFilters.push(ingVal);
  }
  document.getElementById("ingredientSearch").value = "";
  updateFilterUI();
  renderIngredientResults();
}

function clearAllFilters() {
  activeIngredientFilters = [];
  updateFilterUI();
  const resultsDiv = document.getElementById("ingredientResultsGlobal");
  if(resultsDiv) {
    resultsDiv.innerHTML = `<div style="width:100%; text-align:center; padding:30px;">✨ Add ingredients above to find matching recipes.</div>`;
  }
}

function updateFilterUI() {
  const filterDiv = document.getElementById("activeFiltersGlobal");
  if(!filterDiv) return;
  if(activeIngredientFilters.length === 0) {
    filterDiv.innerHTML = `<span>🔍 Add ingredients like "cheese", "paneer", "chicken"</span>`;
  } else {
    filterDiv.innerHTML = `<strong>Active ingredients:</strong> ${activeIngredientFilters.map(f => `<span class="filter-badge">${f}</span>`).join(" ")} 
    <button onclick="clearAllFilters()" style="background:#555; padding:5px 12px; margin-top:10px;">Clear All</button>`;
  }
}

function renderIngredientResults() {
  const resultsDiv = document.getElementById("ingredientResultsGlobal");
  if(!resultsDiv) return;
  if(activeIngredientFilters.length === 0) {
    resultsDiv.innerHTML = `<div style="width:100%; text-align:center; padding:30px;">🍅 Type an ingredient and click 'Add Ingredient' to discover recipes.</div>`;
    return;
  }
  const matched = recipes.filter(recipe => {
    return activeIngredientFilters.every(filter =>
      recipe.ingredients.some(ing => ing.toLowerCase().includes(filter))
    );
  });
  if(matched.length === 0) {
    resultsDiv.innerHTML = `<div style="width:100%; text-align:center; padding:30px;">😕 No recipes contain all selected ingredients. Try different combo!</div>`;
    return;
  }
  resultsDiv.innerHTML = matched.map(recipe => createFlipCard(recipe)).join("");
  attachFlipEvents("ingredientResultsGlobal");
}

// ========== FIND BY INGREDIENTS (Find Page) ==========
let activeIngredientFiltersPage = [];

function addIngredientFilterPage() {
  let ingVal = document.getElementById("ingredientSearchPage").value.trim().toLowerCase();
  if(!ingVal) return;
  if(!activeIngredientFiltersPage.includes(ingVal)) {
    activeIngredientFiltersPage.push(ingVal);
  }
  document.getElementById("ingredientSearchPage").value = "";
  updateFilterUIPage();
  renderIngredientResultsPage();
}

function clearAllFiltersPage() {
  activeIngredientFiltersPage = [];
  updateFilterUIPage();
  const resultsDiv = document.getElementById("ingredientResultsPage");
  if(resultsDiv) {
    resultsDiv.innerHTML = `<div style="width:100%; text-align:center; padding:30px;">✨ Add ingredients above to find matching recipes.</div>`;
  }
}

function updateFilterUIPage() {
  const filterDiv = document.getElementById("activeFiltersPage");
  if(!filterDiv) return;
  if(activeIngredientFiltersPage.length === 0) {
    filterDiv.innerHTML = `<span>🔍 Add ingredients like "cheese", "paneer", "chicken"</span>`;
  } else {
    filterDiv.innerHTML = `<strong>Active ingredients:</strong> ${activeIngredientFiltersPage.map(f => `<span class="filter-badge">${f}</span>`).join(" ")} 
    <button onclick="clearAllFiltersPage()" style="background:#555; padding:5px 12px; margin-top:10px;">Clear All</button>`;
  }
}

function renderIngredientResultsPage() {
  const resultsDiv = document.getElementById("ingredientResultsPage");
  if(!resultsDiv) return;
  if(activeIngredientFiltersPage.length === 0) {
    resultsDiv.innerHTML = `<div style="width:100%; text-align:center; padding:30px;">🍅 Type an ingredient and click 'Add Ingredient' to discover recipes.</div>`;
    return;
  }
  const matched = recipes.filter(recipe => {
    return activeIngredientFiltersPage.every(filter =>
      recipe.ingredients.some(ing => ing.toLowerCase().includes(filter))
    );
  });
  if(matched.length === 0) {
    resultsDiv.innerHTML = `<div style="width:100%; text-align:center; padding:30px;">😕 No recipes contain all selected ingredients. Try different combo!</div>`;
    return;
  }
  resultsDiv.innerHTML = matched.map(recipe => createFlipCard(recipe)).join("");
  attachFlipEvents("ingredientResultsPage");
}

// ========== REVIEWS SYSTEM ==========
let reviews = JSON.parse(localStorage.getItem("foodieReviewsComplete")) || [];
function saveReviews() { localStorage.setItem("foodieReviewsComplete", JSON.stringify(reviews)); }

function addReview() {
  const name = document.getElementById("reviewerName").value.trim();
  const comment = document.getElementById("reviewComment").value.trim();
  if(!name || !comment) {
    alert("❌ Please enter your name and a review!");
    return;
  }
  reviews.unshift({ name: name, text: comment, date: new Date().toLocaleDateString() });
  saveReviews();
  renderReviews();
  document.getElementById("reviewerName").value = "";
  document.getElementById("reviewComment").value = "";
  alert("✅ Review submitted successfully!");
}

function addReviewFromPage() {
  const name = document.getElementById("reviewerNamePage").value.trim();
  const comment = document.getElementById("reviewCommentPage").value.trim();
  if(!name || !comment) {
    alert("❌ Please enter your name and a review!");
    return;
  }
  reviews.unshift({ name: name, text: comment, date: new Date().toLocaleDateString() });
  saveReviews();
  renderReviewsPage();
  document.getElementById("reviewerNamePage").value = "";
  document.getElementById("reviewCommentPage").value = "";
  alert("✅ Review submitted successfully!");
}

function renderReviews() {
  const reviewContainer = document.getElementById("reviewsListGlobal");
  if(!reviewContainer) return;
  if(reviews.length === 0) {
    reviewContainer.innerHTML = `<div style="width:100%; text-align:center; padding:20px;">💬 No reviews yet. Be the first to share your foodie thoughts!</div>`;
    return;
  }
  reviewContainer.innerHTML = reviews.map(rev => `
    <div class="review-card">
      <h4>⭐ ${escapeHtml(rev.name)}</h4>
      <p>“${escapeHtml(rev.text)}”</p>
      <small>📅 ${rev.date}</small>
    </div>
  `).join("");
}

function renderReviewsPage() {
  const reviewContainer = document.getElementById("reviewsListPage");
  if(!reviewContainer) return;
  if(reviews.length === 0) {
    reviewContainer.innerHTML = `<div style="width:100%; text-align:center; padding:20px;">💬 No reviews yet. Be the first to share your foodie thoughts!</div>`;
    return;
  }
  reviewContainer.innerHTML = reviews.map(rev => `
    <div class="review-card">
      <h4>⭐ ${escapeHtml(rev.name)}</h4>
      <p>“${escapeHtml(rev.text)}”</p>
      <small>📅 ${rev.date}</small>
    </div>
  `).join("");
}

// ========== PAGE SWITCHING ==========
function switchPage(pageName) {
  const pages = ['home', 'indian', 'fast', 'dessert', 'favorites', 'add', 'find', 'review', 'about'];
  pages.forEach(page => {
    const el = document.getElementById(`${page}-page`);
    if(el) el.classList.remove('active-page');
  });
  
  const activePage = document.getElementById(`${pageName}-page`);
  if(activePage) activePage.classList.add('active-page');
  
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active-nav'));
  
  const pageMap = { 
    home:'Home', indian:'Indian', fast:'Fast', dessert:'Dessert', 
    favorites:'Favorites', add:'Add', find:'Find', review:'Reviews', about:'About'
  };
  for(let btn of document.querySelectorAll('.nav-btn')) {
    if(btn.textContent.includes(pageMap[pageName])) {
      btn.classList.add('active-nav');
      break;
    }
  }
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========== INITIALIZATION ==========
function init() {
  renderAllSections();
  renderReviews();
  renderReviewsPage();
  renderIngredientResults();
  renderIngredientResultsPage();
}

// Make functions globally available
window.switchPage = switchPage;
window.toggleFavorite = toggleFavorite;
window.addNewRecipe = addNewRecipe;
window.clearAddForm = clearAddForm;
window.addNewRecipeFromPage = addNewRecipeFromPage;
window.clearAddFormPage = clearAddFormPage;
window.addIngredientFilter = addIngredientFilter;
window.clearAllFilters = clearAllFilters;
window.addIngredientFilterPage = addIngredientFilterPage;
window.clearAllFiltersPage = clearAllFiltersPage;
window.addReview = addReview;
window.addReviewFromPage = addReviewFromPage;
window.searchRecipes = searchRecipes;
window.closeSearchResults = closeSearchResults;
window.clearSearch = clearSearch;

init();