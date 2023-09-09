const defaultTravel = {
  flight: {
    yearlyKM: 0,
    numFlights: 0,
    class: "economy",
    score: 0,
  },
  car: {
    weeklyKm: 0,
    type: "petrol",
    year2000: "before",
    score: 0,
  },
  transport: {
    drive: 0,
    carpool: 0,
    walk: 0,
    cycle: 0,
    train: 0,
    bus: 0,
    score: 0,
  },
};
const defaultEnergy = {
  energy: {
    electric: 0,
    gas: 0,
    oil: 0,
    coal: 0,
    lpg: 0,
    propane: 0,
    wood: 0,
    factor: 0,
    score: 0,
  },
};

const defaultFood = {
  diet: {
    type: "carnivore",
    calories: 0,
    score: 0,
  },
  farm: {
    local: false,
    produce: 0,
    organic: 0,
    seasonal: false,
    crop: false,
    score: 0,
  },
  dining: {
    out: false,
    waste: false,
    score: 0,
  },
};

const defaultCommunity = {
  recycle: {
    metal: false,
    paper: false,
    plastic: false,
    glass: false,
    food: false,
    score: 0,
  },
  volunteer: {
    tree: false,
    gardens: false,
    wildlife: false,
    ocean: false,
    other: false,
    donation: 0,
    score: 0,
  },
};

export class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.createdAt = data.createdAt;
    this.travel = data?.travel || defaultTravel;
    this.food = data?.food || defaultFood;
    this.energy = data?.energy || defaultEnergy;
    this.community = data?.community || defaultCommunity;
  }

  overAllScore() {
    const valueTransport =
      this.calcTransportScore() > 100 ? 100 : this.calcTransportScore();

    const valueFood = this.calcFoodScore() > 100 ? 100 : this.calcFoodScore();

    const valueRecycle =
      this.calcRecyclingScore() > 100 ? 100 : this.calcRecyclingScore();

    const valueEnergy =
      this.calcEnergyScore() > 100 ? 100 : this.calcEnergyScore();

    const totalScore =
      +valueTransport + +valueFood + +valueRecycle + +valueEnergy;

    const totalPercentage = totalScore / 2;

    return { totalScore, totalPercentage };
  }

  calcTransportScore() {
    const totalValue =
      +this.travel.flight.score +
      +this.travel.car.score +
      +this.travel.transport.score;

    const percentValue = (totalValue / 3).toFixed(2);

    return +percentValue;
  }
  calcFoodScore() {
    const totalValue =
      +this.food.diet.score + +this.food.farm.score + +this.food.dining.score;

    const percentValue = (totalValue / 3).toFixed(2);

    return +percentValue;
  }

  calcRecyclingScore() {
    const totalValue =
      +this.community.recycle.score + +this.community.volunteer.score;

    const percentValue = (totalValue / 3).toFixed(2);

    return +percentValue;
  }

  calcEnergyScore() {
    const totalValue = +this.energy.energy.score;

    return +totalValue;
  }

  starRating() {
    const { totalScore, totalPercentage } = this.overAllScore();

    if (totalScore < 0) {
      return 0;
    }

    const percentageDifference = Math.abs((totalScore - 400) / 400) * 100;

    const starRating = Math.round((percentageDifference / 20) * 100) / 100;

    return Math.min(Math.max(starRating, 0), 5).toFixed(2);
  }
}
