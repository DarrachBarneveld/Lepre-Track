document.getElementById('calculateEnergyImpactBtn').addEventListener('click', calculateEnergyImpact);

function energyImpactScore(electricitySource, heatingSource, efficientAppliance, insulation, solarPanels) {
    // To normalize the carbon footprint scores I use the highest value from the given sources 
    let CARBON_FOOTPRINT = {
        "Renewable-energy": 25.125,
        "Non-renewable-energy": 50.6
    };
    // highest value for heatingSource is Heating Oil
    let CARBON_FOOTPRINT1 = {
        "Renewable-energy": 25.125,
        "Non-renewable-energy": 50.6
    };

    let score = CARBON_FOOTPRINT[electricitySource] + CARBON_FOOTPRINT1[heatingSource];
    
    if (efficientAppliance === "Yes") {
        score *= 0.7;  // Assume using efficient appliances reduces your score by 30%
    }

    if (insulation === "Yes") {
        score *= 0.8;  // Assume proper insulation reduces your score by 20%
    }

    if (solarPanels === "Yes") {
        score *= 0.5;  // Assume having solar panels reduces your score by 50%
    }
    
    return score;
}

function calculateEnergyImpact() {
    // Get user inputs
    let electricitySource = document.getElementById("electricity-source").value;
    let heatingSource = document.getElementById("heating-source").value;
    let efficientAppliance = document.querySelector('input[name="efficientAppliance"]:checked').value;
    let insulation = document.querySelector('input[name="insulation"]:checked').value;
    let solarPanels = document.querySelector('input[name="solarPanels"]:checked').value;

    // Calculate the score
    let score = energyImpactScore(electricitySource, heatingSource, efficientAppliance, insulation, solarPanels);
    
    // Display the result
    document.getElementById("energy-result").innerText = score.toFixed(2) + ' % '; 
} // Displaying the score in kgCO2 with 4 decimal places

// A kilowatt-hour (kWh) is the unit of measurement used by gas and electricity suppliers. One kilowatt-hour is equivalent to 1000 watts of energy used for 1 hour.
