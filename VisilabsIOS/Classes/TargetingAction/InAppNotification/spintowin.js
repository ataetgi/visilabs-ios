function SpinToWin(config) {

  this.container = document.getElementById("container");
  this.canvasContainer = document.getElementById("canvas-container");
  this.wheelCanvas = document.getElementById("wheel-canvas");
  this.arrowCanvas = document.getElementById("arrow-canvas");
  this.wheelCanvasContext = this.wheelCanvas.getContext("2d");
  this.arrowCanvasContext = this.arrowCanvas.getContext("2d");
  this.closeButton = document.getElementById("spin-to-win-box-close");
  this.titleElement = document.getElementById("form-title");
  this.messageElement = document.getElementById("form-message");
  this.submitButton = document.getElementById("form-submit-btn");
  this.emailInput = document.getElementById("vl-form-input");
  this.consentContainer = document.getElementById("vl-form-consent");
  this.emailPermitContainer = document.getElementById("vl-permitform-email");
  this.consentCheckbox = document.getElementById("vl-form-checkbox");
  this.emailPermitCheckbox = document.getElementById("vl-form-checkbox-emailpermit");
  this.consentText = document.getElementById("vl-form-consent-text");
  this.emailPermitText = document.getElementById("vl-permitform-email-text");
  this.couponCode = document.getElementById("coupon-code");
  this.copyButton = document.getElementById("form-copy-btn");
  this.warning = document.getElementById("vl-warning");
  this.invalidEmailMessageLi = document.getElementById("invalid-email-message");
  this.checkConsentMessageLi = document.getElementById("check-consent-message");
    
  this.successMessageElement = document.getElementById("success-message");
    
  this.formValidation = {
    email: true,
    consent: true
  };
  this.spinCompleted = false;
  this.config = config;
  this.config.circle_R = window.innerWidth / 2;
  var r = parseFloat(config.circle_R);
  this.config.windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  this.config.r = (r * 2) > this.config.windowWidth ? 150 : r;
  this.config.language = "En";
  this.config.centerX = this.config.r;
  this.config.centerY = this.config.r;
  this.config.selectedPromotionCode = "";
  this.config.selectedSlice = {};

  this.convertStringsToNumber();
  this.setCloseButton();


  this.config.campaigns = this.config.slices;
  this.config.mailFormEnabled = config.mailSubscription;
  this.config.pickedColors = [];
  this.config.middleCircleR = this.config.r / 10;
  this.config.middleCircleColor = "#000";
  this.config.fontFamily = "sans-serif"; // TODO: default gelirse ne yapılacak?
  this.config.font_size = config.textSize + 10;
  this.config.isMobile = true;
  this.config.textDirection = "horizontal";
  this.config.angle = 2 * Math.PI / config.sliceCount;



  for (var i = 0; i < this.config.campaigns.length; i++) {
    this.config.pickedColors.push(this.config.campaigns[i].color);
  }

  this.config.slices = [], this.config.colors = [], this.config.promotionSlices = [], this.config.staticCodeSlices = [];

  for (var i = 0; i < this.config.campaigns.length; i++) {
    if (this.config.campaigns[i].type === "promotion") {
      this.config.promotionSlices.push(this.config.campaigns[i]);
    }
  }

  for (var i = 0; i < this.config.campaigns.length; i++) {
    if (this.config.campaigns[i].type === "staticcode") {
      this.config.staticCodeSlices.push(this.config.campaigns[i]);
    }
  }

  this.setContent();

  this.colorsHandler();
  this.textsHandler();
  this.styleHandler();
  //TODO: buna gerek olmayabilir, webview'de resize ihtimali var mı? kalmasında da zarar yok.
  window.onresize = function() {
    window.spinToWin.styleHandler();
  }

  this.drawArrow();


  for (var i = 0; i < config.sliceCount; i++) {
    this.sliceDrawer(i, config.colors[i]);
    this.mobileTextTyper(i, config.slices[i].displayName, config.colors[i]);
  }
  this.midCircleDrawer(config.middleCircleColor, config.middleCircleR);
  this.handleVisibility();

  window.spinToWin = this;
}

