const signUpForm = document.getElementById('signup-form');
signUpForm.addEventListener('submit',(e)=>{
  e.preventDefault();
  let username = document.getElementById('username').value;
  let password = document.getElementById('password').value;
  
  if(username.toString().trim().length == 0 || password.toString().trim().length == 0){
    alert('must enter username and password');
    resetForm();
    return;
  }

  // if username already exists then don't register
  const users = JSON.parse(localStorage.getItem('users')) || [];
  if(users.length == 0 || !users){
    registerUser(username,password);
  }else{
    let userExists = users.find((user)=>{
      return user.name == username;
    });
    if(userExists){
      alert('username already exists');
      resetForm();
      return;
    }else{
      registerUser(username,password);
    }
  }
});

function registerUser(username,password){
  const users = JSON.parse(localStorage.getItem('users')) || [];
  let usersCount = users.length;
  const newUser = {
    "id": ++usersCount,
    "name" : username,
    "password" : password,
    "isAdmin" : false,
    "activeServices": []
  }
  users.push(newUser)
  localStorage.setItem('users',JSON.stringify(users));
  // login user by default
  localStorage.setItem('userLoggedIn','true');
  localStorage.setItem('userObj',JSON.stringify(newUser));
  window.location.href = '/index.html'
}

function resetForm(){
  document.getElementById('username').value = ''
  document.getElementById('password').value = ''
}