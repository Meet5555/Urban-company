const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const enteredUsername = usernameInput.value;
  const enteredPassword = passwordInput.value;

  if (enteredUsername.toString().trim().length == 0 || enteredPassword.toString().trim().length == 0) {
    Toastify({
      text: "Please enter both username and password correctly",
      duration: 2000,
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

  // Taking the data from Local storage
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Checking if the entered username is valid
  const isUsernameValid = users.some((u) => u.name === enteredUsername.toString().trim());

  if (isUsernameValid) {
    // If username is valid, check the password
    const user = users.find((u) => u.name === enteredUsername.toString().trim() && u.password === enteredPassword.toString().trim());

    if (user) {
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem("userObj", JSON.stringify(user));
      window.location.href = "/index.html";
    } else {
      Toastify({
        text: "Invalid Credentials. Please try again",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        style: {
          background: "rgb(252, 90, 90)",
        }
      }).showToast();
      return;
    }
  } else {
    Toastify({
      text: "User not Found, Register First",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "center",
      stopOnFocus: true,
      style: {
        background: "rgb(255, 202, 44)",
      }
    }).showToast();
    resetForm();
    return;
  }
});

function resetForm() {
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
}
