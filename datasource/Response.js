System.register([], function(exports_1) {
    var TargetTypeNode, TargetTypeResponse, TargetNameNode, TargetNameResponse, MetricGroupNode, MetricGroupResponse, MetricNode, MetricResponse;
    return {
        setters:[],
        execute: function() {
            /*
            ** Copyright © 2020 Oracle and/or its affiliates. All rights reserved.
            ** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
            */
            TargetTypeNode = (function () {
                function TargetTypeNode(displayName, targetType) {
                    this.displayName = displayName;
                    this.targetType = targetType;
                }
                TargetTypeNode.prototype.getDisplayName = function () {
                    return this.displayName;
                };
                TargetTypeNode.prototype.getTargetType = function () {
                    return this.targetType;
                };
                return TargetTypeNode;
            })();
            exports_1("TargetTypeNode", TargetTypeNode);
            TargetTypeResponse = (function () {
                function TargetTypeResponse(items) {
                    this.items = new Array(items.length);
                    for (var i = 0; i < items.length; i++) {
                        this.items[i] = new TargetTypeNode(items[i].displayName, items[i].targetType);
                    }
                }
                return TargetTypeResponse;
            })();
            exports_1("TargetTypeResponse", TargetTypeResponse);
            TargetNameNode = (function () {
                function TargetNameNode(displayName, targetName) {
                    this.displayName = displayName;
                    this.targetName = targetName;
                }
                return TargetNameNode;
            })();
            exports_1("TargetNameNode", TargetNameNode);
            TargetNameResponse = (function () {
                function TargetNameResponse(items) {
                    this.items = items;
                }
                return TargetNameResponse;
            })();
            exports_1("TargetNameResponse", TargetNameResponse);
            MetricGroupNode = (function () {
                function MetricGroupNode(displayName, metricGroup) {
                    this.displayName = displayName;
                    this.metricGroup = metricGroup;
                }
                return MetricGroupNode;
            })();
            exports_1("MetricGroupNode", MetricGroupNode);
            MetricGroupResponse = (function () {
                function MetricGroupResponse(items) {
                    this.items = items;
                }
                return MetricGroupResponse;
            })();
            exports_1("MetricGroupResponse", MetricGroupResponse);
            MetricNode = (function () {
                function MetricNode(displayName, metricGroup) {
                    this.displayName = displayName;
                    this.metric = metricGroup;
                }
                return MetricNode;
            })();
            exports_1("MetricNode", MetricNode);
            MetricResponse = (function () {
                function MetricResponse(items) {
                    this.items = items;
                }
                return MetricResponse;
            })();
            exports_1("MetricResponse", MetricResponse);
        }
    }
});
