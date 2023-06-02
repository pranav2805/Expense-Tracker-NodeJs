const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

form.addEventListener('submit', login);

function login(e){
    e.preventDefault();

    let obj = {
        email: emailInput.value,
        password: passwordInput.value
    }

    axios.post('http://localhost:3000/login', obj)
    .then(response => {
        alert("Successfully logged in!");
    })
    .catch(err => {
        console.log(err);
    })
}