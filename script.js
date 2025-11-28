function populateSchoolFilter() {
    const table = document.getElementById("bill-table");
    const schoolFilter = document.getElementById("schoolFilter");
    const schools = new Set();

    // Start from 2 to skip header and filter rows
    for (let i = 2; i < table.rows.length; i++) {
        // Column index for school name is 1
        const schoolName = table.rows[i].cells[1].textContent;
        schools.add(schoolName);
    }

    schools.forEach(school => {
        const option = document.createElement("option");
        option.value = school;
        option.textContent = school;
        schoolFilter.appendChild(option);
    });
}

function filterTable() {
    const schoolFilter = document.getElementById("schoolFilter").value;
    const monthFilter = document.getElementById("monthFilter").value;
    const table = document.getElementById("bill-table");
    const tr = table.getElementsByTagName("tr");

    // Start from 2 to skip header and filter rows
    for (let i = 2; i < tr.length; i++) {
        const schoolCell = tr[i].getElementsByTagName("td")[1];
        const monthCell = tr[i].getElementsByTagName("td")[3];
        
        if (schoolCell && monthCell) {
            const schoolMatch = (schoolFilter === "" || schoolCell.textContent === schoolFilter);
            const monthMatch = (monthFilter === "" || monthCell.textContent === monthFilter);

            if (schoolMatch && monthMatch) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function assignDataLabels() {
    const table = document.getElementById('bill-table');
    const headers = Array.from(table.querySelectorAll('thead tr:first-child th')).map(th => th.textContent);
    const rows = table.querySelectorAll('tbody tr');

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        cells.forEach((cell, index) => {
            cell.setAttribute('data-label', headers[index]);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    populateSchoolFilter();
    assignDataLabels();
});
