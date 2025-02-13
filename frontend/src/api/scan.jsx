"use strict";
import $ from 'jquery';
/*!
 * imageFORMULA Web Scan SDK (scan.js)
 * @version   1.0.5
 * @copyright  2016-2019 Canon Electronics Inc.
 */
// var imageFORMULAScanJS = function () {
export function imageFORMULAScanJS() {
  "use strict";

  if ("undefined" == typeof jQuery) {
    throw new Error("imageFORMULA Web Scan SDK's JavaScript requires jQuery");
  }

  var Promise = window.Promise;
  if ("undefined" == typeof Promise || Promise.toString().indexOf("[native code]") === -1) {
    if ("undefined" == typeof ES6Promise) {
      throw new Error("imageFORMULA Web Scan SDK's JavaScript requires ES6-Promise");
    }
    var Promise = ES6Promise.Promise;
  }

  var version = function version() {
    return "1.0.5";
  };

  var DEFAULT = {
    'FQDN': 'localhost:6851', //scan server url 
    'MONITOR_TIMEOUT': 600 //second
  };

  var CONST = {
    'CODE_H': 'API',
    'SEND_TIMEOUT': 60, //second
    'CONNECTION_LOCK_BASIC': 120, //second
    'CONNECTION_LOCK_EXPANDED': 5, //second
    'IF_MODIFIED_SINCE_NAME': 'If-Modified-Since',
    'IF_MODIFIED_SINCE_VALUE': 'Thu, 01 Jun 1970 00:00:00 GMT'
  };

  var CONST_ID = {
    'GET_SCANNER_LIST': '1001',
    'CONNECT_SCANNER': '1011',
    'DISCONNECT_SCANNER': '1012',
    'GET_SCANSTATE': '1021',
    'MONITOR_SCANSTATE': '1022',
    'START_SCAN': '1031',
    'CANCEL_SCAN': '1032',
    'GET_SETTING': '1041',
    'UPDATE_SETTING': '1042',
    'GET_FILELIST': '1051',
    'GET_TOKEN': '1061',
    'REFRESH_TOKEN': '1062',
    'GET_TOKEN_FROM_PROXY': '1063',
    'REFRESH_TOKEN_FROM_PROXY': '1064'
  };

  var CONST_CODE = {
    'COMM': CONST.CODE_H + '_' + '404'
  };

  var CONST_API = {
    'API': 'api',
    'VER': 'v1',
    'SCANNER': 'scanners',
    'CONNECT': 'connection',
    'SCAN': 'scanning',
    'SETTING': 'settings',
    'FILE': 'files',
    'PROXY': 'proxy'
  };

  var CONST_API_ARG = {
    'SCAN_START': 1,
    'SCAN_WAIT': 0
  };

  var CONST_API_PARAM = {
    'MODE': 'colormode',
    'SIDE': 'scanside',
    'RESOLUTION': 'resolution',
    'FILEFORMAT': 'fileformat',
    'PREFIX': 'schmprefix',
    'SEPARATOR': 'schmseparator',
    'DATETIME': 'schmdatetime',
    'URL': 'destination',
    'HEADERS': 'destinationheaders',
    'PARAM': 'destinationparameters',
    'FILEPARAM': 'destinationfileparameter'
  };

  Object.freeze(DEFAULT);
  Object.freeze(CONST);
  Object.freeze(CONST_ID);
  Object.freeze(CONST_CODE);
  Object.freeze(CONST_API);
  Object.freeze(CONST_API_ARG);
  Object.freeze(CONST_API_PARAM);

  var createUrl = function createUrl(fqdn, api, opt_scanner_id, opt_scan_id) {
    if (api == CONST_API.PROXY) {
      return 'https://' + fqdn + '/' + CONST_API.API + '/' + CONST_API.VER + '/' + CONST_API.PROXY;
    }

    var base_url = 'https://' + fqdn + '/' + CONST_API.API + '/' + CONST_API.VER + '/' + CONST_API.SCANNER;

    if (api == CONST_API.SCANNER) {
      return base_url;
    }

    if (typeof opt_scanner_id === 'string' && opt_scanner_id !== '') {
      base_url += '/' + opt_scanner_id;
    }

    if (api == CONST_API.CONNECT) {
      return base_url + '/' + CONST_API.CONNECT;
    }

    if (api == CONST_API.SCAN) {
      return base_url + '/' + CONST_API.SCAN;
    }

    if (api == CONST_API.SETTING) {
      return base_url + '/' + CONST_API.SETTING;
    }

    if (api == CONST_API.FILE) {
      base_url += '/' + CONST_API.FILE;
      if (typeof opt_scan_id === 'string' && opt_scan_id !== '') {
        base_url += '/' + opt_scan_id;
      }
      return base_url;
    }
  };

  var scanServerVersion = function scanServerVersion(xhr) {
    var v = '';
    if (xhr && typeof xhr === 'object') {
      var h = xhr.getResponseHeader('Server');
      if (h) {
        var servers = h.split(" ");
        for (var s in servers) {
          var prefix = 'ScanServer/';
          var index = servers[s].indexOf(prefix);
          if (index != 0) {
            continue;
          }
          v = servers[s].substr(prefix.length);
        }
      }
    }
    return v;
  };

  var sdkInfo = function sdkInfo(xhr) {
    return {
      "ScanServer": scanServerVersion(xhr),
      "scanjs": version()
    };
  };

  var appendSdkInfo = function appendSdkInfo(obj, xhr) {
    obj['imageFORMULAWebScanSDK'] = sdkInfo(xhr);
    return obj;
  };

  var sendRequest = function sendRequest(target_url, method, opt_data) {
    var time_out = CONST.SEND_TIMEOUT * 1000;
    var isNotDefaultJqueryOption = false;
    $.ajaxPrefilter(function (o) {
      if (!o || o.cache === false) {
        o.cache = true;
        isNotDefaultJqueryOption = true;
      }
    });
    var data = {
      crossdomain: true,
      type: method,
      timeout: time_out,
      dataType: 'json',
      url: target_url,
      data: opt_data,
      beforeSend: function (xhr) {
        if (isNotDefaultJqueryOption && method === 'GET') {
          xhr.setRequestHeader(CONST.IF_MODIFIED_SINCE_NAME, CONST.IF_MODIFIED_SINCE_VALUE);
        }
      }
    };
    if (typeof opt_data === 'string' && opt_data !== '') {
      data.contentType = 'application/json; charset=utf-8';
    }
    return $.ajax(data);
  };

  var authorize = function authorize(endpoint, state, client_id, opt_redirect_uri, opt_other, open) {
    var param = '?response_type=' + encodeURI('code') + '&client_id=' + encodeURI(client_id) + '&state=' + encodeURI(state);
    if (opt_redirect_uri) {
      param += '&redirect_uri=' + encodeURI(opt_redirect_uri);
    }
    if (opt_other) {
      var tmp_auth_option = $.extend({}, opt_other);
      if (typeof tmp_auth_option['redirect_uri'] === 'string') {
        delete tmp_auth_option.redirect_uri;
      }
      var other_param = $.param(tmp_auth_option);
      if (other_param != "") {
        param += '&' + other_param;
      }
    }
    if (open) {
      open(endpoint + param);
    } else {
      window.open(endpoint + param, '_self');
    }
  };

  var getAccessToken = function getAccessToken(endpoint, state, client_id, client_secret, code, option) {
    var fqdn = DEFAULT.FQDN;
    var redirect_uri = null;
    var other_optin = {};

    if (option) {
      other_optin = $.extend({}, option);
      if (typeof option['fqdn'] === 'string' && option['fqdn'] !== '') {
        fqdn = option['fqdn'];
        delete other_optin.fqdn;
      }
      if (typeof option['redirect_uri'] === 'string' && option['redirect_uri'] !== '') {
        redirect_uri = option['redirect_uri'];
        delete other_optin.redirect_uri;
      }
    }

    return new Promise(function (resolve, reject) {
      var url = createUrl(fqdn, CONST_API.PROXY);
      var proxyData = {
        endpoint: endpoint,
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF8'
        },
        data: ''
      };
      var requestData = {
        grant_type: 'authorization_code',
        code: code,
        client_id: client_id,
        client_secret: client_secret
      };
      if (redirect_uri) {
        requestData.redirect_uri = redirect_uri;
      }
      requestData = $.extend(requestData, other_optin);
      proxyData.data = $.param(requestData);

      $.ajax({
        url: url,
        data: JSON.stringify(proxyData),
        type: 'POST',
        dataType: 'json',
        cache: true,
        beforeSend: function (xhr) {
          xhr.setRequestHeader(CONST.IF_MODIFIED_SINCE_NAME, CONST.IF_MODIFIED_SINCE_VALUE);
        }
      }).done(function (data, status, xhr) {
        localStorage.setItem(state, JSON.stringify({
          access_token: data.access_token,
          refresh_token: data.refresh_token
        }));
        resolve(appendSdkInfo({
          'result': 'true',
          'value': {}
        }, xhr));
      }).fail(function (xhr, status, error) {
        var result = {
          'result': 'false',
          'function': 'getAccessToken',
          'value': {}
        };
        if (xhr.status == 0) {
          result['value']['id'] = CONST_ID.GET_TOKEN;
          result['value']['code'] = CONST_CODE.COMM;
          reject(appendSdkInfo(result, xhr));
        } else {
          result['value']['id'] = CONST_ID.GET_TOKEN_FROM_PROXY;
          result['value']['status'] = xhr.status;
          result['value']['response'] = xhr.responseJSON;
          reject(appendSdkInfo(result, xhr));
        }
      });
    });
  };

  var refreshAccessToken = function refreshAccessToken(fqdn, endpoint, state, refresh_token, client_id, client_secret) {
    return new Promise(function (resolve, reject) {
      var url = createUrl(fqdn, CONST_API.PROXY);
      var proxyData = {
        endpoint: endpoint,
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF8'
        },
        data: ''
      };
      var requestData = {
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
        client_id: client_id,
        client_secret: client_secret
      };
      proxyData.data = $.param(requestData);

      $.ajax({
        url: url,
        data: JSON.stringify(proxyData),
        type: 'POST',
        dataType: 'json',
        cache: true,
        beforeSend: function (xhr) {
          xhr.setRequestHeader(CONST.IF_MODIFIED_SINCE_NAME, CONST.IF_MODIFIED_SINCE_VALUE);
        }
      }).done(function (data, status, xhr) {
        if (data.refresh_token) {
          localStorage.setItem(state, JSON.stringify({
            access_token: data.access_token,
            refresh_token: data.refresh_token
          }));
        } else {
          localStorage.setItem(state, JSON.stringify({
            access_token: data.access_token,
            refresh_token: refresh_token
          }));
        }
        resolve(appendSdkInfo({
          'result': 'true',
          'value': {}
        }, xhr));
      }).fail(function (xhr, status, error) {
        var result = {
          'result': 'false',
          'function': 'refreshAccessToken',
          'value': {}
        };
        if (xhr.status == 0) {
          result['value']['id'] = CONST_ID.REFRESH_TOKEN;
          result['value']['code'] = CONST_CODE.COMM;
          reject(appendSdkInfo(result, xhr));
        } else {
          result['value']['id'] = CONST_ID.REFRESH_TOKEN_FROM_PROXY;
          result['value']['status'] = xhr.status;
          result['value']['response'] = xhr.responseJSON;
          reject(appendSdkInfo(result, xhr));
        };
      });
    });
  };

  var getScannerList = function getScannerList(fqdn) {
    return new Promise(function (resolve, reject) {
      var url = createUrl(fqdn, CONST_API.SCANNER);
      sendRequest(url, 'GET').done(function (data, status, xhr) {
        var jsonRaw = JSON.parse(xhr.responseText);
        if (jsonRaw.scanners[0] == undefined) {
          reject(appendSdkInfo({
            'result': 'true',
            'value': jsonRaw
          }, xhr));
        } else {
          resolve(appendSdkInfo({
            'result': 'true',
            'value': jsonRaw
          }, xhr));
        }
      }).fail(function (xhr, status, error) {
        var result = {
          'result': 'false',
          'value': {}
        };
        if (xhr.status == 0) {
          result['value'] = {
            'id': CONST_ID.GET_SCANNER_LIST,
            'code': CONST_CODE.COMM
          };
          reject(appendSdkInfo(result, xhr));
        } else {
          result['value'] = xhr.responseJSON;
          reject(appendSdkInfo(result, xhr));
        }
      });
    });
  };

  var connectScanner = function connectScanner(fqdn, scanner_id, timeout) {
    return new Promise(function (resolve, reject) {
      var url = createUrl(fqdn, CONST_API.CONNECT, scanner_id);
      var opt_data = {
        'connection_timeout': CONST.CONNECTION_LOCK_BASIC
      };
      if (timeout) {
        opt_data['connection_timeout'] = timeout;
      }
      sendRequest(url, 'POST', JSON.stringify(opt_data)).done(function (data, status, xhr) {
        var jsonRaw = JSON.parse(xhr.responseText);
        resolve(appendSdkInfo({
          'result': 'true',
          'value': jsonRaw
        }, xhr));
      }).fail(function (xhr, status, error) {
        var result = {
          'result': 'false',
          'value': {}
        };
        if (xhr.status == 0) {
          result['value'] = {
            'id': CONST_ID.CONNECT_SCANNER,
            'code': CONST_CODE.COMM
          };
        } else {
          result['value'] = xhr.responseJSON;
        }
        reject(appendSdkInfo(result, xhr));
      });
    });
  };

  var disconnectScanner = function disconnectScanner(fqdn, scanner_id, connection_id) {
    return new Promise(function (resolve, reject) {
      var url = createUrl(fqdn, CONST_API.CONNECT, scanner_id);
      var opt_data = {
        'connection_id': String(connection_id)
      };
      sendRequest(url, 'DELETE', JSON.stringify(opt_data)).done(function (data, status, xhr) {
        var jsonRaw = JSON.parse(xhr.responseText);
        resolve(appendSdkInfo({
          'result': 'true',
          'value': jsonRaw
        }, xhr));
      }).fail(function (xhr, status, error) {
        var result = {
          'result': 'false',
          'value': {}
        };
        if (xhr.status == 0) {
          result['value'] = {
            'id': CONST_ID.DISCONNECT_SCANNER,
            'code': CONST_CODE.COMM
          };
        } else {
          result['value'] = xhr.responseJSON;
        }
        reject(appendSdkInfo(result, xhr));
      });
    });
  };

  var getScanState = function getScanState(fqdn, scanner_id, connection_id) {
    return new Promise(function (resolve, reject) {
      var url = createUrl(fqdn, CONST_API.SCAN, scanner_id);
      var opt_data = {
        'connection_id': String(connection_id)
      };
      sendRequest(url, 'GET', JSON.stringify(opt_data)).done(function (data, status, xhr) {
        var jsonRaw = JSON.parse(xhr.responseText);
        resolve(appendSdkInfo({
          'result': 'true',
          'value': jsonRaw
        }, xhr));
      }).fail(function (xhr, status, error) {
        var result = {
          'result': 'false',
          'value': {}
        };
        if (xhr.status == 0) {
          result['value'] = {
            'id': CONST_ID.GET_SCANSTATE,
            'code': CONST_CODE.COMM
          };
        } else {
          result['value'] = xhr.responseJSON;
        }
        reject(appendSdkInfo(result, xhr));
      });
    });
  };

  var monitorScanState = function monitorScanState(fqdn, scanner_id, connection_id, opt_timeout) {
    var timeout = DEFAULT.MONITOR_TIMEOUT;
    if (isFinite(opt_timeout)) {
      timeout = opt_timeout;
    }
    return new Promise(function (resolve, reject) {
      function loop(count) {
        return new Promise(function (res, rej) {
          setTimeout(function () {
            getScanState(fqdn, scanner_id, connection_id).then(function (scanStates) {
              res(scanStates);
            }).catch(function (error) {
              rej(error);
            });
          }, 1000);
        }).then(function (scanStates) {
          if (count >= timeout) {
            reject({
              'result': 'true',
              'value': scanStates.value,
              'imageFORMULAWebScanSDK': scanStates.imageFORMULAWebScanSDK
            });
          } else {
            if (scanStates.value.status == 1 || count < 1) {
              loop(count + 1);
            } else {
              if (scanStates.value.status == 0) {
                resolve({
                  'result': 'true',
                  'value': {},
                  'imageFORMULAWebScanSDK': scanStates.imageFORMULAWebScanSDK
                });
              } else {
                reject({
                  'result': 'false',
                  'value': scanStates.value,
                  'imageFORMULAWebScanSDK': scanStates.imageFORMULAWebScanSDK
                });
              }
            }
          }
        }).catch(function (error) {
          if (error['value']['id'] === CONST_ID.GET_SCANSTATE) {
            error['value']['id'] = CONST_ID.MONITOR_SCANSTATE;
          }
          reject(error);
        });
      }
      loop(1);
    });
  };

  var startScan = function startScan(fqdn, scanner_id, connection_id) {
    return new Promise(function (resolve, reject) {
      var url = createUrl(fqdn, CONST_API.SCAN, scanner_id);
      var opt_data = {
        'connection_id': String(connection_id),
        'status': CONST_API_ARG.SCAN_START
      };
      sendRequest(url, 'PUT', JSON.stringify(opt_data)).done(function (data, status, xhr) {
        var jsonRaw = JSON.parse(xhr.responseText);
        resolve(appendSdkInfo({
          'result': 'true',
          'value': jsonRaw
        }, xhr));
      }).fail(function (xhr, status, error) {
        var result = {
          'result': 'false',
          'value': {}
        };
        if (xhr.status == 0) {
          result['value'] = {
            'id': CONST_ID.START_SCAN,
            'code': CONST_CODE.COMM
          };
        } else {
          result['value'] = xhr.responseJSON;
        }
        reject(appendSdkInfo(result, xhr));
      });
    });
  };

  var cancelScan = function cancelScan(fqdn, scanner_id, connection_id) {
    return new Promise(function (resolve, reject) {
      var url = createUrl(fqdn, CONST_API.SCAN, scanner_id);
      var opt_data = {
        'connection_id': String(connection_id),
        'status': CONST_API_ARG.SCAN_WAIT
      };
      sendRequest(url, 'PUT', JSON.stringify(opt_data)).done(function (data, status, xhr) {
        var jsonRaw = JSON.parse(xhr.responseText);
        resolve(appendSdkInfo({
          'result': 'true',
          'value': jsonRaw
        }, xhr));
      }).fail(function (xhr, status, error) {
        var result = {
          'result': 'false',
          'value': {}
        };
        if (xhr.status == 0) {
          result['value'] = {
            'id': CONST_ID.CANCEL_SCAN,
            'code': CONST_CODE.COMM
          };
        } else {
          result['value'] = xhr.responseJSON;
        }
        reject(appendSdkInfo(result, xhr));
      });
    });
  };

  var getSettings = function getSettings(fqdn, scanner_id, connection_id) {
    return new Promise(function (resolve, reject) {
      var url = createUrl(fqdn, CONST_API.SETTING, scanner_id);
      var opt_data = {
        'connection_id': String(connection_id)
      };
      sendRequest(url, 'GET', JSON.stringify(opt_data)).done(function (data, status, xhr) {
        var jsonRaw = JSON.parse(xhr.responseText);
        resolve(appendSdkInfo({
          'result': 'true',
          'value': jsonRaw
        }, xhr));
      }).fail(function (xhr, status, error) {
        var result = {
          'result': 'false',
          'value': {}
        };
        if (xhr.status == 0) {
          result['value'] = {
            'id': CONST_ID.GET_SETTING,
            'code': CONST_CODE.COMM
          };
        } else {
          result['value'] = xhr.responseJSON;
        }
        reject(appendSdkInfo(result, xhr));
      });
    });
  };

  var updateSettings = function updateSettings(fqdn, scanner_id, connection_id, settings) {
    return new Promise(function (resolve, reject) {
      var url = createUrl(fqdn, CONST_API.SETTING, scanner_id);
      var opt_data = {
        'connection_id': String(connection_id)
      };
      $.extend(opt_data, settings);

      sendRequest(url, 'PUT', JSON.stringify(opt_data)).done(function (data, status, xhr) {
        var jsonRaw = JSON.parse(xhr.responseText);
        resolve(appendSdkInfo({
          'result': 'true',
          'value': jsonRaw
        }, xhr));
      }).fail(function (xhr, status, error) {
        var result = {
          'result': 'false',
          'value': {}
        };
        if (xhr.status == 0) {
          result['value'] = {
            'id': CONST_ID.UPDATE_SETTING,
            'code': CONST_CODE.COMM
          };
        } else {
          result['value'] = xhr.responseJSON;
        }
        reject(appendSdkInfo(result, xhr));
      });
    });
  };

  var getFileList = function getFileList(fqdn, scanner_id, connection_id, scan_id) {
    return new Promise(function (resolve, reject) {
      var url = createUrl(fqdn, CONST_API.FILE, scanner_id, scan_id);
      var opt_data = {
        'connection_id': String(connection_id)
      };
      sendRequest(url, 'GET', JSON.stringify(opt_data)).done(function (data, status, xhr) {
        var jsonRaw = JSON.parse(xhr.responseText);
        resolve(appendSdkInfo({
          'result': 'true',
          'value': jsonRaw
        }, xhr));
      }).fail(function (xhr, status, error) {
        var result = {
          'result': 'false',
          'value': {}
        };
        if (xhr.status == 0) {
          result['value'] = {
            'id': CONST_ID.GET_FILELIST,
            'code': CONST_CODE.COMM
          };
        } else {
          result['value'] = xhr.responseJSON;
        }
        reject(appendSdkInfo(result, xhr));
      });
    });
  };

  var selectScannerType = function selectScannerType(scanners, scanner_type) {
    var scanner_id = null;
    var target_scanner_type = null;
    if (typeof scanner_type === 'string' && scanner_type == '0') {
      target_scanner_type = 0;
    } else if (typeof scanner_type === 'string' && scanner_type == '1') {
      target_scanner_type = 1;
    }
    if (target_scanner_type) {
      for (var s in scanners) {
        if (scanners[s] && scanners[s].scanner_type && scanners[s].scanner_type == target_scanner_type) {
          scanner_id = scanners[s].scanner_id;
        }
      }
    } else {
      if (0 < scanners.length) {
        scanner_id = scanners[0].scanner_id;
      }
    }
    return scanner_id;
  };

  var startScanProgress = function (scan_progress, startScan_result) {
    if (!startScan_result || !scan_progress || typeof scan_progress !== 'function') {
      return;
    }
    var pin = null;
    var user_name = null;
    var scanner_title = null;
    var scanner_message = null;
    if (startScan_result.parameters) {
      for (var k in startScan_result.parameters) {
        if (startScan_result.parameters[k].name == 'PIN') {
          pin = startScan_result.parameters[k].value;
        }
        if (startScan_result.parameters[k].name == 'UserName') {
          user_name = startScan_result.parameters[k].value;
        }
        if (startScan_result.parameters[k].name == 'ScannerTitle') {
          scanner_title = startScan_result.parameters[k].value;
        }
        if (startScan_result.parameters[k].name == 'ScannerMessage') {
          scanner_message = startScan_result.parameters[k].value;
        }
      }
      if (pin && user_name) {
        scan_progress(pin, user_name);
      } else if (scanner_title && scanner_message) {
        scan_progress(scanner_title, scanner_message);
      }
    }
  };

  var scan = function scan(upload_url, opt_fqdn) {
    var scanner_id = null;
    var connection_id = null;
    var scan_id = null;
    var scanfile_list = null;
    var last_function = null;
    var last_sdk_info = sdkInfo();

    var fqdn = DEFAULT.FQDN;
    if (typeof opt_fqdn === 'string' && opt_fqdn !== '') {
      fqdn = opt_fqdn;
    }

    return new Promise(function (resolve, reject) {
      last_function = 'getScannerList';
      getScannerList(fqdn).then(function (success) {
        scanner_id = selectScannerType(success.value.scanners);
        last_sdk_info = success.imageFORMULAWebScanSDK;
        if (!scanner_id) {
          throw {
            'result': 'false',
            'function': last_function,
            'value': success.value,
            'imageFORMULAWebScanSDK': last_sdk_info
          };
        } else {
          last_function = 'connectScanner';
          return connectScanner(fqdn, scanner_id, CONST.CONNECTION_LOCK_EXPANDED);
        }
      }).then(function (success) {
        connection_id = success.value.connection_id;
        last_function = 'getSettings';
        last_sdk_info = success.imageFORMULAWebScanSDK;
        return getSettings(fqdn, scanner_id, connection_id);
      }).then(function (success) {
        var settings = success.value;
        // set upload URL.
        settings[CONST_API_PARAM.URL] = upload_url;
        last_function = 'updateSettings';
        last_sdk_info = success.imageFORMULAWebScanSDK;
        return updateSettings(fqdn, scanner_id, connection_id, settings);
      }).then(function (success) {
        last_function = 'startScan';
        last_sdk_info = success.imageFORMULAWebScanSDK;
        return startScan(fqdn, scanner_id, connection_id);
      }).then(function (success) {
        scan_id = success.value.scan_id;
        last_function = 'monitorScanState';
        last_sdk_info = success.imageFORMULAWebScanSDK;
        return monitorScanState(fqdn, scanner_id, connection_id, DEFAULT.MONITOR_TIMEOUT);
      }).then(function (success) {
        last_function = 'getFileList';
        last_sdk_info = success.imageFORMULAWebScanSDK;
        return getFileList(fqdn, scanner_id, connection_id, scan_id);
      }).then(function (success) {
        if (success.value.files.length > 0) {
          scanfile_list = success.value;
        } else {
          scanfile_list = {
            files: []
          };
        }
        last_function = 'disconnectScanner';
        last_sdk_info = success.imageFORMULAWebScanSDK;
        return disconnectScanner(fqdn, scanner_id, connection_id);
      }).then(function (success) {
        resolve({
          'result': 'true',
          'value': scanfile_list,
          'imageFORMULAWebScanSDK': last_sdk_info
        });
      }).catch(function (error) {
        last_sdk_info = error.imageFORMULAWebScanSDK;
        if (last_function == 'monitorScanState' && error.result == 'true') {
          scanfile_list = {
            files: []
          };
          cancelScan(fqdn, scanner_id, connection_id).then(function (success) {
            last_sdk_info = success.imageFORMULAWebScanSDK;
            return getFileList(fqdn, scanner_id, connection_id, scan_id);
          }).then(function (success) {
            last_sdk_info = success.imageFORMULAWebScanSDK;
            if (success.value.files.length > 0) {
              scanfile_list = success.value;
            }
            return disconnectScanner(fqdn, scanner_id, connection_id);
          }).then(function (success) {
            last_sdk_info = success.imageFORMULAWebScanSDK;
            reject({
              'result': 'false',
              'function': last_function,
              'value': scanfile_list,
              'imageFORMULAWebScanSDK': last_sdk_info
            });
          }).catch(function (error2) {
            last_sdk_info = error2.imageFORMULAWebScanSDK;
            disconnectScanner(fqdn, scanner_id, connection_id);
            reject({
              'result': 'false',
              'function': last_function,
              'value': scanfile_list,
              'imageFORMULAWebScanSDK': last_sdk_info
            });
          });
        } else {
          if (connection_id) {
            disconnectScanner(fqdn, scanner_id, connection_id);
          }
          reject({
            'result': 'false',
            'function': last_function,
            'value': error.value == undefined ? error : error.value,
            'imageFORMULAWebScanSDK': last_sdk_info
          });
        }
      });
    });
  };

  var scanSetParameter = function scanSetParameter(settings, opt_fqdn, scan_progress) {
    var scanner_id = null;
    var connection_id = null;
    var scan_id = null;
    var scanfile_list = null;
    var last_function = null;
    var last_sdk_info = sdkInfo();

    var fqdn = DEFAULT.FQDN;
    if (typeof opt_fqdn === 'string' && opt_fqdn !== '') {
      fqdn = opt_fqdn;
    }

    return new Promise(function (resolve, reject) {
      last_function = 'getScannerList';
      getScannerList(fqdn).then(function (success) {
        scanner_id = selectScannerType(success.value.scanners);
        last_sdk_info = success.imageFORMULAWebScanSDK;
        if (!scanner_id) {
          throw {
            'result': 'false',
            'function': last_function,
            'value': success.value,
            'imageFORMULAWebScanSDK': last_sdk_info
          };
        } else {
          last_function = 'connectScanner';
          return connectScanner(fqdn, scanner_id, CONST.CONNECTION_LOCK_EXPANDED);
        }
      }).then(function (success) {
        connection_id = success.value.connection_id;
        last_function = 'updateSettings';
        last_sdk_info = success.imageFORMULAWebScanSDK;
        return updateSettings(fqdn, scanner_id, connection_id, settings);
      }).then(function (success) {
        last_function = 'startScan';
        last_sdk_info = success.imageFORMULAWebScanSDK;
        return startScan(fqdn, scanner_id, connection_id);
      }).then(function (success) {
        scan_id = success.value.scan_id;
        startScanProgress(scan_progress, success.value);
        last_function = 'monitorScanState';
        last_sdk_info = success.imageFORMULAWebScanSDK;
        return monitorScanState(fqdn, scanner_id, connection_id, DEFAULT.MONITOR_TIMEOUT);
      }).then(function (success) {
        last_function = 'getFileList';
        last_sdk_info = success.imageFORMULAWebScanSDK;
        return getFileList(fqdn, scanner_id, connection_id, scan_id);
      }).then(function (success) {
        if (success.value.files.length > 0) {
          scanfile_list = success.value;
        } else {
          scanfile_list = {
            files: []
          };
        }
        last_function = 'disconnectScanner';
        last_sdk_info = success.imageFORMULAWebScanSDK;
        return disconnectScanner(fqdn, scanner_id, connection_id);
      }).then(function (success) {
        resolve({
          'result': 'true',
          'value': scanfile_list,
          'imageFORMULAWebScanSDK': last_sdk_info
        });
      }).catch(function (error) {
        last_sdk_info = error.imageFORMULAWebScanSDK;
        if (last_function == 'monitorScanState' && error.result == 'true') {
          scanfile_list = {
            files: []
          };
          cancelScan(fqdn, scanner_id, connection_id).then(function (success) {
            return getFileList(fqdn, scanner_id, connection_id, scan_id);
          }).then(function (success) {
            if (success.value.files.length > 0) {
              scanfile_list = success.value;
            }
            return disconnectScanner(fqdn, scanner_id, connection_id);
          }).then(function (success) {
            reject({
              'result': 'false',
              'function': last_function,
              'value': scanfile_list,
              'imageFORMULAWebScanSDK': last_sdk_info
            });
          }).catch(function (error2) {
            disconnectScanner(fqdn, scanner_id, connection_id);
            reject({
              'result': 'false',
              'function': last_function,
              'value': scanfile_list,
              'imageFORMULAWebScanSDK': last_sdk_info
            });
          });
        } else {
          if (connection_id) {
            disconnectScanner(fqdn, scanner_id, connection_id);
          }
          reject({
            'result': 'false',
            'function': last_function,
            'value': error.value,
            'imageFORMULAWebScanSDK': last_sdk_info
          });
        }
      });
    });
  };

  var scanOAuth = function scanOAuth(auth_endpoint, token_endpoint, state, client_id, client_secret, settings, option, auth_option, skip_refresh_access_token, auth_open, scan_progress) {
    var scanner_id = null;
    var connection_id = null;
    var scan_id = null;
    var scanfile_list = null;
    var last_function = null;
    var fqdn = DEFAULT.FQDN;
    var redirect_uri = null;
    var auth_opt_other = null;
    var last_sdk_info = sdkInfo();

    if (option) {
      if (typeof option['fqdn'] === 'string' && option['fqdn'] !== '') {
        fqdn = option['fqdn'];
      }
      if (typeof option['redirect_uri'] === 'string' && option['redirect_uri'] !== '') {
        redirect_uri = option['redirect_uri'];
      }
    }
    if (auth_option) {
      var tmp_auth_option = $.extend({}, auth_option);
      if (typeof auth_option['redirect_uri'] === 'string' && auth_option['redirect_uri'] !== '') {
        delete tmp_auth_option.redirect_uri;
      }
      auth_opt_other = tmp_auth_option;
    }
    return new Promise(function (resolve, reject) {
      var token = JSON.parse(localStorage.getItem(state));
      if (!skip_refresh_access_token && (!token || !token['refresh_token']) || skip_refresh_access_token && (!token || !token['access_token'])) {
        authorize(auth_endpoint, state, client_id, redirect_uri, auth_opt_other, auth_open);
        return reject(appendSdkInfo({
          'result': 'true',
          'function': 'authorize',
          'value': {}
        }));
      }

      var refresh = refreshAccessToken;
      if (skip_refresh_access_token) {
        refresh = function (fqdn, endpoint, state, refresh_token, client_id, client_secret) {
          return new Promise(function (resolve) {
            resolve(appendSdkInfo({
              'result': 'true',
              'value': {}
            }));
          });
        };
      }
      last_function = 'refreshAccessToken';
      refresh(fqdn, token_endpoint, state, token['refresh_token'], client_id, client_secret).then(function (success) {
        if (!skip_refresh_access_token) {
          token = JSON.parse(localStorage.getItem(state));
          if (settings[CONST_API_PARAM.HEADERS].Authorization) {
            settings[CONST_API_PARAM.HEADERS].Authorization = 'Bearer ' + token['access_token'];
          }
        }
        last_function = 'getScannerList';
        last_sdk_info = success.imageFORMULAWebScanSDK;
        return getScannerList(fqdn);
      }).then(function (success) {
        scanner_id = selectScannerType(success.value.scanners);
        last_sdk_info = success.imageFORMULAWebScanSDK;
        if (!scanner_id) {
          throw {
            'result': 'false',
            'function': last_function,
            'value': success.value,
            'imageFORMULAWebScanSDK': last_sdk_info
          };
        } else {
          last_function = 'connectScanner';
          return connectScanner(fqdn, scanner_id, CONST.CONNECTION_LOCK_EXPANDED);
        }
      }).then(function (success) {
        connection_id = success.value.connection_id;
        last_function = 'updateSettings';
        last_sdk_info = success.imageFORMULAWebScanSDK;
        return updateSettings(fqdn, scanner_id, connection_id, settings);
      }).then(function (success) {
        last_function = 'startScan';
        last_sdk_info = success.imageFORMULAWebScanSDK;
        return startScan(fqdn, scanner_id, connection_id);
      }).then(function (success) {
        scan_id = success.value.scan_id;
        startScanProgress(scan_progress, success.value);
        last_function = 'monitorScanState';
        last_sdk_info = success.imageFORMULAWebScanSDK;
        return monitorScanState(fqdn, scanner_id, connection_id, DEFAULT.MONITOR_TIMEOUT);
      }).then(function (success) {
        last_function = 'getFileList';
        last_sdk_info = success.imageFORMULAWebScanSDK;
        return getFileList(fqdn, scanner_id, connection_id, scan_id);
      }).then(function (success) {
        if (success.value.files.length > 0) {
          scanfile_list = success.value;
        } else {
          scanfile_list = {
            files: []
          };
        }
        last_function = 'disconnectScanner';
        last_sdk_info = success.imageFORMULAWebScanSDK;
        return disconnectScanner(fqdn, scanner_id, connection_id);
      }).then(function (success) {
        resolve({
          'result': 'true',
          'value': scanfile_list,
          'imageFORMULAWebScanSDK': last_sdk_info
        });
      }).catch(function (error) {
        last_sdk_info = error.imageFORMULAWebScanSDK;
        if (last_function == 'monitorScanState' && error.result == 'true') {
          scanfile_list = {
            files: []
          };
          cancelScan(fqdn, scanner_id, connection_id).then(function (success) {
            return getFileList(fqdn, scanner_id, connection_id, scan_id);
          }).then(function (success) {
            if (success.value.files.length > 0) {
              scanfile_list = success.value;
            }
            return disconnectScanner(fqdn, scanner_id, connection_id);
          }).then(function (success) {
            reject({
              'result': 'false',
              'function': last_function,
              'value': scanfile_list,
              'imageFORMULAWebScanSDK': last_sdk_info
            });
          }).catch(function (error2) {
            disconnectScanner(fqdn, scanner_id, connection_id);
            reject({
              'result': 'false',
              'function': last_function,
              'value': scanfile_list,
              'imageFORMULAWebScanSDK': last_sdk_info
            });
          });
        } else {
          if (connection_id) {
            disconnectScanner(fqdn, scanner_id, connection_id);
          }
          if (error.value.id == CONST_ID.REFRESH_TOKEN && !error.value.code) {
            authorize(auth_endpoint, state, client_id, redirect_uri, auth_opt_other, auth_open);
            reject({
              'result': 'false',
              'function': last_function,
              'value': {},
              'imageFORMULAWebScanSDK': last_sdk_info
            });
          } else {
            reject({
              'result': 'false',
              'function': last_function,
              'value': error.value,
              'imageFORMULAWebScanSDK': last_sdk_info
            });
          }
        }
      });
    });
  };

  return {
    'DEFAULT': DEFAULT,
    'CONST_CODE': CONST_CODE,
    'version': version(),
    'authorize': authorize,
    'getAccessToken': getAccessToken,
    'refreshAccessToken': refreshAccessToken,
    'selectScannerType': selectScannerType,
    'getScannerList': getScannerList,
    'connectScanner': connectScanner,
    'disconnectScanner': disconnectScanner,
    'getScanState': getScanState,
    'monitorScanState': monitorScanState,
    'startScan': startScan,
    'cancelScan': cancelScan,
    'getSettings': getSettings,
    'updateSettings': updateSettings,
    'getFileList': getFileList,
    'scan': scan,
    'scanSetParameter': scanSetParameter,
    'scanOAuth': scanOAuth,
  };
};