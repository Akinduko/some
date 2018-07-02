
/*
Copyright 2016 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
var app = ( () => {
  'use strict';

   const logResult = result => {
    console.log(result);
    let value=$("#amount").val();
    let currency_1=document.querySelector('#mySelect').value;
    let currency_2=document.querySelector('#mySelect1').value;
    let message = document.getElementById('feedback-text');  
    let check =`${currency_1}_${currency_2}`
    let rate = Object.values(result)[0];
    let fx =`${rate * value} ${currency_2}`;
    let answer =`${value} ${currency_1} is equivalent to ${fx}`;
    $("#modal-title").hide();
    $("#feedback-text").show();
    message.textContent = answer;
  }

  const logError = error => {
    console.log('Looks like there was a problem: \n', error);
  }

  if (!('fetch' in window)) {
    console.log('Fetch API not found, try including the polyfill');
    return;
  }

  const validateResponse = response => {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }

  const readResponseAsJSON = response => {
    return response.json();
  }

  const readResponseAsText = response => {
    return response.text();
  }

   const showText = responseAsText => {
    let message = document.getElementById('message');
    message.textContent = responseAsText;
  }

  /* NOTE: Never send unencrypted user credentials in production! */
  const getRequest = ()  => {
    let currency1=document.querySelector('#currency_1');
    let currency2=document.querySelector('#currency_2');
    const url = `https://free.currencyconverterapi.com/api/v5/convert?q=${currency1.value}_${currency2.value}&compact=ultra`;
    fetch(url, {
      method: 'GET',
      'mode': 'no-cors'
    })
    .then(validateResponse)
    .then(readResponseAsText)
    .then(logResult)
    .catch(logError);
  }

    const url = 'https://free.currencyconverterapi.com/api/v5/currencies';
    fetch(url, {
      method: 'GET',
      'mode': 'no-cors'
    })
    .then(validateResponse)
    .then(response => {
    let message= response.data;
    //const outputs=message["results"];
    //let list =Object.keys(outputs);
    return response.json();
    })
    .then(response => {
    const outputs=response["results"];
    let array =Object.keys(outputs);
    let currency_1 = document.getElementById("currency_1");
    let currency_2 = document.getElementById("currency_2");
    //Create and append select list
    let selectList = document.createElement("select");
    let selectList1 = document.createElement("select");
    selectList.setAttribute("id", "mySelect");
    selectList1.setAttribute("id", "mySelect1");
    currency_1.appendChild(selectList1);
    currency_2.appendChild(selectList);
    //Create and append the options
    for (let i = 0; i < array.length; i++) {
        let option = document.createElement("option");
        let option1 = document.createElement("option");
        option.setAttribute("value", array[i]);
        option1.setAttribute("value", array[i]);
        option.text = array[i];
        option1.text = array[i];
        selectList.appendChild(option);
        selectList1.appendChild(option1);
    }

    })
    .catch(logError);
    $(document).ready(function(){
        $("#button").click(function(){
            $("#feedback-text").hide();
            $("#modal-title").show();
            let amount=$("#amount").val();
            let currency1=document.querySelector('#currency_1');
            let currency2=document.querySelector('#currency_2');
            if (amount && currency1 && currency2)
            {
            let fromCurrency=document.querySelector('#mySelect');
            let toCurrency=document.querySelector('#mySelect1');
            const url = `https://free.currencyconverterapi.com/api/v5/convert?q=${fromCurrency.value}_${toCurrency.value}&compact=ultra`;
            fetch(url, {
              method: 'GET',
              'mode': 'no-cors'
            })
            .then(validateResponse)
            .then(readResponseAsJSON)
            .then(logResult)
            .catch(logError);
            }
            else {
             alert('Please fill all inputs')
            }
        });
    });


  // Don't worry if you don't understand this, it's not part of the Fetch API.
  // We are using the JavaScript Module Pattern to enable unit testing of
  // our functions.
  return {
    readResponseAsJSON: (readResponseAsJSON),
    readResponseAsText: (readResponseAsText),
    validateResponse: (validateResponse),
    getRequest: (getRequest)
  };

})();

