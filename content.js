"use strict";
class FormFill {

  constructor() {
    this.currentSet = 0,
    this.formFieldMap = {
      text: "text_field_1"
    };
  }

  csvJSON(csv) {
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

    return result;
  }

  setSelected(e) {
    console.log('Question Set changed');
    let values = document.getElementById('selectSet');
    console.log(e);

    this.updateFormFields();
  }

  getCSVFile(url) {
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

  getSetsAsSelect(data) {
    let options = "";
    let uniqueSets = {};
    data.forEach(function(item) {
      uniqueSets[item.set] = item.set;
    });
    Object.keys(uniqueSets).map(item => {
      options += `<option value="${item}">${item}</option>`;
    });
    return `
    <select id="selectSet" onchange="window.FormFill.setSelected()">
      ${options}
    </select>
    `;
  }

  updateFormFields() {

  }

  async autoPopulateForm(url, formFieldMap) {
    let data = await this.getCSVFile(url);
    let csv = this.csvJSON(data);
    let setPages = this.getSetsAsSelect(csv);
    var body = document.body;
    var formFillForm = document.createElement("div");
    formFillForm.setAttribute("id", "formFill");
    formFillForm.appendChild(document.createTextNode("Choose a question"));
    var sets = document.createElement("div");
    sets.innerHTML = `
      <div>
      <form>
        ${setPages}
      <form>
      </div>
    `;
    formFillForm.appendChild(sets);
    body.appendChild(formFillForm);
  }
}

window.FormFill = new FormFill();
window.FormFill.autoPopulateForm(
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRlTyLora9f19OaYhY1tT1Kbbp2XUL8loFMayZ0qoElCY61HnBGF7HKKntd7gK1-2Cq-YJ1yF4Jyl2H/pub?output=csv"
);
