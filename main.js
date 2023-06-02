const form = document.getElementById('signupForm');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const msg = document.getElementsByClassName('msg');

form.addEventListener('submit', addUser);

function addUser(e) {
    e.preventDefault();
    if(usernameInput.value==='' || emailInput.value==='' || passwordInput.value===''){
        msg.classList.add('error');
        msg.innerHTML = 'Please fill all fields';

        setTimeout(() => msg.remove(), 3000);
        console.log('Please enter all fields');
    } 
    else {
        let obj = {
            username: usernameInput.value,
            email: emailInput.value,
            password: password.value
        }

        axios.post('http://localhost:3000/signup', obj)
            .then(response => {
                alert("User has been created successfully");
            })
            .catch(err => {
                alert(err);
                // msg.classList.add('error');
                // msg.innerHTML = 'Email id already exists!';
                console.log(err);
            })

        usernameInput.value = '';
        emailInput.value = '';
        passwordInput.value = '';
    }
}