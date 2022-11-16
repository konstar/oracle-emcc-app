/*
** Copyright © 2020 Oracle and/or its affiliates. All rights reserved.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/
System.register(['./components/config'], function(exports_1) {
    var config_1;
    return {
        setters:[
            function (config_1_1) {
                config_1 = config_1_1;
            }],
        execute: function() {
            exports_1("ConfigCtrl", config_1.OracleConfigCtrl);
        }
    }
});
