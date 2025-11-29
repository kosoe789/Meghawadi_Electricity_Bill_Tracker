// Wait for the entire HTML document to be fully loaded and parsed
document.addEventListener('DOMContentLoaded', () => {
    // Step 1: Populate the dropdown filters with data from the table and predefined lists
    populateFilters();
    
    // Step 2: Format numbers and prepare data for calculation
    prepareTableData(); 
    
    // Step 3: Calculate the initial total amount
    calculateTotal(); 
});

/**
 * Reads data from the HTML table for schools and uses a predefined list for months
 * to populate the dropdown filters.
 */
function populateFilters() {
    const tableBody = document.getElementById("table-body");
    if (!tableBody) return; // Exit if table body doesn't exist

    const rows = tableBody.getElementsByTagName("tr");
    const schoolFilter = document.getElementById("schoolFilter");
    const monthFilter = document.getElementById("monthFilter");
    
    // --- MONTHS ---
    // Use a predefined, complete list of all 12 months.
    const allMonths = [
        "ဇန်နဝါရီ", "ဖေဖော်ဝါရီ", "မတ်", "ဧပြီ", "မေ", "ဇွန်",
        "ဇူလိုင်", "ဩဂုတ်", "စက်တင်ဘာ", "အောက်တိုဘာ", "နိုဝင်ဘာ", "ဒီဇင်ဘာ"
    ];

    // --- SCHOOLS ---
    // Use a Set to automatically get unique school names from the table.
    const schools = new Set();
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName("td");
        if (cells.length > 1) { 
            const schoolName = cells[1].textContent.trim();
            if (schoolName) schools.add(schoolName);
        }
    }

    // --- POPULATE DROPDOWNS ---
    // Clear previous options
    schoolFilter.innerHTML = '<option value="">ကျောင်းအားလုံး</option>';
    monthFilter.innerHTML = '<option value="">လအားလုံး</option>';

    // Add all unique school names to the school dropdown
    schools.forEach(school => {
        const option = document.createElement("option");
        option.value = school;
        option.textContent = school;
        schoolFilter.appendChild(option);
    });

    // Add all 12 months to the month dropdown
    allMonths.forEach(month => {
        const option = document.createElement("option");
        option.value = month;
        option.textContent = month;
        monthFilter.appendChild(option);
    });
}

/**
 * Prepares table data by formatting numbers for display and storing
 * original values for calculation.
 */
function prepareTableData() {
    const tableBody = document.getElementById("table-body");
    if (!tableBody) return;

    const rows = tableBody.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName("td");
        if (cells.length > 5) {
            const amountCell = cells[5];
            const rawAmount = parseFloat(amountCell.textContent.replace(/,/g, ''));
            if (!isNaN(rawAmount)) {
                amountCell.setAttribute('data-amount', rawAmount);
                amountCell.textContent = rawAmount.toLocaleString('en-US');
            }
        }
    }
}

/**
 * Filters the table rows based on the selected dropdown values.
 */
function filterTable() {
    const schoolFilter = document.getElementById("schoolFilter").value;
    const monthFilter = document.getElementById("monthFilter").value;
    const tableBody = document.getElementById("table-body");
    if (!tableBody) return;

    const tr = tableBody.getElementsByTagName("tr");

    for (let i = 0; i < tr.length; i++) {
        const cells = tr[i].getElementsByTagName("td");
        if (cells.length > 3) {
            const schoolCell = cells[1];
            const monthCell = cells[3];
            
            const schoolMatch = (schoolFilter === "" || schoolCell.textContent.trim() === schoolFilter);
            const monthMatch = (monthFilter === "" || monthCell.textContent.trim() === monthFilter);

            tr[i].style.display = (schoolMatch && monthMatch) ? "" : "none";
        }
    }
    calculateTotal(); 
}

/**
 * Calculates the total amount of all VISIBLE rows in the table.
 */
function calculateTotal() {
    const tableBody = document.getElementById("table-body");
    if (!tableBody) return;

    const rows = tableBody.getElementsByTagName("tr");
    let total = 0;

    for (let i = 0; i < rows.length; i++) {
        if (rows[i].style.display !== "none") {
            const cells = rows[i].getElementsByTagName("td");
            if (cells.length > 5) {
                const amountCell = cells[5];
                const amount = parseFloat(amountCell.getAttribute('data-amount'));
                if (!isNaN(amount)) {
                    total += amount;
                }
            }
        }
    }
    
    document.getElementById('totalAmount').textContent = `${total.toLocaleString('en-US')} ကျပ်`;
}
