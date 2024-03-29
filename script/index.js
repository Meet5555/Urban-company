function showAvailableServices(services,selectedCategory = "All") {
  let servicesContainer = document.getElementById("services-container");
  let servicesContainerTitle = document.getElementById("container-title");
  const userObj = JSON.parse(localStorage.getItem("userObj")) || [];

  servicesContainer.innerHTML = "";

  if (userObj.isServiceProvider) {
    servicesContainerTitle.innerText = "Requested Services";
    // show only requested services to the service provider for particulars service providers category and also which are not accepted by the service provider
    services = services.filter(
      (service) =>
        service.category === userObj.serviceProviderCategory &&
        service.isConsumed &&
        !userObj.acceptedServices.includes(service.serviceId)
    );
  }

  // Check if there are no services
  if (services.length === 0) {
    servicesContainer.innerHTML = "<h3>No services found</h3>";
    return;
  }
  
  services.forEach((element) => {
    if(userObj.isServiceProvider){
      if (element.isConsumed && (element.category === userObj.serviceProviderCategory)) {
        let card = createServiceCard(element, "Accept");
        servicesContainer.appendChild(card);
      }
    }else{
      servicesContainerTitle.innerText = "Available Services";
      if (!element.isConsumed && (selectedCategory === 'All' || element.category === selectedCategory)) {
        let card = createServiceCard(element, "Book Service");
        servicesContainer.appendChild(card);
      }
    }
  });
}

function createServiceCard(service, btnText) {
  const card = document.createElement("div");
  card.classList.add("service-card","card","col-3");

  const title = document.createElement("h2");
  title.classList.add("service-title","card-title");
  title.textContent = service.name;

  const description = document.createElement("h4");
  description.classList.add("service-description","card-text");
  description.textContent = service.description;

  const category = document.createElement("h5");
  category.classList.add("service-category","card-text");
  category.textContent = `Category: ${service.category}`;

  const cost = document.createElement("h4");
  cost.classList.add("service-cost","card-text");
  cost.textContent = ` Cost: ₹${service.cost}`;

  const bookServiceButton = document.createElement("button");
  bookServiceButton.id = service.serviceId;
  bookServiceButton.classList.add("book-service","btn","btn-primary");
  bookServiceButton.textContent = btnText;
  bookServiceButton.addEventListener("click", (e) => {
    btnText.includes("Book") ? handleBookService(e) : handleAcceptRequest(e);
  });

  card.appendChild(title);
  card.appendChild(description);
  card.appendChild(category);
  card.appendChild(cost);
  card.appendChild(bookServiceButton);
  return card;
}

function isUserLoggedIn() {
  const userLoggedIn = localStorage.getItem("userLoggedIn");
  return userLoggedIn === "true" ? true : false;
}

// function to book service for user
function handleBookService(e) {
  const loggedIn = isUserLoggedIn();
  if (!loggedIn) {
    Toastify({
      text: "Please Login first to book service",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "center",
      stopOnFocus: true,
      style: {
        background: "rgb(255, 202, 44)",
      },
      onClick: function () {
        window.location.href = "/pages/login.html";
      },
    }).showToast();
  } else {
    const userObj = JSON.parse(localStorage.getItem("userObj"));
    const users = JSON.parse(localStorage.getItem("users"));
    const services = JSON.parse(localStorage.getItem("services"));
    const requestedServiceId = parseInt(e.target.id);
    const requestedServices = JSON.parse(localStorage.getItem("requestedServices")) || [];

    // check if user have more than 3 services booked or requested
    if (userObj.requestedServices.length >= 3 || userObj.activeServices.length >= 3 ) {
      Toastify({
        text: "You have booked maximum of 3 services, try again after completion of previous service",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        style: {
          background: "rgb(255, 202, 44)",
        },
      }).showToast();
      return;
    }

    // Add the new requested service to the list
    requestedServices.push({
      requestedBy: userObj.id,
      requestedService: requestedServiceId,
    });

    // Update the local storage with the new requested services
    localStorage.setItem(
      "requestedServices",
      JSON.stringify(requestedServices)
    );

    // Update the requestedServices field in the userObj
    userObj.requestedServices.push(requestedServiceId);

    // update main users array
    const updatedUsers = users.map((user) => {
      if (user.id === userObj.id) {
        user.requestedServices.push(requestedServiceId);
      }
      return user;
    });

    const updatedServices = services.map((service) => {
      if (service.serviceId === requestedServiceId) {
        return { ...service, isConsumed: true };
      }
      return service;
    });

    // Update the local storage with the modified userObj
    localStorage.setItem("userObj", JSON.stringify(userObj));
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("services", JSON.stringify(updatedServices));
    Toastify({
      text: "Service requested successfully",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "center",
      stopOnFocus: true,
      style: {
        background: "rgb(12, 188, 12)",
      },
    }).showToast();
    const selectedCategory = document
      .getElementById("filterButton")
      .innerText.replace("Categories", "")
      .replace(")", "")
      .replace("(", "")
      .trim();
    if (selectedCategory.length != 0) {
      showAvailableServices(updatedServices, selectedCategory);
    } else {
      showAvailableServices(updatedServices);
    }
  }
}

