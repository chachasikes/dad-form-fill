"use strict";
$(document).ready(function() {
  class FormFill {

    constructor() {
      this.currentSet = 0,
      this.formFieldMap = {
        text: "text_field_1"
      };
      this.data = null;
      this.csvData = null;
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

    selectSet(e) {
      console.log('Question Set changed');
      let select = document.getElementById('selectSet');
      console.log(e);
      this.currentSet = select.options[select.selectedIndex].value;
      console.log('current set changed: ', this.currentSet);
      this.updateFormFields();
    }

    updateFormFields() {

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
      <select id="selectSet">
        ${options}
      </select>
      `;
    }

    async autoPopulateForm(url, formFieldMap) {
      let data = await this.getCSVFile(url);
      this.data = data;
      let csv = this.csvJSON(data);
      let groupedSets = {};
      let csvGrouped = csv.forEach(item => {
        if (groupedSets[item.set] === undefined) {
          groupedSets[item.set] = [];
          groupedSets[item.set].push(item);
        } else {
          groupedSets[item.set].push(item);
        }
      });
      this.csvData = groupedSets;
      console.log('grouped', this.csvData);
      let setPages = this.getSetsAsSelect(csv);
      var body = document.body;
      var formFillForm = document.createElement("div");
      formFillForm.setAttribute("id", "formFill");
      formFillForm.appendChild(document.createTextNode("Choose a question"));
      var sets = document.createElement("form");
      sets.innerHTML = `
        ${setPages}
      `;
      formFillForm.appendChild(sets);
      body.appendChild(formFillForm);

      document.querySelector('#selectSet').addEventListener('change', function(event) {
        this.selectSet(event);
      }.bind(this));
      return true;
    }
  }

  console.log("Loaded Form Fill Extension");
  // executes when HTML-Document is loaded and DOM is ready
  let formFill = new FormFill();
  formFill.autoPopulateForm(
   "https://docs.google.com/spreadsheets/d/e/2PACX-1vRlTyLora9f19OaYhY1tT1Kbbp2XUL8loFMayZ0qoElCY61HnBGF7HKKntd7gK1-2Cq-YJ1yF4Jyl2H/pub?output=csv"
  );
  window.FormFill = formFill;
});
