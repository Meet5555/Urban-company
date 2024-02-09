function showAvailableServices(services){
  let servicesContainer = document.getElementById('services-container');
  let servicesContainerTitle = document.getElementById('container-title');
  servicesContainer.innerHTML = '';
  servicesContainerTitle.innerText = 'Available Services'
  services.map((element)=>{
    if(!element.isConsumed){
      let card = createServiceCard(element,'Book Service');
      servicesContainer.appendChild(card)
    }
  })
}

function createServiceCard(service,btnText){
  // console.log("inside create card", service)
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
  bookServiceButton.textContent = btnText;
  bookServiceButton.addEventListener('click',(e)=>{
    btnText.includes('Book') ? handleBookService(e) : handleAcceptRequest(e)
  });

  card.appendChild(title);
  card.appendChild(description);
  card.appendChild(cost);
  card.appendChild(bookServiceButton);
  return card;
}

function handleBookService(e){
  const loggedIn = isUserLoggedIn();
  if(!loggedIn){
    alert('You are not logged in');
  } else {
    const userObj = JSON.parse(localStorage.getItem('userObj'));
    const users = JSON.parse(localStorage.getItem('users'));
    const services = JSON.parse(localStorage.getItem('services'));
    const requestedServiceId = parseInt(e.target.id);
    const requestedServices = JSON.parse(localStorage.getItem('requestedServices')) || [];

    // Add the new requested service to the list
    requestedServices.push({
      requestedBy: userObj.id,
      requestedService: requestedServiceId,
    });

    // Update the local storage with the new requested services
    localStorage.setItem('requestedServices', JSON.stringify(requestedServices));

    // Update the requestedServices field in the userObj
    userObj.requestedServices.push(requestedServiceId);

    const updatedUsers = users.map(user => {
      if (user.id === userObj.id) {
        user.requestedServices.push(requestedServiceId);
      }
      return user;
    });

    const updatedServices = services.map(service => {
      if (service.serviceId === requestedServiceId) {
        return { ...service, isConsumed: true };
      }
      return service;
    });
  
    // Update the local storage with the modified userObj
    localStorage.setItem('userObj', JSON.stringify(userObj));
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('services', JSON.stringify(updatedServices));

    showAvailableServices(updatedServices)
  }
}

function handleAcceptRequest(e){
  const loggedIn = isUserLoggedIn();
  if(!loggedIn){
    alert('you are not loggedIn')
  }else{
    // console.log(e,"I accepted")
    let requestedServiceId = parseInt(e.target.id)
    // console.log(e,"I accepted id" , requestedServiceId)
    const services = JSON.parse(localStorage.getItem('services')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userObj = JSON.parse(localStorage.getItem('userObj')) || [];
    const requestedServices  = JSON.parse(localStorage.getItem('requestedServices')) || [];

    // update requested service array in local storage
    const updatedRequestedServicesObj = requestedServices.filter((e)=>{
      return e.requestedService != requestedServiceId;
    })
    // update activeService and requested service for user users array
    let requestedUser = [];
    requestedUser = users.filter((user) => {
      return requestedServices.some((requestedService) => {
        return requestedService.requestedBy === user.id;
      });
    });
    let updatedUsersArray = users.map((user)=>{
      if(requestedUser.length != 0){
        if(user.id == requestedUser[0].id){
          user.requestedServices = user.requestedServices.filter((e)=> {
            e != requestedServiceId
          })
          user.activeServices.push(requestedServiceId);
        }
        return user;
      }
    })

    // update acceptedService for serviceProvider in userObj and users array
    const serviceProviderObj = users.filter((e)=>{
      return e.id == userObj.id;
    })
    updatedUsersArray = users.map((user)=>{
      console.log("do match", user.id , serviceProviderObj[0].id)
        if(user.id == serviceProviderObj[0].id){
          user.acceptedServices.push(requestedServiceId);
          userObj.acceptedServices.push(requestedServiceId)
        }
        return user;
    })
    console.log("me provides", updatedUsersArray);
    console.log("me provides", userObj);

    // update service consumed in services array
    services.map((service)=>{
      if(service.serviceId == requestedServiceId){
        service.isConsumed = true;
      }
    })

    // call show requested service function
    showRequestedServices(services,updatedRequestedServicesObj);

    // save userObj, users, services, requested services to local storage
    localStorage.setItem('users',JSON.stringify(updatedUsersArray))
    localStorage.setItem('userObj',JSON.stringify(userObj))
    localStorage.setItem('services',JSON.stringify(services))
    localStorage.setItem('requestedServices',JSON.stringify(updatedRequestedServicesObj))
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

    const userObj = JSON.parse(localStorage.getItem('userObj')) || [];
    const requestedServices  = JSON.parse(localStorage.getItem('requestedServices')) || [];
    const servicesContainerTitle = document.getElementById('container-title');
    if(userObj.length != 0){
      console.log(userObj)
      if(userObj.isServiceProvider == true){
      // console.log("inside provider")
        if(!requestedServices || requestedServices.length === 0){
          // console.log("No req")
          noServiceRequested();
          servicesContainerTitle.innerText = 'Requested Services'
        }else{
          // console.log("yes req")
          // console.log(requestedServices)
          showRequestedServices(services,requestedServices);
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
})

function showRequestedServices(services,requestedServices){
  let servicesContainer = document.getElementById('services-container');
  let requestedServicesArray = requestedServices.map((e)=>e.requestedService);
  let servicesContainerTitle = document.getElementById('container-title');
  const userObj = JSON.parse(localStorage.getItem('userObj')) || [];
  let requestedServicesObj = services.filter((e)=>{
    return requestedServicesArray.includes(e.serviceId) && e.category == userObj.serviceProviderCategory;
  })
  console.log("checking lll", requestedServicesObj)
  if(requestedServicesObj.length == 0){
    noServiceRequested();
    servicesContainerTitle.innerText = 'Requested Services'
  }else{
    // console.log("reqArr" ,requestedServicesArray)
    // console.log("reqObj" ,requestedServicesObj)
    servicesContainer.innerHTML = '';
    servicesContainerTitle.innerText = 'Requested Services'
    // console.log("after",requestedServicesObj)
    requestedServicesObj.map((element)=>{
        let card = createServiceCard(element,'Accept');
        servicesContainer.append(card);
    })
  }
}

function noServiceRequested(){
  let servicesContainer = document.getElementById('services-container');
  const card = document.createElement('h3');
  card.classList.add('service-card');
  card.classList.add('card');
  card.innerHTML = "No service requested"
  servicesContainer.innerHTML = ''
  servicesContainer.append(card);
}

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
