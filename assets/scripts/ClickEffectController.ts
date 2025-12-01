import { _decorator, Component, Node, Prefab, instantiate, Vec3, UITransform, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ClickEffectController')
export class ClickEffectController extends Component {

    @property(Node)
    touchArea: Node = null; 
    // Любой UI-Node, который будет реагировать на тапы (обычно весь Canvas)

    @property(Prefab)
    weakEffect: Prefab = null;

    @property(Prefab)
    strongEffect: Prefab = null;

    private lastClickTime: number = 0;
    private fastThreshold: number = 0.17; // меньше 0.5 сек → "быстрый" клик

    onLoad() {
        // Вешаем на зону события нажатия
        this.touchArea.on(Node.EventType.TOUCH_START, this.onClick, this);
    }

    onClick(event) {
        // --- определяем быстрый ли это клик ---
        const now = director.getTotalTime() / 1000; // секунды
        const delta = now - this.lastClickTime;
        const isFast = delta < this.fastThreshold;
        this.lastClickTime = now;

        // --- спавним эффект ---
        this.spawnEffect(event, isFast);
    }

    spawnEffect(event, isFast: boolean) {
        const prefab = isFast ? this.strongEffect : this.weakEffect;
        if (!prefab) return;

        // Получаем позицию тапа в координатах UI
        const uiPos = event.getUILocation();

        // Переводим в локальные координаты touchArea
        const localPos = this.touchArea
            .getComponent(UITransform)
            .convertToNodeSpaceAR(new Vec3(uiPos.x, uiPos.y, 0));

        // Создаём эффект
        const fx = instantiate(prefab);
        fx.setPosition(localPos);
        this.touchArea.addChild(fx);

        // Удаляем через 1.5 сек (если префаб сам не исчезает)
        setTimeout(() => {
            if (fx && fx.isValid) fx.destroy();
        }, 1500);
    }
}
