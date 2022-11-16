System.register(['./EMCCConstants', './Utils', './MetricQueryResource', './QueryResource'], function(exports_1) {
    var EMCCConstants_1, Utils_1, MetricQueryResource_1, QueryResource_1;
    var OracleEMCDatasource;
    return {
        setters:[
            function (EMCCConstants_1_1) {
                EMCCConstants_1 = EMCCConstants_1_1;
            },
            function (Utils_1_1) {
                Utils_1 = Utils_1_1;
            },
            function (MetricQueryResource_1_1) {
                MetricQueryResource_1 = MetricQueryResource_1_1;
            },
            function (QueryResource_1_1) {
                QueryResource_1 = QueryResource_1_1;
            }],
        execute: function() {
            OracleEMCDatasource = (function () {
                /**
                * constructor()
                * @param instanceSettings information in the datasource instance
                * @param backendSrv for making the backend related rest api calls
                *@param templateSrv for making the template variable related information of the dashboard
                */
                /** @ngInject */
                function OracleEMCDatasource(instanceSettings, $q, backendSrv, templateSrv) {
                    //  console.log(instanceSettings);
                    this.type = instanceSettings.type;
                    if (instanceSettings.url.endsWith("/") === true) {
                        this.url = instanceSettings.url;
                    }
                    else {
                        this.url = instanceSettings.url + "/";
                    }
                    if (instanceSettings.url.endsWith("em/") === true) {
                        this.url = this.url.substring(0, this.url.indexOf('em/'));
                    }
                    this.name = instanceSettings.name;
                    this.id = instanceSettings.id;
                    this.backendSrv = backendSrv;
                    this.templateSrv = templateSrv;
                    this.hostPort = instanceSettings.jsonData.hostPort;
                    this.serviceName = instanceSettings.jsonData.serviceName;
                    this.serviceType = instanceSettings.jsonData.serviceType;
                    this.namedCredential = instanceSettings.jsonData.namedCredential;
                    if (instanceSettings.jsonData.remoteConnectionToggle === false) {
                        this.remoteConnection = false;
                    }
                    else {
                        this.remoteConnection = true;
                    }
                    this.headers = { 'Content-Type': 'application/json' };
                    this.gVersion = 0;
                    this.getGrafanaVersion();
                    var version;
                }
                /**
                *getStatusInfo() method to know whether the grafana is enabled in em instance
                */
                OracleEMCDatasource.prototype.getStatusInfo = function () {
                    return this.enableStatus;
                };
                /**
                *updateStatusInfo() calls the rest api for getting the enablestatus of target, repository, grafana enablestatus
                */
                OracleEMCDatasource.prototype.updateStatusInfo = function () {
                    var that = this;
                    return this.doRequest({
                        url: this.url + Utils_1.Utils.getURL('enablestatus'),
                        data: {},
                        method: 'POST'
                    }).then(function (data) {
                        that.enableStatus = data.data;
                        return that.enableStatus;
                    });
                };
                /**
                * query() method is called for performing the EM Site call
                */
                OracleEMCDatasource.prototype.query = function (options) {
                    if (options.targets === undefined || options.targets.length === 0) {
                        return Promise.resolve({ data: [] });
                    }
                    var body = this.buildQueryParameters(options);
                    if (body.length <= 0) {
                        return Promise.resolve({ data: [] });
                    }
                    options.targets = body;
                    var dataBody = {};
                    dataBody['range'] = options.range;
                    dataBody['targets'] = options.targets;
                    return this.doRequest({
                        url: this.url + Utils_1.Utils.getURL('query'),
                        data: dataBody,
                        method: 'POST'
                    });
                };
                /**
                * commasValue() create comma separate string from the array.
                * jsondata : array of values to string
                */
                OracleEMCDatasource.prototype.commasValue = function (array) {
                    var data = '';
                    if (array.length === 0) {
                        return data;
                    }
                    for (var i = 0; i < array.length; i++) {
                        data = data + '\'' + array[i] + '\',';
                    }
                    return data.substring(0, data.length - 1);
                };
                /**
                *replaceTemplateVariable(): replace the template variable in the string
                * @param value string in which the data should be replaced
                * @param templateValues values in the query level values
                * @param options templateValues in the dashboard level templateValues
                * @param type way to replace the values [1,2]
                */
                OracleEMCDatasource.prototype.replaceTemplateVariable = function (value, templateValues, options, type) {
                    if (value === undefined) {
                        return value;
                    }
                    if (type === 2) {
                        if (value.indexOf('\$oem_gf_target_type') !== -1) {
                            var tempTargetType = this.templateSrv.replace('\$oem_gf_target_type', options.scopedVars, null);
                            tempTargetType = tempTargetType === '$oem_gf_target_type' ? templateValues.targettype : tempTargetType;
                            value = value.replace(/\$oem_gf_target_type/gi, '\'' + tempTargetType + '\'');
                        }
                        if (value.indexOf('\$oem_gf_target_name') !== -1) {
                            var tempTargetName = this.templateSrv.replace('\$oem_gf_target_name', options.scopedVars, 'csv').split(",");
                            tempTargetName = tempTargetName === '$oem_gf_target_name' ? templateValues.targetNames : tempTargetName;
                            value = value.replace(/\$oem_gf_target_name/gi, this.commasValue(tempTargetName));
                        }
                        if (value.indexOf('\$oem_gf_namedcredential') !== -1) {
                            var tempNamedCred = this.templateSrv.replace('\$oem_gf_namedcredential', options.scopedVars, null);
                            tempNamedCred = tempNamedCred === '$oem_gf_namedcredential' ? templateValues.namedcredential : tempNamedCred;
                            value = value.replace(/\$oem_gf_namedcredential/gi, '\'' + tempNamedCred + '\'');
                        }
                    }
                    value = this.templateSrv.replace(value, options.scopedVars);
                    value = value.replace(/\$oem_gf_metricgroup/gi, this.checkTemplate(templateValues, 'metricgroup'));
                    value = value.replace(/\$oem_gf_metric/gi, this.checkTemplate(templateValues, 'metric'));
                    value = value.replace(/\$oem_gf_namedcredential/gi, this.checkTemplate(templateValues, 'namedcredential'));
                    value = value.replace(/\$oem_gf_target_name/gi, this.checkTemplate(templateValues, 'targetNames'));
                    return value;
                };
                /**
                * checkTemplate() : check 'value' in the name if not send empty string
                * name : json with key: value
                * value : key search
                */
                OracleEMCDatasource.prototype.checkTemplate = function (name, value) {
                    if (name === undefined || name === '') {
                        return '';
                    }
                    else {
                        return name[value];
                    }
                };
                /**
                * buildQueryParameters() function for building the body for the query method
                */
                OracleEMCDatasource.prototype.buildQueryParameters = function (options) {
                    var that = this;
                    var queryResources = options.targets.map(function (target) {
                        var cloneTarget = target;
                        if (cloneTarget.metric !== undefined) {
                            var openBracketIndex = cloneTarget.metric.lastIndexOf('(');
                            var closeBracketIndex = cloneTarget.metric.lastIndexOf(')');
                            if (openBracketIndex !== -1 && closeBracketIndex !== -1 && openBracketIndex < closeBracketIndex) {
                                cloneTarget.dataType = cloneTarget.metric.substring(openBracketIndex + 1, closeBracketIndex);
                                var metric = cloneTarget.metric.substring(0, openBracketIndex);
                                cloneTarget.metric = metric;
                            }
                            else {
                                cloneTarget.dataType = 'NUMBER';
                            }
                        }
                        if (cloneTarget.seriestype === undefined) {
                            return undefined;
                        }
                        if (cloneTarget.targetName !== null) {
                            var targetcsv = that.templateSrv.replace(cloneTarget.targetName, options.scopedVars, 'csv');
                            cloneTarget.targetNames = targetcsv === '' ? [] : targetcsv.split(",");
                        }
                        cloneTarget.targettype = that.replaceTemplateVariable(cloneTarget.targettype, cloneTarget, options, 1);
                        cloneTarget.target = that.replaceTemplateVariable(cloneTarget.target, cloneTarget, options, 1);
                        cloneTarget.offset = that.replaceTemplateVariable(cloneTarget.offset, cloneTarget, options, 1);
                        var baseClass;
                        if (Utils_1.Utils.getSeriesType(cloneTarget.seriestype) === EMCCConstants_1.EMCCConstants.METRIC_SERIES_TYPE) {
                            baseClass = new MetricQueryResource_1.MetricQueryResource(cloneTarget);
                        }
                        else {
                            cloneTarget.namedcredential = that.replaceTemplateVariable(cloneTarget.namedcredential, cloneTarget, options, 1);
                            cloneTarget.rawQuery = that.replaceTemplateVariable(cloneTarget.rawQuery, cloneTarget, options, 2);
                            cloneTarget.rawQuery = cloneTarget.rawQuery.trim();
                            if (cloneTarget.rawQuery.endsWith(";") === true) {
                                cloneTarget.rawQuery = cloneTarget.rawQuery.substring(0, cloneTarget.rawQuery.length - 1);
                            }
                            baseClass = new QueryResource_1.QueryResource(cloneTarget);
                        }
                        return baseClass;
                    });
                    queryResources = queryResources.filter(function (t) { return t === undefined || (!t.isAnyValueEmpty() && !t.hide); });
                    var body = queryResources.map(function (query) {
                        return query.toJSON();
                    });
                    return body;
                };
                /**
                * doRequest() function for calling the restful webservices
                */
                OracleEMCDatasource.prototype.doRequest = function (options) {
                    var isCompatable = Utils_1.Utils.getCompatibilityDatasource(this.name);
                    if (isCompatable === 0) {
                        var emVersion = Utils_1.Utils.getEMVersionForDatasource(this.name);
                        return new Promise(function (resolve, reject) {
                            throw (Utils_1.Utils.getErrorMsg(emVersion !== '0' ? emVersion : undefined));
                        });
                    }
                    if (isCompatable === 2) {
                        return new Promise(function (resolve, reject) {
                            throw (Utils_1.Utils.getErrorMsg('2'));
                        });
                    }
                    options.headers = this.headers;
                    if (options.data === undefined) {
                        options.data = {};
                    }
                    options.data['pluginVersion'] = EMCCConstants_1.EMCCConstants.PLUGIN_VERSION;
                    options.data['grafanaVersion'] = this.gVersion;
                    options.data['isRemoteConnection'] = this.remoteConnection;
                    if (this.remoteConnection === true) {
                        options.data['remoteConnection'] = {};
                        options.data['remoteConnection']['hostPort'] = this.hostPort;
                        options.data['remoteConnection']['serviceType'] = this.serviceType;
                        options.data['remoteConnection']['serviceName'] = this.serviceName;
                        options.data['remoteConnection']['namedCredential'] = this.namedCredential;
                    }
                    var that = this;
                    return this.backendSrv.datasourceRequest(options)
                        .then(function (response) {
                        if (response.data.valueOf().toString().indexOf('<div class="preloader__text">Loading Grafana</div>') !== -1) {
                            throw ({
                                statusText: "Enterprise Manager Cloud Control is not currently available. The EMGC_OMS server where Cloud Control runs, or some other component, might be down",
                                status: 404,
                                info: "EMC_DOWN"
                            });
                        }
                        return response;
                    }).catch(function (error) {
                        if (error.status === 400 && error.data.message.indexOf("Invalid version") !== -1) {
                            return that.getEMInstanceVersion();
                        }
                        if (error.info !== undefined || error.status !== 404) {
                            throw error;
                        }
                        return that.getEMInstanceVersion();
                    })
                        .then(function (data) {
                        if (data.data !== undefined) {
                            return data;
                        }
                        throw (Utils_1.Utils.getErrorMsg(data));
                    })
                        .catch(function (error) {
                        if (error.info !== undefined && error.info === "EMC_DOWN") {
                            throw error;
                        }
                        if (error.status !== undefined && ([404].indexOf(error.status) === -1)) {
                            throw error;
                        }
                        return that.doRequestWithoutRUVersionCall({
                            url: that.url + Utils_1.Utils.getURL('/'),
                            method: 'POST'
                        }).then(function (response) {
                            Utils_1.Utils.setCompatibilityDatasource(that.name, 0);
                            throw error;
                        })
                            .catch(function (err) {
                            var msg = err.data !== undefined ? err.data.message : '';
                            if (Utils_1.Utils.getErrorMsg('2').statusText === msg) {
                                Utils_1.Utils.setCompatibilityDatasource(that.name, 2);
                            }
                            throw err;
                        });
                    });
                };
                /**
                * doRequestWithoutRUVersionCall() function for calling the restful webservices
                */
                OracleEMCDatasource.prototype.doRequestWithoutRUVersionCall = function (options) {
                    options.headers = this.headers;
                    var that = this;
                    if (options.data === undefined) {
                        options.data = {};
                    }
                    options.data['pluginVersion'] = EMCCConstants_1.EMCCConstants.PLUGIN_VERSION;
                    options.data['grafanaVersion'] = this.gVersion;
                    options.data['isRemoteConnection'] = this.remoteConnection;
                    if (this.remoteConnection === true) {
                        options.data['remoteConnection'] = {};
                        options.data['remoteConnection']['hostPort'] = this.hostPort;
                        options.data['remoteConnection']['serviceType'] = this.serviceType;
                        options.data['remoteConnection']['serviceName'] = this.serviceName;
                        options.data['remoteConnection']['namedCredential'] = this.namedCredential;
                    }
                    return this.backendSrv.datasourceRequest(options)
                        .then(function (response) {
                        if (response.data.valueOf().toString().indexOf('<div class="preloader__text">Loading Grafana</div>') !== -1) {
                            throw ({
                                statusText: "Enterprise Manager Cloud Control is not currently available. The EMGC_OMS server where Cloud Control runs, or some other component, might be down",
                                status: 404
                            });
                        }
                        return response;
                    })
                        .catch(function (error) {
                        throw error;
                    });
                };
                /**
                getGrafanaVersion
                */
                OracleEMCDatasource.prototype.getGrafanaVersion = function () {
                    var that = this;
                    if (this.gVersion === 0) {
                        return this.backendSrv.get('/api/health').then(function (data) {
                            that.gVersion = parseFloat(data.version);
                            return that.gVersion;
                        });
                    }
                    return this.gVersion;
                };
                /**
                getEMInstanceVersion
                */
                OracleEMCDatasource.prototype.getEMInstanceVersion = function () {
                    var that = this;
                    var version = Utils_1.Utils.getEMVersionForDatasource(this.name);
                    if (version !== '-1') {
                        return version;
                    }
                    return this.doRequestWithoutRUVersionCall({
                        url: this.url + Utils_1.Utils.getURL('emruversion'),
                        data: { 'isRemoteConnection': false },
                        method: 'POST'
                    }).then(function (response) {
                        that.emInstanceVersion = response.data.releaseUpdateVersion;
                        var version = Utils_1.Utils.convertVersionToRU(response.data.releaseUpdateVersion);
                        Utils_1.Utils.setEMVersionForDatasource(that.name, version);
                        return version;
                    }).catch(function (error) {
                        Utils_1.Utils.setEMVersionForDatasource(that.name, '0');
                        return '0';
                    });
                };
                /**
                *annotationQuery() function for the annotation query
                */
                OracleEMCDatasource.prototype.annotationQuery = function (options) {
                    throw new Error("Annotation Support not implemented yet.");
                };
                /**
                * metricFindQuery() in-built function called on the template variable
                */
                OracleEMCDatasource.prototype.metricFindQuery = function (options) {
                    options = JSON.parse(options);
                    if (options.type === 'targettype') {
                        var that = this;
                        return this.getTargetTypes().catch(function (err) {
                            if (err.statusText !== undefined) {
                                err.message = err.statusText;
                            }
                            throw err;
                        });
                    }
                    else if (options.type === 'target') {
                        options.targettype = this.templateSrv.replace(options.targettype, null, 'regex');
                        return this.getTargetValues(options.targettype).catch(function (err) {
                            if (err.statusText !== undefined) {
                                err.message = err.statusText;
                            }
                            throw err;
                        });
                    }
                    else if (options.type === 'namedcredential') {
                        options.targettype = this.replaceTemplateVariable(options.targettype, '', options, 1);
                        options.target = this.replaceTemplateVariable(options.target, options, '', 1);
                        return this.getNamedCredentials(options.targettype, options.target).catch(function (err) {
                            if (err.statusText !== undefined) {
                                err.message = err.statusText;
                            }
                            throw err;
                        });
                    }
                };
                /**
                *getTargetTypes function for getting the target types
                */
                OracleEMCDatasource.prototype.getTargetTypes = function () {
                    return this.doRequest({
                        url: this.url + Utils_1.Utils.getURL('targettypes'),
                        method: 'POST',
                    }).then(function (response) {
                        return this.mapToTextValue(response.data, 'targetType');
                    }.bind(this));
                };
                /**
                *getTargetValues() function for getting the targets for the given targetType
                *@param targettype : targettype of the em
                */
                OracleEMCDatasource.prototype.getTargetValues = function (targettype) {
                    targettype = this.templateSrv.replace(targettype);
                    return this.doRequest({
                        url: this.url + Utils_1.Utils.getURL('targets'),
                        data: { "targetType": targettype },
                        method: 'POST'
                    }).then(function (response) {
                        return this.mapToTextValue(response.data, 'targetName');
                    }.bind(this));
                };
                /**
                * getNamedCredentials() function for getting the namedCreds
                *@param targettype : targettype of the em
                *@param targetvalue : target of the targettype
                */
                OracleEMCDatasource.prototype.getNamedCredentials = function (targettype, targetvalue) {
                    targettype = this.templateSrv.replace(targettype);
                    targetvalue = this.templateSrv.replace(targetvalue);
                    return this.doRequest({
                        url: this.url + Utils_1.Utils.getURL('namedcreds'),
                        data: { "targetType": targettype, "targetNames": [targetvalue] },
                        method: 'POST'
                    }).then(function (response) {
                        return this.mapToNamedCreds(response.data[0].namedCreds);
                    }.bind(this));
                };
                /**
                * getMetricGroup() function for getting the metricgroup for the given targettype, target
                *@param targettype : targettype of the em
                *@param targetvalue : target of the targettype
                */
                OracleEMCDatasource.prototype.getMetricGroup = function (targettype, targetvalue) {
                    targettype = this.templateSrv.replace(targettype);
                    targetvalue = this.templateSrv.replace(targetvalue, null, 'csv').split(",");
                    return this.doRequest({
                        url: this.url + Utils_1.Utils.getURL('metricgroups'),
                        data: { "targetType": targettype, "targetNames": targetvalue },
                        method: 'POST'
                    }).then(function (response) {
                        var data = response.data;
                        data = data.map(function (a) { return { 'displayName': a.displayName, 'metricGroup': a.metricGroup }; })
                            .sort(function (a, b) { return a.displayName.localeCompare(b.displayName); })
                            .filter(function (currentValue, index, arr) {
                            if (index === 0) {
                                return true;
                            }
                            return !(currentValue.displayName === arr[index - 1].displayName);
                        });
                        return this.mapToTextValue(data, 'metricGroup');
                    }.bind(this));
                };
                /**
                * getMetrics() function for getting the metricgroup for the given targettype, target, metricgroup
                *@param targettype : targettype of the em
                *@param targetvalue : target of the targettype
                *@param metricgroup : metricgroup of the given targettype, target
                */
                OracleEMCDatasource.prototype.getMetrics = function (seriestype, targettype, targetvalue, metricgroup) {
                    targettype = this.templateSrv.replace(targettype);
                    metricgroup = this.templateSrv.replace(metricgroup);
                    targetvalue = this.templateSrv.replace(targetvalue, null, 'csv').split(",");
                    return this.doRequest({
                        url: this.url + Utils_1.Utils.getURL('metrics'),
                        data: { "seriesType": seriestype, "targetType": targettype, "targetNames": targetvalue, "metricGroup": metricgroup },
                        method: 'POST'
                    }).then(function (response) {
                        if (response.data.indexOf('<div class="preloader__text">Loading Grafana</div>') !== -1) {
                            throw (response);
                        }
                        var data = response.data;
                        data = data.map(function (a) { return { 'displayName': a.displayName, 'metricName': a.metricName, 'dataType': a.dataType }; })
                            .sort(function (a, b) { return a.displayName.localeCompare(b.displayName); })
                            .filter(function (currentValue, index, arr) {
                            if (index === 0) {
                                return true;
                            }
                            return !(currentValue.displayName === arr[index - 1].displayName);
                        });
                        return this.mapToTextValue(data, 'metricName');
                    }.bind(this));
                };
                /**
                * testDatasource() function for testing the em site connection status
                */
                OracleEMCDatasource.prototype.testDatasource = function () {
                    return this.doRequest({
                        url: this.url + Utils_1.Utils.getURL('/'),
                        method: 'POST'
                    }).then(function (response) {
                        if (response !== undefined && response.status !== undefined && response.status === 200) {
                            return { status: "success", message: response.data, title: "Success" };
                        }
                        else {
                            console.log("Now ERROR");
                            return { status: "Error", message: response.data, title: "Error" };
                        }
                    })
                        .catch(function (err) {
                        console.log(err);
                        if (err.data !== undefined && err.data.message !== undefined) {
                            return { status: "Error", message: err.data.message, title: "Error" };
                        }
                        else {
                            return { status: "Error", message: err.statusText, title: "Error" };
                        }
                    });
                };
                /**
                * mapToTextValue() converting the plain array into {text,value} format for each value in array
                * @param data : array of text, displayname
                * @param type : type of data[type]
                */
                OracleEMCDatasource.prototype.mapToTextValue = function (data, type) {
                    return data.map(function (d) {
                        if (d && d.displayName && d[type]) {
                            if (type === 'targetType') {
                                return { 'text': d[type], 'value': d[type] };
                            }
                            else if (type === 'targetName') {
                                return { 'text': d[type], 'value': d[type] };
                            }
                            else if (type === 'metricName') {
                                var displayName = d.displayName;
                                displayName = d.dataType === undefined ? displayName : displayName + '(' + d.dataType + ')';
                                return { 'text': displayName, 'value': d[type] + '(' + d.dataType + ')' };
                            }
                            else {
                                return { 'text': d.displayName, 'value': d[type] };
                            }
                        }
                        return { 'text': d, 'value': d };
                    });
                };
                /**
                * mapToTextValue() converting the plain array from the namedCreds into {text,value} pair
                * @param data : array of text, displayname
                */
                OracleEMCDatasource.prototype.mapToNamedCreds = function (data) {
                    return data.map(function (d) {
                        if (d && d.credName && d.credScope) {
                            if (d.credScope === 'instance') {
                                return { 'text': d.credName, 'value': d.credName };
                            }
                            else {
                                return { 'text': d.credName + '(' + d.credScope + ')', 'value': d.credName };
                            }
                        }
                        else {
                            return { 'text': d, 'value': d };
                        }
                    });
                };
                return OracleEMCDatasource;
            })();
            exports_1("OracleEMCDatasource", OracleEMCDatasource);
        }
    }
});
