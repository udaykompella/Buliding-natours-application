const login = async (email, password) => {
  console.log(email, password);
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/login",
      data: {
        email,
        password,
      },
    });
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

document.querySelector(".form").addEventListener("submit", (e) => {
  debugger;
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  login(email, password);
});