// function to accept service by service provider
function handleAcceptRequest(e) {
  const loggedIn = isUserLoggedIn();

  if (!loggedIn) {
    Toastify({
      text: "You are not logged in",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "center",
      stopOnFocus: true,
      style: {
        background: "rgb(252, 90, 90)",
      },
    }).showToast();
    return;
  }

  const requestedServiceId = parseInt(e.target.id);
  const services = JSON.parse(localStorage.getItem("services")) || [];
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const userObj = JSON.parse(localStorage.getItem("userObj")) || [];
  const requestedServices = JSON.parse(localStorage.getItem("requestedServices")) || [];

  if (userObj.acceptedServices.length >= 3) {
    Toastify({
      text: "You have accepted a maximum of 3 services. Please try again after completing a previous service.",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "center",
      stopOnFocus: true,
      style: {
        background: "rgb(255, 202, 44)",
      },
    }).showToast();
    return;
  }

  // Update requested service array in local storage
  const updatedRequestedServicesObj = requestedServices.filter(
    (reqService) => reqService.requestedService !== requestedServiceId
  );

  // Find the user who requested the service
  const requestedUser = users.find((user) =>
    requestedServices.some(
      (reqService) =>
        reqService.requestedBy === user.id &&
        reqService.requestedService === requestedServiceId
    )
  );

  // Update activeService and requested service for the user in the users array
  const updatedUsersArray = users.map((user) => {
    if (user.id === requestedUser.id) {
      user.requestedServices = user.requestedServices.filter(
        (serviceId) => serviceId !== requestedServiceId
      );
      user.activeServices.push(requestedServiceId);
    }
    return user;
  });

  // Update acceptedService for serviceProvider in userObj and users array
  const serviceProviderObj = users.find((user) => user.id === userObj.id);

  if (serviceProviderObj) {
    serviceProviderObj.acceptedServices.push(requestedServiceId);
    userObj.acceptedServices.push(requestedServiceId);
  }

  // Update service consumed in services array
  services.forEach((service) => {
    if (service.serviceId === requestedServiceId) {
      service.isConsumed = true;
    }
  });

  // Save userObj, users, services, requested services to local storage
  localStorage.setItem("users", JSON.stringify(updatedUsersArray));
  localStorage.setItem("userObj", JSON.stringify(userObj));
  localStorage.setItem("services", JSON.stringify(services));
  localStorage.setItem(
    "requestedServices",
    JSON.stringify(updatedRequestedServicesObj)
  );

  Toastify({
    text: "Service accepted",
    duration: 2000,
    close: true,
    gravity: "top",
    position: "center",
    stopOnFocus: true,
    style: {
      background: "rgb(12, 188, 12)",
    },
  }).showToast();

  // Call show requested service function
  showRequestedServices(services, updatedRequestedServicesObj);
}

