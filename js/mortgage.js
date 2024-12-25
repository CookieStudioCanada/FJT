// Define calculator object globally
const calculator = {
    // Constants for SCHL rates and welcome tax brackets
    SCHL_RATES: {
        5: 4.00,    // 5% à 9.99%
        10: 3.10,   // 10% à 14.99%
        15: 2.80,   // 15% à 19.99%
        20: 0       // 20% et plus
    },

    WELCOME_TAX_RATES: {
        montreal: [
            { limit: 61500, rate: 0.005 },
            { limit: 307800, rate: 0.01 },
            { limit: 552300, rate: 0.015 },
            { limit: 1104700, rate: 0.02 },
            { limit: 2136500, rate: 0.025 },
            { limit: 3113000, rate: 0.035 },
            { limit: Infinity, rate: 0.04 }
        ],
        longueuil: [
            { limit: 58900, rate: 0.005 },
            { limit: 294600, rate: 0.01 },
            { limit: 508699, rate: 0.015 },
            { limit: Infinity, rate: 0.03 }
        ],
        brossard: [
            { limit: 58900, rate: 0.005 },
            { limit: 294600, rate: 0.01 },
            { limit: 500000, rate: 0.015 },
            { limit: Infinity, rate: 0.03 }
        ]
    },

    // Utility methods
    formatMoney(amount) {
        return formatCurrency(amount); // Using global formatCurrency from utils.js
    },

    // Core calculation methods
    calculateSCHLRate(downPaymentPercentage) {
        if (downPaymentPercentage >= 20) return 0;
        if (downPaymentPercentage >= 15) return 2.80;
        if (downPaymentPercentage >= 10) return 3.10;
        if (downPaymentPercentage >= 5) return 4.00;
        return 0;
    },

    calculateWelcomeTax(price, city) {
        if (!city || !this.WELCOME_TAX_RATES[city]) return 0;
        
        const rates = this.WELCOME_TAX_RATES[city];
        let tax = 0;
        let remainingPrice = price;
        let previousLimit = 0;

        for (const bracket of rates) {
            const bracketAmount = Math.min(Math.max(remainingPrice, 0), bracket.limit - previousLimit);
            tax += bracketAmount * bracket.rate;
            remainingPrice -= bracketAmount;
            previousLimit = bracket.limit;
            if (remainingPrice <= 0) break;
        }

        return tax;
    },

    calculateMonthlyPayment(principal, annualRate, years) {
        if (annualRate === 0) return principal / (years * 12);
        
        const monthlyRate = annualRate / 100 / 12;
        const numberOfPayments = years * 12;
        return principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments) 
               / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    },

    // Validation methods
    validateInputs(data) {
        const errors = [];
        
        if (data.price <= 0) {
            errors.push('Veuillez entrer un prix valide');
        }
        
        if (data.downPayment < 0) {
            errors.push('La mise de fonds ne peut pas être négative');
        }
        
        if (data.downPayment >= data.price) {
            errors.push('La mise de fonds doit être inférieure au prix de la propriété');
        }

        const minRequired = this.calculateMinimumDownPayment(data.price);
        if (data.downPayment < minRequired) {
            errors.push(`La mise de fonds minimale doit être d'au moins ${formatCurrency(minRequired)} (${((minRequired/data.price)*100).toFixed(1)}%) pour ce prix d'achat`);
        }

        if (data.interestRate < 0 || data.interestRate > 100) {
            errors.push('Le taux d\'intérêt doit être entre 0% et 100%');
        }

        return errors;
    },

    // UI update methods
    updateDownPaymentUI(price, downPayment) {
        const minRequired = this.calculateMinimumDownPayment(price);
        // Afficher un avertissement si la mise de fonds est inférieure au minimum requis
        const downPaymentInput = document.getElementById('downPayment');
        const percentageElement = document.getElementById('downPaymentPercentage');
        
        const percentage = price > 0 ? ((downPayment / price) * 100).toFixed(2) : 0;
        
        if (percentageElement) {
            if (downPayment < minRequired) {
                percentageElement.innerHTML = `
                    <span style="color: var(--danger-color)">
                        ${formatCurrency(downPayment)} (${percentage}%) 
                        - Minimum requis: ${formatCurrency(minRequired)}
                    </span>`;
            } else {
                percentageElement.innerHTML = `${formatCurrency(downPayment)} (${percentage}%)`;
            }
        }
        
        return downPayment;
    },

    calculateMinimumDownPayment(price) {
        if (price <= 0) return 0;
        if (price >= 1000000) return price * 0.20;
        if (price > 500000) {
            const firstPortion = 500000 * 0.05;
            const secondPortion = (price - 500000) * 0.10;
            return firstPortion + secondPortion;
        }
        return price * 0.05;
    },

    // Results display
    displayResults(data) {
        const resultHTML = `
            <div class="result">
                <h4>Résultats du calcul hypothécaire</h4>
                
                <div class="result-group">
                    <h5 class="mb-4">Faits et hypothèses</h5>
                    <div class="result-row">
                        <span class="result-label">Prix d'achat :</span>
                        <span class="result-value">${this.formatMoney(data.price)}</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">Mise de fonds minimale requise :</span>
                        <span class="result-value">${this.formatMoney(this.calculateMinimumDownPayment(data.price))}</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">Mise de fonds fournie :</span>
                        <span class="result-value">${this.formatMoney(data.downPayment)} (${((data.downPayment / data.price) * 100).toFixed(1)}%)</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">Taux d'intérêt :</span>
                        <span class="result-value">${data.interestRate}%</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">Période d'amortissement :</span>
                        <span class="result-value">${data.amortization} ans</span>
                    </div>
                </div>

                <div class="result-group mt-5">
                    <h5 class="mb-4">Détails du prêt</h5>
                    <div class="result-row">
                        <span class="result-label">Montant du prêt initial :</span>
                        <span class="result-value">${this.formatMoney(data.price - data.downPayment)}</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">Prime SCHL ${data.schlRate > 0 ? `(${data.schlRate}%)` : ''} :</span>
                        <span class="result-value">${this.formatMoney(data.schlInsurance)}</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">Montant total du prêt :</span>
                        <span class="result-value">${this.formatMoney((data.price - data.downPayment) + data.schlInsurance)}</span>
                    </div>
                </div>

                <div class="result-group mt-5">
                    <h5 class="mb-4">Paiements hypothécaires</h5>
                    <div class="result-row">
                        <span class="result-label">Mensuel :</span>
                        <span class="result-value">${this.formatMoney(data.monthlyPayment)}</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">Aux deux semaines :</span>
                        <span class="result-value">${this.formatMoney((data.monthlyPayment * 12) / 26)}</span>
                    </div>
                </div>

                <div class="result-group mt-5">
                    <h5 class="mb-4">Coûts à la clôture</h5>
                    <div class="result-row">
                        <span class="result-label">Mise de fonds :</span>
                        <span class="result-value">${this.formatMoney(data.downPayment)}</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">Droits de mutation :</span>
                        <span class="result-value">${this.formatMoney(data.welcomeTax)}</span>
                    </div>
                </div>

                <div class="result-total mt-5">
                    <div class="result-row">
                        <span class="result-label">Total des coûts initiaux :</span>
                        <span class="result-value">${this.formatMoney(data.downPayment + data.welcomeTax)}</span>
                    </div>
                </div>

                <div class="d-flex justify-content-center mt-4">
                    <button type="button" class="btn btn-calculate btn-lg" onclick="printCalculator('Mortgage')">Imprimer</button>
                </div>
            </div>
        `;

        document.querySelector('#Mortgage .calculator-result').innerHTML = resultHTML;
    }
};

