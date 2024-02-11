function showUsers(users){
  let usersContainer = document.getElementById('users-container');
  usersContainer.innerHTML = '';
  users.map((element)=>{
      if(element.isAdmin != true){
        let card = createUserCard(element);
        usersContainer.appendChild(card);
      }
  })
}

function createUserCard(user) {
  const card = document.createElement('div');
  card.classList.add('user-card');
  card.classList.add('card');
  card.classList.add('col-3');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const userId = document.createElement('p');
  userId.classList.add('card-title');
  userId.textContent = `User ID: ${user.id}`;

  const userName = document.createElement('p');
  userName.classList.add('card-text');
  userName.textContent = `Name: ${user.name}`;

  const isServiceProvider = document.createElement('p');
  isServiceProvider.classList.add('card-text');
  isServiceProvider.textContent = `Service Provider: ${user.isServiceProvider ? 'Yes' : 'No'}`;

  cardBody.appendChild(userId);
  cardBody.appendChild(userName);
  cardBody.appendChild(isServiceProvider);

  if (user.isServiceProvider) {
      const acceptedServices = document.createElement('p');
      acceptedServices.classList.add('card-text');
      acceptedServices.textContent = `Accepted Services Id: ${user.acceptedServices.length > 0 ? user.acceptedServices.join(', ') : 'None'}`;

      const serviceProviderId = document.createElement('p');
      serviceProviderId.classList.add('card-text');
      serviceProviderId.textContent = `Service Provider ID: ${user.serviceProviderId || 'Not available'}`;

      const serviceProviderCategory = document.createElement('p');
      serviceProviderCategory.classList.add('card-text');
      serviceProviderCategory.textContent = `Service Provider Category: ${user.serviceProviderCategory || 'Not available'}`;

      cardBody.appendChild(serviceProviderId);
      cardBody.appendChild(serviceProviderCategory);
      cardBody.appendChild(acceptedServices);
  } else {
      const requestedServices = document.createElement('p');
      requestedServices.classList.add('card-text');
      requestedServices.textContent = `Requested Services Id: ${user.requestedServices.length > 0 ? user.requestedServices.join(', ') : 'None'}`;

      const activeServices = document.createElement('p');
      activeServices.classList.add('card-text');
      activeServices.textContent = `Active Services Id: ${user.activeServices.length > 0 ? user.activeServices.join(', ') : 'None'}`;

      cardBody.appendChild(requestedServices);
      cardBody.appendChild(activeServices);
  }

  const updateUserButton = document.createElement('button')
  updateUserButton.id = user.id
  updateUserButton.classList.add('update-user-btn');
  updateUserButton.classList.add('btn');
  updateUserButton.classList.add('btn-warning');
  updateUserButton.textContent = 'Update User';
  updateUserButton.addEventListener('click', (e) => { handleUpdateUser(e, user.id) });
  cardBody.appendChild(updateUserButton);

  const deleteUserButton = document.createElement('button')
  deleteUserButton.id = user.id
  deleteUserButton.classList.add('delete-user-btn');
  deleteUserButton.classList.add('btn');
  deleteUserButton.classList.add('btn-danger');
  deleteUserButton.textContent = 'Delete User';
  deleteUserButton.addEventListener('click',(e)=>{ handleDeleteUser(e) });

  cardBody.appendChild(deleteUserButton);
  card.appendChild(cardBody);

  return card;
}

function handleUpdateUser(e, userId) {
  const modal = document.getElementById('updateUserModal');
  const userNameInput = modal.querySelector('#userName');
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const userToBeUpdated = users.filter((user) => user.id === userId);
  userNameInput.value = userToBeUpdated[0].name;

  const saveChangesBtn = modal.querySelector('#saveChangesBtn');
  const closeModalBtn = modal.querySelector('#closeModalBtn');

  saveChangesBtn.addEventListener('click', () => {
    const updatedUserName = userNameInput.value;
    const userExists = users.some((user) => user.name === updatedUserName);
    if (!userExists) {
      updateUserData(userId, updatedUserName);
      hideModal(modal);
      // Show Toastify message after hiding modal
      Toastify({
        text: 'User updated successfully',
        duration: 3000,
        close: true,
        gravity: 'top',
        position: 'center',
        stopOnFocus: true,
        style: {
          background: 'rgb(12, 188, 12)',
        }
      }).showToast();
    } else {
      // Alert if username already exists
      // alert('Username already exists. Please choose a different one.');
      Toastify({
        text: 'Username already exists. Please choose a different one.',
        duration: 3000,
        close: true,
        gravity: 'top',
        position: 'center',
        stopOnFocus: true,
        style: {
          background: 'rgb(255, 202, 44)',
        },
      }).showToast();
    }
  });

  closeModalBtn.addEventListener('click', (e) => {
    hideModal(modal);
  });
  showModal(modal);
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

function updateUserData(userId, newName) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const updatedUsers = users.map((user) => {
    if (user.id === userId) {
      user.name = newName;
    }
    return user;
  });
  localStorage.setItem('users', JSON.stringify(updatedUsers));
  showUsers(updatedUsers);
}

