// <reference path="../../../node_modules/@types/systemjs/index.d.ts"/>
declare var System: SystemJSLoader.System;

System.config(JSON.parse('<%= SYSTEM_CONFIG_DEV %>'));
