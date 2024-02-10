function showAvailableServices(users,services){
  let servicesContainer = document.getElementById('services-container');
  servicesContainer.innerHTML = '';
  services.map((element)=>{
      let card = createServiceCard(users,element);
      servicesContainer.appendChild(card);
  })
}

function createServiceCard(users,service){
  // console.log("inside create card", service)
  const card = document.createElement('div');
  card.classList.add('service-card');
  card.classList.add('card');
  card.classList.add('col-3');

  const id = document.createElement('h4')
  id.classList.add('service-id');
  id.classList.add('card-title');
  id.textContent = `Service Id: ${service.serviceId}`;

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

  const consumptionInfo = document.createElement('p');
  consumptionInfo.classList.add('service-consumption-info');
  consumptionInfo.classList.add('card-text');

  if (service.isConsumed) {
    const consumedByUser = users.find((user) => {
      return user.activeServices.includes(service.serviceId) || user.requestedServices.includes(service.serviceId)
    });
    consumptionInfo.textContent = `Consumed by: ${consumedByUser ? 'UserID- ' + consumedByUser.id : 'Unknown'}`;
  } else {
    consumptionInfo.textContent = 'Not consumed';
  }
  
  const acceptedByInfo = document.createElement('p');
  acceptedByInfo.classList.add('service-accepted-by-info');
  acceptedByInfo.classList.add('card-text');

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

  const deleteServiceButton = document.createElement('button')
  deleteServiceButton.id = service.serviceId
  deleteServiceButton.classList.add('delete-requested-service-btn');
  deleteServiceButton.classList.add('btn');
  deleteServiceButton.classList.add('btn-danger');
  deleteServiceButton.textContent = 'Delete';
  deleteServiceButton.addEventListener('click',(e)=>{ handleDeleteService(e) });

  card.appendChild(id);
  card.appendChild(title);
  card.appendChild(description);
  card.appendChild(category);
  card.appendChild(cost);
  card.appendChild(consumptionInfo);
  card.appendChild(acceptedByInfo);
  card.appendChild(deleteServiceButton);
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
  
  // alert('Service Deleted');
  Toastify({
    text: "Service Deleted successfully",
    duration: 3000,
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