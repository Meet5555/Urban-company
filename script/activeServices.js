function showAvailableServices(services){
  let servicesContainer = document.getElementById('services-container');
  servicesContainer.innerHTML = '';
  services.map((element)=>{
      let card = createServiceCard(element);
      servicesContainer.appendChild(card);
  })
}

function createServiceCard(service){
  // console.log("inside create card", service)
  const card = document.createElement('div');
  card.classList.add('service-card');
  card.classList.add('card');
  card.classList.add('col-3');

  const title = document.createElement('h2')
  title.classList.add('service-title');
  title.classList.add('card-title');
  title.textContent = service.name;
  
  const description = document.createElement('h4');
  description.classList.add('service-description');
  description.classList.add('card-text');
  description.textContent = service.description;

  const category = document.createElement('h5');
  category.classList.add('service-category');
  category.classList.add('card-text');
  category.textContent = `Category: ${service.category}`;
  
  const cost = document.createElement('h4');
  cost.classList.add('service-cost');
  cost.classList.add('card-text');
  cost.textContent = service.cost;

  const cancelServiceButton = document.createElement('button')
  cancelServiceButton.id = service.serviceId
  cancelServiceButton.classList.add('delete-requested-service-btn');
  cancelServiceButton.classList.add('btn');
  cancelServiceButton.classList.add('btn-danger');
  cancelServiceButton.textContent = 'Cancel Service';
  cancelServiceButton.addEventListener('click',(e)=>{ handleCancelService(e) });

  card.appendChild(title);
  card.appendChild(description);
  card.appendChild(category);
  card.appendChild(cost);
  card.appendChild(bookServiceButton);
  return card;
}

document.addEventListener('DOMContentLoaded',async (e)=>{
  const services = JSON.parse(localStorage.getItem('services')) || [];
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const userObj = JSON.parse(localStorage.getItem('userObj')) || [];
  console.log(userObj)
  const userActiveServices = services.filter((service)=>{
    return userObj.activeServices.includes(service.serviceId);
  })

  if(!userActiveServices || userActiveServices.length === 0){
    noActiveService();
  }else{
    showAvailableServices(userActiveServices);
  }
})

function noActiveService(){
  let servicesContainer = document.getElementById('services-container');
  const card = document.createElement('h3');
  card.classList.add('service-card');
  card.classList.add('card');
  card.innerHTML = "No Active Services"
  servicesContainer.innerHTML = ''
  servicesContainer.append(card);
}

function handleCancelService(e){
  const userObj = JSON.parse(localStorage.getItem('userObj'));
  const users = JSON.parse(localStorage.getItem('users'));
  const services = JSON.parse(localStorage.getItem('services'));
  const requestedServiceId = parseInt(e.target.id);
 
  // update the requestedServices field in the userObj
  userObj.activeServices = userObj.activeServices.filter((serviceId) => serviceId !== requestedServiceId);
  localStorage.setItem('userObj', JSON.stringify(userObj));

  // update main users array for removing service from active service and also change serviceProvider Obj to remove from accepted request
  let updatedUsers = users.map((user) => {
    if (user.id === userObj.id) {
      user.activeServices = user.activeServices.filter((serviceId) => serviceId !== requestedServiceId);
    }
    if(user.isServiceProvider == true ){
      user.acceptedServices = user.acceptedServices.filter((serviceId)=>{return serviceId != requestedServiceId})
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

  alert('Booking Canceled')
  
  // update active services in the container
  const userActiveServices = services.filter((service)=>{
    return userObj.activeServices.includes(service.serviceId);
  })

  if(!userActiveServices || userActiveServices.length === 0){
    noActiveService();
  }else{
    showAvailableServices(userActiveServices);
  }
}