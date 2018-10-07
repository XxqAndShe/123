# pdf-js-demo
a demo of pdf.js with crossing domain using (http://115.159.119.52/education_lib/backend/web/site/pdf?file=http://otp88c4y4.bkt.clouddn.com/163.pdf)
# Download
down pdf.js form offical web site (http://mozilla.github.io/pdf.js/)  
# Install
unzip the archive file and move it to you accessable directory  
# Usage
import js files in you front-end file,
```
<?php
//make sure in order
$this->registerJsFile("@web/js/l10n.js");
$this->registerJsFile("@web/js/pdf.js");
$this->registerJsFile("@web/js/pdf.worker.js");
$this->registerJsFile("@web/js/viewer.js");
$this->registerCssFile("@web/css/viewer.css");
?>
```
# CrossDomain
defaultly you can render PDF file with setting ```var DEFAULT_URL = 'your file';``` in viewer.js, but if you input a remote url,this will no longer work.
to use a remote url, add your Domain to ```var HOSTED_VIEWER_ORIGINS``` over line 2000, and make sure your remote server surportting CORS, you shall get your file rendered properlly
