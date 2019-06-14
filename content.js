// This is a published to the Web google spreadsheet, single sheet.
const url =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRlTyLora9f19OaYhY1tT1Kbbp2XUL8loFMayZ0qoElCY61HnBGF7HKKntd7gK1-2Cq-YJ1yF4Jyl2H/pub?output=csv";

//var csv is the CSV file with headers
function csvJSON(csv) {
  var lines = csv.split(/\r?\n|\r/);
  var result = [];
  var headers = lines[0].split(",");
  for (var i = 1; i < lines.length; i++) {
    var obj = {};
    var currentline = lines[i].split(",");
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }
    result.push(obj);
  }

  //return result; //JavaScript object
  return JSON.stringify(result); //JSON
}

function getCSVFile(url) {
  return new Promise(function(resolve, reject) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", url, true);
    rawFile.onreadystatechange = function() {
      if (rawFile.readyState === 4) {
        if (rawFile.status === 200 || rawFile.status == 0) {
          var allText = rawFile.responseText;
          resolve(allText);
        }
      }
    };
    rawFile.send(null);
  });
}

async function loadCSVData(url) {
  let data = await getCSVFile(url);
  let csv = csvJSON(data);
  console.log(csv);
}

loadCSVData(url);
