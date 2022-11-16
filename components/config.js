/*
** Copyright © 2020 Oracle and/or its affiliates. All rights reserved.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/
System.register([], function(exports_1) {
    var OracleConfigCtrl;
    return {
        setters:[],
        execute: function() {
            OracleConfigCtrl = (function () {
                /** @ngInject */
                function OracleConfigCtrl($scope, $injector, backendSrv) {
                    this.appEditCtrl.setPostUpdateHook(this.postUpdate.bind(this));
                }
                OracleConfigCtrl.prototype.postUpdate = function () {
                    if (!this.appModel.enabled) {
                        return new Promise(function (resolve, reject) {
                            resolve();
                        });
                    }
                    return this.appEditCtrl.importDashboards()
                        .then(function () {
                        console.log("imported dashboards");
                    });
                };
                OracleConfigCtrl.templateUrl = 'components/partials/config.html';
                return OracleConfigCtrl;
            })();
            exports_1("OracleConfigCtrl", OracleConfigCtrl);
        }
    }
});
