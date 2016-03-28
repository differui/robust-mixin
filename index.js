function isFunction (src) {
    return typeof src === 'function';
}

function toArray(target, start) {
    start = start || 0

    var i = target.length - start;
    var result = [];

    while (i--) {
        result[i] = target[i + start];
    }

    return result;
}

function eachArray (target, callback, context) {
    var i = 0;
    var len = target.length;
    var result = null;

    for (; i < len; i += 1) {
        result = callback.call(context || null, target[i], i, target);

        if (result === false) {
            return;
        }
    }
}

function eachMap (target, callback, context) {
    const keys = target ? Object.keys(target) : [];

    eachArray(keys, function (key) {
        return callback.call(context || null, key, target[key], target);
    });
}

function extend (dest) {
    var srcList = toArray(arguments, 1);

    eachArray(srcList, function (src) {
        if (!src || typeof src !== 'object') {
            return;
        }

        eachMap(src, function (key, value, src) {
            if (src.hasOwnProperty(src, key)) {
                dest[key] = src[key];
            }
        });
    });

    return dest;
}

module.exports = function (dest, opts) {
    var mixins = toArray(arguments, 2);

    if (Array.isArray(mixins[0])) {
        mixins = mixins[0];
    }

    // cache last opts
    dest.opts = opts = opts || {};

    eachArray(mixins, function (mixin) {
        var mixinCopy = null;

        // pre mix
        if (isFunction(mixin.preMix)) {
            mixinCopy = extend({}, mixin);
            mixinCopy.preMix(opts);
        }

        extend(dest, mixinCopy || mixin);

        // post mix
        if (isFunction(mixin.postMix)) {
            mixin.postMix.call(dest, opts);
        }
    });

    return dest;
};
