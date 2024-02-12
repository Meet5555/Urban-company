function showAvailableServices(users,services){
  let servicesContainer = document.getElementById('services-container');
  servicesContainer.innerHTML = '';
  services.map((element)=>{
      let card = createServiceCard(users,element);
      servicesContainer.appendChild(card);
  })
}

function createServiceCard(users,service){
  const card = document.createElement('div');
  card.classList.add('service-card','card','col-3');

  const id = document.createElement('h4')
  id.classList.add('service-id','card-title');
  id.textContent = `Service Id: ${service.serviceId}`;

  const title = document.createElement('h2')
  title.classList.add('service-title','card-title');
  title.textContent = service.name;
  
  const description = document.createElement('h4');
  description.classList.add('service-description','card-text');
  description.textContent = service.description;

  const category = document.createElement('h5');
  category.classList.add('admin-service-category','card-text');
  category.textContent = `Category: ${service.category}`;
  
  const cost = document.createElement('h4');
  cost.classList.add('admin-service-cost','card-text');
  cost.textContent =` Cost: ₹${service.cost}`;

  const consumptionInfo = document.createElement('p');
  consumptionInfo.classList.add('admin-service-consumption-info','card-text','service-category');

  if (service.isConsumed) {
    const consumedByUser = users.find((user) => {
      return user.activeServices.includes(service.serviceId) || user.requestedServices.includes(service.serviceId)
    });
    consumptionInfo.textContent = `Consumed by: ${consumedByUser ? 'UserID- ' + consumedByUser.id : 'Unknown'}`;
  } else {
    consumptionInfo.textContent = 'Not consumed';
  }
  
  const acceptedByInfo = document.createElement('p');
  acceptedByInfo.classList.add('admin-service-accepted-by-info');
  acceptedByInfo.classList.add('card-text');
  acceptedByInfo.classList.add('service-category');

  if(service.isConsumed){
    const acceptedByUser = users.find((user) => {
      if(user.isServiceProvider == true){
        return user.acceptedServices.includes(service.serviceId)
      }
    });
    acceptedByInfo.textContent = acceptedByUser ? `Accepted by: UserID- ${acceptedByUser.id}` : 'Not accepted by Service Provider';
  }else{
    acceptedByInfo.textContent = '';
  }

  const updateServiceButton = document.createElement('button')
  updateServiceButton.id = service.serviceId
  updateServiceButton.classList.add('update-service-btn');
  updateServiceButton.classList.add('btn');
  updateServiceButton.classList.add('btn-warning');
  updateServiceButton.textContent = 'Edit';
  updateServiceButton.addEventListener('click', (e) => { handleUpdateService(e, service.serviceId) });

  const deleteServiceButton = document.createElement('button')
  deleteServiceButton.id = service.serviceId
  deleteServiceButton.classList.add('delete-service-btn');
  deleteServiceButton.classList.add('btn');
  deleteServiceButton.classList.add('btn-danger');
  deleteServiceButton.textContent = 'Delete';
  deleteServiceButton.addEventListener('click',(e)=>{ handleDeleteService(e) });

  card.appendChild(id);
  card.appendChild(title);
  card.appendChild(description);
  card.appendChild(category);
  card.appendChild(consumptionInfo);
  card.appendChild(acceptedByInfo);
  card.appendChild(cost);
  card.appendChild(deleteServiceButton);
  card.appendChild(updateServiceButton);
  return card;
}

document.addEventListener('DOMContentLoaded',async (e)=>{
  const services = JSON.parse(localStorage.getItem('services')) || [];
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const userObj = JSON.parse(localStorage.getItem('userObj')) || [];
  
  if(!services || services.length === 0){
    noServicesInDatabase();
  }else{
    showAvailableServices(users,services);
  }
})

function noServicesInDatabase(){
  let servicesContainer = document.getElementById('services-container');
  const card = document.createElement('h3');
  card.classList.add('service-card');
  card.classList.add('card');
  card.innerHTML = "No service requested"
  servicesContainer.innerHTML = ''
  servicesContainer.append(card);
}

