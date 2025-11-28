function searchTable() {
    const input = document.getElementById("searchInput");
    const filter = input.value.toUpperCase();
    const table = document.getElementById("bill-table");
    const tr = table.getElementsByTagName("tr");

    for (let i = 1; i < tr.length; i++) {
        let display = "none";
        const tds = tr[i].getElementsByTagName("td");
        for (let j = 0; j < tds.length; j++) {
            if (tds[j]) {
                if (tds[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
                    display = "";
                    break;
                }
            }
        }
        tr[i].style.display = display;
    }
}

function assignDataLabels() {
    const table = document.getElementById('bill-table');
    const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent);
    const rows = table.querySelectorAll('tbody tr');

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        cells.forEach((cell, index) => {
            cell.setAttribute('data-label', headers[index]);
        });
    });
}

document.addEventListener('DOMContentLoaded', assignDataLabels);