function planetImpactScore(Diet, shopLocal) {
  // Object for raw scores
  let scores = {
      "Meat-heavy": 100,
      "Omnivore": 80.5,
      "Pescatarian": 62.5,
      "Vegetarian": 52.7,
      "Vegan": 40.2
  };
  
  let score = scores[Diet];
  
  if (shopLocal) {
      score *= 0.9;  // reduce score by 10%
  }
  
  return score;
}

function calculateImpact() {
  // Get user inputs
  let Diet = document.getElementById("diet").value;
  let shopLocal = document.getElementById("local").checked;

  // Calculate the score
  let score = planetImpactScore(Diet, shopLocal);

  // Display the result using .toFixed() method to round the score to two decimal places.
  document.getElementById("result").innerText = "Score: "+ score.toFixed(2)  + ' % ';
}

// ------------------------------------------------------------------

// NEW Food script.js


