// function planetImpactScore(Diet, shopLocal) {
//   // Object for raw scores
//   let scores = {
//       "Meat-heavy": 100,
//       "Omnivore": 80.5,
//       "Pescatarian": 62.5,
//       "Vegetarian": 52.7,
//       "Vegan": 40.2
//   };
  
//   let score = scores[Diet];
  
//   if (shopLocal) {
//       score *= 0.9;  // reduce score by 10%
//   }
  
//   return score;
// }

// function calculateImpact() {
//   // Get user inputs
//   let Diet = document.getElementById("diet").value;
//   let shopLocal = document.getElementById("local").checked;

//   // Calculate the score
//   let score = planetImpactScore(Diet, shopLocal);

//   // Display the result using .toFixed() method to round the score to two decimal places.
//   document.getElementById("result").innerText = "Score: "+ score.toFixed(2)  + ' % ';
// }

// ------------------------------------------------------------------

// NEW Food script.js

document.getElementById('calculateImpactBtn').addEventListener('click', calculateImpact);

function planetImpactScore(Diet, FoodType, local, takeout, wastage, grow) {
   // scores based on a Meat-Heavy diet 
    let scores = {
        "Meat-heavy": 100,
        "Omnivore": 80.5,
        "Pescatarian": 62.5,
        "Vegetarian": 52.7,
        "Vegan": 40.2,
    };

    let scores1 = {
        "Processed": 90.2,
        "Supermarket": 75.6,
        "Organic":15.4
    }
    
    let score = scores[Diet] + scores1[FoodType];
    
    if (local === "Yes") {
        score *= 0.7;  // Reduce score by 30%
    }

    if (takeout === "Yes") {
        score *= 1.15;  // Increase score by 15%
    }

    if (wastage === "Yes") {
        score *= 1.15; // Increase score by 15% 
    }
    
    if (grow === "Yes") {
        score *= 0.7; // Reduce score by 30% 
    }
    
    return score;
}

function calculateImpact() {
    // Get user inputs
    let Diet = document.getElementById("diet").value;
    let FoodType = document.getElementById("foodType").value;
    let local = document.querySelector('input[name="local"]:checked').value;
    let takeout = document.querySelector('input[name="takeout"]:checked').value;
    let wastage = document.querySelector('input[name="wastage"]:checked').value;  // Added this line
    let grow = document.querySelector('input[name="grow"]:checked').value;

    // Calculate the score
    let score = planetImpactScore(Diet, FoodType, local, takeout, wastage, grow);
    // Display the result
    document.getElementById("result").innerText = score.toFixed(2)  + ' % ';
}
     // used toFixed() method to round the score to two decimal places.
