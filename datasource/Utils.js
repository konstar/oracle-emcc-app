System.register(['./EMCCConstants'], function(exports_1) {
    var EMCCConstants_1;
    var Utils;
    return {
        setters:[
            function (EMCCConstants_1_1) {
                EMCCConstants_1 = EMCCConstants_1_1;
            }],
        execute: function() {
            Utils = (function () {
                function Utils() {
                }
                /**
                * set the datasource name and compatiblity information
                */
                Utils.setCompatibilityDatasource = function (name, isCompatable) {
                    Utils.compatibilityDatasourceMap[name] = isCompatable;
                };
                /**
                * get compatiblity information of the datasource
                * -1 if not information is there
                * 0 if not compatiblity is there
                * 1 if compatiblity is there
                */
                Utils.getCompatibilityDatasource = function (name) {
                    if (Utils.compatibilityDatasourceMap[name] === undefined) {
                        return -1;
                    }
                    else {
                        return Utils.compatibilityDatasourceMap[name];
                    }
                };
                /**
                * It will return the emVersion for the given datasource name
                *return
                * -1 : No information
                * 0 : Not Found version
                * <version> : version of the em for the 'name'
                */
                Utils.getEMVersionForDatasource = function (name) {
                    if (Utils.versionAndDatasourceName[name] !== undefined) {
                        return Utils.versionAndDatasourceName[name];
                    }
                    else {
                        return '-1';
                    }
                };
                /**
                * It will set the emVersion for the given datasource name
                */
                Utils.setEMVersionForDatasource = function (name, version) {
                    Utils.versionAndDatasourceName[name] = version;
                };
                /**
                * It is used know if the 'data' is json or not
                */
                Utils.isJSON = function (data) {
                    try {
                        JSON.parse(data);
                        return true;
                    }
                    catch (e) {
                        return false;
                    }
                };
                Utils.getAliasName = function (seriesType) {
                    if (seriesType === undefined || seriesType === '') {
                        return '';
                    }
                    else if (seriesType.endsWith('(Target)')) {
                        return '$oem_gf_namedcredential';
                    }
                    else if (['EM Metrics(Raw)', 'EM Metrics Hourly', 'EM Metrics Daily'].indexOf(seriesType) !== -1) {
                        return '$oem_gf_metricgroup_$oem_gf_metric';
                    }
                    else if (seriesType.endsWith('(Repository)')) {
                        return 'Custom(Repository)';
                    }
                    else {
                        return '';
                    }
                };
                Utils.getSeriesList = function () {
                    return ['EM Metrics(Raw)', 'EM Metrics Hourly', 'EM Metrics Daily' /*,'JVMD Metrics'*/, 'Query(Target)', 'Timeseries Query(Repository)', 'General Query(Repository)'];
                };
                Utils.isGoBtnEnabled = function (options) {
                    if (options.seriestype === '') {
                        return false;
                    }
                    else if (Utils.getSeriesType(options.seriestype) === EMCCConstants_1.EMCCConstants.METRIC_SERIES_TYPE) {
                        return !(Utils.isEmpty(options.targettype)
                            || Utils.isEmpty(options.targetName)
                            || Utils.isEmpty(options.metricgroup)
                            || Utils.isEmpty(options.metric));
                    }
                    else if (options.seriestype.endsWith('(Target)')) {
                        return !(Utils.isEmpty(options.targettype)
                            || Utils.isEmpty(options.targetName)
                            || Utils.isEmpty(options.namedcredential)
                            || Utils.isEmpty(options.rawQuery));
                    }
                    else {
                        return !(Utils.isEmpty(options.rawQuery));
                    }
                };
                Utils.isEmpty = function (value) {
                    return value === ''
                        || value === undefined;
                };
                Utils.getSeriesType = function (seriestype) {
                    if (['EM Metrics(Raw)', 'EM Metrics Hourly', 'EM Metrics Daily', 'JVMD Metrics'].indexOf(seriestype) !== -1) {
                        return EMCCConstants_1.EMCCConstants.METRIC_SERIES_TYPE;
                    }
                    else if (['Timeseries Query(Repository)', 'General Query(Repository)', 'General Query(Target)'].indexOf(seriestype) !== -1) {
                        return EMCCConstants_1.EMCCConstants.QUERY_SERIES_TYPE;
                    }
                    else {
                        return '';
                    }
                };
                Utils.isRawQuery = function (query) {
                    if (query.trim() !== EMCCConstants_1.EMCCConstants.QUERY_RAW_QUERY_DATA
                        || query.trim() !== EMCCConstants_1.EMCCConstants.QUERY_GENERAL_DATA) {
                        return true;
                    }
                    else {
                        return false;
                    }
                };
                Utils.getTargetMetricsValues = function () {
                    return ['Average', 'Minimum', 'Maximum', 'Standard Deviation'];
                };
                Utils.getTargetValuesFroJVMDMetrics = function () {
                    return ['Host CPU Utilization', 'JVM CPU Utilization', 'GC Minor', 'GC Major', 'Minor GC Time', 'Major GC Time'];
                };
                Utils.isVisibleSeriesValue = function (value) {
                    if (value === 'EM Metrics Hourly'
                        || value === 'EM Metrics Daily'
                        || value === 'JVMD Metrics') {
                        return true;
                    }
                    else {
                        return false;
                    }
                };
                Utils.isTargetVisible = function (seriestype) {
                    if (['EM Metrics(Raw)', 'EM Metrics Hourly',
                        'EM Metrics Daily', 'JVMD Metrics',
                        'Timeseries Query(Target)', 'General Query(Target)'].indexOf(seriestype) !== -1) {
                        return true;
                    }
                    else {
                        return false;
                    }
                };
                Utils.isTimeseriesCustomQuery = function (seriestype) {
                    if (['Timeseries Query(Target)', 'Timeseries Query(Repository)'].indexOf(seriestype) !== -1) {
                        return true;
                    }
                    else {
                        return false;
                    }
                };
                Utils.isRawQueryVisible = function (seriestype) {
                    if (['Timeseries Query(Target)', 'Timeseries Query(Repository)',
                        'General Query(Repository)', 'General Query(Target)'].indexOf(seriestype) !== -1) {
                        return true;
                    }
                    else {
                        return false;
                    }
                };
                Utils.getSeriesTypes = function (type, enabledStatus) {
                    var data = [];
                    console.log(type);
                    console.log(enabledStatus);
                    if (type === 'Timeseries') {
                        data = [{ 'key': 'Raw', 'value': 'EM Metrics(Raw)' },
                            { 'key': 'Hourly', 'value': 'EM Metrics Hourly' },
                            { 'key': 'Daily', 'value': 'EM Metrics Daily' }];
                        if (enabledStatus.targetQueryEnabled === true) {
                            data.push({ 'key': 'Custom(Target)', 'value': 'Timeseries Query(Target)' });
                        }
                        if (enabledStatus.repositoryQueryEnabled === true) {
                            data.push({ 'key': 'Custom(Repository)', 'value': 'Timeseries Query(Repository)' });
                        }
                        return data;
                    }
                    else if (type === 'Table') {
                        if (enabledStatus.targetQueryEnabled === true) {
                            data.push({ 'key': 'Custom(Target)', 'value': 'General Query(Target)' });
                        }
                        if (enabledStatus.repositoryQueryEnabled === true) {
                            data.push({ 'key': 'Custom(Repository)', 'value': 'General Query(Repository)' });
                        }
                        return data;
                    }
                    else {
                        return [];
                    }
                };
                Utils.getURL = function (name) {
                    return EMCCConstants_1.EMCCConstants.EM_URI + Utils.urlNameMap[name];
                };
                Utils.convertVersionToRU = function (version) {
                    var versionPart = version.substr(0, version.indexOf(".", version.indexOf(".") + 1));
                    var ruPart = version.substr(version.lastIndexOf(".") + 1);
                    return versionPart + "RU" + ruPart;
                };
                Utils.getErrorMsg = function (version) {
                    if (version !== undefined && version === '0') {
                        return {
                            info: "NO_VERSION",
                            statusText: "OEM App for Grafana " + EMCCConstants_1.EMCCConstants.PLUGIN_VERSION + " is incompatible with the OEM version. Refer to the version compatibility matrix.",
                            status: 404
                        };
                    }
                    else if (version !== undefined && version === '2') {
                        return {
                            info: "Grafana compatibility Issue",
                            statusText: "Querying Oracle Enterprise Manager (OEM) Repository through Grafana is not enabled on the EM server. Contact the EM administrator to enable it.",
                            status: 404
                        };
                    }
                    else if (version !== undefined) {
                        return {
                            info: "VERSION_ISSUE",
                            statusText: "OEM App for Grafana " + EMCCConstants_1.EMCCConstants.PLUGIN_VERSION + " is incompatible with the OEM version " + version + ".Refer to the version compatibility matrix.",
                            status: 404
                        };
                    }
                    else {
                        return {
                            info: "VERSION_ISSUE",
                            statusText: "OEM App for Grafana " + EMCCConstants_1.EMCCConstants.PLUGIN_VERSION + " is incompatible with the OEM version. Refer to the version compatibility matrix.",
                            status: 404
                        };
                    }
                };
                Utils.urlNameMap = {
                    'metrics': '/v2/metrics',
                    'query': '/v2/query',
                    'namedcreds': '/v1/namedcreds',
                    'metricgroups': '/v1/metricgroups',
                    '/': '/v1/',
                    'enablestatus': '/v1/enablestatus',
                    'targettypes': '/v1/targettypes',
                    'targets': '/v1/targets',
                    'emruversion': '/v1/emruversion'
                };
                Utils.versionAndDatasourceName = {};
                Utils.compatibilityDatasourceMap = {};
                return Utils;
            })();
            exports_1("Utils", Utils);
        }
    }
});