function handleDeleteUser(e) {
  const deleteUserId = parseInt(e.target.id);
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const services = JSON.parse(localStorage.getItem('services')) || [];
  const requestedServices = JSON.parse(localStorage.getItem('requestedServices')) || [];
  const userToBeDeleted = users.find((user) => user.id === deleteUserId);

  const userRequestedServices = services.filter((service) =>
    userToBeDeleted.requestedServices.includes(service.serviceId)
  );
  const userActiveServices = services.filter((service) =>
    userToBeDeleted.activeServices.includes(service.serviceId)
  );

  if (userToBeDeleted.isServiceProvider) {
    const acceptedServices = userToBeDeleted.acceptedServices;
    console.log(acceptedServices);
  
    // If user is a service provider:
    // Find users whose services have been accepted and are present in acceptedServices array
    const requestedUser = users.find((user) =>
      user.activeServices.some((serviceId) => acceptedServices.includes(serviceId))
    );
  
    if (requestedUser) {
      const requestedUserId = requestedUser.id;
  
      acceptedServices.forEach((element) => {
        requestedServices.push({
          requestedBy: requestedUserId,
          requestedService: element,
        });
      });
  
      localStorage.setItem('requestedServices', JSON.stringify(requestedServices));
  
      // Update user's acceptedServices and move accepted services to requestedServices
      const updatedUsers = users.map((user) => {
        if (user.id === requestedUserId) {
          user.activeServices = user.activeServices.filter(
            (serviceId) => !acceptedServices.includes(serviceId)
          );
          user.requestedServices.push(...acceptedServices);
        }
        return user;
      });
  
      // Delete service provider from the main users array
      const usersWithoutServiceProvider = updatedUsers.filter(
        (user) => user.id !== userToBeDeleted.id
      );
      localStorage.setItem('users', JSON.stringify(usersWithoutServiceProvider));
      // alert('user deleted');
      Toastify({
        text: "user deleted successfully",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        style: {
          background: "rgb(12, 188, 12)",
        }
      }).showToast();
      showUsers(updatedUsers);
    }
  }
   else {
    // If user is a normal user:
    // Update isConsumed to false in request for both active and requested services
    const updatedServices = services.map((service) => {
      if (userRequestedServices.some((userReqService) => userReqService.serviceId === service.serviceId) ||
          userActiveServices.some((userActService) => userActService.serviceId === service.serviceId)) {
        return { ...service, isConsumed: false };
      }
      return service;
    });
    localStorage.setItem('services', JSON.stringify(updatedServices));

    // Delete accepted service from service provider based on active services
    let updatedUsers = users.map((user) => {
      if (user.isServiceProvider) {
        user.acceptedServices = user.acceptedServices.filter((serviceId) => !userActiveServices.some((actService) => actService.serviceId === serviceId));
      }
      return user;
    });

    // Delete user from the main users array
    updatedUsers = updatedUsers.filter((user) => user.id !== userToBeDeleted.id);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Remove requested services from requestedServices array in local storage
    const updatedRequestedServicesObj = requestedServices.filter((service) => !userRequestedServices.some((userReqService) => userReqService.serviceId === service.requestedService));
    localStorage.setItem('requestedServices', JSON.stringify(updatedRequestedServicesObj));
    // alert('user deleted');
    Toastify({
      text: "user deleted successfully",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      stopOnFocus: true,
      style: {
        background: "rgb(12, 188, 12)",
      }
    }).showToast();
    showUsers(updatedUsers);
  }
}


document.addEventListener('DOMContentLoaded',async (e)=>{
  const services = JSON.parse(localStorage.getItem('services')) || [];
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const userObj = JSON.parse(localStorage.getItem('userObj')) || [];
  console.log(userObj)
  
  if(!users || users.length === 0){
    noUsersRegistered()
  }else{
    showUsers(users)
  }
})

function noUsersRegistered(){
  let usersContainer = document.getElementById('users-container');
  const card = document.createElement('h3');
  card.classList.add('user-card');
  card.classList.add('card');
  card.innerHTML = "No Registered Users"
  usersContainer.innerHTML = ''
  usersContainer.append(card);
}
