function isFunction (src) {
    return typeof src === 'function';
}

function toArray() {
    start = start || 0

    var i = target.length - start;
    var result = [];

    while (i--) {
        result[i] = target[i + start];
    }

    return result;
}

function each (target, callback, context) {
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

function extend (dest) {
    var srcList = toArray(arguments, 1);

    each(srcList, function (src) {
        if (!src || typeof src !== 'object') {
            return;
        }

        mapEach(src, function (key, value, src) {
            if (src.hasOwnProperty(src, key)) {
                dest[key] = src[key];
            }
        });
    });

    return dest;
}

module.exports = function (dest, opts) {
    var mixins = toArray(arguments, 2);

    // cache last opts
    dest.opts = opts = opts || {};

    each(mixins, function (mixin) {
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