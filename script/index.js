function showAvailableServices(services){
  let servicesContainer = document.getElementById('services-container');
  services.map((element)=>{
    if(!element.isConsumed){
      let card = createServiceCard(element);
      servicesContainer.appendChild(card)
    }
  })
}

function createServiceCard(service){
  // console.log(service)
  const card = document.createElement('div');
  card.classList.add('service-card');
  card.classList.add('card');
  card.classList.add('col-3');

  const title = document.createElement('h2')
  title.classList.add('service-title');
  card.classList.add('card-title');
  title.textContent = service.name;
  
  const description = document.createElement('h4');
  description.classList.add('service-description');
  card.classList.add('card-text');
  description.textContent = service.description;
  
  const cost = document.createElement('h4');
  cost.classList.add('service-cost');
  cost.textContent = service.cost;

  const bookServiceButton = document.createElement('button')
  bookServiceButton.id = service.serviceId
  bookServiceButton.classList.add('book-service');
  bookServiceButton.classList.add('btn');
  bookServiceButton.classList.add('btn-primary');
  bookServiceButton.textContent = 'Book Service';
  bookServiceButton.addEventListener('click',(e)=>{handleBookService(e)});

  card.appendChild(title);
  card.appendChild(description);
  card.appendChild(cost);
  card.appendChild(bookServiceButton);
  return card;
}

function handleBookService(e){
  const loggedIn = isUserLoggedIn();
  if(!loggedIn){
    alert('you are not loggedIn')
  }else{
    console.log("request" ,e)
  }
}

function isUserLoggedIn(){
  const userLoggedIn = localStorage.getItem('userLoggedIn');
  return userLoggedIn === 'true' ? true : false;
}

document.addEventListener('DOMContentLoaded',async (e)=>{
  const services = JSON.parse(localStorage.getItem('services')) || [];
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const loginBtn = document.getElementById("login-btn");
  const signUpBtn = document.getElementById("sign-up-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const userLoggedIn = localStorage.getItem("userLoggedIn") || false;
  
  if(services.length === 0){
    const services = await fetchServices();
    localStorage.setItem('services',JSON.stringify(services));
    showAvailableServices(services);
  }else{
    showAvailableServices(services);
  }

  if(users.length === 0){
    const users = await fetchUsers();
    localStorage.setItem('users',JSON.stringify(users));
  }

  if (userLoggedIn === "true") {
    // User is logged in, hide login and sign-up buttons and show logout button
    loginBtn.style.display = "none";
    signUpBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
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
})

async function fetchServices(){
  const res = await fetch('../data/services.json');
  const data = await res.json()
  return data;
}

async function fetchUsers(){
  const res = await fetch('../data/users.json');
  const data = await res.json()
  return data;
}
