const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const enteredUsername = usernameInput.value;
  const enteredPassword = passwordInput.value;

  if (enteredUsername.toString().trim().length == 0 || enteredPassword.toString().trim().length == 0) {
    alert("Must enter username and password");
    resetForm();
    return;
  }
  //Taking the data from LS
  const usersData = JSON.parse(localStorage.getItem("users")) || [];
  //Checking if the enetered credentials are valid or not
  const user = usersData.find(
    (u) => u.name === enteredUsername && u.password === enteredPassword
  );
  
  if (user) {
    localStorage.setItem("userLoggedIn", "true");
    localStorage.setItem("userObj", JSON.stringify(user));
    window.location.href = "/index.html";
  } else {
    alert("Invalid username or password. Please try again.");
    resetForm();
    return;
  }
});

function resetForm() {
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
}
