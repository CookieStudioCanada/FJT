let totIncome;
let dMmajoration;
let ndMajoration;

function formatNumber(num) {
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function calculateFederalTax(income) {
    let logs = [];
    let tax = 0;
    let subTotal = 0;

    // Premier palier (0 à 57 375$)
    const firstBracketAmount = Math.min(income, 57375);
    const firstBracketTax = firstBracketAmount * 0.15;
    subTotal += firstBracketTax;
    logs.push(`De 0$ à 57,375$ (15%) : ${formatNumber(firstBracketAmount)}$ × 15% = ${formatNumber(firstBracketTax)}$`);

    if (income > 57375) {
        // Deuxième palier (57 375$ à 114 750$)
        const secondBracketAmount = Math.min(income - 57375, 114750 - 57375);
        const secondBracketTax = secondBracketAmount * 0.205;
        subTotal += secondBracketTax;
        logs.push(`De 57,375$ à 114,750$ (20.5%) : ${formatNumber(secondBracketAmount)}$ × 20.5% = ${formatNumber(secondBracketTax)}$`);

        if (income > 114750) {
            // Troisième palier (114 750$ à 177 882$)
            const thirdBracketAmount = Math.min(income - 114750, 177882 - 114750);
            const thirdBracketTax = thirdBracketAmount * 0.26;
            subTotal += thirdBracketTax;
            logs.push(`De 114,750$ à 177,882$ (26%) : ${formatNumber(thirdBracketAmount)}$ × 26% = ${formatNumber(thirdBracketTax)}$`);

            if (income > 177882) {
                // Quatrième palier (177 882$ à 253 414$)
                const fourthBracketAmount = Math.min(income - 177882, 253414 - 177882);
                const fourthBracketTax = fourthBracketAmount * 0.29;
                subTotal += fourthBracketTax;
                logs.push(`De 177,882$ à 253,414$ (29%) : ${formatNumber(fourthBracketAmount)}$ × 29% = ${formatNumber(fourthBracketTax)}$`);

                if (income > 253414) {
                    // Cinquième palier (253 414$ et plus)
                    const fifthBracketAmount = income - 253414;
                    const fifthBracketTax = fifthBracketAmount * 0.33;
                    subTotal += fifthBracketTax;
                    logs.push(`Plus de 253,414$ (33%) : ${formatNumber(fifthBracketAmount)}$ × 33% = ${formatNumber(fifthBracketTax)}$`);
                }
            }
        }
    }
    
    const abatement = subTotal * 0.165;
    const finalTax = subTotal - abatement;
    logs.push(`Abattement du Québec (16.5%) : (${formatNumber(abatement)}$)`);

    return [finalTax, logs];
}

function calculateQuebecTax(income) {
    let logs = [];
    let tax = 0;
    let subTotal = 0;

    // Premier palier (0 à 53 255$)
    const firstBracketAmount = Math.min(income, 53255);
    const firstBracketTax = firstBracketAmount * 0.14;
    subTotal += firstBracketTax;
    logs.push(`De 0$ à 53,255$ (14%) : ${formatNumber(firstBracketAmount)}$ × 14% = ${formatNumber(firstBracketTax)}$`);

    if (income > 53255) {
        // Deuxième palier (53 255$ à 106 495$)
        const secondBracketAmount = Math.min(income - 53255, 106495 - 53255);
        const secondBracketTax = secondBracketAmount * 0.19;
        subTotal += secondBracketTax;
        logs.push(`De 53,255$ à 106,495$ (19%) : ${formatNumber(secondBracketAmount)}$ × 19% = ${formatNumber(secondBracketTax)}$`);

        if (income > 106495) {
            // Troisième palier (106 495$ à 129 590$)
            const thirdBracketAmount = Math.min(income - 106495, 129590 - 106495);
            const thirdBracketTax = thirdBracketAmount * 0.24;
            subTotal += thirdBracketTax;
            logs.push(`De 106,495$ à 129,590$ (24%) : ${formatNumber(thirdBracketAmount)}$ × 24% = ${formatNumber(thirdBracketTax)}$`);

            if (income > 129590) {
                // Quatrième palier (129 590$ et plus)
                const fourthBracketAmount = income - 129590;
                const fourthBracketTax = fourthBracketAmount * 0.2575;
                subTotal += fourthBracketTax;
                logs.push(`Plus de 129,590$ (25.75%) : ${formatNumber(fourthBracketAmount)}$ × 25.75% = ${formatNumber(fourthBracketTax)}$`);
            }
        }
    }

    return [subTotal, logs];
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
    taxableCapitalGains = capitalGains * 0.50;

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
    // Get the logs from tax calculations
    const [_, federalLogs] = calculateFederalTax(totalIncome);
    const [__, quebecLogs] = calculateQuebecTax(totalIncome);

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
                    <span class="result-label">Gains en capital imposables (50%)</span>
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

            <div class="result-group">
                <h5 class="mb-3">Détails du calcul</h5>
                <div class="calculation-logs">
                    <div class="log-section">
                        <h6>Calcul de l'impôt fédéral</h6>
                        ${federalLogs.map(log => `<div class="log-entry">${log}</div>`).join('')}
                    </div>
                    <div class="log-section">
                        <h6>Calcul de l'impôt provincial</h6>
                        ${quebecLogs.map(log => `<div class="log-entry">${log}</div>`).join('')}
                    </div>
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
    if (income <= 57375) rate = 15;
    else if (income <= 114750) rate = 20.5;
    else if (income <= 177882) rate = 26;
    else if (income <= 253414) rate = 29;
    else rate = 33;
    
    // Application de l'abattement de 16,5% pour les résidents du Québec
    return rate * (1 - 0.165);
}

function getQuebecMarginalRate(income) {
    if (income <= 53255) return 14;
    if (income <= 106495) return 19;
    if (income <= 129590) return 24;
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

// Continue in next message due to length... 