const loadCategories = async () => {
  try {
    toggleCategorySpinner(true);
    const response = await fetch(
      `https://openapi.programming-hero.com/api/peddy/categories`
    );
    const data = await response.json();
    showCategories(data.categories);
  } catch (error) {
    console.log(`Erro:${error}`);
  } finally {
    toggleCategorySpinner(false);
  }
};

const showCategories = (categories) => {
  const categoryContainer = document.getElementById("category-container");
  categories.forEach((categoryItem) => {
    const categoryButton = document.createElement("button");
    categoryButton.className =
      "btn border-2 p-6 rounded-lg font-bold category-btn";
    categoryButton.id = categoryItem.id;
    categoryButton.addEventListener("click", () => {
      loadPetsByCategory(categoryItem.id, categoryItem.category);
    });
    categoryButton.innerHTML = `
        <img class="w-8" src="${categoryItem.category_icon}" alt=""> ${categoryItem.category}
        `;
    categoryContainer.appendChild(categoryButton);
  });
};

const loadPets = async () => {
  try {
    togglePetSpinner(true);
    const response = await fetch(
      `https://openapi.programming-hero.com/api/peddy/pets`
    );
    const data = await response.json();
    showPets(data.pets);
  } catch (error) {
    console.log(`Error: ${error}`);
  } finally {
    togglePetSpinner(false);
  }
};

const loadPetsByCategory = async (categoryId, categoryName) => {
  isActive(categoryId);

  try {
    const petsContainer = document.getElementById("pet-container");
    petsContainer.innerHTML = "";
    togglePetSpinner(true);
    const response = await fetch(
      `https://openapi.programming-hero.com/api/peddy/category/${categoryName}`
    );
    const data = await response.json();
    showPets(data.data);
  } catch (error) {
    console.log(`Error: ${error}`);
  } finally {
    togglePetSpinner(false);
  }
};

let currentPets = [];
const showPets = (pets) => {
  currentPets = pets;
  const petsContainer = document.getElementById("pet-container");
  petsContainer.innerHTML = "";

  pets.forEach((petItem) => {
    const petsCard = document.createElement("div");
    petsCard.className = "card border-2 shadow-sm p-3";
    petsCard.innerHTML = `
        <figure>
            <!-- card image  -->
            <img
            class="w-full rounded-lg"
            src="${petItem.image}"
            alt="${petItem.pet_name}"
            />
        </figure>
        <div class="card-body px-0 py-3">
            <!-- card-body -->
            <h3 class="font-bold text-xl">${petItem.pet_name}</h3>
            <div class="text-gray-500 flex flex-col gap-1">
                <p>
                <i class="fa-solid fa-puzzle-piece"></i> Breed: ${petItem.breed}
                </p>
                <p><i class="fa-solid fa-calendar-days"></i> Birth: ${
                  petItem.date_of_birth
                    ? getBirthYear(petItem?.date_of_birth)
                    : "not found"
                }</p>
                <p><i class="fa-solid fa-mars-and-venus"></i> Gender: ${
                  petItem.gender
                }</p>
                <p><i class="fa-solid fa-dollar-sign"></i> Price: ${
                  petItem.price ? "$" + petItem.price : "contact the seller"
                }</p>
                </div>
                <hr class="border-1 border-gray-200 my-2" />
                <div class="flex justify-between text-[#0E7A81] font-bold">
                <button id="petid-${
                  petItem.petId
                }" class="btn border-2 rounded-lg px-3 py-2">
                <i class="fa-solid fa-thumbs-up"></i></button
                ><button class="btn border-2 rounded-lg px-3 py-2">
                Adopt</button
                ><button id="details-btn-${
                  petItem.petId
                }" onclick="detailsModal.showModal()" class="btn border-2 rounded-lg px-3 py-2">
                Details
                </button>
            </div>
        </div>
    `;

    petsContainer.appendChild(petsCard);
    const detailsBtn = document.getElementById(`details-btn-${petItem.petId}`);
    detailsBtn.addEventListener("click", (e) => {
      showDetails(petItem.petId);
    });
    const likeBtn = document.getElementById(`petid-${petItem.petId}`);
    likeBtn.addEventListener("click", () => {
      likedPetsList(petItem, pets);
    });
  });
};
const showDetails = async (petId) => {
  try {
    const modalContainer = document.getElementById("modal-data");
    modalContainer.innerHTML = "";
    toggleDetailsSpinner(true);
    const response = await fetch(
      `https://openapi.programming-hero.com/api/peddy/pet/${petId}`
    );
    const data = await response.json();
    const petData = data.petData;
    const modalCard = document.createElement("div");
    // modalCard.classList.add("modal-box");
    modalCard.innerHTML = `
        <div>
        <img
            class="w-full rounded-lg mb-3"
            src="${petData.image}"
            alt="${petData.name}"
        />
        <h2 class="font-bold text-lg mb-3">${petData.pet_name}</h2>
        <div class="grid grid-cols-2 w-5/6 gap-4 text-gray-400 mb-3">
            <p><i class="fa-solid fa-puzzle-piece"></i> breed: ${
              petData.breed
            }</p>
            <p><i class="fa-solid fa-calendar-days"></i> Birth: ${
              petData.date_of_birth
                ? getBirthYear(petData?.date_of_birth)
                : "not found"
            }</p>
            <p><i class="fa-solid fa-mars-and-venus"></i> Gender: ${
              petData.gender
            }</p>
            <p><i class="fa-solid fa-dollar-sign"></i> Price: ${
              petData.price ? "$" + petData.price : "contact the seller"
            }</p>
            <p><i class="fa-solid fa-syringe"></i> Vaccine: ${
              petData.vaccinated_status
            } </p>
        </div>
        <hr class="border-1 border-gray-200 my-3" />
        <h3 class="font-bold mb-3">Details Information</h3>
        <p class="text-gray-400 mb-3">
        ${petData.pet_details}
        </p>
        </div>
        <!-- modal close btn  -->
        <form method="dialog">
        <button
            class="btn w-full text-center border-1 rounded-lg bg-[#0e79810d] text-[#0E7A81]"
        >
            Cancel
        </button>
        </form>
    `;
    modalContainer.appendChild(modalCard);
  } catch (error) {
    console.log(`Error: ${error}`);
  } finally {
    toggleDetailsSpinner(false);
  }
};

