document.addEventListener('DOMContentLoaded', () => {
    formatInitialAmounts();
    populateFilters();
    calculateTotal();
});

function formatInitialAmounts() {
    const tableBody = document.getElementById("table-body");
    const rows = tableBody.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        const amountCell = rows[i].getElementsByTagName("td")[5];
        if (amountCell) {
            const amount = parseFloat(amountCell.textContent);
            amountCell.textContent = amount.toLocaleString('en-US');
        }
    }
}

function populateFilters() {
    const tableBody = document.getElementById("table-body");
    const rows = tableBody.getElementsByTagName("tr");
    const schoolFilter = document.getElementById("schoolFilter");
    const monthFilter = document.getElementById("monthFilter");
    const schools = new Set();
    const months = new Set();

    for (let i = 0; i < rows.length; i++) {
        const schoolName = rows[i].getElementsByTagName("td")[1].textContent;
        const monthName = rows[i].getElementsByTagName("td")[3].textContent;
        schools.add(schoolName);
        months.add(monthName);
    }

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
    calculateTotal();
}

function calculateTotal() {
    const tableBody = document.getElementById("table-body");
    const rows = tableBody.getElementsByTagName("tr");
    let total = 0;

    for (let i = 0; i < rows.length; i++) {
        if (rows[i].style.display !== "none") {
            const amountCell = rows[i].getElementsByTagName("td")[5];
            if (amountCell) {
                const amount = parseFloat(amountCell.textContent.replace(/,/g, ''));
                if (!isNaN(amount)) {
                    total += amount;
                }
            }
        }
    }
    
    document.getElementById('totalAmount').textContent = ${total.toLocaleString('en-US')} ကျပ်;
}
