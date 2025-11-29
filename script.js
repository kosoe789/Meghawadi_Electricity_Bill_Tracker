// --- CONFIGURATION ---
// 1. Replace 'YOUR_SHEET_ID' with your actual Google Sheet ID from Step 1.
const SHEET_ID = '1wgIlwrkbgiajopkWul-_y5ghskVwjxmiS-SVKR2DGJI'; 
// 2. Replace '0' if your GID is different.
const GID = '0'; 
// -------------------

const sheetURL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${GID}`;

document.addEventListener('DOMContentLoaded', () => {
    fetch(sheetURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(csvText => {
            const data = parseCSV(csvText);
            populateTable(data);
            populateFilters(data);
            calculateTotal();
        })
        .catch(error => {
            console.error('Error fetching or parsing Google Sheet:', error);
            const tableBody = document.getElementById('table-body');
            tableBody.innerHTML = '<tr><td colspan="6" class="loading-cell" style="color: red;">Error: Google Sheet မှ ဒေတာများ ရယူ၍မရပါ။ Sheet ID မှန်ကန်မှု နှင့် Share setting ကိုစစ်ဆေးပါ။</td></tr>';
        });
});

function parseCSV(text) {
    // Split into rows, and remove the header row (slice(1))
    const rows = text.trim().split('\n').slice(1);
    return rows.map(row => {
        // This regex handles commas inside quoted fields
        const values = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
        // Remove quotes from each value
        return values.map(value => value.replace(/"/g, '').trim());
    });
}

function populateTable(data) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; // Clear "Loading..." message

    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="loading-cell">ဒေတာ မရှိသေးပါ။</td></tr>';
        return;
    }

    data.forEach(row => {
        if (row.length < 6) return; // Skip empty or malformed rows
        
        const tr = document.createElement('tr');
        const rawAmount = parseFloat(row[5]);
        const formattedUnit = parseFloat(row[4]).toLocaleString('en-US');
        const formattedAmount = !isNaN(rawAmount) ? rawAmount.toLocaleString('en-US') : 'N/A';

        tr.innerHTML = `
            <td data-label="စဉ်">${row[0]}</td>
            <td data-label="ကျောင်း">${row[1]}</td>
            <td data-label="မီတာအမှတ်">${row[2]}</td>
            <td data-label="ရွေးချယ်ထားသောလ">${row[3]}</td>
            <td data-label="သုံးစွဲယူနစ်">${formattedUnit}</td>
            <td data-label="ဘေလ်ပမာဏ (ကျပ်)" data-amount="${rawAmount}">${formattedAmount}</td>
        `;
        tableBody.appendChild(tr);
    });
}

function populateFilters(data) {
    const schoolFilter = document.getElementById("schoolFilter");
    const monthFilter = document.getElementById("monthFilter");
    
    const allMonths = ["ဇန်နဝါရီ", "ဖေဖော်ဝါရီ", "မတ်", "ဧပြီ", "မေ", "ဇွန်", "ဇူလိုင်", "ဩဂုတ်", "စက်တင်ဘာ", "အောက်တိုဘာ", "နိုဝင်ဘာ", "ဒီဇင်ဘာ"];
    const schools = new Set(data.map(row => row[1]).filter(Boolean));

    schoolFilter.innerHTML = '<option value="">ကျောင်းအားလုံး</option>';
    monthFilter.innerHTML = '<option value="">လအားလုံး</option>';

    schools.forEach(school => {
        schoolFilter.add(new Option(school, school));
    });
    allMonths.forEach(month => {
        monthFilter.add(new Option(month, month));
    });
}

function filterTable() {
    const schoolFilter = document.getElementById("schoolFilter").value;
    const monthFilter = document.getElementById("monthFilter").value;
    const tableBody = document.getElementById("table-body");
    const tr = tableBody.getElementsByTagName("tr");

    for (let i = 0; i < tr.length; i++) {
        const schoolCell = tr[i].cells[1];
        const monthCell = tr[i].cells[3];
        
        const schoolMatch = (schoolFilter === "" || schoolCell.textContent.trim() === schoolFilter);
        const monthMatch = (monthFilter === "" || monthCell.textContent.trim() === monthFilter);

        tr[i].style.display = (schoolMatch && monthMatch) ? "" : "none";
    }
    calculateTotal(); 
}

function calculateTotal() {
    const rows = document.querySelectorAll("#table-body tr");
    let total = 0;

    rows.forEach(row => {
        if (row.style.display !== "none") {
            const amountCell = row.cells[5];
            const amount = parseFloat(amountCell.getAttribute('data-amount'));
            if (!isNaN(amount)) {
                total += amount;
            }
        }
    });
    
    document.getElementById('totalAmount').textContent = `${total.toLocaleString('en-US')} ကျပ်`;
}
