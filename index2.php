<?php
  $localhosturl = "";
  if(isset($_SERVER['HTTPS']) === true || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER["HTTP_X_FORWARDED_PROTO"] == "https")){
    $localhosturl="https://" . $_SERVER["HTTP_HOST"] . $_SERVER["SCRIPT_NAME"];
  }else{
    $localhosturl = "http://" . $_SERVER["HTTP_HOST"] . $_SERVER["SCRIPT_NAME"];
  }
  $dataurl=dirname($localhosturl);
  $uploaddir = './data/';
  // File uploader
  if(isset($_FILES['file'])&&$_FILES['file']!=null){
    $file_sjis = mb_convert_encoding($_FILES['file']['name'], 'cp932', 'UTF-8'); // Character encoding conversion
    setlocale(LC_CTYPE, 'Japanese_Japan.932');
    $uploadfile = $uploaddir . basename($file_sjis);
    if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {
      echo basename($_FILES['file']['name']);
      return;
    }
  }else if(isset($_GET['file'])&&$_GET['file']!=null){
    $putdata = fopen("php://input", "r");
    $fp = fopen($uploaddir . $_GET['file'], "w");
    while ($data = fread($putdata, 1024)){
      fwrite($fp, $data);
    }
    fclose($fp);
    fclose($putdata);
    echo basename($_GET['file']);
    return;
  }
  if($_SERVER["REQUEST_METHOD"] == "POST" || $_SERVER["REQUEST_METHOD"] == "PUT"){
    $body = json_decode(file_get_contents('php://input'), true);
    if(isset($body)){
      echo json_encode($body);
    }else{
      header((array_key_exists( 'SERVER_PROTOCOL',  $_SERVER) ? $_SERVER['SERVER_PROTOCOL'] : "HTTP/1.1") . " 500 Internal Server Error");
    }
    return;
  }
  parse_str($_SERVER["QUERY_STRING"], $params);
?><!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="content-language" content="ja">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="lib/bootstrap/css/bootstrap.min.css" media="handheld,screen,print,projection" rel="stylesheet">
    <link href="lib/jquery-select-areas/jquery.selectareas.css" media="handheld,screen,print,projection" rel="stylesheet" />
    <script src="lib/jquery-3.2.1.min.js" type="text/javascript"></script>
    <script src="lib/es6-promise.min.js" type="text/javascript"></script>
    <script src="lib/jquery-select-areas/jquery.selectareas.min.js" type="text/javascript"></script>
    <script src="lib/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
    <script src="js/scan.js" type="text/javascript"></script>
    <script src="js/scan_stub2.js" type="text/javascript"></script>
    <title>Usage Examples for imageFORMULA Web Scan SDK</title>

    <style type="text/css">
    <!--
    /*maskingLoader*/
    #maskingLoader{
      position:absolute;
      top:0px;
      left:0px;

      width:100%;
      height:100%;

      background-color:#FFF;
      opacity:0.7;
      display:none;
      z-index:10001;
    }
    #maskingLoader div{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      width: 80px;
      height: 80px;
    }
    .btn {
      white-space: normal;
    }
    div .col-md-6{
      margin-top: 1px;
      margin-bottom: 1px;
      padding-right: 1px;
      padding-left: 1px;
    }
    div .col-md-3, .col-md-2{
      margin-top: 1px;
      margin-bottom: 1px;
      padding-right: 1px;
      padding-left: 1px;
    }
    div .col-md-12{
      margin-top: 1px;
      margin-bottom: 1px;
      padding-right: 1px;
      padding-left: 1px;
    }
    -->
    </style>
    <script type="text/javascript">

      $(function(){
        <?php
          if(isset($params['state'])&&$params['state']=="box"){
            echo "$('#setting_box').click();";
            if(isset($params['code'])&&$params['code']!=null){
              echo "imageFORMULAScanJS_stub.redirectGetAccessToken();";
            }
          }else if(isset($params['state'])&&$params['state']=="dropbox"){
            echo "$('#setting_dropbox').click();";
            if(isset($params['code'])&&$params['code']!=null){
              echo "imageFORMULAScanJS_stub.redirectGetAccessToken();";
            }
          }else if(isset($params['state'])&&$params['state']=="googledrive"){
            echo "$('#setting_googledrive').click();";
            if(isset($params['code'])&&$params['code']!=null){
              echo "imageFORMULAScanJS_stub.redirectGetAccessToken();";
            }
          }else if(isset($params['state'])&&$params['state']=="onedrive"){
            echo "$('#setting_onedrive').click();";
            if(isset($params['code'])&&$params['code']!=null){
              echo "imageFORMULAScanJS_stub.redirectGetAccessToken();";
            }
          }else if(isset($params['state'])&&$params['state']=="onedrive_for_business"){
            echo "$('#setting_onedrive_for_business').click();";
            if(isset($params['code'])&&$params['code']!=null){
              echo "imageFORMULAScanJS_stub.redirectGetAccessToken();";
            }
          }else if(isset($params['state'])&&$params['state']=="salesforce"){
            echo "$('#setting_salesforce').click();";
            if(isset($params['code'])&&$params['code']!=null){
              echo "imageFORMULAScanJS_stub.redirectGetAccessToken();";
            }
          }else{
            echo "$('#setting_local').click();";
          }
        ?>
      });
    </script>
  </head>

