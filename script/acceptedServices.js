function showAcceptedServices(services){
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

  const deleteServiceButton = document.createElement('button')
  deleteServiceButton.id = service.serviceId
  deleteServiceButton.classList.add('delete-requested-service-btn');
  deleteServiceButton.classList.add('btn');
  deleteServiceButton.classList.add('btn-danger');
  deleteServiceButton.textContent = 'Delete';
  deleteServiceButton.addEventListener('click',(e)=>{ handleDeleteService(e) });

  const completeServiceButton = document.createElement('button')
  completeServiceButton.id = service.serviceId
  completeServiceButton.classList.add('complete-service-btn');
  completeServiceButton.classList.add('btn');
  completeServiceButton.classList.add('btn-success');
  completeServiceButton.textContent = 'Completed';
  completeServiceButton.addEventListener('click',(e)=>{ handleCompleteService(e) });

  card.appendChild(title);
  card.appendChild(description);
  card.appendChild(category);
  card.appendChild(cost);
  card.appendChild(deleteServiceButton);
  card.appendChild(completeServiceButton);
  return card;
}

document.addEventListener('DOMContentLoaded',async (e)=>{
  const services = JSON.parse(localStorage.getItem('services')) || [];
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const userObj = JSON.parse(localStorage.getItem('userObj')) || [];
  console.log(userObj)
  const userAcceptedServices = services.filter((service)=>{
    return userObj.acceptedServices.includes(service.serviceId);
  })

  if(!userAcceptedServices || userAcceptedServices.length === 0){
    noServiceAccepted();
  }else{
    showAcceptedServices(userAcceptedServices);
  }
})

function noServiceAccepted(){
  let servicesContainer = document.getElementById('services-container');
  const card = document.createElement('h3');
  card.classList.add('service-card');
  card.classList.add('card');
  card.innerHTML = "No accepted requested"
  servicesContainer.innerHTML = ''
  servicesContainer.append(card);
}

function handleDeleteService(e){
  console.log(e)
  const userObj = JSON.parse(localStorage.getItem('userObj'));
  const users = JSON.parse(localStorage.getItem('users'));
  const services = JSON.parse(localStorage.getItem('services'));
  const requestedServiceId = parseInt(e.target.id);
  const requestedServices = JSON.parse(localStorage.getItem('requestedServices')) || [];

  // add service back into the requestedServices array
  let requestedUser = users.filter((user)=>{
    return user.activeServices.includes(requestedServiceId);
  })
  const requestedUserId = requestedUser[0].id;
  requestedServices.push({
    requestedBy: requestedUserId,
    requestedService: requestedServiceId,
  });
  localStorage.setItem('requestedServices',JSON.stringify(requestedServices));

  // remove from accepted service in userObj
  userObj.acceptedServices = userObj.acceptedServices.filter((serviceId)=>{return serviceId != requestedServiceId});
  localStorage.setItem('userObj',JSON.stringify(userObj));

  console.log("Before update",users);
  // update requestedUser - activeService and requestedService array and also update serviceProviders obj
  let updatedUsers = users.map((user)=>{
    if(user.id == userObj.id){
      user.acceptedServices = user.acceptedServices.filter((serviceId)=>{return serviceId != requestedServiceId})
    }else if(user.id == requestedUser[0].id){
      user.activeServices = user.activeServices.filter((serviceId)=>{return serviceId != requestedServiceId});
      user.requestedServices.push(requestedServiceId);
    }
    return user;
  })
  console.log("Updated",updatedUsers)
  localStorage.setItem('users',JSON.stringify(updatedUsers));
  alert('Request Deleted')
  
  // update requested services in the container
  const userAcceptedServices = services.filter((service)=>{
    return userObj.acceptedServices.includes(service.serviceId);
  })

  if(!userAcceptedServices || userAcceptedServices.length === 0){
    noServiceAccepted();
  }else{
    showAcceptedServices(userAcceptedServices)
  }
}

function handleCompleteService(e){
  const userObj = JSON.parse(localStorage.getItem('userObj'));
  const users = JSON.parse(localStorage.getItem('users'));
  const services = JSON.parse(localStorage.getItem('services'));
  const requestedServiceId = parseInt(e.target.id);
  
  // remove from serviceProvider object's accepted service array ( update userObj )
  userObj.acceptedServices = userObj.acceptedServices.filter((serviceId)=>{return serviceId != requestedServiceId});
  localStorage.setItem('userObj',JSON.stringify(userObj));

  // mark isConsumed false
  const updatedServices = services.map(service => {
    if (service.serviceId === requestedServiceId) {
      return { ...service, isConsumed: false };
    }
    return service;
  });
  localStorage.setItem('services', JSON.stringify(updatedServices));

  // update users array for both requested user and service provider
  let requestedUser = users.filter((user)=>{
    return user.activeServices.includes(requestedServiceId);
  })
  let updatedUsers = users.map((user)=>{
    if(user.id == userObj.id){
      user.acceptedServices = user.acceptedServices.filter((serviceId)=>{return serviceId != requestedServiceId})
    }else if(user.id == requestedUser[0].id){
      user.activeServices = user.activeServices.filter((serviceId)=>{return serviceId != requestedServiceId});
    }
    return user;
  })
  localStorage.setItem('users',JSON.stringify(updatedUsers));

  alert('service completed')
  // update requested services in the container
  const userAcceptedServices = services.filter((service)=>{
    return userObj.acceptedServices.includes(service.serviceId);
  })

  if(!userAcceptedServices || userAcceptedServices.length === 0){
    noServiceAccepted();
  }else{
    showAcceptedServices(userAcceptedServices)
  }
}