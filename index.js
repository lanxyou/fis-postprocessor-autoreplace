/**
 * @file fis替换文本插件
 */

'use strict';

var replaceContent = function (content, file, rule) {
    var reg = rule.from;
    var exclude = rule.exclude;

    if (exclude) {
        if (typeof exclude === 'string') {
            exclude = new RegExp(fis.util.escapeReg(exclude));
        }

        try {
            if (exclude.test(file.fullname)) {
                return content;
            }
        }
        catch (e) {
            fis.log.error('invalid settings.postprocessor.replacer.exclude[' + exclude + ']');
        }
    }

    if (typeof reg === 'string') {
        reg = new RegExp(fis.util.escapeReg(reg), 'g');
    } else if (!reg instanceof RegExp) {
        fis.log.error('invalid settings.postprocessor.replacer.from [' + reg + ']');
    }

    return content.replace(reg, rule.to);
};

module.exports = function (content, file, conf) {
    if (fis.util.is(conf, 'Array')) {
        fis.util.map(conf, function(i, rule) {
            content = replaceContent(content, file, rule);
        });
    }
    else if (fis.util.is(conf, 'Object')) {
        content = replaceContent(content, file, conf);
    }

    return content;
};
