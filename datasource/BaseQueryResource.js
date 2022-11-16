/*
** Copyright © 2020 Oracle and/or its affiliates. All rights reserved.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/
System.register([], function(exports_1) {
    var BaseQueryResource;
    return {
        setters:[],
        execute: function() {
            BaseQueryResource = (function () {
                function BaseQueryResource(options) {
                    this.seriesType = options.seriestype;
                    this.refId = options.refId;
                    this.hide = options.hide === undefined ? false : options.hide;
                    this.offset = options.offset;
                    this.targetType = options.targettype;
                    this.targetNames = options.targetNames;
                }
                BaseQueryResource.prototype.toJSON = function () {
                    var jsonData = {
                        seriesType: this.seriesType,
                        refId: this.refId,
                        value: "blank",
                        offset: this.offset,
                        target: this.aliasName
                    };
                    return jsonData;
                };
                BaseQueryResource.prototype.isEmpty = function (value) {
                    return value === '' || value === undefined;
                };
                BaseQueryResource.prototype.isAnyValueEmpty = function () {
                    return this.isEmpty(this.seriesType) || this.isEmpty(this.targetType) || this.isEmpty(this.targetNames) || this.targetNames.length === 0;
                };
                return BaseQueryResource;
            })();
            exports_1("BaseQueryResource", BaseQueryResource);
        }
    }
});