//promoAuth burada kullanılacak buna göre. hangi slice'in seçileceğine karar verilecek
//response false döndüğü zaman ne yapılacak
//_VTObjs["_VisilabsTarget_5"].Callback({"id":130,"success":false,"promocode":""})
SpinToWin.prototype.getPromotionCode = function() {
  if (window.Android) {
    Android.getPromotionCode();
  } else if (window.webkit.messageHandlers.eventHandler) {
    window.webkit.messageHandlers.eventHandler.postMessage({
      method: "getPromotionCode"
    });
  }
};

//auth burada kullanılacak.
SpinToWin.prototype.subscribeEmail = function() {
  if (window.Android) {
    Android.subscribeEmail(this.emailInput.value.trim());
  } else if (window.webkit.messageHandlers.eventHandler) {
    window.webkit.messageHandlers.eventHandler.postMessage({
      method: "subscribeEmail",
      email: this.emailInput.value.trim()
    });
  }
};

SpinToWin.prototype.close = function() {
  if (window.Android) {
    Android.close();
  } else if (window.webkit.messageHandlers.eventHandler) {
    window.webkit.messageHandlers.eventHandler.postMessage({
      method: "close"
    });
  }
};

SpinToWin.prototype.copyToClipboard = function() {
  if (window.Android) {
    Android.copyToClipboard(this.couponCode.innerText);
  } else if (window.webkit.messageHandlers.eventHandler) {
    window.webkit.messageHandlers.eventHandler.postMessage({
      method: "copyToClipboard",
      couponCode: this.couponCode.innerText
    });
  }
};

SpinToWin.prototype.convertStringsToNumber = function() {
  this.config.titleTextSize = isNaN(parseInt(this.config.titleTextSize)) ? 10 : parseInt(this.config.titleTextSize);
  this.config.textSize = isNaN(parseInt(this.config.textSize)) ? 5 : parseInt(this.config.textSize);
  this.config.buttonTextSize = isNaN(parseInt(this.config.buttonTextSize)) ? 20 : parseInt(this.config.buttonTextSize);
  this.config.consentTextSize = isNaN(parseInt(this.config.consentTextSize)) ? 5 : parseInt(this.config.consentTextSize);
  this.config.copybuttonTextSize = isNaN(parseInt(this.config.copybuttonTextSize)) ? 20 : parseInt(this.config.copybuttonTextSize);
};

SpinToWin.prototype.setContent = function() {
  this.container.style.backgroundColor = this.config.backgroundColor;
  this.titleElement.innerHTML = this.config.title.replace(/\\n/g, '<br/>');
  this.titleElement.style.color = this.config.titleTextColor;
  this.titleElement.style.fontFamily = this.config.titleFontFamily;
  this.titleElement.style.fontSize = (this.config.titleTextSize + 20) + "px";
  this.messageElement.innerHTML = this.config.message.replace(/\\n/g, '<br/>');
  this.messageElement.style.color = this.config.textColor;
  this.messageElement.style.fontFamily = this.config.textFontFamily;
  this.messageElement.style.fontSize = (this.config.textSize + 10) + "px";
  this.submitButton.innerHTML = this.config.buttonLabel;
  this.submitButton.style.color = this.config.buttonTextColor;
  this.submitButton.style.backgroundColor = this.config.buttonColor;
  this.submitButton.style.fontFamily = this.config.buttonFontFamily;
  this.submitButton.style.fontSize = (this.config.buttonTextSize + 20) + "px";
  this.emailInput.placeholder = this.config.placeholder;
  this.consentText.innerHTML = this.config.consentText;
  this.consentText.style.fontSize = (this.config.consentTextSize + 10) + "px";
  this.consentText.style.fontFamily = this.config.textFontFamily;
  this.emailPermitText.innerHTML = this.config.emailPermitText;
  this.emailPermitText.style.fontSize = (this.config.consentTextSize + 10) + "px";
  this.emailPermitText.style.fontFamily = this.config.textFontFamily;
  this.copyButton.innerHTML = this.config.copyButtonLabel;
  this.copyButton.style.color = this.config.copybuttonTextColor;
  this.copyButton.style.backgroundColor = this.config.copybuttonColor;
  this.copyButton.style.fontFamily = this.config.copybuttonFontFamily;
  this.copyButton.style.fontSize = (this.config.copybuttonTextSize + 20) + "px";
  this.invalidEmailMessageLi.innerHTML = this.config.invalidEmailMessage;
  this.invalidEmailMessageLi.style.fontSize = (this.config.consentTextSize + 10) + "px";
  this.invalidEmailMessageLi.style.fontFamily = this.config.textFontFamily;
  this.checkConsentMessageLi.innerHTML = this.config.checkConsentMessage;
  this.checkConsentMessageLi.style.fontSize = (this.config.consentTextSize + 10) + "px";
  this.checkConsentMessageLi.style.fontFamily = this.config.textFontFamily;
  
  this.couponCode.style.color = this.config.promocodeTextColor;
  this.couponCode.style.backgroundColor = this.config.promocodeBackgroundColor;
  this.couponCode.style.fontFamily = this.config.copybuttonFontFamily;
  this.couponCode.style.fontSize = (this.config.copybuttonTextSize + 20) + "px";
    
  this.successMessageElement.innerHTML = this.config.successMessage;
  this.successMessageElement.style.color = "green";
    
  this.submitButton.addEventListener("click", this.submit);
  this.closeButton.addEventListener("click", evt => this.close());
  this.copyButton.addEventListener("click", evt => this.copyToClipboard());
};

