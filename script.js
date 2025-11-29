// --- CONFIGURATION ---
const SHEET_ID = '1wgIlwrkbgiajopkWul-_y5ghskVwjxmiS-SVKR2DGJI'; 
const GID = '0'; 
// -------------------

const sheetURL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${GID}`;

document.addEventListener('DOMContentLoaded', () => {
    fetch(sheetURL)
        .then(response => response.ok ? response.text() : Promise.reject('Network response was not ok'))
        .then(csvText => {
            const data = parseCSV(csvText);
            populateTable(data);
            populateFilters(data);
            calculateTotal();
        })
        .catch(error => {
            console.error('Error fetching Google Sheet:', error);
            const tableBody = document.getElementById('table-body');
            tableBody.innerHTML = `<tr><td colspan="7" class="loading-cell" style="color: red;">Error: Google Sheet မှ ဒေတာများ ရယူ၍မရပါ။ Sheet ID နှင့် Share setting ကိုစစ်ဆေးပါ။</td></tr>`;
        });
});

function parseCSV(text) {
    const rows = text.trim().split('\n').slice(1);
    return rows.map(row => {
        const values = [];
        let current = '', inQuotes = false;
        for (const char of row) {
            if (char === '"' && (values.length === 0 || row[row.indexOf(char) - 1] !== '\\')) {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current.trim());
        return values.map(v => v.startsWith('"') && v.endsWith('"') ? v.slice(1, -1) : v);
    });
}

function populateTable(data) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; 
    if (data.length === 0 || (data.length === 1 && data[0].length <= 1)) {
        tableBody.innerHTML = `<tr><td colspan="7" class="loading-cell">ဒေတာ မရှိသေးပါ။</td></tr>`;
        return;
    }
    data.forEach(row => {
        if (row.length < 7) return;
        const tr = document.createElement('tr');
        const rawAmount = parseFloat(row[6]);
        tr.innerHTML = `
            <td data-label="စဉ်">${row[0]}</td>
            <td data-label="နှစ်">${row[1]}</td>
            <td data-label="ကျောင်း">${row[2]}</td>
            <td data-label="မီတာအမှတ်">${row[3]}</td>
            <td data-label="ရွေးချယ်ထားသောလ">${row[4]}</td>
            <td data-label="သုံးစွဲယူနစ်">${parseFloat(row[5]).toLocaleString('en-US')}</td>
            <td data-label="ဘေလ်ပမာဏ (ကျပ်)" data-amount="${rawAmount}">${!isNaN(rawAmount) ? rawAmount.toLocaleString('en-US') : 'N/A'}</td>
        `;
        tableBody.appendChild(tr);
    });
}

function populateFilters(data) {
    const yearFilter = document.getElementById("yearFilter");
    const schoolFilter = document.getElementById("schoolFilter");
    const monthFilter = document.getElementById("monthFilter");
    
    const allMonths = ["ဇန်နဝါရီ", "ဖေဖော်ဝါရီ", "မတ်", "ဧပြီ", "မေ", "ဇွန်", "ဇူလိုင်", "ဩဂုတ်", "စက်တင်ဘာ", "အောက်တိုဘာ", "နိုဝင်ဘာ", "ဒီဇင်ဘာ"];
    const years = new Set(data.map(row => row[1]).filter(Boolean));
    const schools = new Set(data.map(row => row[2]).filter(Boolean));

    yearFilter.innerHTML = '<option value="">နှစ်အားလုံး</option>';
    schoolFilter.innerHTML = '<option value="">ကျောင်းအားလုံး</option>';
    monthFilter.innerHTML = '<option value="">လအားလုံး</option>';

    years.forEach(year => yearFilter.add(new Option(year, year)));
    schools.forEach(school => schoolFilter.add(new Option(school, school)));
    allMonths.forEach(month => monthFilter.add(new Option(month, month)));
}

function filterTable() {
    const yearFilter = document.getElementById("yearFilter").value;
    const schoolFilter = document.getElementById("schoolFilter").value;
    const monthFilter = document.getElementById("monthFilter").value;
    const tableBody = document.getElementById("table-body");
    const tr = tableBody.getElementsByTagName("tr");

    for (let i = 0; i < tr.length; i++) {
        const yearCell = tr[i].cells[1];
        const schoolCell = tr[i].cells[2];
        const monthCell = tr[i].cells[4];
        
        const yearMatch = (yearFilter === "" || yearCell.textContent.trim() === yearFilter);
        const schoolMatch = (schoolFilter === "" || schoolCell.textContent.trim() === schoolFilter);
        const monthMatch = (monthFilter === "" || monthCell.textContent.trim() === monthFilter);

        tr[i].style.display = (yearMatch && schoolMatch && monthMatch) ? "" : "none";
    }
    calculateTotal(); 
}

function calculateTotal() {
    const rows = document.querySelectorAll("#table-body tr");
    let total = 0;
    rows.forEach(row => {
        if (row.style.display !== "none") {
            const amount = parseFloat(row.cells[6].getAttribute('data-amount'));
            if (!isNaN(amount)) total += amount;
        }
    });
    document.getElementById('totalAmount').textContent = `${total.toLocaleString('en-US')} ကျပ်`;
}
