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
    
    // Update the totals in the table
    document.getElementById('totalRevenus').textContent = formatCurrency(totalRevenus);
    document.getElementById('totalDepenses').textContent = formatCurrency(totalDepenses);
    document.getElementById('argentDisponible').textContent = formatCurrency(argentDisponible);

}

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