SpinToWin.prototype.validateForm = function() {
  var result = {
    email: true,
    consent: true
  };
  if (!this.validateEmail(this.emailInput.value)) {
    result.email = false;
  }
  if (!this.isNullOrWhitespace(this.consentText.innerText)) {
    result.consent = this.consentCheckbox.checked;
  }
  if (result.consent) {
    if (!this.isNullOrWhitespace(this.emailPermitText.innerText)) {
      result.consent = this.emailPermitCheckbox.checked;
    }
  }
  this.formValidation = result;
  return result;
};


SpinToWin.prototype.handleVisibility = function() {

  if (this.spinCompleted) {
    this.couponCode.style.display = "";
    this.copyButton.style.display = "";
    this.emailInput.style.display = "none";
    this.submitButton.style.display = "none";
    this.consentContainer.style.display = "none";
    this.emailPermitContainer.style.display = "none";
    this.warning.style.display = "none";
    this.successMessageElement.style.display = "";
    return;
  } else {
    this.couponCode.style.display = "none";
    this.copyButton.style.display = "none";
    this.successMessageElement.style.display = "none";
  }

  this.warning.style.display = "none";

  if (this.config.mailFormEnabled) {
    if (!this.formValidation.email || !this.formValidation.consent) {
      this.warning.style.display = "";
      if (this.formValidation.email) {
        this.invalidEmailMessageLi.style.display = "none";
      } else {
        this.invalidEmailMessageLi.style.display = "";
      }
      if (this.formValidation.consent) {
        this.checkConsentMessageLi.style.display = "none";
      } else {
        this.checkConsentMessageLi.style.display = "";
      }
    } else {
      this.warning.style.display = "none";
    }
  } else {
    this.emailInput.style.display = "none";
    this.consentContainer.style.display = "none";
    this.emailPermitContainer.style.display = "none";
  }
};

//TODO: randomNumber çalışıyor mu bak?
SpinToWin.prototype.colorsHandler = function() {
  if (this.config.pickedColors.length == 0) {
    for (var i = 0; i < this.config.sliceCount; i++) {
      this.config.colors.push("rgb(" + randomInt(0, 256) + "," + randomInt(0, 256) + "," + randomInt(0, 256) + ")");
    }
  } else if (this.config.pickedColors.length <= this.config.sliceCount) {
    for (var i = 0; i < this.config.sliceCount; i++) {
      if (i >= this.config.pickedColors.length) {
        this.config.colors.push(this.config.pickedColors[i % this.config.pickedColors.length]);
      } else {
        this.config.colors.push(this.config.pickedColors[i]);
      }
    }
  }
};

SpinToWin.prototype.textsHandler = function() {
  if (this.config.campaigns.length <= this.config.sliceCount) {
    for (var i = 0; i < this.config.sliceCount; i++) {
      if (i >= this.config.campaigns.length) {
        this.config.slices.push(this.config.campaigns[i % this.config.campaigns.length]);
      } else {
        this.config.slices.push(this.config.campaigns[i]);
      }
    }
  }
};

