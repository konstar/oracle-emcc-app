/*
** Copyright © 2020 Oracle and/or its affiliates. All rights reserved.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/
System.register([], function(exports_1) {
    var EMCCConstants;
    return {
        setters:[],
        execute: function() {
            EMCCConstants = (function () {
                function EMCCConstants() {
                }
                EMCCConstants.METRIC_SERIES_TYPE = 'METRIC';
                EMCCConstants.QUERY_SERIES_TYPE = 'QUERY';
                EMCCConstants.QUERY_RAW_QUERY_DATA = 'SELECT <time_column> as time_sec,\n'
                    + '  <value column> as value,\n'
                    + '  <series name column> as metric\n'
                    + '  FROM <table name>\n'
                    + '  WHERE <your where conditions>\n'
                    + '  ORDER BY <time_column> ASC;';
                EMCCConstants.QUERY_GENERAL_DATA = 'select\n'
                    + '<col1>,<col2>,<col3>..\n'
                    + 'from <your table>\n'
                    + 'where <your where clause> and cast(cast(<any time stamp column> as timestamp) at time zone UTC as date) >= $FROM_TIME_STAMP$'
                    + ' and cast(cast(<any timestamp column> as timestamp) at time zone UTC as date) <= $TO_TIME_STAMP$ \n';
                EMCCConstants.JVMD_METRICS_SERIES_TYPE = "JVMD Metrics";
                EMCCConstants.QUERY_TARGET_SERIES_TYPE = "General Query(Target)";
                EMCCConstants.TARGET_SERIES_TYPE = "(Target)";
                EMCCConstants.TIMES_SERIES_QUERY_SERIES_TYPE = "Timeseries Query";
                EMCCConstants.EM_METRICS_RAW_SERIES_TYPE = "EM Metrics(Raw)";
                EMCCConstants.EM_URI = 'em/websvcs/restful/grafana';
                EMCCConstants.JDBC_URL = 'jdbc:oracle:thin:@<host>:<port>:<sid>';
                EMCCConstants.PLUGIN_VERSION = '2.0.0';
                EMCCConstants.EM_VERSION = '13.4RU7';
                EMCCConstants.EM_DISPLAY_VERSION = '13.4RU7';
                return EMCCConstants;
            })();
            exports_1("EMCCConstants", EMCCConstants);
        }
    }
});