// Main calculation function
function calculateMortgage() {
    const data = {
        price: parseFloat(document.getElementById('price').value) || 0,
        downPayment: parseFloat(document.getElementById('downPayment').value) || 0,
        interestRate: parseFloat(document.getElementById('interestRate').value) || 0,
        amortization: parseInt(document.getElementById('amortization').value) || 25,
        city: document.getElementById('city').value
    };

    // Validate inputs
    const errors = calculator.validateInputs(data);
    if (errors.length > 0) {
        alert(errors.join('\n'));
        return;
    }

    // Calculate additional data
    const downPaymentPercentage = (data.downPayment / data.price) * 100;
    data.schlRate = calculator.calculateSCHLRate(downPaymentPercentage);
    data.schlInsurance = data.schlRate ? ((data.price - data.downPayment) * data.schlRate / 100) : 0;
    data.welcomeTax = calculator.calculateWelcomeTax(data.price, data.city);
    data.monthlyPayment = calculator.calculateMonthlyPayment(
        (data.price - data.downPayment) + data.schlInsurance,
        data.interestRate,
        data.amortization
    );

    // Display results
    calculator.displayResults(data);
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    const priceInput = document.getElementById('price');
    const downPaymentInput = document.getElementById('downPayment');

    if (priceInput) {
        priceInput.addEventListener('input', function(e) {
            const price = parseFloat(e.target.value) || 0;
            const minDownPayment = calculator.calculateMinimumDownPayment(price);
            
            const currentDownPayment = parseFloat(downPaymentInput.value) || 0;
            if (!downPaymentInput.value || currentDownPayment < minDownPayment) {
                downPaymentInput.value = minDownPayment;
            }
            
            calculator.updateDownPaymentUI(price, parseFloat(downPaymentInput.value));
        });
    }

    if (downPaymentInput) {
        downPaymentInput.addEventListener('input', function(e) {
            const price = parseFloat(document.getElementById('price').value) || 0;
            const downPayment = parseFloat(e.target.value) || 0;
            
            calculator.updateDownPaymentUI(price, downPayment);
        });
    }
});

function updateMortgageChart(data) {
    if (window.mortgageChart) {
        window.mortgageChart.destroy();
    }
    
    const ctx = document.getElementById('mortgageChart').getContext('2d');
    const principal = data.price - data.downPayment;
    const totalInterest = (data.monthlyPayment * data.amortization * 12) - principal;
    
    window.mortgageChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Capital', 'Intérêts', 'Mise de fonds', 'Prime SCHL'],
            datasets: [{
                data: [principal, totalInterest, data.downPayment, data.schlInsurance],
                backgroundColor: ['#36A2EB', '#FF6384', '#4BC0C0', '#FFCE56']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Répartition du coût total'
                }
            }
        }
    });
}

function resetMortgage() {
    document.getElementById('price').value = '';
    document.getElementById('downPayment').value = '';
    document.getElementById('interestRate').value = '';
    document.getElementById('amortization').value = '25';
    document.getElementById('city').value = '';
    
    document.querySelector('#Mortgage .calculator-result').innerHTML = '';
    if (window.mortgageChart) {
        window.mortgageChart.destroy();
    }
} 