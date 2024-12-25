// Budget calculator functionality
function updateTotals() {
    // Calculate total revenues
    let totalRevenus = 0;
    document.querySelectorAll('.revenu-input').forEach(input => {
        totalRevenus += Number(input.value) || 0;
    });
    
    // Calculate total expenses
    let totalDepenses = 0;
    document.querySelectorAll('.depense-input').forEach(input => {
        totalDepenses += Number(input.value) || 0;
    });
    
    // Calculate available money
    let argentDisponible = totalRevenus - totalDepenses;
    
    // Update displays with formatted currency and add print button
    const resultHTML = `
        <div class="result">
            <h4>Résultats du budget</h4>
            <div class="result-group">
                <div class="result-row">
                    <span class="result-label">Total des revenus</span>
                    <span class="result-value">${formatCurrency(totalRevenus)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Total des dépenses</span>
                    <span class="result-value">${formatCurrency(totalDepenses)}</span>
                </div>
            </div>
            <div class="result-total">
                <div class="result-row">
                    <span class="result-label">Argent disponible</span>
                    <span class="result-value">${formatCurrency(argentDisponible)}</span>
                </div>
            </div>
            <div class="d-flex justify-content-center mt-4">
                <button type="button" class="btn btn-calculate btn-lg" onclick="printCalculator('Budget')">Imprimer</button>
            </div>
        </div>
    `;

    document.querySelector('#Budget .calculator-result').innerHTML = resultHTML;
}

// Export budget data
document.getElementById('shareButton').addEventListener('click', function() {
    const budgetData = getBudgetData();
    downloadBudgetData(budgetData);
});

// Print budget
document.getElementById('printButton').addEventListener('click', function() {
    window.print();
});

// Helper function to get all budget data
function getBudgetData() {
    return {
        revenus: {
            emploi: document.getElementById('salaireInput').value,
            entreprise: document.getElementById('entrepriseInput').value,
            biens: document.getElementById('biensInput').value
        },
        depenses: {
            logement: document.getElementById('loyerInput').value,
            automobile: document.getElementById('automobileInput').value,
            essence: document.getElementById('essenceInput').value,
            transport: document.getElementById('transportInput').value,
            assuranceSante: document.getElementById('assuranceSanteInput').value,
            assuranceAuto: document.getElementById('assuranceAutoInput').value,
            assuranceHabitation: document.getElementById('assuranceHabitationInput').value,
            energie: document.getElementById('hydroQuebecInput').value,
            cellulaire: document.getElementById('cellulaireInput').value,
            internet: document.getElementById('internetInput').value,
            epicerie: document.getElementById('epicerieInput').value,
            medicaments: document.getElementById('medicamentsInput').value,
            restaurants: document.getElementById('restaurantsInput').value,
            divertissements: document.getElementById('divertissementsInput').value,
            cadeaux: document.getElementById('cadeauxInput').value,
            abonnements: document.getElementById('abonnementsInput').value,
            celi: document.getElementById('celiInput').value,
            reer: document.getElementById('reerInput').value,
            comptesNonEnregistres: document.getElementById('comptesAutoGereInput').value,
            pretDette: document.getElementById('pretDetteInput').value,
            autres: document.getElementById('autresDepensesInput').value
        }
    };
}

// Helper function to download data
function downloadBudgetData(data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'budget.json';
    a.click();
    URL.revokeObjectURL(url);
}

function updateBudgetChart() {
    const budgetData = getBudgetData();
    
    // Destroy existing chart if any
    if (window.budgetChart instanceof Chart) {
        window.budgetChart.destroy();
    }
    
    // Si tous les montants sont à zéro, ne pas créer de graphique
    const totalDepenses = Object.values(budgetData.depenses).reduce((a, b) => Number(a) + Number(b), 0);
    if (totalDepenses === 0) {
        return;
    }
    
    const ctx = document.getElementById('budgetChart').getContext('2d');
    
    // Group expenses by category
    const expenseCategories = {
        'Logement': Number(budgetData.depenses.logement),
        'Transport': Number(budgetData.depenses.automobile) + Number(budgetData.depenses.essence) + Number(budgetData.depenses.transport),
        'Assurances': Number(budgetData.depenses.assuranceSante) + Number(budgetData.depenses.assuranceAuto) + Number(budgetData.depenses.assuranceHabitation),
        'Services': Number(budgetData.depenses.energie) + Number(budgetData.depenses.cellulaire) + Number(budgetData.depenses.internet),
        'Alimentation': Number(budgetData.depenses.epicerie) + Number(budgetData.depenses.restaurants),
        'Épargne': Number(budgetData.depenses.celi) + Number(budgetData.depenses.reer) + Number(budgetData.depenses.comptesNonEnregistres),
        'Autres': Number(budgetData.depenses.divertissements) + Number(budgetData.depenses.cadeaux) + Number(budgetData.depenses.abonnements) + Number(budgetData.depenses.autres)
    };

    // Filtrer les catégories avec des montants > 0
    const filteredCategories = Object.fromEntries(
        Object.entries(expenseCategories).filter(([_, value]) => value > 0)
    );

    window.budgetChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(filteredCategories),
            datasets: [{
                data: Object.values(filteredCategories),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
                    '#9966FF', '#FF9F40', '#FF6384'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Répartition des dépenses mensuelles'
                },
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

function resetBudget() {
    // Détruire le graphique existant s'il existe
    if (window.budgetChart instanceof Chart) {
        window.budgetChart.destroy();
        window.budgetChart = null;
    }
    
    // Réinitialiser tous les champs
    document.querySelectorAll('.revenu-input, .depense-input').forEach(input => {
        input.value = '0';
    });
    
    // Mettre à jour les totaux
    updateTotals();
} 