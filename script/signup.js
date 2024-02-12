const signUpForm = document.getElementById('signup-form');
signUpForm.addEventListener('submit',(e)=>{
  e.preventDefault();
  let username = document.getElementById('username').value;
  let password = document.getElementById('password').value;
  let isServiceProvider = document.getElementById('is-provider').checked;
  console.log(isServiceProvider)
  if(username.toString().trim().length == 0 || password.toString().trim().length == 0){
    // alert('must enter username and password');
    Toastify({
      text: "Please enter both username and password",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      stopOnFocus: true,
      style: {
        background: "rgb(252, 90, 90)",
      }
    }).showToast();
    resetForm();
    return;
  }

  // if username already exists then don't register
  const users = JSON.parse(localStorage.getItem('users')) || [];
  if(users.length == 0 || !users){
    registerUser(username.toString().trim(),password.toString().trim(),isServiceProvider);
  }else{
    let userExists = users.find((user)=>{
      return user.name == username;
    });
    if(userExists){
      // alert('username already exists');
      Toastify({
        text: "Username already exists",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        style: {
          background: "rgb(252, 90, 90)",
        }
      }).showToast();
      resetForm();
      return;
    }else{
      registerUser(username.toString().trim(),password.toString().trim(),isServiceProvider);
    }
  }
});


function resetForm(){
  document.getElementById('username').value = ''
  document.getElementById('password').value = ''
}

function registerUser(username,password,isServiceProvider){
  const users = JSON.parse(localStorage.getItem('users')) || [];
  let usersCount = users.length;
  const newUser = {
    "id": ++usersCount,
    "name" : username,
    "password" : password,
    "isAdmin" : false,
    "isServiceProvider": false,
    "requestedServices": [],
    "activeServices": [],
    "acceptedServices": []
  }
  if(isServiceProvider){
    registerServiceProvider(users,username,password);
  }else{
    users.push(newUser)
    localStorage.setItem('users',JSON.stringify(users));
    // login user by default
    localStorage.setItem('userLoggedIn','true');
    localStorage.setItem('userObj',JSON.stringify(newUser));
    Toastify({
      text: "Registration Successful",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      stopOnFocus: true,
      style: {
        background: "rgb(12, 188, 12)",
      },
      onClick: function(){
        window.location.href = '/index.html'
      }
    }).showToast();
    setTimeout(() => {
      window.location.href = '/index.html';
    }, 2000);
  }
}

function registerServiceProvider(users,username,password){
  let serviceProviderCategory = document.getElementById('service-provider-category').value.toString().trim();
  const serviceProviders = users.filter((user)=> user.isServiceProvider) || [];
  const newServiceProviderId = serviceProviders[serviceProviders.length - 1].serviceProviderId + 1;

  const newUser = {
    "id": ++users.length,
    "name" : username,
    "password" : password,
    "isAdmin" : false,
    "isServiceProvider": true,
    "serviceProviderId": newServiceProviderId,
    "serviceProviderCategory": serviceProviderCategory,
    "acceptedServices": [],
    "requestedServices": [],
    "activeServices": []
  }

  users.push(newUser)
  localStorage.setItem('users',JSON.stringify(users));
  // login user by default
  localStorage.setItem('userLoggedIn','true');
  localStorage.setItem('userObj',JSON.stringify(newUser));
  Toastify({
    text: "Registration Successful",
    duration: 3000,
    close: true,
    gravity: "top",
    position: "center",
    stopOnFocus: true,
    style: {
      background: "rgb(12, 188, 12)",
    },
    onClick: function(){
      window.location.href = '/index.html'
    }
  }).showToast();
  setTimeout(() => {
    window.location.href = '/index.html';
  }, 2000);
}