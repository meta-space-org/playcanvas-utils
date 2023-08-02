pc.Angle = function(degrees) {
    this._theta = (degrees * pc.Angle.RA) || 0;
    this._normalize();
};

// constant to convert between radians and degrees
pc.Angle.RA = 180 / Math.PI;

pc.Angle.prototype = {
    copy: function(angle) {
        this._theta = angle._theta;
        return this;
    },
    dot: function(angle) {
        return this.x * angle.x + this.y * angle.y;
    },
    lerp: function(angle, speed) {
        var d = this.distance(angle);
        if (!d) return;

        if (Math.abs(d) < speed) {
            this._theta = angle._theta;
            return this;
        }

        this._theta += Math.sign(d) * speed;
        this._normalize();

        return this;
    },
    distance: function(angle) {
        var d = angle._theta - this._theta;

        if (Math.abs(d) > Math.PI)
            return (Math.PI2 - Math.abs(d)) * (-1 * Math.sign(d));

        return d;
    },
    fromVec2: function(vec) {
        if (!(vec instanceof Array))
            vec = vec.data;

        this._theta = Math.atan2(vec[0], vec[1]);
        return this;
    },
    _normalize: function() {
        this._theta -= Math.PI2 * Math.floor((this._theta + Math.PI) / Math.PI2);
        return this;
    }
};

Object.defineProperty(pc.Angle.prototype, 'radians', {
    get: function() {
        return this._theta;
    },
    set: function(value) {
        this._theta = value;
        this._normalize();
    }
});

Object.defineProperty(pc.Angle.prototype, 'degrees', {
    get: function() {
        return this._theta * pc.Angle.RA;
    },
    set: function(value) {
        this._theta = value / pc.Angle.RA;
        this._normalize();
    }
});

Object.defineProperty(pc.Angle.prototype, 'x', {
    get: function() {
        return Math.sin(this._theta);
    }
});

Object.defineProperty(pc.Angle.prototype, 'y', {
    get: function() {
        return Math.cos(this._theta);
    }
});


// pc.Vec2.fromAngle
pc.Vec2.prototype.fromAngle = function(angle) {
    this.data[0] = Math.sin(angle._theta);
    this.data[1] = Math.cos(angle._theta);
    return this;
};


// Math.sign polyfill
Math.sign = Math.sign || function(x) {
    if (x === 0 || isNaN(x))
        return x;

    return x > 0 ? 1 : -1;
};

// Math.PI2
Math.PI2 = Math.PI * 2;
