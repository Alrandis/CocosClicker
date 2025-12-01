import { _decorator, Component, Node, Label, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {

    @property({ type: Label })
    public scoreLabel: Label | null = null;
    @property({ type: Node })
    public clickerNode: Node | null = null;

    private score: number = 0; // Обычная переменная счета
    clickPower = 1; 
    autoIncome = 0; 
    time = 0;            // таймер для авто-инкома

    // --- МЕТОДЫ ЖИЗНЕННОГО ЦИКЛА ---

    start() {
        // Проверяем, назначил ли ты ноду в редакторе (защита от null)
        if (this.clickerNode) {
            // ПОДПИСКА НА СОБЫТИЯ
            // Node.EventType.TOUCH_START - срабатывает при нажатии пальцем или клике мышкой.
            this.clickerNode.on(Node.EventType.TOUCH_START, this.onClick, this);
        }

        this.updateScoreUI();
    }

    update(deltaTime) {
        // Пассивный доход
        if (this.autoIncome > 0) {
            this.time += deltaTime;
            if (this.time >= 1) {
                this.score += this.autoIncome;
                this.updateScoreUI();
                this.time = 0;
            }
        }
    }

    // Метод, который вызывается при клике
    private onClick() {
        // 1. Увеличиваем счет
        this.addScore();

        // 3. Запускаем анимацию (Tween)
        this.playBounceAnimation();
    }

    private updateScoreUI() {
        if (this.scoreLabel) {
            this.scoreLabel.string = this.score.toString();
        }
    }

    public getScore() {
        return this.score;
    }

    public addScore() {
        this.score += this.clickPower;
        this.updateScoreUI();
    }

    public minusScore(amount) {
        this.score -= amount;
        this.updateScoreUI();
    }

    // --- АНИМАЦИЯ (Tweening) ---
    private playBounceAnimation() {
        if (!this.clickerNode) return;

        // Останавливаем предыдущие твины на этом объекте, чтобы они не накладывались
        tween(this.clickerNode).stop();

        tween(this.clickerNode)
            .to(0.1, { scale: new Vec3(1.2, 1.2, 1.0) }) // Увеличиваем
            .to(0.1, { scale: new Vec3(1.0, 1.0, 1.0) }) // Возвращаем
            .start(); 
    }

    // Важно отписываться от событий, если объект уничтожается, хотя при смене сцен движок чистит сам.
    protected onDisable() {
        if (this.clickerNode?.isValid) {
            this.clickerNode.off(Node.EventType.TOUCH_START, this.onClick, this);
        }
    }
}


