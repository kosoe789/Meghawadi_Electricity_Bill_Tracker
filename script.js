document.addEventListener('DOMContentLoaded', () => {
    // This function will now run first to populate the dropdowns
    populateFilters(); 
    
    // This function will format the numbers in the table
    formatInitialAmounts(); 
    
    // This function will calculate the total amount correctly on page load
    calculateTotal(); 
});

function formatInitialAmounts() {
    const tableBody = document.getElementById("table-body");
    const rows = tableBody.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        const amountCell = rows[i].getElementsByTagName("td")[5];
        if (amountCell) {
            // Keep the original number in a data attribute for calculation
            const amount = parseFloat(amountCell.textContent);
            amountCell.setAttribute('data-amount', amount); 
            // Display the formatted number
            amountCell.textContent = amount.toLocaleString('en-US');
        }
    }
}

function populateFilters() {
    const tableBody = document.getElementById("table-body");
    const rows = tableBody.getElementsByTagName("tr");
    const schoolFilter = document.getElementById("schoolFilter");
    const monthFilter = document.getElementById("monthFilter");
    
    // Use Sets to automatically handle unique values
    const schools = new Set();
    const months = new Set();

    for (let i = 0; i < rows.length; i++) {
        const schoolName = rows[i].getElementsByTagName("td")[1].textContent;
        const monthName = rows[i].getElementsByTagName("td")[3].textContent;
        if (schoolName) schools.add(schoolName);
        if (monthName) months.add(monthName);
    }

    // Clear existing options except the first one ("All")
    schoolFilter.length = 1; 
    monthFilter.length = 1;

    schools.forEach(school => {
        const option = document.createElement("option");
        option.value = school;
        option.textContent = school;
        schoolFilter.appendChild(option);
    });

    months.forEach(month => {
        const option = document.createElement("option");
        option.value = month;
        option.textContent = month;
        monthFilter.appendChild(option);
    });
}

function filterTable() {
    const schoolFilter = document.getElementById("schoolFilter").value;
    const monthFilter = document.getElementById("monthFilter").value;
    const tableBody = document.getElementById("table-body");
    const tr = tableBody.getElementsByTagName("tr");

    for (let i = 0; i < tr.length; i++) {
        const schoolCell = tr[i].getElementsByTagName("td")[1];
        const monthCell = tr[i].getElementsByTagName("td")[3];
        
        const schoolMatch = (schoolFilter === "" || schoolCell.textContent === schoolFilter);
        const monthMatch = (monthFilter === "" || monthCell.textContent === monthFilter);

        if (schoolMatch && monthMatch) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
    // Recalculate total after filtering
    calculateTotal(); 
}

function calculateTotal() {
    const tableBody = document.getElementById("table-body");
    const rows = tableBody.getElementsByTagName("tr");
    let total = 0;

    for (let i = 0; i < rows.length; i++) {
        // Only calculate for visible rows
        if (rows[i].style.display !== "none") {
            const amountCell = rows[i].getElementsByTagName("td")[5];
            if (amountCell) {
                // Use the original, unformatted number from the data attribute for accurate calculation
                const amount = parseFloat(amountCell.getAttribute('data-amount')); 
                if (!isNaN(amount)) {
                    total += amount;
                }
            }
        }
    }
    
    // Display the final total, formatted with commas
    document.getElementById('totalAmount').textContent = ${total.toLocaleString('en-US')} ကျပ်;
}
