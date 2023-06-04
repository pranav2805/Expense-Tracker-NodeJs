//const Razorpay = require('razorpay');

const form = document.getElementById('addForm');
const amountInput = document.getElementById('amount');
const descInput = document.getElementById('description');
const categoryInput = document.getElementById('category');
const expenseList = document.getElementById('expenses');
let editFlag = false;
let tempId;

form.addEventListener('submit', addExpense);

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function showPremiumFeatures(isPremiumUser) {
    const premiumDiv = document.getElementById('premiumDiv');
    if(isPremiumUser === true){
        premiumDiv.innerHTML = `<p><b>You're a premium user</b></p>
                                <a href="leaderboard.html"><button onclick="showLeaderboard()" class="btn btn-primary float-right">Show Leaderboard</button></a>`
    } else{
        premiumDiv.innerHTML = `<button onclick="buyPremium()" class="btn btn-primary float-right ">Buy Premium</button>`
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const decodedToken = parseJwt(token);
    console.log(decodedToken);
    showPremiumFeatures(decodedToken.isPremiumUser);

    axios.get('http://localhost:3000/expenses', {headers: {"Authorization": token} })
        .then(response => {
            // console.log(response.data);
            
            for(let i=0;i<response.data.length;i++){
                showExpenseOnScreen(response.data[i]);
            }
            // response.data.expenses.forEach(expense => {
            //     showExpenseOnScreen(expense);
            // })
        })
        .catch(err => {
            console.log(err);
        })
})

//document.getElementById('rzp-button').onclick = async function (e) {
async function buyPremium(){
    //e.preventDefault;
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/purchase/premiumMembership', {headers: {"Authorization": token} });
    console.log("response from premiummembership route >>>"+response);
    var options = 
    {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        //his handler function will handle the success payment
        "handler": async function (response) {
            await axios.post('http://localhost:3000/purchase/updateTransactionStatus',{
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
                success: true
            }, {headers: {"Authorization": token} })

            alert('You are a Premium User Now!')
            showPremiumFeatures(true);
        },
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    //e.preventDefault();

    rzp1.on('payment.failed', async function (response){
        console.log(response);
        const result = await axios.post('http://localhost:3000/purchase/updateTransactionStatus',{
            order_id: options.order_id,
            success: false
        }, {headers: {"Authorization": token} })
        alert('Something went wrong!!');
        alert(result.data.error);
    });
}

function addExpense(e){
    e.preventDefault();
    const token = localStorage.getItem('token');
    let expenseDetails = {
        amount: amountInput.value,
        description: descInput.value,
        category: categoryInput.value
    }
    if(editFlag === true){
        axios.put('http://localhost:3000/expenses/edit-expense/'+tempId, expenseDetails, {headers: {"Authorization": token} })
            .then(response => {
                showExpenseOnScreen({...expenseDetails, id: tempId});
                editFlag = false;
            })
            .catch(err => console.log(err))
    } else{
        axios.post('http://localhost:3000/expenses', expenseDetails, {headers: {"Authorization": token} })
            .then(response => {
                showExpenseOnScreen(response.data);
            })
            .catch(err => console.log(err))
    }

    amountInput.value = '';
    descInput.value = '';
    categoryInput.value = '';
}

function showExpenseOnScreen(obj) {
    const parentElement = document.getElementById('expenses');
    const childHTML = `<li id=${obj.id} class="list-group-item"> 
                                <div class="row">
                                <div class="col-lg-3">
                                    ${obj.amount} 
                                </div>
                                <div class="col-lg-3">
                                    ${obj.description} 
                                </div>
                                <div class="col-lg-3">
                                    ${obj.category} 
                                </div>
                                </div>
                                <button class="btn btn-danger btn-sm float-right ml-2" onclick="deleteExpense('${obj.id}')">Delete</button>
                                <button class="btn btn-danger btn-sm float-right ml-2" onclick="editExpense('${obj.id}', '${obj.amount}', '${obj.category}', '${obj.description}')">Edit</button>
                        </li>`
                    //    ${obj.description} ${obj.price} ${obj.quantity}
    parentElement.innerHTML = parentElement.innerHTML + childHTML;
}

function deleteExpense(id) {
    const parentElement = document.getElementById('expenses');
    const childElement = document.getElementById(id);
    const token = localStorage.getItem('token');
    //console.log(id);
    axios.delete(`http://localhost:3000/expenses/${id}`, {headers: {"Authorization": token} })
        .then(response => {
            console.log('Deletion was successful!!');
            parentElement.removeChild(childElement);
        })
        .catch(err => console.log(err))
}

function editExpense(id, amount, category, description) {
    //console.log(id);
    //axios.put(`http://localhost:3000/expenses/`)
    const element = document.getElementById(id);
    expenseList.removeChild(element);
    amountInput.value = amount;
    categoryInput.value = category;
    descInput.value = description;
    editFlag = true;
    tempId = id;
}

function showLeaderboard() {

}