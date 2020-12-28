var AWS_KEY = '<your key>';
var AWS_SECRET = '<your secret>';

function generateS3Url(bucket, path) {  
  var expiresDt = Math.floor(Date.now() / 1000) + (60 * 60 * 24); // can be up to 7 days from now
  
  var stringToSign = 'GET\n\n\n' + expiresDt + '\n/' + bucket + '/' + encodeURIComponent(path);
  
  var hmac = Utilities.computeHmacSignature(Utilities.MacAlgorithm.HMAC_SHA_1, stringToSign, AWS_SECRET, Utilities.Charset.UTF_8);
  var signed = encodeURIComponent(Utilities.base64Encode(hmac));
  
  return 'https://' + bucket + '.s3.amazonaws.com/' + path + '?AWSAccessKeyId=' + AWS_KEY + '&Expires=' + expiresDt + '&Signature=' + signed;
}

// Use "Resources" > "Current project's triggers" to run this on a schedule
function updateSheet() {
  var csvUrl = generateS3Url('my-bucket', 'my-file.csv');
  
  SpreadsheetApp.openById('<spreadsheet id>').getSheets()[0].getRange('A1').setFormula('=IMPORTDATA("' + csvUrl + '")');
}