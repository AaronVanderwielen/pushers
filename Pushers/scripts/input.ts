import Lib = require('./gameLib');

export class Input {

    constructor() {
    }

    clear() {
    }

    bindControls(phase: Lib.TurnPhase) {
        this.clear();

        if (phase == Lib.TurnPhase.Roll) this.setupRollPhaseInput();
        if (phase == Lib.TurnPhase.Main) this.setupMainPhaseInput();
        if (phase == Lib.TurnPhase.Attack) this.setupAttackPhaseInput();
    }

    setupRollPhaseInput() {
    }

    setupMainPhaseInput() {
    }

    setupAttackPhaseInput() {
    }
}