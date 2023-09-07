export class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.createdAt = data.createdAt;
    this.travelScore = data?.travel;
    this.foodScore = data?.food;
    this.energyScore = data?.energy;
    this.communityScore = data?.community;
  }

  overAllScore() {
    const totalScore =
      this.travelScore +
      this.foodScore +
      this.communityScore +
      this.energyScore;

    const totalPercentage = totalScore / 4;

    return { totalScore, totalPercentage };
  }

  starRating() {
    const { totalScore } = this.overAllScore();

    const percentageDifference = Math.abs((totalScore - 400) / 400) * 100;

    const starRating = Math.round((5 - percentageDifference / 20) * 100) / 100;

    return Math.min(Math.max(starRating, 0), 5);
  }
}
