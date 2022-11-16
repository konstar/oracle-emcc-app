/*
** Copyright © 2020 Oracle and/or its affiliates. All rights reserved.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/
System.register(['./BaseQueryResource', './EMCCConstants'], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var BaseQueryResource_1, EMCCConstants_1;
    var MetricQueryResource;
    return {
        setters:[
            function (BaseQueryResource_1_1) {
                BaseQueryResource_1 = BaseQueryResource_1_1;
            },
            function (EMCCConstants_1_1) {
                EMCCConstants_1 = EMCCConstants_1_1;
            }],
        execute: function() {
            MetricQueryResource = (function (_super) {
                __extends(MetricQueryResource, _super);
                function MetricQueryResource(options) {
                    _super.call(this, options);
                    this.metricGroup = options.metricgroup;
                    this.metric = options.metric;
                    this.seriesValue = options.value;
                    this.dataType = options.dataType;
                    // if (options.target === undefined || options.target==='' || options.target.trim()==='') {
                    //   this.aliasName= this.metricGroup+'_'+this.metric;
                    // }else
                    {
                        this.aliasName = options.target;
                    }
                }
                MetricQueryResource.prototype.isAnyValueEmpty = function () {
                    return _super.prototype.isAnyValueEmpty.call(this) || this.isEmpty(this.metricGroup) || this.isEmpty(this.metric);
                };
                MetricQueryResource.prototype.toJSON = function () {
                    var jsonData = _super.prototype.toJSON.call(this);
                    jsonData['metricGroup'] = this.metricGroup;
                    jsonData['metric'] = this.metric;
                    jsonData['value'] = this.seriesValue;
                    jsonData['targetType'] = this.targetType;
                    jsonData['targetNames'] = this.targetNames;
                    if (this.seriesType === EMCCConstants_1.EMCCConstants.EM_METRICS_RAW_SERIES_TYPE) {
                        jsonData['value'] = "blank";
                    }
                    if (this.seriesType === EMCCConstants_1.EMCCConstants.EM_METRICS_RAW_SERIES_TYPE) {
                        jsonData['metricDataType'] = this.dataType;
                    }
                    return jsonData;
                };
                return MetricQueryResource;
            })(BaseQueryResource_1.BaseQueryResource);
            exports_1("MetricQueryResource", MetricQueryResource);
        }
    }
});