function handleUpdateService(e, serviceId) {
  const modal = document.getElementById('updateServiceModal');
  const serviceNameInput = modal.querySelector('#serviceName');
  const serviceDescriptionInput = modal.querySelector('#serviceDescription');
  const serviceCategoryInput = modal.querySelector('#serviceCategory');
  const serviceCostInput = modal.querySelector('#serviceCost');

  const services = JSON.parse(localStorage.getItem('services')) || [];
  const serviceToBeUpdated = services.find((service) => service.serviceId === serviceId);

  // Set input values to the current service data
  serviceNameInput.value = serviceToBeUpdated.name;
  serviceDescriptionInput.value = serviceToBeUpdated.description;
  serviceCategoryInput.value = serviceToBeUpdated.category;
  serviceCostInput.value = serviceToBeUpdated.cost;

  const saveChangesBtn = modal.querySelector('#saveServiceChangesBtn');
  const closeServiceModalBtn = modal.querySelector('#closeServiceModalBtn');

  saveChangesBtn.addEventListener('click', () => {
    const updatedServiceName = serviceNameInput.value;
    const updatedServiceDescription = serviceDescriptionInput.value;
    const updatedServiceCategory = serviceCategoryInput.value;
    const updatedServiceCost = serviceCostInput.value;

    // Update service data
    updateServiceData(serviceId, updatedServiceName, updatedServiceDescription, updatedServiceCategory, updatedServiceCost);

    // Hide modal after updating service
    hideModal(modal);

    // Show Toastify message after hiding modal
    Toastify({
      text: 'Service updated successfully',
      duration: 2000,
      close: true,
      gravity: 'top',
      position: 'center',
      stopOnFocus: true,
      style: {
        background: 'rgb(12, 188, 12)',
      }
    }).showToast();
  });

  closeServiceModalBtn.addEventListener('click', (e) => {
    hideModal(modal);
  });

  showModal(modal);
}

function updateServiceData(serviceId, newName, newDescription, newCategory, newCost) {
  const services = JSON.parse(localStorage.getItem('services')) || [];
  const users = JSON.parse(localStorage.getItem('users')) || [];

  const updatedServices = services.map((service) => {
    if (service.serviceId === serviceId) {
      service.name = newName;
      service.description = newDescription;
      service.category = newCategory;
      service.cost = newCost;
    }
    return service;
  });

  localStorage.setItem('services', JSON.stringify(updatedServices));
  showAvailableServices(users,updatedServices);
}

function showModal(modal) {
  modal.classList.add('show');
  modal.style.display = 'block';
  document.getElementsByClassName('overlay')[0].classList.remove('hide');
  document.body.style.overflow = 'hidden';
}

function hideModal(modal) {
  modal.classList.remove('show');
  modal.style.display = 'none';
  document.getElementsByClassName('overlay')[0].classList.add('hide');
  document.body.style.overflow = '';
}

function handleDeleteService(e){
  const serviceIdToDelete = parseInt(e.target.id);
  const users = JSON.parse(localStorage.getItem('users'));
  const services = JSON.parse(localStorage.getItem('services'));
  const requestedServicesObj = JSON.parse(localStorage.getItem('requestedServices')) || [];

  // check for active services and requested services in normal users and update users array amd check for accepted service in service providers and update users array
  let updatedUsers = users.map((user)=>{
    if(user.isServiceProvider){
      user.acceptedServices = user.acceptedServices.filter((serviceId) => serviceId !=serviceIdToDelete);
    }else{
      user.requestedServices = user.requestedServices.filter((serviceId) => serviceId !=serviceIdToDelete);
      user.activeServices = user.activeServices.filter((serviceId) => serviceId !=serviceIdToDelete);
    }
    return user;
  })
  localStorage.setItem('users', JSON.stringify(updatedUsers));

  // update requestedServices array in local storage
  let updatedRequestedServicesObj = requestedServicesObj.filter((service)=> service.requestedService != serviceIdToDelete);
  localStorage.setItem('requestedServices', JSON.stringify(updatedRequestedServicesObj));

  // remove from services array and update in local storage
  let updatedServices = services.filter((service)=> service.serviceId != serviceIdToDelete);
  localStorage.setItem('services', JSON.stringify(updatedServices));
  
  Toastify({
    text: "Service Deleted successfully",
    duration: 2000,
    close: true,
    gravity: "top",
    position: "center",
    stopOnFocus: true,
    style: {
      background: "rgb(12, 188, 12)",
    }
  }).showToast();

  // call show services function
  if(!updatedServices || updatedServices.length === 0){
    noServicesInDatabase();
  }else{
    showAvailableServices(updatedUsers,updatedServices)
  }
}