SpinToWin.prototype.styleHandler = function() {

  var wheelCanvasWidth = (config.r * 2),
    wheelCanvasHeight = (config.r * 2);
  this.wheelCanvas.width = wheelCanvasWidth;
  this.wheelCanvas.height = wheelCanvasHeight;
  var wheelCanvasStyle = {};
  wheelCanvasStyle.transform = "translateX(0px) rotate(" + this.randomInt(0, 360) + "deg)";
  wheelCanvasStyle.transitionProperty = "transform";
  wheelCanvasStyle.transitionDuration = "0s";
  wheelCanvasStyle.transitionTimingFunction = "ease-out";
  wheelCanvasStyle.transitionDelay = "0s";
  wheelCanvasStyle.borderRadius = "50%";
  Object.assign(this.wheelCanvas.style, wheelCanvasStyle);


  this.canvasContainer.style.position = "absolute";
  this.canvasContainer.style.bottom = (-wheelCanvasHeight / 2) + "px";




  var arrowContainerTop = (config.r - (config.r / 5.2)) + "px"; // R: 250 top: 205, R: 200 top: 162, R: 150 top: 121
  var styleEl = document.createElement("style"),
    styleString = "#lightbox-outer{}" +
    "#canvas-container{float:left;width:" + config.r + "px;height:" + (2 * config.r) + "px}" +
    "#wheel-container{float:left;height:" + (2 * config.r) + "px;width:" + config.r + "px;margin:20px 0;overflow:hidden}" +
    "#arrow-container{width:20px;height:30px;display:inline-block;position:absolute;box-sizing:border-box;top:calc(50% - 14px);left:" + (config.r - 10) + "px;z-index:1;transform:rotate(90deg)}" +
    "#form-container{width:300px;box-sizing:border-box;float:right}" +
    "#form-container>div{position:absolute;top:50%;transform:translateY(-50%);margin:0 30px;width: 240px;}" +
    "#form-title{text-align:center;}" +
    "#form-message{text-align:center;}" +
    "#success-message{text-align:center;}" +
    "#warning{display:none; position: absolute; z-index: 3; background: #fcf6c1; font-size: 12px; border: 1px solid #ccc; top: 105%;width: 100%; box-sizing: border-box;}" +
    "#warning>ul{margin: 2px;padding-inline-start: 20px;}" +
    "#form-consent{font-size:12px;color:#555;width:100%;padding:5px 0;position:relative;}" +
    "#form-aggreement-link{color:#555;opacity:.75;text-decoration:none}" +
    "#form-consent input[type='checkbox']{opacity:0;position:absolute}" +
    "#form-consent label{position:relative;display:inline-block;padding-left:18px}" +
    "#form-consent label::before," +
    "#form-consent label::after{position:absolute;content:'';display:inline-block;cursor:pointer}" +
    "#form-consent label::before{height:12px;width:12px;border:1px solid;left:0;top:0}" +
    "#form-consent label::after{height:4px;width:8.5px;border-left:2px solid;border-bottom:2px solid;transform:rotate(-45deg);left:2px;top:2px}" +
    "#form-consent input[type='checkbox']+label::after{content:none}" +
    "#form-consent input[type='checkbox']:checked+label::after{content:''}" +
    "#form-consent input[type='checkbox']:focus+label::before{outline:#3b99fc auto 5px}" +
    "#form-emailpermit{font-size:12px;color:#555;width:100%;padding:5px 0;position:relative;}" +
    "#form-emailpermit input[type='checkbox']{opacity:0;position:absolute}" +
    "#form-emailpermit label{position:relative;display:inline-block;padding-left:18px}" +
    "#form-emailpermit label::before," +
    "#form-emailpermit label::after{position:absolute;content:'';display:inline-block;cursor:pointer}" +
    "#form-emailpermit label::before{height:12px;width:12px;border:1px solid;left:0;top:0}" +
    "#form-emailpermit label::after{height:4px;width:8.5px;border-left:2px solid;border-bottom:2px solid;transform:rotate(-45deg);left:2px;top:2px}" +
    "#form-emailpermit input[type='checkbox']+label::after{content:none}" +
    "#form-emailpermit input[type='checkbox']:checked+label::after{content:''}" +
    "#form-emailpermit input[type='checkbox']:focus+label::before{outline:#3b99fc auto 5px}" +
    ".form-submit-btn{transition:.2s filter ease-in-out;}" +
    ".form-submit-btn:hover{filter: brightness(110%);transition:.2s filter ease-in-out;}" +
    ".form-submit-btn.disabled{filter: grayscale(100%);transition:.2s filter ease-in-out;}" +
    "@media only screen and (max-width:2500px){" +
    "#canvas-container{float:unset;width:100%;text-align:center;position:relative}" +
    "#wheel-container{width:" + (config.r * 2) + "px;margin:0 auto;float:unset;transform:rotate(-90deg)}" +
    "#arrow-container{top:" + arrowContainerTop + ";transform:rotate(45deg);left:calc(50% - 10px)}" +
    "#form-container{float:unset;width:100%;}" +
    "#form-container>div{transform:unset;top:unset;margin:20px;width:calc(100% - 40px)}" +
    "}";

  styleEl.id = "vl-styles";
  if (!document.getElementById("vl-styles")) {
    styleEl.innerHTML = styleString;
    document.head.appendChild(styleEl);
  } else {
    document.getElementById("vl-styles").innerHTML = styleString;
  }
};

