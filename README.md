<p align="center">
    <img title="Flutterwave" src="https://quikgem-repo.s3.amazonaws.com/bizlogotext.png" width="50%"/>
</p>

# Bizgem NodeJS Library

![npm](https://img.shields.io/npm/v/bizgem-sdk-node)
![NPM](https://img.shields.io/npm/l/bizgem-sdk-node)

[comment]: <> (![Node.js Package]&#40;https://github.com/Bizgem/bizgem-sdk-node/workflows/Node.js%20Package/badge.svg&#41;)
[comment]: <> (![npm]&#40;https://img.shields.io/npm/dt/bizgem-sdk-node&#41;)



### How to use with Nodejs SDK

`npm install bizgem-sdk-node`


```javascript
import { BPG } from 'bizgem-sdk-node';

```

For staging, Use TEST API Keys and for production, use LIVE API KEYS.
You can get your PUBLIC_KEY and SECRET_KEY from the Bizgem dashboard.

Go [here](https://dashboard.bizgem.io/settings/settings) to get your API Keys.

Turn on Sandbox to get TEST API KEYS and Turn off Sandbox to get LIVE API KEYS

## Bizgem Services exposed by the library

**1**.  **COLLECTION**

* Payment by transfer

For more information on the services listed above, visit the [Bizgem website](https://bizgem.io)




## COLLECTION


### ```payment by transfer```

This describes how to collect payment by transfer on bizgem.



```javascript
import { BPG } from 'bizgem-sdk-node';

function generateUUID() {
    let d = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c) {
        let r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c==='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return 'BZIGEM-'+uuid.toUpperCase();
}

function onCancel(data){
    console.log('Transaction Cancelled',data)
}
function onSuccess(data){
    console.log('Transaction Succeeded',data)
}
function onFailure(data){
    console.log('Transaction Failed',data)
}

function payWithBankTransfer() {
    BPG.pay({
        publicKey:"PK-00000001110000000111-PROD-E9CCA968BEEFD98089D3CDAC4053FE49FA422B92F290FQWWEFEFRF", //(required) your public key, this is gotten from dashboard
        fullName:"Anthony Morah", //(required) name of the person paying
        email:"cmmorah1@gmail.com", //(required) email of the person paying
        phoneNumber:"09049957786", //(required) phone number of the person paying
        amount:"100", //(required) the transaction amount
        narration:"Test Sdk Example",//(required) description of the transaction
        reference:generateUUID(), //(optional) unique transaction identifier
        logo:null, // (optional) logo url
        redirectUrl:"http://localhost:63343/", // (optional) when the value is null it assumes the current url
        onCancel:onCancel, // (optional) the function to be triggered on a cancelled transaction
        onSuccess:onSuccess, // (optional) the function to be triggered on a successful transaction
        onFailure:onFailure // (optional) the function to be triggered on a failed transaction
    })
}

payWithBankTransfer()

```

### How to use with CDN

`<script src="https://cdn.bizgem.io/sdk/1.0.2/index.js"></script>`

## COLLECTION


### ```payment by transfer```


```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="https://cdn.bizgem.io/sdk/1.0.2/index.js"></script>
</head>
<body>
  <button onclick="payWithBankTransfer()">Pay With Bank Transfer</button>
  <script>
      function generateUUID() {
          let d = new Date().getTime();
          let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c) {
              let r = (d + Math.random()*16)%16 | 0;
              d = Math.floor(d/16);
              return (c==='x' ? r : (r&0x7|0x8)).toString(16);
          });
          return uuid.toUpperCase();
      }

      let reference = generateUUID()

      function payWithBankTransfer() {
          console.log(">>>>>>")
          BPG.pay({
              publicKey:"PK-00000001110000000111-PROD-E9CCA968BEEFD98089D3CDAC4053FE49FA422B92F290FQWWEFEFRF", //(required) your public key, this is gotten from dashboard
              fullName:"Anthony Morah", //(required) name of the person paying
              email:"cmmorah1@gmail.com", //(required) email of the person paying
              phoneNumber:"09049957786", //(required) phone number of the person paying
              amount:"100", //(required) the transaction amount
              narration:"Test Sdk Example",//(required) description of the transaction
              reference:generateUUID(), //(optional) unique transaction identifier
              logo:null, // (optional) logo url
              redirectUrl:"http://localhost:63343/", // (optional) when the value is null it assumes the current url
              onCancel:onCancel, // (optional) the function to be triggered on a cancelled transaction
              onSuccess:onSuccess, // (optional) the function to be triggered on a successful transaction
              onFailure:onFailure // (optional) the function to be triggered on a failed transaction
          })
      }
      function onCancel(data){
          console.log('Transaction Cancelled',data)
      }
      function onSuccess(data){
          console.log('Transaction Succeeded',data)
      }
      function onFailure(data){
          console.log('Transaction Failed',data)
      }
  </script>
</body>
</html>
```