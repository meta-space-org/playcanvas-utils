// Modify pc.EventHandler so it returns an object with `off` method for easier events detachment.
// If events chaning were ever used in the project, this will be conflicting change.
// Tested with 1.64

pc.EventHandler.prototype._addCallback = function (name, callback, scope, once = false) {
    if (!name || typeof name !== 'string' || !callback)
        return;

    if (!this._callbacks[name])
        this._callbacks[name] = [];

    if (this._callbackActive[name] && this._callbackActive[name] === this._callbacks[name])
        this._callbackActive[name] = this._callbackActive[name].slice();

    let obj = {
        callback: callback,
        scope: scope || this,
        once: once,
        off: () => {
            this.off(name, callback, scope || this);
        }
    };

    this._callbacks[name].push(obj);

    return obj;
};

pc.EventHandler.prototype.on = function (name, callback, scope) {
    return this._addCallback(name, callback, scope, false);
};

pc.EventHandler.prototype.once = function (name, callback, scope) {
    return this._addCallback(name, callback, scope, true);
};