//TODO: bunu css'e ekle
SpinToWin.prototype.getWheelCanvasStyle = function() {
  var wheelCanvasStyle = {};
  wheelCanvasStyle.transform = "translateX(0px) rotate(" + this.randomInt(0, 360) + "deg)";
  wheelCanvasStyle.transitionProperty = "transform";
  wheelCanvasStyle.transitionDuration = "0s";
  wheelCanvasStyle.transitionTimingFunction = "ease-out";
  wheelCanvasStyle.transitionDelay = "0s";
  wheelCanvasStyle.borderRadius = "50%";
  return wheelCanvasStyle;
};


SpinToWin.prototype.drawArrow = function() {
  this.arrowCanvasContext.beginPath();
  this.arrowCanvasContext.moveTo(0, 0);
  this.arrowCanvasContext.lineTo(config.centerX + 100, config.centerY);
  this.arrowCanvasContext.lineTo(config.centerX, config.centerY + 100);
  this.arrowCanvasContext.closePath();
  this.arrowCanvasContext.lineWidth = 30;
  this.arrowCanvasContext.strokeStyle = '#000000';
  this.arrowCanvasContext.stroke();
  this.arrowCanvasContext.fillStyle = "#000000";
  this.arrowCanvasContext.fill();
};

SpinToWin.prototype.sliceDrawer = function(sliceNumber, sliceColor) {
  this.wheelCanvasContext.beginPath();
  this.wheelCanvasContext.fillStyle = sliceColor;
  this.wheelCanvasContext.moveTo(config.centerX, config.centerY);
  this.wheelCanvasContext.arc(config.centerX, config.centerY, config.r, config.angle * sliceNumber, config.angle * (sliceNumber + 1));
  this.wheelCanvasContext.moveTo(config.centerX, config.centerY);
  this.wheelCanvasContext.fill();
  this.wheelCanvasContext.closePath();
};


SpinToWin.prototype.mobileTextTyper = function(sliceNumber, sliceText, sliceColor) {
  var fontSize = config.font_size;
  this.wheelCanvasContext.save();
  this.wheelCanvasContext.translate(config.centerX + (Math.cos(sliceNumber * config.angle) * config.r), config.centerY + (Math.sin(sliceNumber * config.angle) * config.r));
  this.wheelCanvasContext.moveTo(config.centerX, config.centerY);
  this.wheelCanvasContext.rotate((config.angle * sliceNumber + config.angle / 2) + (Math.PI / 2));
  this.wheelCanvasContext.fillStyle = this.lightOrDark(sliceColor) == "light" ? "#000" : "#fff";
  this.wheelCanvasContext.font = 'bolder ' + fontSize + 'px ' + config.fontFamily;
  var textWidth = this.wheelCanvasContext.measureText(sliceText).width + 10;
  var arcValue = Math.PI * 2 * (config.r - fontSize) / config.sliceCount;
  if (textWidth < arcValue) {
    this.wheelCanvasContext.textAlign = "center";
    sliceText = sliceText.split("|").join(" ");
    this.wheelCanvasContext.fillText(sliceText, Math.PI * (config.r - fontSize) / config.sliceCount, 10)
  } else {
    this.wheelCanvasContext.textAlign = "center";
    var lines = sliceText.split("|");
    for (var j = 0; j < lines.length; j++) {
      this.wheelCanvasContext.fillText(lines[j], Math.PI * (config.r) / config.sliceCount, (j * fontSize) + 10);
    }
  }
  this.wheelCanvasContext.restore();
};

