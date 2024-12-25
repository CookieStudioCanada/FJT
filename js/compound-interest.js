let chart = null;

function calculateCompoundInterest() {
    const principal = parseFloat(document.getElementById('principal').value) || 0;
    const rate = parseFloat(document.getElementById('rate').value) || 0;
    const time = parseInt(document.getElementById('time').value) || 0;
    const contribution = parseFloat(document.getElementById('newContribution').value) || 0;
    const frequency = document.getElementById('frequency').value;
    
    // Convert frequency to number of times per year
    const frequencyMap = {
        monthly: 12,
        quarterly: 4,
        semiannually: 2,
        annually: 1
    };
    
    const paymentsPerYear = frequencyMap[frequency];
    const r = rate / 100;
    
    // Calculate future value
    let futureValue = principal * Math.pow(1 + r, time);
    let contributionValue = contribution * ((Math.pow(1 + r, time) - 1) / r) * paymentsPerYear;
    
    const totalValue = futureValue + contributionValue;
    const futureContributions = contribution * paymentsPerYear * time;
    const totalInterest = totalValue - futureContributions;
    
    // Display results
    document.querySelector('#CI .calculator-result').innerHTML = `
        <div class="result">
            <h4>Résultats du calcul d'intérêts composés</h4>
            <div class="result-group">
                <div class="result-row">
                    <span class="result-label">Montant initial investi</span>
                    <span class="result-value">${formatCurrency(principal)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Total des contributions futures</span>
                    <span class="result-value">${formatCurrency(futureContributions)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Intérêts gagnés</span>
                    <span class="result-value">${formatCurrency(totalInterest)}</span>
                </div>
            </div>
            <div class="result-total">
                <div class="result-row">
                    <span class="result-label">Montant final</span>
                    <span class="result-value">${formatCurrency(totalValue)}</span>
                </div>
            </div>
            <div class="d-flex justify-content-center mt-4">
                <button type="button" class="btn btn-calculate btn-lg" onclick="printCalculator('CI')">Imprimer</button>
            </div>
        </div>
    `;
    
    // Show chart container
    document.querySelector('.chart-container').classList.add('visible');
    
    // Update chart
    updateChart(time, principal, rate, contribution, frequency);
}

function updateChart(time, principal, rate, contribution, frequency) {
    if (chart) {
        chart.destroy();
    }
    
    const years = Array.from({length: time + 1}, (_, i) => i);
    const values = years.map(year => {
        const r = rate / 100;
        const paymentsPerYear = {
            monthly: 12,
            quarterly: 4,
            semiannually: 2,
            annually: 1
        }[frequency];
        
        return principal * Math.pow(1 + r, year) + 
               contribution * ((Math.pow(1 + r, year) - 1) / r) * paymentsPerYear;
    });
    
    const ctx = document.getElementById('compoundInterestChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Valeur du portefeuille',
                data: values,
                borderColor: '#28a745',
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Évolution de la valeur du portefeuille'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => formatCurrency(value)
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Années'
                    }
                }
            }
        }
    });
}

function resetCompoundInterest() {
    // Réinitialiser tous les champs
    document.getElementById('principal').value = '';
    document.getElementById('rate').value = '';
    document.getElementById('time').value = '';
    document.getElementById('newContribution').value = '';
    document.getElementById('frequency').value = 'monthly';
    
    // Effacer les résultats
    document.querySelector('#CI .calculator-result').innerHTML = '';
    
    // Hide chart container
    document.querySelector('.chart-container').classList.remove('visible');
    
    // Détruire le graphique existant
    if (chart) {
        chart.destroy();
        chart = null;
    }
}

function updateCompoundInterestChart(years, totalAmounts) {
    const ctx = document.getElementById('compoundInterestChart').getContext('2d');
    
    // Détruire le graphique existant s'il y en a un
    if (window.compoundInterestChart instanceof Chart) {
        window.compoundInterestChart.destroy();
    }

    window.compoundInterestChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Valeur totale',
                data: totalAmounts,
                borderColor: '#424769',
                backgroundColor: 'rgba(103, 111, 157, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Croissance de l\'investissement',
                    font: {
                        size: 16,
                        family: 'Inter'
                    }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return new Intl.NumberFormat('fr-CA', {
                                style: 'currency',
                                currency: 'CAD',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            }).format(value);
                        }
                    }
                }
            }
        }
    });
}

// ... (rest of the compound interest calculator code) 