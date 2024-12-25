let totIncome;
let dMmajoration;
let ndMajoration;

function formatNumber(num) {
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function calculateFederalTax(income) {
    let logs = [`Calcul des impôts fédéraux pour un revenu de $${formatNumber(income)}.`];
    let tax = 0;
    
    if (income <= 55867) {
        tax = income * 0.15;
        logs.push(`Le revenu jusqu'à $55,867 est imposé à 15% : $${formatNumber(tax)}`);
    } else {
        let initialTax = 55867 * 0.15;
        tax = initialTax;
        logs.push(`Les premiers $55,867 sont imposés à 15% : $${formatNumber(initialTax)}`);
        
        if (income <= 111733) {
            tax += (income - 55867) * 0.205;
            logs.push(`Le revenu de $55,867 à $111,733 est imposé à 20.5% : $${formatNumber((income - 55867) * 0.205)}`);
        } else {
            let middleTax = (111733 - 55867) * 0.205;
            tax += middleTax;
            logs.push(`Les $55,866 suivants sont imposés à 20.5% : $${formatNumber(middleTax)}`);
            
            if (income <= 173205) {
                tax += (income - 111733) * 0.26;
                logs.push(`Le revenu de $111,733 à $173,205 est imposé à 26% : $${formatNumber((income - 111733) * 0.26)}`);
            } else {
                let higherTax = (173205 - 111733) * 0.26;
                tax += higherTax;
                logs.push(`Les $61,472 suivants sont imposés à 26% : $${formatNumber(higherTax)}`);
                
                if (income <= 246752) {
                    tax += (income - 173205) * 0.29;
                    logs.push(`Le revenu de $173,205 à $246,752 est imposé à 29% : $${formatNumber((income - 173205) * 0.29)}`);
                } else {
                    let highestTax = (246752 - 173205) * 0.29;
                    tax += highestTax;
                    tax += (income - 246752) * 0.33;
                    logs.push(`Les $73,547 suivants sont imposés à 29% : $${formatNumber(highestTax)}`);
                    logs.push(`Le revenu supérieur à $246,752 est imposé à 33% : $${formatNumber((income - 246752) * 0.33)}`);
                }
            }
        }
    }
    
    let abatedTax = tax - (tax * 0.165);
    logs.push(`Application de l'abattement de 16.5%, réduction de l'impôt de $${formatNumber(tax * 0.165)} à $${formatNumber(abatedTax)}.`);
    return [abatedTax, logs];
}

function calculateQuebecTax(income) {
    let logs = [`Calcul des impôts du Québec pour un revenu de $${formatNumber(income)}.`];
    let tax = 0;
    
    if (income <= 51780) {
        tax = income * 0.14;
        logs.push(`Le revenu jusqu'à $51,780 est imposé à 14% : $${formatNumber(tax)}`);
    } else {
        let initialTax = 51780 * 0.14;
        tax = initialTax;
        logs.push(`Les premiers $51,780 sont imposés à 14% : $${formatNumber(initialTax)}`);
        
        if (income <= 103545) {
            tax += (income - 51780) * 0.19;
            logs.push(`Le revenu de $51,780 à $103,545 est imposé à 19% : $${formatNumber((income - 51780) * 0.19)}`);
        } else {
            let middleTax = (103545 - 51780) * 0.19;
            tax += middleTax;
            logs.push(`Les $51,765 suivants sont imposés à 19% : $${formatNumber(middleTax)}`);
            
            if (income <= 126000) {
                tax += (income - 103545) * 0.24;
                logs.push(`Le revenu de $103,545 à $126,000 est imposé à 24% : $${formatNumber((income - 103545) * 0.24)}`);
            } else {
                let higherTax = (126000 - 103545) * 0.24;
                tax += higherTax;
                tax += (income - 126000) * 0.2575;
                logs.push(`Les $22,455 suivants sont imposés à 24% : $${formatNumber(higherTax)}`);
                logs.push(`Le revenu supérieur à $126,000 est imposé à 25.75% : $${formatNumber((income - 126000) * 0.2575)}`);
            }
        }
    }
    return [tax, logs];
}

function calculateTotalTax() {
    console.log("Starting tax calculation...");
    
    // Income
    const employmentIncome = parseFloat(document.getElementById('employmentIncome').value) || 0;
    const capitalGains = parseFloat(document.getElementById('capitalGains').value) || 0;
    const determinedDividend = parseFloat(document.getElementById('determinedDividend').value) || 0;
    const undeterminedDividend = parseFloat(document.getElementById('undeterminedDividend').value) || 0;
    const propertyIncome = parseFloat(document.getElementById('propertyIncome').value) || 0;

    console.log("Input values:", {
        employmentIncome,
        capitalGains,
        determinedDividend,
        undeterminedDividend,
        propertyIncome
    });

    let taxableCapitalGains;
    if (capitalGains <= 250000) {
        taxableCapitalGains = capitalGains * 0.50;
    } else {
        taxableCapitalGains = 250000 * 0.50 + (capitalGains - 250000) * 0.6667;
    }

    const totalIncome = employmentIncome + 
                        taxableCapitalGains + 
                        (determinedDividend * 1.38) + 
                        (undeterminedDividend * 1.15) + 
                        propertyIncome;
    
    console.log("Total income calculated:", totalIncome);

    totIncome = totalIncome;
    dMmajoration = (determinedDividend * 1.38) - determinedDividend;
    ndMajoration = (undeterminedDividend * 1.15) - undeterminedDividend;
    
    if (isNaN(totalIncome) || totalIncome === 0) {
        console.log("Invalid or zero total income");
        document.getElementById('result').innerHTML = 'Veuillez entrer un chiffre valide dans au moins une catégorie.';
        return;
    }

    try {
        console.log("Calculating federal tax...");
        const [federalTax, federalLogs] = calculateFederalTax(totalIncome);
        console.log("Federal tax calculated:", federalTax);

        console.log("Calculating Quebec tax...");
        const [quebecTax, quebecLogs] = calculateQuebecTax(totalIncome);
        console.log("Quebec tax calculated:", quebecTax);

        const totalTax = federalTax + quebecTax;
        const federalTaxBeforeAbatement = federalTax / 0.835;
        const quebecAbatement = federalTaxBeforeAbatement * 0.165;
        const effectiveTaxRate = (totalTax / totalIncome) * 100;
        
        // Calculate marginal tax rate
        const marginalFederalRate = getFederalMarginalRate(totalIncome);
        const marginalQuebecRate = getQuebecMarginalRate(totalIncome);
        const marginalTaxRate = marginalFederalRate + marginalQuebecRate;

        console.log("All calculations completed, displaying results...");

        displayTaxResults(
            employmentIncome,
            capitalGains,
            taxableCapitalGains,
            determinedDividend,
            undeterminedDividend,
            propertyIncome,
            totalIncome,
            federalTax,
            quebecTax,
            totalTax,
            federalTaxBeforeAbatement,
            quebecAbatement,
            effectiveTaxRate,
            marginalTaxRate
        );

        updateTaxChart(federalTax, quebecTax, totalIncome);
    } catch (error) {
        console.error("Error during tax calculation:", error);
        document.getElementById('result').innerHTML = 'Une erreur est survenue lors du calcul.';
    }
}

function displayTaxResults(
    employmentIncome,
    capitalGains,
    taxableCapitalGains,
    determinedDividend,
    undeterminedDividend,
    propertyIncome,
    totalIncome,
    federalTax,
    quebecTax,
    totalTax,
    federalTaxBeforeAbatement,
    quebecAbatement,
    effectiveTaxRate,
    marginalTaxRate
) {
    // Create result container
    const resultHTML = `
        <div class="result">
            <h4>Résultats du calcul d'impôts</h4>
            
            <div class="result-group">
                <h5 class="mb-3">Revenus bruts</h5>
                <div class="result-row">
                    <span class="result-label">Revenu d'emploi</span>
                    <span class="result-value">${formatCurrency(employmentIncome)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Gains en capital</span>
                    <span class="result-value">${formatCurrency(capitalGains)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Dividende déterminé</span>
                    <span class="result-value">${formatCurrency(determinedDividend)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Dividende non-déterminé</span>
                    <span class="result-value">${formatCurrency(undeterminedDividend)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Revenu d'entreprise/biens</span>
                    <span class="result-value">${formatCurrency(propertyIncome)}</span>
                </div>
            </div>

            <div class="result-group">
                <h5 class="mb-3">Revenus imposables ajustés</h5>
                <div class="result-row">
                    <span class="result-label">Gains en capital imposables (${capitalGains > 250000 ? '66.67%' : '50%'})</span>
                    <span class="result-value">${formatCurrency(taxableCapitalGains)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Dividende déterminé majoré (138%)</span>
                    <span class="result-value">${formatCurrency(determinedDividend * 1.38)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Dividende non-dét. majoré (115%)</span>
                    <span class="result-value">${formatCurrency(undeterminedDividend * 1.15)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Revenu total imposable</span>
                    <span class="result-value">${formatCurrency(totalIncome)}</span>
                </div>
            </div>

            <div class="result-group">
                <h5 class="mb-3">Impôt fédéral</h5>
                <div class="result-row">
                    <span class="result-label">Impôt avant abattement</span>
                    <span class="result-value">${formatCurrency(federalTaxBeforeAbatement)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Abattement du Québec (16.5%)</span>
                    <span class="result-value">${formatCurrency(quebecAbatement)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Impôt fédéral final</span>
                    <span class="result-value">${formatCurrency(federalTax)}</span>
                </div>
            </div>

            <div class="result-group">
                <h5 class="mb-3">Impôt provincial (Québec)</h5>
                <div class="result-row">
                    <span class="result-label">Impôt du Québec</span>
                    <span class="result-value">${formatCurrency(quebecTax)}</span>
                </div>
            </div>

            <div class="result-total">
                <div class="result-row">
                    <span class="result-label">Total des impôts</span>
                    <span class="result-value">${formatCurrency(totalTax)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Taux d'imposition effectif</span>
                    <span class="result-value">${effectiveTaxRate.toFixed(2)}%</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Taux d'imposition marginal</span>
                    <span class="result-value">${marginalTaxRate.toFixed(2)}%</span>
                </div>
            </div>

            <div class="d-flex justify-content-center mt-4">
                <button type="button" class="btn btn-calculate btn-lg" onclick="printCalculator('Tax')">Imprimer</button>
            </div>
        </div>
    `;

    // Update the results container
    document.querySelector('#Tax .calculator-result').innerHTML = resultHTML;
}

function getFederalMarginalRate(income) {
    let rate;
    if (income <= 55867) rate = 15;
    else if (income <= 111733) rate = 20.5;
    else if (income <= 173205) rate = 26;
    else if (income <= 246752) rate = 29;
    else rate = 33;
    
    // Apply the 16.5% reduction
    return rate * (1 - 0.165);
}

function getQuebecMarginalRate(income) {
    if (income <= 51780) return 14;
    if (income <= 103545) return 19;
    if (income <= 126000) return 24;
    return 25.75;
}

function resetFields() {
    document.getElementById('employmentIncome').value = '';
    document.getElementById('capitalGains').value = '';
    document.getElementById('determinedDividend').value = '';
    document.getElementById('undeterminedDividend').value = '';
    document.getElementById('propertyIncome').value = '';
    document.querySelector('#Tax .calculator-result').innerHTML = '';
}

function updateTaxChart(federalTax, quebecTax, totalIncome) {
    if (window.taxChart) {
        window.taxChart.destroy();
    }
    
    const ctx = document.getElementById('taxChart').getContext('2d');
    const netIncome = totalIncome - federalTax - quebecTax;
    
    window.taxChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Revenu net', 'Impôt fédéral', 'Impôt provincial'],
            datasets: [{
                data: [netIncome, federalTax, quebecTax],
                backgroundColor: ['#4BC0C0', '#FF6384', '#36A2EB']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Répartition du revenu total'
                },
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

// Continue in next message due to length... 