SpinToWin.prototype.midCircleDrawer = function(circleColor, circleRadius) {
  this.wheelCanvasContext.beginPath();
  this.wheelCanvasContext.fillStyle = circleColor;
  this.wheelCanvasContext.moveTo(config.centerX, config.centerY);
  this.wheelCanvasContext.arc(config.centerX, config.centerY, circleRadius, 0, 2 * Math.PI);
  this.wheelCanvasContext.fill();
  this.wheelCanvasContext.closePath();
};

SpinToWin.prototype.submit = function() {
  if (config.mailFormEnabled) {
    this.formValidation = window.spinToWin.validateForm();
    if (!window.spinToWin.formValidation.email || !window.spinToWin.formValidation.consent) {
      window.spinToWin.handleVisibility();
      return;
    }
    window.spinToWin.subscribeEmail();
  }
  window.spinToWin.handleVisibility();
  window.spinToWin.submitButton.removeEventListener("click", window.spinToWin.submit);
  window.spinToWin.getPromotionCode();
};

SpinToWin.prototype.spin = function(sliceIndex, promotionCode) {
  if (sliceIndex > -1) {
    window.spinToWin.config.selectedSlice = window.spinToWin.config.slices[sliceIndex];
    window.spinToWin.config.selectedSlice.code = promotionCode;
  } else {
    sliceIndex = window.spinToWin.randomInt(0, window.spinToWin.config.staticCodeSlices.length);
    window.spinToWin.config.selectedSlice = window.spinToWin.config.staticCodeSlices[window.spinToWin.randomInt(0, window.spinToWin.config.staticCodeSlices.length)];
  }
  window.spinToWin.spinHandler(sliceIndex);
};



SpinToWin.prototype.spinHandler = function(result) {

  var spinHandler_R = window.spinToWin.r;
  var spinHandler_isMobile = true; //window.visilabs_spin_to_win.isMobile;
  var vl_form_input = document.getElementById("vl-form-input");
  if (vl_form_input !== null)
    vl_form_input.setAttribute("disabled", "");
  var vl_form_checkbox = document.getElementById("vl-form-checkbox");
  if (vl_form_checkbox !== null)
    vl_form_checkbox.setAttribute("disabled", "");
  var vl_form_checkbox_emailpermit = document.getElementById("vl-form-checkbox-emailpermit");
  if (vl_form_checkbox_emailpermit !== null)
    vl_form_checkbox_emailpermit.setAttribute("disabled", "");
  var vl_form_submit_btn = document.getElementsByClassName("form-submit-btn"); // document.getElementsByClassName("vl-form-submit-btn");
  if (vl_form_submit_btn !== null)
    vl_form_submit_btn[0].classList.add("disabled");
  var currentAngle = Math.round((parseFloat(this.wheelCanvas.style.transform.split("(")[2]) % 360));
  var sliceDeg = 360 / this.config.sliceCount;
  var startSlice = Math.floor((360 - currentAngle) / sliceDeg);
  var spinCount = this.randomInt(3, 8);
  var spinDeg = (spinCount * 360) + (startSlice - result) * sliceDeg;
  var spinDuration = parseFloat((spinDeg / 360).toFixed(2));
  spinDuration = spinDuration > 7.5 ? 7.5 : spinDuration;
  this.wheelCanvas.style.transform = "translateX(" + (spinHandler_isMobile ? 0 : -spinHandler_R) + "px) rotate(" + (spinDeg + currentAngle) + "deg)";
  this.wheelCanvas.style.transitionDuration = spinDuration + "s";
  setTimeout(function() {
    window.spinToWin.wheelCanvas.style.transform = "translateX(" + (spinHandler_isMobile ? 0 : -spinHandler_R) + "px) rotate(" + (spinDeg + currentAngle) % 360 + "deg)";
    window.spinToWin.wheelCanvas.style.transitionDuration = "0s";
    window.spinToWin.resultHandler(window.spinToWin.config.slices[result]);
  }, spinDuration * 1000);

};

SpinToWin.prototype.resultHandler = function(res) {
  this.spinCompleted = true;
  this.couponCode.innerText = res.code;
  this.couponCode.value = res.code;
  this.handleVisibility();
};


//Helper functions
                                 
SpinToWin.prototype.prepareCheckboxHtmls(text, url) {
      
};
                                 