document.addEventListener("DOMContentLoaded", async (e) => {
  const services = JSON.parse(localStorage.getItem("services")) || [];
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const loginBtn = document.getElementById("login-btn");
  const signUpBtn = document.getElementById("sign-up-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const userLoggedIn = localStorage.getItem("userLoggedIn") || false;

  if (services.length === 0) {
    const services = await fetchServices();
    localStorage.setItem("services", JSON.stringify(services));
    showAvailableServices(services);
  } else {
    showAvailableServices(services);
  }

  if (users.length === 0) {
    const users = await fetchUsers();
    localStorage.setItem("users", JSON.stringify(users));
  }

  if (userLoggedIn === "true") {
    // User is logged in, hide login and sign-up buttons and show logout button
    loginBtn.style.display = "none";
    signUpBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";

    const userObj = JSON.parse(localStorage.getItem("userObj")) || [];
    const requestedServices =
      JSON.parse(localStorage.getItem("requestedServices")) || [];
    const servicesContainerTitle = document.getElementById("container-title");
    if (userObj.length != 0) {
      if (userObj.isServiceProvider == true) {
        if (!requestedServices || requestedServices.length === 0) {
          noServiceRequested();
          servicesContainerTitle.innerText = "Available Requests for Service";
        } else {
          showRequestedServices(services, requestedServices);
        }
      }
    }
  } else {
    // User is not logged in, show login and sign-up buttons and hide logout button
    loginBtn.style.display = "inline-block";
    signUpBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
  }

  logoutBtn.addEventListener("click", function () {
    // Set userLoggedIn to false and remove userObj from localStorage on logout
    localStorage.setItem("userLoggedIn", "false");
    localStorage.removeItem("userObj");
    // Redirect to login page after logout
    window.location.href = "/pages/login.html";
  });

  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", function (e) {
    const userObj = JSON.parse(localStorage.getItem("userObj")) || [];
    const query = e.target.value.toString().trim().toLowerCase();
    if (userObj.isServiceProvider) {
      if (query.length === 0) {
        showAvailableServices(services);
      } else {
        performSearch(
          query.toString(),
          services,
          userObj.serviceProviderCategory
        );
      }
    } else {
      const selectedCategory = document
        .getElementById("filterButton")
        .innerText.replace("Categories", "")
        .replace(")", "")
        .replace("(", "")
        .trim();
      // Trigger search on input change
      if (query.length === 0) {
        if (selectedCategory.length != 0) {
          showAvailableServices(services, selectedCategory);
        } else {
          showAvailableServices(services);
        }
      } else {
        performSearch(query.toString(), services, selectedCategory);
      }
    }
  });
});

function performSearch(query, services, selectedCategory) {
  const filteredServices = services.filter((service) => {
    return (
      (service.name.toLowerCase().includes(query) ||
      service.description.toLowerCase().includes(query) ||
      service.category.toLowerCase().includes(query)) && (selectedCategory.length != 0 ? service.category === selectedCategory: true) && !service.isConsumed
    );
  });
  if (filteredServices.length === 0) {
    // Handle case when no results are found
    let servicesContainer = document.getElementById("services-container");
    servicesContainer.innerHTML = "<h3>No matching services found</h3>";
  } else {
    // Display the filtered services
    showAvailableServices(filteredServices);
  }
}

function showRequestedServices(services, requestedServices) {
  let servicesContainer = document.getElementById("services-container");
  let requestedServicesArray = requestedServices.map((e) => e.requestedService);
  let servicesContainerTitle = document.getElementById("container-title");
  const userObj = JSON.parse(localStorage.getItem("userObj")) || [];
  let requestedServicesObj = services.filter((e) => {
    return (
      requestedServicesArray.includes(e.serviceId) &&
      e.category == userObj.serviceProviderCategory
    );
  });
  if (requestedServicesObj.length == 0) {
    noServiceRequested();
    servicesContainerTitle.innerText = "Requested Services";
  } else {
    servicesContainer.innerHTML = "";
    servicesContainerTitle.innerText = "Requested Services";
    requestedServicesObj.map((element) => {
      let card = createServiceCard(element, "Accept");
      servicesContainer.append(card);
    });
  }
}

function noServiceRequested() {
  let servicesContainer = document.getElementById("services-container");
  const card = document.createElement("h3");
  card.classList.add("service-card");
  card.classList.add("card");
  card.innerHTML = "No service requested";
  servicesContainer.innerHTML = "";
  servicesContainer.append(card);
}

async function fetchServices() {
  const res = await fetch("../data/services.json");
  const data = await res.json();
  return data;
}

async function fetchUsers() {
  const res = await fetch("../data/users.json");
  const data = await res.json();
  return data;
}

document.addEventListener("DOMContentLoaded", function () {
  const sortButton = document.getElementById("sortButton");
  const filterButton = document.getElementById("filterButton");

  sortButton.addEventListener("click", function () {
    const sortOptions = document.getElementById("sortOptions");
    const dropdownInstance = new bootstrap.Dropdown(sortButton);
    dropdownInstance.toggle();
  });

  filterButton.addEventListener("click", function () {
    const filterOptions = document.getElementById("filterOptions");
    const dropdownInstance = new bootstrap.Dropdown(filterButton);
    dropdownInstance.toggle();
  });

  const filterOptions = document.getElementById("filterOptions");
  filterOptions.addEventListener("click", function (e) {
    const selectedCategory = e.target.dataset.category;
    if (selectedCategory) {
      handleFilter(selectedCategory);
    }
  });

  document.addEventListener("click", function (event) {
    const sortButtonParent = event.target.closest("#sortButton");
    const filterButtonParent = event.target.closest("#filterButton");

    if (!sortButtonParent) {
      const sortButtonInstance = new bootstrap.Dropdown(sortButton);
      sortButtonInstance.hide();
    }
    if (!filterButtonParent) {
      const filterButtonInstance = new bootstrap.Dropdown(filterButton);
      filterButtonInstance.hide();
    }
  });
});

