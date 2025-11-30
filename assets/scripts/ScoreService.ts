import { _decorator, Component } from 'cc';
import { GameController } from './GameController';
const { ccclass, property } = _decorator;

/**
 * Сервис работы со счётом.
 * Отвечает за изменение очков и уведомление других систем.
 * НЕ содержит UI и не знает, как игра устроена визуально.
 */
@ccclass('ScoreService')
export class ScoreService extends Component {

    @property({ type: GameController })
    public gameController = null; // Ссылка на твой GameController

    /**
     * Увеличиваем очки на N
     */
    public addClickPower() {
        if (this.gameController) {
            this.gameController.clickPower ++;
        }
    }

    public addTimePower() {
        if (this.gameController) {
            this.gameController.autoIncome ++;
        }
    }


    /**
     * Уменьшаем очки на N, если хватает
     * Возвращает true/false для валидации покупки
     */
    public trySpend(amount) {
        if (!this.gameController) return false;

        if (this.gameController.getScore() >= amount) {
            this.gameController.minusScore(amount);
            return true;
        }

        return false;
    }

    /**
     * Получить текущее количество очков
     */
    public getScore() {
        if (this.gameController) {
            return this.gameController.getScore();
        }
        return 0;
    }
}
