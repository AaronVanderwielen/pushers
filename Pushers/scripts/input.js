define(["require", "exports", './gameLib'], function (require, exports, Lib) {
    "use strict";
    var Input = (function () {
        function Input() {
        }
        Input.prototype.clear = function () {
        };
        Input.prototype.bindControls = function (phase) {
            this.clear();
            if (phase == Lib.TurnPhase.Roll)
                this.setupRollPhaseInput();
            if (phase == Lib.TurnPhase.Main)
                this.setupMainPhaseInput();
            if (phase == Lib.TurnPhase.Attack)
                this.setupAttackPhaseInput();
        };
        Input.prototype.setupRollPhaseInput = function () {
        };
        Input.prototype.setupMainPhaseInput = function () {
        };
        Input.prototype.setupAttackPhaseInput = function () {
        };
        return Input;
    }());
    exports.Input = Input;
});
//# sourceMappingURL=input.js.map