//SORTING FUNCTIONALITY WORKING HERE - Vaideek
function sortServices(order) {
  // Assuming our services data is stored in a variable called 'services'
  let services = JSON.parse(localStorage.getItem("services")) || [];

  switch (order) {
    case "lowToHigh":
      services.sort((a, b) => parseFloat(a.cost) - parseFloat(b.cost));
      break;
    case "highToLow":
      services.sort((a, b) => parseFloat(b.cost) - parseFloat(a.cost));
      break;

    default:
      services.sort((a, b) => a.serviceId - b.serviceId);
      break;
  }

  // Update the local storage with the sorted services
  localStorage.setItem("services", JSON.stringify(services));

  // Call a function to update the UI with the sorted services
  const selectedCategory = document
    .getElementById("filterButton")
    .innerText.replace("Categories", "")
    .replace(")", "")
    .replace("(", "")
    .trim();
  if (selectedCategory.length != 0) {
    let updatedServices = services.filter(
      (service) => service.category === selectedCategory
    );
    showAvailableServices(updatedServices, selectedCategory);
  } else {
    showAvailableServices(services);
  }

  //Code to show the selected option on select
  const sortButton = document.getElementById("sortButton");
  sortButton.innerText = `Sort (${
    order === "lowToHigh" ? "Low to High" : "High to Low"
  })`;
}

function handleFilter(category) {
  // Fetch services from localStorage
  const services = JSON.parse(localStorage.getItem("services")) || [];

  const filterButton = document.getElementById("filterButton");

  if (category === "All") {
    // If "All" is selected, show all services
    showAvailableServices(services);

    // Update the text of the filter button
    filterButton.innerText = "Categories";
  } else {
    // Filter services based on the selected category
    const filteredServices = services.filter(
      (service) => service.category === category
    );

    // Update the UI with the filtered services
    showAvailableServices(filteredServices);

    // Update the text of the filter button
    filterButton.innerText = `Categories (${category})`;
  }
}

//PRICE RANGE BUTTON GOES HERE
document.addEventListener("DOMContentLoaded", function () {
  const priceRangeButton = document.getElementById("priceRangeButton");
  const priceRangeOptions = document.getElementById("priceRangeOptions");

  priceRangeButton.addEventListener("click", function () {
    const dropdownInstance = new bootstrap.Dropdown(priceRangeButton);
    dropdownInstance.toggle();
  });

  priceRangeOptions.addEventListener("click", function (e) {
    const selectedPriceRange = e.target.textContent;
    handlePriceRange(selectedPriceRange); // Call the handlePriceRange function
  });

  document.addEventListener("click", function (event) {
    const priceRangeButtonParent = event.target.closest("#priceRangeButton");

    if (!priceRangeButtonParent) {
      // Clicked outside the price range button, close the dropdown
      const priceRangeButtonInstance = new bootstrap.Dropdown(priceRangeButton);
      priceRangeButtonInstance.hide();
    }
  });
});

function handlePriceRange(selectedPriceRange) {
  const services = JSON.parse(localStorage.getItem("services")) || [];
  const selectedCategory = document.getElementById("filterButton").innerText.replace("Categories", "").replace(")", "").replace("(","").trim();
  if(selectedCategory.length != 0){
    if(selectedPriceRange === 'All Range'){
      showAvailableServices(services,selectedCategory);
    }else{
      // Implement logic to filter services based on the selected price range
      let filteredServices = services.filter((service) => {
        const serviceCost = parseInt(service.cost);
        const [min, max] = selectedPriceRange.split('-').map(Number);
        return serviceCost >= min && (serviceCost <= max) && service.category === selectedCategory;
      });
      // Update the UI with the filtered services
      showAvailableServices(filteredServices);
    }
  }else{
    let filteredServices = services.filter((service) => {
      const serviceCost = parseInt(service.cost);
      const [min, max] = selectedPriceRange.split('-').map(Number);
      return serviceCost >= min && (serviceCost <= max)
    });
    // Update the UI with the filtered services
    showAvailableServices(filteredServices);
  }
}