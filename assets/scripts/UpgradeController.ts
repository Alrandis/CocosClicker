import { _decorator, Component, Button, Node, Label } from 'cc';
const { ccclass, property } = _decorator;
import { ScoreService } from './ScoreService';

/**
 * Управление апгрейдами.
 * Отвечает только за апгрейд-логику и UI кнопок.
 */
@ccclass('UpgradeController')
export class UpgradeController extends Component {

    @property(ScoreService)
    scoreService = null; // ссылка на ScoreService

    @property(Button)
    upgradeClickButton = null;

    @property(Button)
    upgradeAutoButton = null;

    @property(Label)
    clickUpgradeLabel = null;

    @property(Label)
    autoUpgradeLabel = null;

    // Текущие данные
    clickPower = 1;      // сила клика
    autoIncome = 0;      // пассивный доход
   

    // Стоимости
    clickUpgradeCost = 10;
    autoUpgradeCost = 30;

    start() {
        this.updateButtonUI();

        this.upgradeClickButton.node.on(Node.EventType.TOUCH_START, this.onBuyClickUpgrade, this);
        this.upgradeAutoButton.node.on(Node.EventType.TOUCH_START, this.onBuyAutoUpgrade, this);
    }

    update(deltaTime) {
        if (!this.scoreService) return;

        // Проверяем, хватает ли очков для активации
        let score = this.scoreService.getScore();
        this.upgradeClickButton.interactable = score >= this.clickUpgradeCost;
        this.upgradeAutoButton.interactable = score >= this.autoUpgradeCost;
    }
    
    // -----------------
    // ПОКУПКА АПГРЕЙДОВ
    // -----------------

    onBuyClickUpgrade() {
        if (this.scoreService.trySpend(this.clickUpgradeCost)) {
            this.scoreService.addClickPower();
            this.updateButtonUI();
        }
    }

    onBuyAutoUpgrade() {
        if (this.scoreService.trySpend(this.autoUpgradeCost)) {
            this.scoreService.addTimePower();
            this.updateButtonUI();
        }
    }

    // Обновление текста кнопок
    updateButtonUI() {
        if (this.clickUpgradeLabel)
            this.clickUpgradeLabel.string = `+1 к клику (${this.clickUpgradeCost})`;

        if (this.autoUpgradeLabel)
            this.autoUpgradeLabel.string = `+1/сек (${this.autoUpgradeCost})`;
    }
}
