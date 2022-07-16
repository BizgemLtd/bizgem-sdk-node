<p align="center">
    <img title="Flutterwave" src="https://quikgem-repo.s3.amazonaws.com/bizlogotext.png" width="50%"/>
</p>

# Bizgem NodeJS Library

![npm](https://img.shields.io/npm/v/bizgem-sdk-node)
![NPM](https://img.shields.io/npm/l/bizgem-sdk-node)

[comment]: <> (![Node.js Package]&#40;https://github.com/Bizgem/bizgem-sdk-node/workflows/Node.js%20Package/badge.svg&#41;)
[comment]: <> (![npm]&#40;https://img.shields.io/npm/dt/bizgem-sdk-node&#41;)



### How to use

`npm install bizgem-sdk-node`


```javascript
const Bizgem = require('bizgem-sdk-node');

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
const Bizgem = require('bizgem-sdk-node');

const payWithBankTransfer = () => {
    Bizgem.pay({
        publicKey:"PK-00000000990000000099-PROD-NI0MJEZNDQ2ODY1NDUZTED025282E9CCA968BEEFD98089D3CDAC4053FE49FWBNHAGRIIAFJE",
        fullName:"Anthony Morah",
        email:"cmmorah1@gmail.com",
        phoneNumber:"09049957786",
        amount:"100",
        narration:"Test Sdk Example",
        logo:null,
        redirectUrl:"http://localhost:63343/",
        onCancel:onCancel,
        onSuccess:onSuccess,
        onFailure:onFailure,
        reference:reference
    })
}

payWithBankTransfer();

```