let likedPets = [];
const likedPetsList = (liked, loadedPets) => {
  const matching = likedPets.some((pet) => pet.petId === liked.petId);
  const likeBtn = document.getElementById(`petid-${liked.petId}`);
  if (!matching) {
    likedPets.push(liked);
    likeBtn.classList.add("bg-green-200");
  } else {
    likedPets = likedPets.filter((pet) => pet.petId !== liked.petId);
    likeBtn.classList.remove("bg-green-200");
  }
  const likedPetsContainer = document.getElementById("liked-pets");
  likedPetsContainer.innerHTML = "";
  likedPets.forEach((likedItem) => {
    const likedPetCard = document.createElement("img");
    likedPetCard.classList.add("rounded-lg", "w-5/12", "m-1", "inline-block");
    likedPetCard.setAttribute("src", likedItem.image);

    likedPetsContainer.appendChild(likedPetCard);
  });
};

const sortByPrice = (currentPets) => {
  const unsorted = currentPets;
  const sorted = currentPets.sort((a, b) => a.price - b.price);
  showPets(sorted);
};
const sortBtn = document.getElementById("sort-by-price");
sortBtn.addEventListener("click", () => {
  sortByPrice(currentPets);
});

const getBirthYear = (date) => {
  const splited = date.split("-");
  return splited[0];
};

const toggleCategorySpinner = (isActive) => {
  const categorySpinner = document.getElementById("category-spinner");
  if (isActive == true) {
    categorySpinner.classList.remove("hidden");
  } else if (isActive == false) {
    categorySpinner.classList.add("hidden");
  }
};
const toggleDetailsSpinner = (isActive) => {
  const detailsSpinner = document.getElementById("details-spinner");
  if (isActive == true) {
    detailsSpinner.classList.remove("hidden");
  } else if (isActive == false) {
    detailsSpinner.classList.add("hidden");
  }
};
const togglePetSpinner = (isActive) => {
  const petSpinner = document.getElementById("pet-spinner");
  const likedPet = document.getElementById("liked-pets");
  if (isActive == true) {
    petSpinner.classList.remove("hidden");
    likedPet.classList.add("hidden");
  } else if (isActive == false) {
    petSpinner.classList.add("hidden");
    likedPet.classList.remove("hidden");
  }
};
const isActive = (categoryId) => {
  const activeBtn = document.getElementById(categoryId);
  const allButtons = document.getElementsByClassName("category-btn");
  for (const btn of allButtons) {
    btn.classList.remove("bg-green-100");
    btn.classList.add("rounded-lg");
    btn.classList.remove("rounded-full");
  }
  activeBtn.classList.add("bg-green-100");
  activeBtn.classList.remove("rounded-lg");
  activeBtn.classList.add("rounded-full");
};

loadCategories();
loadPets();
