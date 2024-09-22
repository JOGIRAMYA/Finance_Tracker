// Select DOM elements
const transactionForm = document.getElementById('transactionForm');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const transactionHistory = document.getElementById('transactionHistory');
const totalIncome = document.getElementById('totalIncome');
const totalExpenses = document.getElementById('totalExpenses');
const remainingBudget = document.getElementById('remainingBudget');
const spendingChart = document.getElementById('spendingChart');

// Initialize variables
let transactions = []; // Array to store all transactions
let chart; // Chart.js chart instance

// Function to update the displayed totals
function updateTotals() {
    const income = transactions
        .filter(transaction => transaction.type === 'income')
        .reduce((sum, transaction) => sum + transaction.amount, 0);

    const expenses = transactions
        .filter(transaction => transaction.type === 'expense')
        .reduce((sum, transaction) => sum + transaction.amount, 0);

    totalIncome.textContent = `$${income.toFixed(2)}`;
    totalExpenses.textContent = `$${expenses.toFixed(2)}`;
    remainingBudget.textContent = `$${(income - expenses).toFixed(2)}`;

    updateChart(income, expenses);
}

// Function to add a transaction to the DOM
function addTransactionToDOM(transaction) {
    const li = document.createElement('li');
    li.className = transaction.type;
    li.innerHTML = `
        <span>${transaction.description}</span>
        <span>${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}</span>
        <button class="delete-btn">Delete</button>
    `;

    // Add delete button functionality
    li.querySelector('.delete-btn').addEventListener('click', () => {
        transactions = transactions.filter(t => t !== transaction);
        li.remove();
        updateTotals();
    });

    transactionHistory.appendChild(li);
}

// Function to handle form submission
transactionForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Create a transaction object
    const transaction = {
        description: descriptionInput.value,
        amount: parseFloat(amountInput.value),
        type: typeInput.value
    };

    // Add transaction to the list
    transactions.push(transaction);
    addTransactionToDOM(transaction);
    updateTotals();

    // Clear form inputs
    descriptionInput.value = '';
    amountInput.value = '';
});

// Function to update the spending chart
function updateChart(income, expenses) {
    const chartData = {
        labels: ['Income', 'Expenses'],
        datasets: [{
            data: [income, expenses],
            backgroundColor: ['#4caf50', '#f44336'],
            borderWidth: 1
        }]
    };

    // If the chart already exists, destroy it before creating a new one
    if (chart) {
        chart.destroy();
    }

    // Create a new chart instance
    chart = new Chart(spendingChart, {
        type: 'doughnut',
        data: chartData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Initial call to update totals and chart
updateTotals();
