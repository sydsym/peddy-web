const loadCategories = async() => {
    try{
        const response = await fetch(`https://openapi.programming-hero.com/api/peddy/categories`);
        const data = await response.json();
        showCategories(data.categories);
    } catch(error){
        console.log(`Erro:${error}`);
    }
}

const showCategories = (categories) => {
    const categoryContainer = document.getElementById('category-container');
    categories.forEach(categoryItem => {
        const categoryButton = document.createElement('button');
        categoryButton.className = "btn border-2 p-6 rounded-lg font-bold";
        categoryButton.id = categoryItem.id;
        categoryButton.innerHTML = 
        `
        <img class="w-8" src="${categoryItem.category_icon}" alt=""> ${categoryItem.category}
        `;
        categoryContainer.appendChild(categoryButton);
    });
}

loadCategories();