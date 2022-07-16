(function () {

    function BootstrapBpg(options) {
        this.defaults = options;
        this.apiBaseUrl = 'https://api.bizgem.io';
        this.iframeBaseUrl = 'https://checkout.bizgem.io';
        this.apiUrl = '';
        this.iframeUrl = '';
        this.pendingCode = '09'
        this.successCode = '00'
        this.cancelCode = '17'
        this.traceId = null
        this.reference = null
        this.publicKey = null
    }

    window.BPG = function () {
        return {
            pay: function (options) {
                let defaults = {
                    fullName: options.fullName || null,
                    buttonId: options.buttonId || "bpg-button",
                    email: options.email || null,
                    phoneNumber: options.phoneNumber || null,
                    amount: options.amount || null,
                    narration: options.narration || null,
                    logo: options.logo || null,
                    redirectUrl: options.redirectUrl || window.location.href,
                    reference: options.reference || null,
                    publicKey: options.publicKey || null,
                    enableFrame: options.enableFrame || true,
                    generateButton: options.generateButton || false,
                    onCancel: options.onCancel,
                    onFailure: options.onFailure,
                    onSuccess: options.onSuccess,
                }
                if (options.generateButton) this.createButton();
                else validateParameters(defaults);
            }
        }
    }();

    function validateParameters(defaults) {
        let parametersValidation = {
            fullName: defaults.fullName,
            email: defaults.email,
            phoneNumber:defaults.phoneNumber,
            amount: defaults.amount,
            reference: defaults.reference
        };

        let errorList = "";
        const errorUrlParamBuilder = {};

        for (const p in  parametersValidation) {
            if (!parametersValidation[p]) {
                errorList += p + " is required \n";
                errorUrlParamBuilder[p] = p + " is required";
            }
            if (p === "amount" && parametersValidation[p] < 0) {
                errorList += p + " cant be less than zero \n";
                errorUrlParamBuilder[p] = p + " cant be less than zero";
            }
        }

        if (defaults.email) {
            if(!validateEmail(defaults.email)) {
                errorList += "Email is not valid \n";
                errorUrlParamBuilder["email"] = "Email is not valid";
            } else parametersValidation['email'] = defaults.email;
        }

        if (errorList.length > 0) {
            if (typeof window[parametersValidation['callback']] === 'function') {
                const callback = evaluateFunction(parametersValidation['callback']);
                callback.call(this, {code: "E00", message: "Missing Parameters", data: errorUrlParamBuilder}, null);
            } else {
                window.location.href = defaults.redirectUrl//parameters['callback'] + "?" + encodeQueryData(errorUrlParamBuilder);
            }
            return;
        }
        initializeBpg(defaults).then(() => {});
    }

    async function initializeBpg(parameters) {
        const pg = new BootstrapBpg(parameters);
        pg.publicKey = parameters.publicKey
        delete parameters.publicKey
        let apiUrl = `${pg.apiBaseUrl}/inward/post-from-sdk`
        let response = {}
        await apiPost(apiUrl, parameters, pg.publicKey).then(resp=>{response=resp}).catch(e=>console.error(e))
        console.log(response)
        pg.traceId = response.traceId
        pg.reference = response.reference
        if (response.responseCode !== pg.successCode){
            pg.executeFunction(pg.defaults.onFailure, response)
            return
        }
        pg.iframeUrl = `${pg.iframeBaseUrl}/payment/${pg.traceId}/${pg.reference}`
        if (pg.defaults.enableFrame) {
            pg.loadIframe(parameters);
        } else {
            window.location.href = pg.iframeUrl;
        }
    }

    function showLoader () {
        this.div = document.createElement('div');
        this.div.id = 'bpg-loader-component';
        this.innerDiv = document.createElement('div');
        this.innerDiv.id = 'bpg-loader-inner-component';
        this.innerDiv.setAttribute('style', 'display:flex;justify-content: center;align-items: center;width: 100%;top: 0;left: 0;bottom: 0;right: 0;height: 100%;z-index: 1000000000;position: absolute;background-color: rgba(187,220,255,0.51);');
        this.span = document.createElement('span');
        this.span.id = 'bpg-loader-span-component';
        this.span.setAttribute('style', 'display: inline-block;width: 2rem;height: 2rem;vertical-align: text-bottom;border: 0.25em solid #3F88C5;border-right-color: transparent;border-radius: 50%;-webkit-animation: spinner-border 0.75s linear infinite;animation: spinner-border 0.75s linear infinite;');
        this.div.insertAdjacentHTML('beforeend', `<style>@keyframes spinner-border {to { transform: rotate(360deg);}}</style>`)
        this.innerDiv.appendChild(this.span);
        this.div.appendChild(this.innerDiv);
        document.body.appendChild(this.div);
    }

    function hideLoader () {
        let loader = document.getElementById('bpg-loader-component');
        loader.remove()
    }

    async function apiPost(url = '', data = {}, auth) {
        showLoader()
        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json', 'Authorization': auth},
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data)
        });
        hideLoader()
        return  response.json()

    }

    function evaluateFunction(string) {
        try {
            return eval(string)
        } catch (err) {
            return string
        }
    }

    function validateEmail(email) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    BootstrapBpg.prototype.listenForCloseEvent = function () {
        let clientSdkIframe = document.getElementById("bpg-frame-component")
        let self = this
        if (clientSdkIframe) {
            clientSdkIframe.onload = async function () {
                if (this.contentWindow.location) {
                    if (this.contentWindow.location.toString().includes(self.iframeBaseUrl)) return
                    self.closeIframe();
                    let response = {}
                    let request = {traceId: self.traceId, reference: self.reference}
                    let url = `${self.apiBaseUrl}/inward/tsq`
                    await apiPost(url, request, self.publicKey).then(resp=>{response=resp}).catch(e=>console.error(e))
                    console.log(response)
                    if (response.responseCode === self.successCode) {
                        console.log(response.responseCode)
                        self.executeFunction(self.defaults.onSuccess, request)
                    }
                    else if (response.responseCode === self.cancelCode) {
                        console.log(response.responseCode)
                        self.executeFunction(self.defaults.onCancel, request)
                    }
                }
            }
        }
    }

    BootstrapBpg.prototype.loadIframe = function () {
        this.div = document.createElement('div');
        this.div.id = "bpg-frame-component-container";
        this.div.setAttribute('style', "-webkit-overflow-scrolling: touch; overflow-y: scroll; position:fixed; left: 0; right: 0; bottom: 0; top: 0px; z-index: 1000000000;");
        this.iframe = document.createElement('iframe');
        this.iframe.src = this.iframeUrl;
        this.iframe.id = "bpg-frame-component";
        this.iframe.setAttribute('style', "z-index: 2147483647;display: block;border: 0px none transparent; overflow-x: hidden; overflow-y: auto; visibility: visible; margin: 0px; padding: 0px; -webkit-tap-highlight-color: transparent; width: 100%; @media only screen and (max-width: 600px) {margin-bottom: 30%}; height: 110%");
        this.iframeOpen = true;
        this.div.appendChild(this.iframe);
        document.body.appendChild(this.div);
        this.listenForCloseEvent();
    };

    BootstrapBpg.prototype.closeIframe = function () {
        if (this.iframeOpen) {
            this.iframe.style.display = "none";
            this.iframe.style.visibility = "hidden";
            this.iframeOpen = false;
            document.body.style.overflow = "";
        }
    }

    BootstrapBpg.prototype.executeFunction = function (fun, data) {
        let element = document.getElementById('bpg-frame-component-container');
        if (element) element.parentNode.removeChild(element);
        if (typeof event != 'undefined' && event.data) delete event.data.eventInstance;
        if (fun) fun(data)
        this.closeIframe();
    };

    BootstrapBpg.prototype.createButton = function () {
        let instance = this;
        let z = document.getElementById(instance.defaults.buttonId);
        let button_id = 'bpg_trigger' + instance.defaults.buttonId;
        z.innerHTML = '<input  style="width:' + instance.defaults.buttonSize + 'px" id="' + button_id + '" class="bpg_trigger" type="button" value="Pay With BPG">';
        z.addEventListener('click', function () {
            instance.loadIframe()
            return false;
        });
    };

}())