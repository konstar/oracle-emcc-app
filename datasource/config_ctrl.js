/*
** Copyright © 2020 Oracle and/or its affiliates. All rights reserved.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/
System.register([], function(exports_1) {
    var OracleEMCConfigCtrl;
    return {
        setters:[],
        execute: function() {
            OracleEMCConfigCtrl = (function () {
                function OracleEMCConfigCtrl($scope, datasourceSrv) {
                    this.current.tlsAuth = false;
                    this.current.tlsAuthWithCACert = false;
                    if (this.current.url === '' || this.current.url === undefined) {
                        this.current.url = '';
                    }
                    if (this.current.jsonData.namedCredential === undefined) {
                        this.current.jsonData.namedCredential = '';
                    }
                    if (this.current.jsonData.hostPort === undefined) {
                        this.current.jsonData.hostPort = '';
                    }
                    if (this.current.jsonData.serviceType === undefined || this.current.jsonData.serviceType === '') {
                        this.current.jsonData.serviceType = 'Service Name';
                    }
                    if (this.current.jsonData.serviceName === undefined || this.current.jsonData.serviceName === '') {
                        this.current.jsonData.serviceName = '';
                    }
                    if (this.current.jsonData.tlsSkipVerify === undefined) {
                        this.current.jsonData.tlsSkipVerify = true;
                        this.current.basicAuth = true;
                        this.current.withCredentials = true;
                    }
                    if (this.current.jsonData.remoteConnectionToggle === undefined) {
                        this.current.jsonData.remoteConnectionToggle = false;
                    }
                    this.current.cookieName = '';
                    if (this.current.jsonData.keepCookies === undefined) {
                        this.current.jsonData.keepCookies = [];
                        this.current.cookieName = 'grafana_session';
                        this.addCookie();
                    }
                }
                OracleEMCConfigCtrl.prototype.removeCookie = function (tagName) {
                    this.current.jsonData.keepCookies = this.current.jsonData.keepCookies.filter(function (item) { return item !== tagName; });
                };
                OracleEMCConfigCtrl.prototype.addCookie = function () {
                    this.current.jsonData.keepCookies.push(this.current.cookieName);
                    this.current.cookieName = '';
                };
                OracleEMCConfigCtrl.prototype.clearPassword = function () {
                    this.current['secureJsonData'] = {};
                    this.current.secureJsonData['basicAuthPassword'] = '';
                    this.current.secureJsonFields.basicAuthPassword = false;
                };
                OracleEMCConfigCtrl.prototype.remoteConnection = function () {
                    if (this.current.jsonData.remoteConnectionToggle === true) {
                        this.current.jsonData.serviceType = 'Service Name';
                        this.current.jsonData.hostPort = '';
                        this.current.jsonData.namedCredential = '';
                        this.current.jsonData.serviceName = '';
                    }
                };
                OracleEMCConfigCtrl.prototype.save = function () {
                    if (this.current.url.endsWith("/") === true) {
                        this.current.url = this.current.url;
                    }
                    else {
                        this.current.url = this.current.url + "/";
                    }
                    if (this.current.url.endsWith("em/") === true) {
                        this.current.url = this.current.url.substring(0, this.current.url.indexOf('em/'));
                    }
                };
                OracleEMCConfigCtrl.templateUrl = 'datasource/partials/config.html';
                return OracleEMCConfigCtrl;
            })();
            exports_1("OracleEMCConfigCtrl", OracleEMCConfigCtrl);
        }
    }
});
