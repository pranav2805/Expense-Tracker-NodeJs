const form = document.getElementById('addForm');
const amountInput = document.getElementById('amount');
const descInput = document.getElementById('description');
const categoryInput = document.getElementById('category');
const expenseList = document.getElementById('expenses');
let editFlag = false;
let tempId;

form.addEventListener('submit', addExpense);

window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
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