// --- CONFIGURATION ---
// 1. Replace 'YOUR_SHEET_ID' with your actual Google Sheet ID.
const SHEET_ID = '1wgIlwrkbgiajopkWul-_y5ghskVwjxmiS-SVKR2DGJI'; 

// 2. IMPORTANT: Map your Year to its correct GID from your sheet's URL.
//    Find the GID in your browser's address bar for each sheet.
const YEAR_TO_GID_MAP = {
    '2025': '0',          // Example: GID for 2025 sheet is '0'
    '2026': '1109851076',  // Example: GID for 2026 sheet
    '2027': '1838808029',
    '2028': '1795083309',
    // Example: GID for 2027 sheet
    // Add more years and their GIDs here
};
// -------------------

document.addEventListener('DOMContentLoaded', () => {
    const yearSelector = document.getElementById('yearSheetSelector');
    
    // Populate the year selector dropdown
    Object.keys(YEAR_TO_GID_MAP).forEach(year => {
        yearSelector.add(new Option(year, year));
    });

    // Add event listener to fetch data when a year is selected
    yearSelector.addEventListener('change', () => {
        const selectedYear = yearSelector.value;
        fetchDataForYear(selectedYear);
    });

    // Optional: Automatically load the first year's data on page load
    if (Object.keys(YEAR_TO_GID_MAP).length > 0) {
        const firstYear = Object.keys(YEAR_TO_GID_MAP)[0];
        yearSelector.value = firstYear;
        fetchDataForYear(firstYear);
    }
});

function fetchDataForYear(year) {
    const gid = YEAR_TO_GID_MAP[year];
    if (!gid) {
        console.error(`GID for year ${year} not found in map.`);
        return;
    }

    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = `<tr><td colspan="6" class="loading-cell">ဒေတာများ ရယူနေပါသည်...</td></tr>`;

    const sheetURL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${gid}`;

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
            tableBody.innerHTML = `<tr><td colspan="6" class="loading-cell" style="color: red;">Error: Google Sheet မှ ဒေတာများ ရယူ၍မရပါ။ Sheet ID နှင့် Share setting ကိုစစ်ဆေးပါ။</td></tr>`;
        });
}

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
        tableBody.innerHTML = `<tr><td colspan="6" class="loading-cell">ဤနှစ်အတွက် ဒေတာ မရှိသေးပါ။</td></tr>`;
        return;
    }
    data.forEach(row => {
        if (row.length < 6) return;
        const tr = document.createElement('tr');
        const rawAmount = parseFloat(row[5]);
        tr.innerHTML = `
            <td data-label="စဉ်">${row[0]}</td>
            <td data-label="ကျောင်း">${row[1]}</td>
            <td data-label="မီတာအမှတ်">${row[2]}</td>
            <td data-label="ရွေးချယ်ထားသောလ">${row[3]}</td>
            <td data-label="သုံးစွဲယူနစ်">${parseFloat(row[4]).toLocaleString('en-US')}</td>
            <td data-label="ဘေလ်ပမာဏ (ကျပ်)" data-amount="${rawAmount}">${!isNaN(rawAmount) ? rawAmount.toLocaleString('en-US') : 'N/A'}</td>
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

    schools.forEach(school => schoolFilter.add(new Option(school, school)));
    allMonths.forEach(month => monthFilter.add(new Option(month, month)));
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
            const amount = parseFloat(row.cells[5].getAttribute('data-amount'));
            if (!isNaN(amount)) total += amount;
        }
    });
    document.getElementById('totalAmount').textContent = `${total.toLocaleString('en-US')} ကျပ်`;
}