<body style="padding-top: 10px; line-height: 1.7em;">
  <?php echo "<input type=\"hidden\" id=\"localhosturl\" value=\"".$localhosturl."\">\r\n"; ?>
  <?php echo "<input type=\"hidden\" id=\"dataurl\" value=\"".$dataurl."/data/\">\r\n"; ?>
  <?php
  if (isset($params['state'])) {
      echo "<input type=\"hidden\" id=\"params_state\" value=\"".$params['state']."\">\r\n";
  }
   ?>
  <?php
  if (isset($params['code'])) {
      echo "<input type=\"hidden\" id=\"params_code\" value=\"".$params['code']."\">\r\n";
  }
  ?>
  <div id="container" class="container-fluid">

    <div class="row">

      <!-- main -->
      <div class="col-lg-4 col-md-7 col-sm-12 col-sx12">

        <!-- scan -->
        <div class="panel panel-primary">
          <div class="panel-heading" data-toggle="collapse" href="#collapseScan" aria-expanded="true">
            <div class="panel-title"><i class="fa fa-print"></i>&nbsp;Scan</div>
          </div>
          <div id="collapseScan" class="panel-body panel-collapse collapse in">
            <div>
              <div class="col-md-6"><button type="button" id="scan" value="Scan" class="btn btn-primary btn-block" style="margin:1px;">Scan</button></div>
              <div class="clearfix"></div>
              <div class="col-md-6"><button type="button" id="scantobox" value="Scan To Box" class="btn btn-primary btn-block" style="margin:1px;">Scan To Box</button></div>
              <div class="col-md-6"><button type="button" id="scantodropbox" value="Scan To Dropbox" class="btn btn-primary btn-block" style="margin:1px;">Scan To Dropbox</button></div>
              <div class="clearfix"></div>
              <div class="col-md-6"><button type="button" id="scantogoogledrive" value="Scan To Google Drive" class="btn btn-primary btn-block" style="margin:1px;">Scan To Google Drive</button></div>
              <div class="col-md-6"><button type="button" id="scantoonedrive" value="Scan To OneDrive" class="btn btn-primary btn-block" style="margin:1px;">Scan To OneDrive</button></div>
              <div class="clearfix"></div>
              <div class="col-md-6"><button type="button" id="scantoonedriveforbusiness" value="Scan To OneDrive for Business" class="btn btn-primary btn-block" style="margin:1px;">Scan To OneDrive for Business</button></div>
              <div class="col-md-6"><button type="button" id="scantosalesforce" value="Scan To Salesforce" class="btn btn-primary btn-block" style="margin:1px;">Scan To Salesforce</button></div>
              <div class="clearfix"></div>
              <div class="col-md-6"><button type="button" id="scantoawss3" value="Scan To AWS S3" class="btn btn-primary btn-block" style="margin:1px;">Scan To AWS S3</button></div>
              <div class="clearfix"></div>
              <div class="col-md-6"><button type="button" id="scanwithocr" value="Scan To Specify OCR Area (preview)" class="btn btn-primary btn-block" style="margin:1px;">Scan To Specify OCR Area (preview)</button></div>
              <div class="col-md-6"><button type="button" id="scanbyflatbed" value="Scan By Flatbed" class="btn btn-primary btn-block" style="margin:1px;">Scan By Flatbed</button></div>
            </div>
            <div class="clearfix"></div>
            <div>
              <div class="col-md-12">
                <i class="fa fa-user"></i>&nbsp;Login&nbsp;(open new window)
              </div>
              <div id="collapseLoginUrl" class="col-md-12 collapse in">
                <div class="col-md-2">
                  <a href="https://app.box.com/login" target="_blank" rel="noopener">box</a>
                </div>
                <div class="col-md-2">
                  <a href="https://www.dropbox.com/login" target="_blank" rel="noopener">Dropbox</a>
                </div>
                <div class="col-md-2">
                  <a href="https://accounts.google.com/ServiceLogin?service=wise&passive=true&continue=http%3A%2F%2Fdrive.google.com%2F%3Futm_source%3Dja&utm_medium=button&utm_campaign=web&utm_content=gotodrive&usp=gtd&ltmpl=drive" target="_blank" rel="noopener">Google Drive</a>
                </div>
                <div class="col-md-4">
                  <a href="https://onedrive.live.com/" target="_blank" rel="noopener">OneDrive</a>/<a href="https://onedrive.live.com/about/business/" target="_blank" rel="noopener">For Business</a>
                </div>
                <div class="col-md-2">
                  <a href="https://login.salesforce.com/" target="_blank" rel="noopener">Salesforce</a>
                </div>
              </div>
            </div>
            <div style="margin-bottom: 10px;">
            <div>
              <i class="fa fa-cloud-upload"></i>&nbsp;Uploader URL
            </div>
            <div id="collapseUploaderUrl" class="collapse in">
              <input class="form-control" id="scan_uploader" value="" />
            </div>
            <div>
              <div class="col-md-12">
                <i class="fa fa-save"></i>&nbsp;Saved Images URL&nbsp;(<a href="" id="scan_upload_link">open new window</a>)
              </div>
            </div>
            <div id="collapseUploaderLink" class="collapse in">
              <input class="form-control" id="scan_upload" value="" />
            </div>
            </div>
            <div>
              <div class="col-md-12">
                <i class="fa fa-cog"></i>&nbsp;Scan Setting
              </div>
              <div class="col-md-3">
                <button type="button" id="setting_local" value="local" class="btn btn-primary btn-xs btn-block">This Server</button>
              </div>
              <div class="col-md-3" style="display:none;">
                <button type="button" id="setting_desktop" value="desktop" class="btn btn-primary btn-xs btn-block">Desktop</button>
              </div>
              <div class="col-md-3">
                <button type="button" id="setting_box" value="box" class="btn btn-primary btn-xs btn-block">box</button>
              </div>
              <div class="col-md-3">
                <button type="button" id="setting_dropbox" value="dropbox" class="btn btn-primary btn-xs btn-block">Dropbox</button>
              </div>
              <div class="col-md-3">
                <button type="button" id="setting_googledrive" value="googledrive" class="btn btn-primary btn-xs btn-block">Google Drive</button>
              </div>
              <div class="col-md-3">
                <button type="button" id="setting_onedrive" value="onedrive" class="btn btn-primary btn-xs btn-block">OneDrive</button>
              </div>
              <div class="col-md-3">
                <button type="button" id="setting_onedrive_for_business" value="onedrive_for_business" class="btn btn-primary btn-xs btn-block">OneDrive for Business</button>
              </div>
              <div class="col-md-3">
                <button type="button" id="setting_salesforce" value="salesforce" class="btn btn-primary btn-xs btn-block">Salesfoce</button>
              </div>
              <div class="col-md-3">
                <button type="button" id="setting_aws_s3" value="aws_s3" class="btn btn-primary btn-xs btn-block">AWS S3</button>
              </div>
              <div class="clearfix"></div>
              <div class="col-md-3">
                <button type="button" id="setting_dropout_color_red" value="dropout_color_red" class="btn btn-primary btn-xs btn-block">Dropout Color Red</button>
              </div>
              <div class="col-md-3">
                <button type="button" id="setting_dropout_color_green" value="dropout_color_green" class="btn btn-primary btn-xs btn-block">Dropout Color Green</button>
              </div>
              <div class="col-md-3">
                <button type="button" id="setting_dropout_color_blue" value="dropout_color_blue" class="btn btn-primary btn-xs btn-block">Dropout Color Blue</button>
              </div><!--
              <div class="col-md-3">
                <button type="button" id="setting_dropout_color_blue" value="dropout_color_blue" class="btn btn-primary btn-xs btn-block">Dropout Color Elimination</button>
              </div>-->
              <div class="col-md-3">
                <button type="button" id="setting_barcode" value="barcode" class="btn btn-primary btn-xs btn-block">Barcode</button>
              </div>
            <div class="clearfix"></div>
              <div class="col-md-6">
                <button type="button" id="setting_preview" value="preview" class="btn btn-primary btn-xs btn-block">Specify OCR Area (preview)</button>
              </div>
              <div class="col-md-6">
                <button type="button" id="setting_flatbed" value="flatbed" class="btn btn-primary btn-xs btn-block">Flatbed Scanner</button>
              </div>
            </div>
            <div class="clearfix"></div>
            <div id="collapseScanSetting" class="panel-body panel-collapse collapse in" style="padding:0px;">
              <textarea id="settings_body" wrap="hard" class="form-control" rows="7"></textarea>
            </div>
            <div class="col-md-6"></div>
            <div class="col-md-6"><button type="button" id="scansetparam" value="Scan Set Param" class="btn btn-primary btn-block" style="margin:1px;">Scan Set Param</button></div>
            <div class="clearfix"></div>
            <div>
              <i class="fa fa-image"></i>&nbsp;Scanned Data
            </div>
            <div>
              <div id="response_scandata" style="height: 400px; margin-bottom:5px; border: 1px solid #ccc; border-radius: 4px; background-color: lightgray; overflow: auto;"></div>
            </div>
            <div class="clearfix"></div>
            <div class="col-md-12">
              <button type="button" id="clear_spefified_ocr_area" value="clear_spefified_ocr_area" class="btn btn-primary btn-xs btn-block">Clear Specified OCR Area</button>
            </div>
          </div>
        </div>
        <!-- scan -->

        <!-- function -->
        <div class="panel panel-primary">
          <div class="panel-heading" data-toggle="collapse" href="#collapseFunction" aria-expanded="true">
            <div><i class="fa fa-wrench"></i>&nbsp;Function</div>
          </div>
          <div id="collapseFunction" class="panel-body panel-collapse collapse in">
            <a name="#detail"></a>
            <form id="form_detail">
              <div>
                <div class="col-md-6"><button type="button" id="getscannerlist" value="getScannerList" class="btn btn-primary btn-block">getScannerList</button></div>
                <div class="clearfix"></div>
                <div class="col-md-6"><button type="button" id="connection" value="connectScanner" class="btn btn-primary btn-block">connectScanner</button></div>
                <div class="col-md-6"><button type="button" id="disconnection" value="disconnectScanner" class="btn btn-primary btn-block">disconnectScanner</button></div>
                <div class="col-md-6"><button type="button" id="updatesettings" value="updateSettings" class="btn btn-primary btn-block">updateSettings</button></div>
                <div class="col-md-6"><button type="button" id="getsettings" value="getSettings" class="btn btn-primary btn-block">getSettings</button></div>
                <div class="clearfix"></div>
                <div class="col-md-6"><button type="button" id="startscan" value="startScan" class="btn btn-primary btn-block">startScan</button></div>
                <div class="col-md-6" style="display:none;"><button type="button" id="cancelscan" value="cancelScan" class="btn btn-primary btn-block">cancelScan</button></div>
                <div class="clearfix"></div>
                <div class="col-md-6"><button type="button" id="getscanstate" value="getScanState" class="btn btn-primary btn-block">getScanState</button></div>
                <div class="col-md-6"><button type="button" id="monitorscanstate" value="monitorScanState" class="btn btn-primary btn-block">monitorScanState</button></div>
                <div class="clearfix"></div>
                <div class="col-md-6"><button type="button" id="getfilelist" value="getFileList" class="btn btn-primary btn-block">getFileList</button></div>
                <div class="clearfix"></div>
              </div>
              <div class="clearfix"></div>
              <div>
                scanner_id<input class="form-control" id="scanner_id" value="" />
                connection_id<input class="form-control" id="connection_id" value="" />
                scan_id<input class="form-control" id="scan_id" value="" />
                status<input class="form-control" id="status" value="" />
              </div>
            </form>
          </div>
        </div>
        <!-- function -->

      </div>
      <!-- main -->

      <!-- result -->
      <div class="col-lg-4 col-md-5 col-sm-12 col-sx12">
        <!-- response -->
        <div class="panel panel-primary">
          <div class="panel-heading" data-toggle="collapse" href="#collapseResult" aria-expanded="true">
            <div id="response">
              <div id="response_title">
                <div><i class="fa fa-file"></i>&nbsp;Response</div>
              </div>
            </div>
          </div>
          <div id="collapseResult" class="panel-body panel-body panel-collapse collapse in">
            <i class="fa fa-check"></i>&nbsp;Response(success)<br>
            <textarea id="response_body" wrap="hard" class="form-control" rows="16"></textarea>
            <i class="fa fa-remove"></i>&nbsp;Response(error)<br>
            <textarea id="response_error" wrap="hard" class="form-control" rows="12"></textarea>
            <div class="col-md-12">
              <button type="button" id="clear_all" value="Clear" class="btn btn-primary btn-block"><i class="fa fa-trash"></i>&nbsp;Clear</button>
            </div>
          </div>
        </div>
        <!-- response -->
      </div>
      <!-- result -->

      <!-- auth -->
      <div class="col-lg-4 col-md-5 col-sm-12 col-sx12">
        <div class="panel panel-primary">
          <div class="panel-heading" data-toggle="collapse" href="#collapseAuth" aria-expanded="true">
            <div id="auth">
              <div id="auth_title">
                <div><i class="fa fa-user"></i>&nbsp;OAuth2.0</div>
              </div>
            </div>
          </div>
          <div id="collapseAuth" class="panel-body panel-body panel-collapse collapse in">
            <a name="#auth"></a>
            <form id="form_auth">
              <div>
                <div class="col-md-6"><button type="button" id="clear_webstorage" value="clear webstorage" class="btn btn-primary btn-block">clear webstorage</button></div>
                <div class="col-md-6"><button type="button" id="save_webstorage" value="save" class="btn btn-primary btn-block">save</button></div>
                webstorage key
                <input class="form-control" id="target_webstorage_key" value="" />
                access_token
                <input class="form-control" id="target_oauth_access_token" value="" />
                refresh_token
                <input class="form-control" id="target_oauth_refresh_token" value="" />
                <hr>
                client_id
                <input class="form-control" id="target_oauth_client_id" value="" />
                client_secret
                <input class="form-control" id="target_oauth_client_secret" value="" />
                redirect_uri
                <input class="form-control" id="target_oauth_redirect_uri" value="" />
                <hr>
                <div class="col-md-6"><button type="button" id="authorize_link" value="authorize" class="btn btn-primary btn-block">authorize</button></div>
                <div class="clearfix"></div>
                authorize endpoint<br>
                <input class="form-control" id="target_authorize" value="" />
                authorize additional parameter<br>
                <textarea class="form-control" id="target_authorize_parameter" wrap="hard" value="" rows="6"></textarea>
                <hr>
                <div class="col-md-6"><button type="button" id="get_access_token" value="get_access_token" class="btn btn-primary btn-block">get_access_token<br/>(redirect ScanServer)</button></div>
                <div class="col-md-6"><button type="button" id="refresh_access_token" value="refresh_access_token" class="btn btn-primary btn-block">refresh_access_token<br/>(redirect ScanServer)</button></div>
                <div class="clearfix"></div>
                token endpoint
                <input class="form-control" id="target_token" value="" />
                code
                <input class="form-control" id="target_oauth_code" value="" />
                other parameter
                <textarea class="form-control" id="target_oauth_other_param" wrap="hard" value="" rows="4"></textarea>
              </div>
            </form>
          </div>
        </div>
      </div>
      <!-- auth -->

    </div>

    <div class="row">
      <div class="text-center">Copyight &copy; 2016 - 2019 CANON ELECTRONICS INC.</div>
      <div class="text-center">
        <ul class="list-inline">
          <li class="small">Box and the Box logo are trademarks of Box, Inc.</li>
          <li class="small">Dropbox and the Dropbox logo are trademarks of Dropbox, Inc.</li>
          <li class="small">Google Drive and the Google Drive logo are trademarks of Google Inc.</li>
          <li class="small">OneDrive and the OneDrive logo are trademarks of Microsoft Corporation.</li>
          <li class="small">Salesforce and the Salesforce logo are trademarks of salesforce.com, inc</li>
          <li class="small">AWS are trademarks of Amazon Technologies, Inc.</li>
        </ul>
      </div>
      <div class="text-center">2022.02</div>
    </div>

  </div>
  <!-- container -->

  <div id="maskingLoader" style="display:none">
    <div>
      <img src="img/loading.gif" alt="Now Loading..." />
    </div>
  </div>

  <!-- Specify OCR Area Message Modal -->
  <div class="modal fade" id="specifyOcrAreaMessageModal" tabindex="-1" role="dialog" aria-labelledby="specifyOcrAreaMessageModalLabel">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="specifyOcrAreaMessageModalLabel">Next Step Description</h4>
        </div>
        <div class="modal-body">
          <ol>
          <li>Drag and Drop for OCR area of Scanned Data.
            <div style="height: 150px;">
              <div id="sample_image" style="position: absolute;width: 202px;height: 152px;border: 1px solid #ddd;">
              </div>
            </div>
          </li>
          <li>Prepair to scan again.</li>
          <li>Press 'Scan specified OCR area' after selecting OCR area.</li>
          </ol>
        </div>
        <div class="modal-footer" style="text-align:left;">
          <div class="checkbox">
            <label><input type="checkbox" value="" id="skipSpecifyOcrAreaMessageModal">Don't show this again</label>
          </div>
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
  <!-- Specify OCR Area Message Modal -->

  <!-- User Message Mordeless -->
  <div class="modal fade" id="userPinModeless" tabindex="-1" role="dialog" style="z-index:10002;">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">Scan Started on Flatbed Scanner</h4>
        </div>
        <div class="modal-body">

          <p class="text-info">The following message are your scan job information.<span class="text-warning">Please scan within about <strong>10 minutes</strong>.</span></p>
          <dl class="dl-horizontal" style="margin-bottom: 0px;">
            <dt>Started date</dt>
              <dd id="registered_date"></dd>
            <dt>Message</dt>
              <dd id="scanner_message_web" style="font-size:20px;">
              <div id="scanner_message_web_en">
              <ol>
                <li>Set documents on flatbed</li>
                <li>Press <img src="img/start_scan.png" alt="Start Botton" /> (Scan Start)</li>
                <li>Set NEXT documents on flatbed</li>
                <li>Repeat steps 2-3</li>
                <li>Press <img src="img/stop_scan.png" alt="Stop Botton" /> (End scanning)</li>
              </ol>
              </div>
          </dl>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
  <!-- User Message Mordeless -->

</body>
</html>
