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

  // Taking the data from LS
  const usersData = JSON.parse(localStorage.getItem("users")) || [];

  // Checking if the entered username is valid
  const isUsernameValid = usersData.some((u) => u.name === enteredUsername);

  if (isUsernameValid) {
    // If username is valid, check the password
    const user = usersData.find((u) => u.name === enteredUsername && u.password === enteredPassword); //Remove password

    if (user) {
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem("userObj", JSON.stringify(user));
      window.location.href = "/index.html";
    } else {
      alert("Invalid Credentials. Please try again.");
      resetForm();
      return;
    }
  } else {
    alert("User not Found, Register First.");
    resetForm();
    return;
  }
});

function resetForm() {
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
}
