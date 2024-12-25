// Generate birth year options when page loads
document.addEventListener('DOMContentLoaded', function() {
    const birthYearSelect = document.getElementById('birthYear');
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 100; // 100 years back
    
    for (let year = currentYear - 18; year >= startYear; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        birthYearSelect.appendChild(option);
    }
});

function calculateCELI() {
    const birthYear = parseInt(document.getElementById('birthYear').value);
    const deposits = parseFloat(document.getElementById('deposit').value) || 0;
    const withdrawals = parseFloat(document.getElementById('withdrawal').value) || 0;
    
    // CELI annual limits
    const limits = {
        2009: 5000, 2010: 5000, 2011: 5000, 2012: 5000, 2013: 5500,
        2014: 5500, 2015: 10000, 2016: 5500, 2017: 5500, 2018: 5500,
        2019: 6000, 2020: 6000, 2021: 6000, 2022: 6000, 2023: 6500,
        2024: 7000
    };
    
    const currentYear = new Date().getFullYear();
    const age18Year = birthYear + 18;
    let totalLimit = 0;
    
    // Calculate total contribution room
    for (let year = 2009; year <= currentYear; year++) {
        if (year >= age18Year && limits[year]) {
            totalLimit += limits[year];
        }
    }
    
    // Calculate available room
    const availableRoom = totalLimit - deposits + withdrawals;
    
    // Display results
    const resultDiv = document.querySelector('#CELI .calculator-result');
    resultDiv.innerHTML = `
        <div class="result">
            <h4>Résultats du calcul CÉLI</h4>
            <div class="result-group">
                <div class="result-row">
                    <span class="result-label">Droits de cotisation totaux</span>
                    <span class="result-value">${formatCurrency(totalLimit)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Cotisations effectuées</span>
                    <span class="result-value">${formatCurrency(deposits)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Retraits effectués</span>
                    <span class="result-value">${formatCurrency(withdrawals)}</span>
                </div>
            </div>
            <div class="result-total">
                <div class="result-row">
                    <span class="result-label">Droits de cotisation disponibles</span>
                    <span class="result-value">${formatCurrency(availableRoom)}</span>
                </div>
            </div>
            <div class="d-flex justify-content-center mt-4">
                <button type="button" class="btn btn-calculate btn-lg" onclick="printCalculator('CELI')">Imprimer</button>
            </div>
        </div>
    `;
}

function resetCELI() {
    // Réinitialiser l'année de naissance au premier choix
    const birthYearSelect = document.getElementById('birthYear');
    if (birthYearSelect.options.length > 0) {
        birthYearSelect.selectedIndex = 0;
    }
    
    // Réinitialiser les montants
    document.getElementById('deposit').value = '';
    document.getElementById('withdrawal').value = '';
    
    // Effacer les résultats
    document.querySelector('#CELI .calculator-result').innerHTML = '';
} 