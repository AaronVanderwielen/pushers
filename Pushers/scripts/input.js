"use strict";
var Manager = require('./manager');
var Input = (function () {
    function Input() {
    }
    Input.prototype.clear = function () {
    };
    Input.prototype.bindControls = function (phase) {
        this.clear();
        if (phase == Manager.Phase.Roll)
            this.setupRollPhaseInput();
        if (phase == Manager.Phase.Main)
            this.setupMainPhaseInput();
        if (phase == Manager.Phase.Attack)
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
//# sourceMappingURL=input.js.map