import Manager = require('./manager');

export class Input {

    constructor() {
    }

    clear() {
    }

    bindControls(phase: Manager.Phase) {
        this.clear();

        if (phase == Manager.Phase.Roll) this.setupRollPhaseInput();
        if (phase == Manager.Phase.Main) this.setupMainPhaseInput();
        if (phase == Manager.Phase.Attack) this.setupAttackPhaseInput();
    }

    setupRollPhaseInput() {
    }

    setupMainPhaseInput() {
    }

    setupAttackPhaseInput() {
    }
}