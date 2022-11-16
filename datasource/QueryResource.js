/*
** Copyright © 2020 Oracle and/or its affiliates. All rights reserved.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/
System.register(['./BaseQueryResource', './Utils'], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var BaseQueryResource_1, Utils_1;
    var QueryResource;
    return {
        setters:[
            function (BaseQueryResource_1_1) {
                BaseQueryResource_1 = BaseQueryResource_1_1;
            },
            function (Utils_1_1) {
                Utils_1 = Utils_1_1;
            }],
        execute: function() {
            QueryResource = (function (_super) {
                __extends(QueryResource, _super);
                function QueryResource(options) {
                    _super.call(this, options);
                    this.namedcredential = options.namedcredential;
                    this.rawQuery = options.rawQuery;
                    this.aliasName = options.target;
                }
                QueryResource.prototype.isAnyValueEmpty = function () {
                    if (this.seriesType.indexOf('(Target)') !== -1) {
                        return _super.prototype.isAnyValueEmpty.call(this)
                            || this.isEmpty(this.namedcredential)
                            || this.isEmpty(this.rawQuery)
                            || (!Utils_1.Utils.isRawQuery(this.rawQuery));
                    }
                    else {
                        return this.isEmpty(this.seriesType) || this.isEmpty(this.rawQuery);
                    }
                };
                QueryResource.prototype.toJSON = function () {
                    var jsonData;
                    if (this.seriesType.indexOf('(Target)') !== -1) {
                        jsonData = _super.prototype.toJSON.call(this);
                        jsonData['targetType'] = this.targetType;
                        jsonData['targetNames'] = this.targetNames;
                        jsonData['namedCreds'] = this.namedcredential.split(',');
                    }
                    else {
                        jsonData = jsonData = _super.prototype.toJSON.call(this);
                    }
                    jsonData['rawQuery'] = this.rawQuery;
                    return jsonData;
                };
                return QueryResource;
            })(BaseQueryResource_1.BaseQueryResource);
            exports_1("QueryResource", QueryResource);
        }
    }
});
