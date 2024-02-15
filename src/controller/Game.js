import Input from '../view/Input.js';
import Output from '../view/Output.js';
import CommonValidator from '../utils/CommonValidator.js';
import CarNamesValidator from '../utils/CarNamesValidator.js';
import TryCountValidator from '../utils/TryCountValidator.js';
import Random from '../utils/Random.js';
import Car from '../model/Car.js';

class Game {
  constructor() {
    this.input = new Input();
    this.output = new Output();
  }

  async startGame() {
    const carNamesMap = await this.getCarNames();
    const tryCount = await this.getTryCount();

    for (let i = 0; i < tryCount; i++) {
      this.playRound(carNamesMap);
      this.output.roundResult(carNamesMap);
    }

    this.output.winnerResult(this.calculateWinner(carNamesMap));
  }

  async getCarNames() {
    while (true) {
      try {
        const carNames = await this.input.inputCarName();

        CommonValidator.inputEmpty(carNames);

        const carNamesArr = carNames.split(',');

        CarNamesValidator.isValidCount(carNamesArr);
        CarNamesValidator.isDuplicate(carNamesArr);

        const carNamesMap = carNamesArr.map((carName) => {
          CarNamesValidator.isValidRange(carName);
          return new Car(carName);
        });

        return carNamesMap;
      } catch (err) {
        console.log(err.message);
      }
    }
  }

  async getTryCount() {
    while (true) {
      try {
        const tryCount = await this.input.inputTryCount();
        TryCountValidator.isNaturalNumber(Number(tryCount));
        return tryCount;
      } catch (err) {
        console.log(err.message);
      }
    }
  }

  playRound(carNamesMap) {
    carNamesMap.forEach((carName) => {
      const randomNumber = Random.pickNumberZeroToNine();
      carName.updateAdvance(randomNumber);
    });
  }

  calculateWinner(carNamesMap) {
    const maxAdvance = Math.max(...carNamesMap.map((carNames) => carNames.getAdvance()));
    return carNamesMap.filter((carNames) => carNames.getAdvance() === maxAdvance);
  }
}

export default Game;