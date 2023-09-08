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
  },
  transport: {
    drive: 0,
    carpool: 0,
    walk: 0,
    cycle: 0,
    train: 0,
    bus: 0,
  },
};

export class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.createdAt = data.createdAt;
    this.travel = data?.travel || defaultTravel;
    this.food = data?.food || 0;
    this.energy = data?.energy || 0;
    this.community = data?.community || 0;
  }

  overAllScore() {
    const totalScore = this.travel + this.food + this.community + this.energy;

    const totalPercentage = totalScore / 4;

    return { totalScore, totalPercentage };
  }

  starRating() {
    // const { totalScore } = this.overAllScore();

    const totalScore = this.travel.flight.score;
    const percentageDifference = Math.abs((totalScore - 400) / 400) * 100;

    const starRating = Math.round((5 - percentageDifference / 20) * 100) / 100;

    return Math.min(Math.max(starRating, 0), 5);
  }
}