SpinToWin.prototype.randomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

SpinToWin.prototype.lightOrDark = function(color) {
  var r, g, b, hsp;
  if (color.indexOf("rgb") != -1) {
    color = color.replace("rgb(" || "rgba(", "");
    color = color.replace(")", "");
    var colorArr = color.split(",");
    r = parseFloat(colorArr[0]);
    g = parseFloat(colorArr[1]);
    b = parseFloat(colorArr[2]);
  } else {
    color = +("0x" + color.slice(1).replace(
      color.length < 5 && /./g, '$&$&'));
    r = color >> 16;
    g = color >> 8 & 255;
    b = color & 255;
  }
  hsp = Math.sqrt(
    0.299 * (r * r) +
    0.587 * (g * g) +
    0.114 * (b * b)
  );
  if (hsp > 127.5) {
    return 'light';
  } else {
    return 'dark';
  }
};

SpinToWin.prototype.isNullOrWhitespace = function(input) {
  if (typeof input === 'undefined' || input == null) return true;
  return input.replace(/\s/g, '').length < 1;
};

SpinToWin.prototype.validateEmail = function(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

SpinToWin.prototype.setCloseButton = function() {

  if (this.config.closeButtonColor == "black") {

    this.closeButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABvUlEQVRoQ+2Z4U0DMQyFfYsxRIEN2AomQEjMgBisKG0jRac0sf2ec1ZF//Qkkvh9fo4vDZtcP08i8nN7Ll9b85zx8dyIKtp/i+BXEfnsqM0K00JU2S9FbO8PdUA2mLtaZyCZymyU8MteGA64WXO0M1ONVeB04IENQKWtzbRqwuIWpta0Lxn1xAVAJi292jctEARk1nBvE5sXIgK5Yo+6kWtBEMgdc9ZW3Qs7gKBYM5CiBwqgBIJjaECiYWAI6/GDEnDnEG1NrSM1Pi0wu2StIKwyYybkkmQPCApDh0BAvDAhECiIFSYMggGihdG8TrxlDu2RvTBNtkcwEATLEUtr7sHAEGwQT5lRICJALDA0iH+Qwa61bnqaK7SFlGen9Jvd6sQeCE4ovADgBBUGBdE4seQSEAGxQFhemi5NrknKclp61eQB8TjhOZuZtJkGg06EwlhAGE6EwWhBIiCoDUADEglBg5mBrICgwDz8JfZKJygN4GH/0XOkE5AzrSOZIMwNYMnJVHOpBf7q3ApIRifMZaYBmb1rwISrpw8TPgPJAjHdM0Xou4i8dfKSDWIE81HFfonIcwOTFaIH8y0ipz/jH10bOlDCXQAAAABJRU5ErkJggg==";
  } else {
    this.closeButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABwklEQVRoQ+2aa24CMQyE7QuUM7YHK2csF0i1qJF2A0lszxiiVfkDEnnM52fCoiIipZRvEfncPm8vVdX6ecX3UkrZ6bqq6pe2EKvDNBBV7nUD2dMdHLCaZ4ZaR1+uFGZTnbMBK8CYNP4leze83p0zJoh9DlgnvLKKeTQdyqxnYjaQV8tDv/AukAEU0fC08UUWYgFF9+528OiCCBCy5/AogizsBUL3mp6p0A0sQIw9piDZfYYBcW/aFotlwbAgXCBsGCaEG4QFw4YIgaAwGRBhkChMFgQE4oXJhIBBrDCWyojeRs3ldyTGYu3RfBSC4pEqMArDgKCCRMKMBUEH8cAwIf5BeonrzROmVyhVyxNSrRFYMBQQrycyYGAQFKJCoZ6BQCwQVaBnrOUk8ODVyCRrTrRWzoQJeQQRhMwdHnO8HmEIYawBhRZTAHMtV2dnbxzNs14EmXIkA8JzaraU5ilIJgQT5vw/mb7CE228I3ue97ECYhVvT0KuA20BON+jtxU8geTM3SMrQnhL8/AvHKy7Apo7JkPPBlm6KirUMn+qczRgFQhLmG2h9SMiHxn3aIulvWM6hr/VZD/ArOaJSTW7qerlF9bSa7Pl7TDpAAAAAElFTkSuQmCC";
  }

};
