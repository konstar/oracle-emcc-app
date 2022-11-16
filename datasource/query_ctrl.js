System.register(['./EMCCConstants', './Utils'], function(exports_1) {
    var EMCCConstants_1, Utils_1;
    var OracleEMCQueryCtrl;
    return {
        setters:[
            function (EMCCConstants_1_1) {
                EMCCConstants_1 = EMCCConstants_1_1;
            },
            function (Utils_1_1) {
                Utils_1 = Utils_1_1;
            }],
        execute: function() {
            OracleEMCQueryCtrl = (function () {
                /** @ngInject **/
                function OracleEMCQueryCtrl($scope, $injector, templateSrv) {
                    this.templateSrv = templateSrv;
                    this.defaults = {};
                    this.panelCtrl = this.panelCtrl || { panel: {} };
                    this.target = this.target || { target: '' };
                    this.panel = this.panelCtrl.panel;
                    //_.defaultsDeep(this.target, this.defaults);
                    this.$scope = $scope;
                    this.target.Utils = Utils_1.Utils;
                    this.target.constants = EMCCConstants_1.EMCCConstants;
                    this.target.loading = {};
                    this.target.loading.target = true;
                    this.target.loading.metricgroup = true;
                    this.target.loading.metric = true;
                    this.target.loading.targettype = true;
                    this.target.loading.namedcredential = true;
                    this.target.loading.seriestype = true;
                    if (this.target.target === undefined || this.target.target === '') {
                        this.target.target = Utils_1.Utils.getAliasName(this.target.seriestype);
                    }
                    if (this.target.type === undefined) {
                        this.target.type = 'Time series';
                        this.changeType();
                    }
                    if (this.target.namedcredential === undefined) {
                        this.target.namedcredential = '';
                    }
                    if (this.target.rawQuery === '' || this.target.rawQuery === undefined) {
                        this.target.rawQuery = EMCCConstants_1.EMCCConstants.QUERY_RAW_QUERY_DATA;
                        this.target.rawQueryPlaceholder = EMCCConstants_1.EMCCConstants.QUERY_RAW_QUERY_DATA;
                    }
                    if (this.target.value === '' || this.target.value === undefined) {
                        this.target.value = Utils_1.Utils.getSeriesList()[0];
                    }
                    if (this.target.lastError === undefined) {
                        this.target.lastError = '';
                    }
                    if (this.target.offset === undefined) {
                        this.target.offset = '';
                    }
                    if (this.target.values === undefined) {
                        this.target.values = Utils_1.Utils.getTargetMetricsValues();
                    }
                    this.target.lastError = '';
                    this.panelCtrl.events.on('data-error', this.onDataError.bind(this), $scope);
                    if (this.target.seriestype === undefined) {
                        this.target.seriestype = '';
                    }
                }
                OracleEMCQueryCtrl.prototype.mapToTextValue = function (data) {
                    return data.map(function (d) {
                        if (d && d.value) {
                            return { text: d.value, value: d.value };
                        }
                        return { text: d, value: d };
                    });
                };
                OracleEMCQueryCtrl.prototype.isLoadingVisible = function () {
                    if (this.target.loading.target || this.target.loading.targettype) {
                        return true;
                    }
                    else {
                        return false;
                    }
                };
                OracleEMCQueryCtrl.prototype.onDataError = function (err) {
                    console.log(this.target.refId);
                    console.log(err);
                    if (err.data && err.data.refId && err.data.refId === this.target.refId) {
                        this.target.lastError = err.data.message;
                    }
                    this.panelCtrl.panel.render([]);
                };
                OracleEMCQueryCtrl.prototype.changeType = function () {
                    var that = this;
                    this.target.lastError = '';
                    this.target.loading.seriestype = false;
                    that.target.seriestypes = [];
                    this.datasource.updateStatusInfo()
                        .then(function (data) {
                        that.target.seriestypes = Utils_1.Utils.getSeriesTypes(that.target.type, data);
                        that.hideLoader();
                        if (that.datasource.getGrafanaVersion() >= 6.7) {
                            that.$scope.$digest();
                        }
                    }).catch(function (err) {
                        console.log(err);
                        that.setError(err);
                        that.hideLoader();
                        if (that.datasource.getGrafanaVersion() >= 6.7) {
                            that.$scope.$digest();
                        }
                    });
                    this.target.seriestype = '';
                };
                OracleEMCQueryCtrl.prototype.getValues = function () {
                    return this.target.values;
                };
                OracleEMCQueryCtrl.prototype.setTargets = function (data) {
                    this.target.targets = data;
                    this.templateSrv.replace('$oem_gf_target_name') !== '$oem_gf_target_name' ? this.target.targets.unshift({ 'text': '$oem_gf_target_name', 'value': '$oem_gf_target_name' }) : '';
                };
                OracleEMCQueryCtrl.prototype.setMetricGroup = function (data) {
                    this.target.metricgroups = data;
                };
                OracleEMCQueryCtrl.prototype.setNamedCredentials = function (data) {
                    this.target.namedcredentials = data;
                    this.templateSrv.replace('$oem_gf_named_credential') !== '$oem_gf_named_credential' ? this.target.namedcredentials.unshift({ 'text': '$oem_gf_named_credential', 'value': '$oem_gf_named_credential' }) : '';
                };
                OracleEMCQueryCtrl.prototype.getNamedCredentials = function (data) {
                    return this.target.namedcredentials;
                };
                OracleEMCQueryCtrl.prototype.setMetrics = function (data) {
                    this.target.metrics = data;
                };
                OracleEMCQueryCtrl.prototype.setError = function (data) {
                    var errorMsg = '';
                    this.target.lastError = '';
                    if (data === null && data === '') {
                        return;
                    }
                    if (data.statusText !== undefined) {
                        errorMsg = data.statusText;
                    }
                    if (typeof (data.data) !== undefined && data.data !== null && data.data !== '' && data.status !== 404) {
                        if (typeof (data.data) === typeof ("") && data.data.indexOf('<div class="preloader__text">Loading Grafana</div>') !== -1) {
                            errorMsg = "Enterprise Manager Cloud Control is not currently available. The EMGC_OMS server where Cloud Control runs, or some other component, might be down";
                        }
                        else {
                            errorMsg = errorMsg + ' Reference Id : ' + data.data.refId + '  :  ' + data.data.message;
                        }
                    }
                    this.target.lastError = errorMsg;
                };
                OracleEMCQueryCtrl.prototype.getTargetTypes = function () {
                    var that = this;
                    this.target.lastError = '';
                    this.target.loading.targettype = false;
                    this.target.targettypes = [];
                    this.datasource.getTargetTypes()
                        .then(function (data) {
                        if (that.target.seriestype.endsWith('(Target)')) {
                            var list = ['oracle_database', 'rac_database', 'oracle_pdb', 'oracle_cloud_atp', 'oracle_cloud_adw'];
                            for (var i = 0; i < list.length; i++) {
                                for (var j = 0; j < data.length; j++) {
                                    if (data[j].text === list[i]) {
                                        that.target.targettypes.unshift(data[j]);
                                    }
                                }
                            }
                        }
                        else {
                            that.target.targettypes = data;
                        }
                        that.templateSrv.replace('$oem_gf_target_type') !== '$oem_gf_target_type' ? that.target.targettypes.unshift({ 'text': '$oem_gf_target_type', 'value': '$oem_gf_target_type' }) : '';
                        that.hideLoader();
                        if (that.datasource.getGrafanaVersion() >= 6.7) {
                            that.$scope.$digest();
                        }
                    })
                        .catch(function (err) {
                        that.setError(err);
                        that.hideLoader();
                        if (that.datasource.getGrafanaVersion() >= 6.7) {
                            that.$scope.$digest();
                        }
                    });
                };
                OracleEMCQueryCtrl.prototype.getMetricGroup = function () {
                    return this.target.metricgroups;
                };
                OracleEMCQueryCtrl.prototype.getSeriesTypes = function () {
                    return this.target.seriestypes;
                };
                OracleEMCQueryCtrl.prototype.getMetrics = function () {
                    return this.target.metrics;
                };
                OracleEMCQueryCtrl.prototype.getTargets = function () {
                    return this.target.targets;
                };
                OracleEMCQueryCtrl.prototype.setRawQuery = function (data) {
                    if (data === undefined || data === '') {
                        if (Utils_1.Utils.isTimeseriesCustomQuery(this.target.seriestype)) {
                            this.target.rawQuery = EMCCConstants_1.EMCCConstants.QUERY_RAW_QUERY_DATA;
                            this.target.rawQueryPlaceholder = EMCCConstants_1.EMCCConstants.QUERY_RAW_QUERY_DATA;
                        }
                        else {
                            this.target.rawQuery = EMCCConstants_1.EMCCConstants.QUERY_GENERAL_DATA;
                            this.target.rawQueryPlaceholder = EMCCConstants_1.EMCCConstants.QUERY_GENERAL_DATA;
                        }
                    }
                    else {
                        this.target.rawQuery = data;
                    }
                    this.target.value = Utils_1.Utils.getTargetMetricsValues()[0];
                };
                OracleEMCQueryCtrl.prototype.changeSeries = function ($query) {
                    var that = this;
                    that.target.targettype = '';
                    that.target.targetName = '';
                    that.target.metricgroup = '';
                    that.target.namedcredential = '';
                    that.target.metric = '';
                    that.setRawQuery('');
                    that.target.targettypes = [];
                    that.target.targets = [];
                    that.target.metrics = [];
                    that.target.metricgroups = [];
                    that.target.namedcredentials = [];
                    if (!this.target.seriestype.endsWith('(Repository)')) {
                        that.getTargetTypes();
                    }
                    if (that.target.seriestype === EMCCConstants_1.EMCCConstants.JVMD_METRICS_SERIES_TYPE) {
                        that.target.values = Utils_1.Utils.getTargetValuesFroJVMDMetrics();
                        that.target.value = that.target.values[0];
                    }
                    else {
                        that.target.values = Utils_1.Utils.getTargetMetricsValues();
                        that.target.value = that.target.values[0];
                    }
                    that.target.target = Utils_1.Utils.getAliasName(that.target.seriestype);
                    //that.refresh();
                };
                OracleEMCQueryCtrl.prototype.changeTargets = function ($query) {
                    var that = this;
                    that.setTargets([]);
                    this.target.lastError = '';
                    if (this.target.targettype.startsWith('$') === false) {
                        that.target.targetName = '';
                        that.target.metricgroup = '';
                        that.target.metricgroups = [];
                        that.target.metric = '';
                        that.target.metrics = [];
                        that.target.namedcredential = '';
                        that.target.namedcredentials = [];
                    }
                    that.target.loading.target = false;
                    return this.datasource.getTargetValues(this.target.targettype)
                        .then(function (data) {
                        that.setTargets(data);
                        that.hideLoader();
                        if (that.datasource.getGrafanaVersion() >= 6.7) {
                            that.$scope.$digest();
                        }
                        return data;
                    }).catch(function (err) {
                        that.setError(err);
                        that.hideLoader();
                        if (that.datasource.getGrafanaVersion() >= 6.7) {
                            that.$scope.$digest();
                        }
                    });
                };
                OracleEMCQueryCtrl.prototype.changeTargetValue = function ($query) {
                    this.target.targetName = '';
                    this.target.metricgroup = '';
                    this.target.metric = '';
                    this.target.namedcredential = '';
                    this.target.targettype = '';
                    if (!(this.target.seriestype).endsWith('(Repository)')) {
                        this.target.rawQuery = EMCCConstants_1.EMCCConstants.QUERY_RAW_QUERY_DATA;
                    }
                };
                OracleEMCQueryCtrl.prototype.changeMetricGroup = function ($query) {
                    var that = this;
                    this.target.lastError = '';
                    if (that.target.targetName.startsWith('$') === false) {
                        that.target.metricgroup = '';
                        that.target.metric = '';
                        that.target.metrics = [];
                    }
                    that.target.loading.metricgroup = false;
                    this.datasource.getMetricGroup(this.target.targettype, this.target.targetName)
                        .then(function (data) {
                        that.setMetricGroup(data);
                        that.hideLoader();
                        if (that.datasource.getGrafanaVersion() >= 6.7) {
                            that.$scope.$digest();
                        }
                        //that.refresh();
                        return data;
                    })
                        .catch(function (err) {
                        that.setError(err);
                        that.hideLoader();
                        if (that.datasource.getGrafanaVersion() >= 6.7) {
                            that.$scope.$digest();
                        }
                    });
                };
                OracleEMCQueryCtrl.prototype.hideLoader = function () {
                    this.target.loading.target = true;
                    this.target.loading.metricgroup = true;
                    this.target.loading.metric = true;
                    this.target.loading.targettype = true;
                    this.target.loading.namedcredential = true;
                    this.target.loading.seriestype = true;
                };
                OracleEMCQueryCtrl.prototype.changeMetrics = function ($query) {
                    var that = this;
                    this.target.lastError = '';
                    that.target.metric = '';
                    this.target.loading.metric = false;
                    this.datasource.getMetrics(this.target.seriestype, this.target.targettype, this.target.targetName, this.target.metricgroup)
                        .then(function (data) {
                        that.setMetrics(data);
                        that.hideLoader();
                        if (that.datasource.getGrafanaVersion() >= 6.7) {
                            that.$scope.$digest();
                        }
                        return data;
                    }).catch(function (err) {
                        console.log(err);
                        that.setError(err);
                        that.hideLoader();
                        if (that.datasource.getGrafanaVersion() >= 6.7) {
                            that.$scope.$digest();
                        }
                    });
                };
                OracleEMCQueryCtrl.prototype.changeBasedOnSeries = function ($query) {
                    if (Utils_1.Utils.getSeriesType(this.target.seriestype) === EMCCConstants_1.EMCCConstants.METRIC_SERIES_TYPE) {
                        this.changeMetricGroup($query);
                    }
                    else {
                        this.changeNamedCredentials($query);
                    }
                };
                OracleEMCQueryCtrl.prototype.changeNamedCredentials = function ($query) {
                    var that = this;
                    that.setRawQuery('');
                    that.target.namedcredential = '';
                    that.target.namedcredentials = [];
                    that.target.loading.namedcredential = false;
                    this.datasource.getNamedCredentials(this.target.targettype, this.target.targetName)
                        .then(function (data) {
                        data = data.filter(function (t) { return t === undefined || !t.text.endsWith('(global)'); });
                        data.sort(function (nc1, nc2) {
                            if (nc1.text.endsWith('(preferred)') && nc2.text.endsWith('(preferred)')) {
                                return 0;
                            }
                            else if (nc1.text.endsWith('(preferred)')) {
                                return -1;
                            }
                            else {
                                return 1;
                            }
                        });
                        that.setNamedCredentials(data);
                        that.hideLoader();
                        if (that.datasource.getGrafanaVersion() >= 6.7) {
                            that.$scope.$digest();
                        }
                        return data;
                    }).catch(function (err) {
                        console.log(err);
                        that.setError(err);
                        that.hideLoader();
                        if (that.datasource.getGrafanaVersion() >= 6.7) {
                            that.$scope.$digest();
                        }
                    });
                };
                OracleEMCQueryCtrl.prototype.changerawQuery = function ($query) {
                    this.setRawQuery('');
                };
                OracleEMCQueryCtrl.prototype.onChangeInternal = function ($query) {
                    this.target.lastError = '';
                    this.panelCtrl.refresh(); // Asks the panel to refresh data.
                };
                OracleEMCQueryCtrl.templateUrl = 'datasource/partials/query.editor.html';
                return OracleEMCQueryCtrl;
            })();
            exports_1("OracleEMCQueryCtrl", OracleEMCQueryCtrl);
        }
    }
});
