function showAvailableServices(services){
  let servicesContainer = document.getElementById('services-container');
  servicesContainer.innerHTML = '';
  services.map((element)=>{
      let card = createServiceCard(element);
      servicesContainer.appendChild(card);
  })
}

function createServiceCard(service){
  const card = document.createElement('div');
  card.classList.add('service-card','card','col-3');

  const title = document.createElement('h2')
  title.classList.add('service-title','card-title');
  title.textContent = service.name;
  
  const description = document.createElement('h4');
  description.classList.add('service-description','card-text');
  description.textContent = service.description;

  const category = document.createElement('h5');
  category.classList.add('service-category','card-text');
  category.textContent = `Category: ${service.category}`;
  
  const cost = document.createElement('h4');
  cost.classList.add('service-cost','card-text');
  cost.textContent =` Cost: ₹${service.cost}`;

  const deleteServiceButton = document.createElement('button')
  deleteServiceButton.id = service.serviceId
  deleteServiceButton.classList.add('delete-requested-service-btn','btn','btn-danger');
  deleteServiceButton.textContent = 'Delete';
  deleteServiceButton.addEventListener('click',(e)=>{ handleDeleteService(e) });

  card.appendChild(title);
  card.appendChild(description);
  card.appendChild(category);
  card.appendChild(cost);
  card.appendChild(deleteServiceButton);
  return card;
}

document.addEventListener('DOMContentLoaded',async (e)=>{
  const services = JSON.parse(localStorage.getItem('services')) || [];
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const userObj = JSON.parse(localStorage.getItem('userObj')) || [];
  
  const userRequestedServices = services.filter((service)=>{
    return userObj.requestedServices.includes(service.serviceId);
  })

  if(!userRequestedServices || userRequestedServices.length === 0){
    noServiceRequested();
  }else{
    showAvailableServices(userRequestedServices);
  }
})

function noServiceRequested(){
  let servicesContainer = document.getElementById('services-container');
  const card = document.createElement('h3');
  card.classList.add('service-card');
  card.classList.add('card');
  card.innerHTML = "No service requested"
  servicesContainer.innerHTML = ''
  servicesContainer.append(card);
}

function handleDeleteService(e){
  const userObj = JSON.parse(localStorage.getItem('userObj'));
  const users = JSON.parse(localStorage.getItem('users'));
  const services = JSON.parse(localStorage.getItem('services'));
  const requestedServiceId = parseInt(e.target.id);
  const requestedServices = JSON.parse(localStorage.getItem('requestedServices')) || [];
  // remove from requested services obj
  let updatedRequestedServicesObj = requestedServices.filter((service)=>{
    return service.requestedService != requestedServiceId;
  });
  localStorage.setItem('requestedServices', JSON.stringify(updatedRequestedServicesObj));

  // update the requestedServices field in the userObj
  userObj.requestedServices = userObj.requestedServices.filter((serviceId) => serviceId !== requestedServiceId);
  localStorage.setItem('userObj', JSON.stringify(userObj));

  // update main users array
  const updatedUsers = users.map((user) => {
    if (user.id === userObj.id) {
      user.requestedServices = user.requestedServices.filter((serviceId) => serviceId !== requestedServiceId);
    }
    return user;
  });
  localStorage.setItem('users', JSON.stringify(updatedUsers));

  // mark isConsumed false for service
  const updatedServices = services.map(service => {
    if (service.serviceId === requestedServiceId) {
      return { ...service, isConsumed: false };
    }
    return service;
  });
  localStorage.setItem('services', JSON.stringify(updatedServices));

  // alert('Request Deleted')
  Toastify({
    text: "Request Deleted Successfully",
    duration: 2000,
    close: true,
    gravity: "top",
    position: "center",
    stopOnFocus: true,
    style: {
      background: "rgb(12, 188, 12)",
    }
  }).showToast();

  // update requested services in the container
  const userRequestedServices = services.filter((service)=>{
    return userObj.requestedServices.includes(service.serviceId);
  })

  if(!userRequestedServices || userRequestedServices.length === 0){
    noServiceRequested();
  }else{
    showAvailableServices(userRequestedServices)
  }
}