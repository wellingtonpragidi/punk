let packit = {
    init: function() {
        popup.modal();
        form.inputfile();
    }
};

let fade = {
    fadeIn: function(selection, duration = 400) {
        var start, begin, startime, time, effect, currentime, timediff, show;
        if( selection.style.getPropertyValue("display") == "none" ) {
            selection.style.opacity = "0";
            selection.style.display = "none";
            start = 1;
            begin = parseFloat(selection.style.opacity) || 0;
            startime = Date.now();
            time = 1000 / 60;
            effect = setInterval(() => {
                currentime = Date.now();
                timediff = (currentime - startime) / duration;
                show = begin - (begin - start) * timediff;
                selection.style.opacity = show.toString();
                if(timediff >= 1) {
                    clearInterval(effect);
                    effect = 1;
                    selection.style.opacity = "1";
                }
                if(timediff * timediff) {
                    selection.style.display = "block";
                }
            }, time);
        }
        else {
            return;
        }
    },
    in: {
        get: function(element, duration = 400) {
            return fade.fadeIn(element, duration);
        },
        query: function(element, duration = 400) {
            return this.get(element, duration);
        },
        selector: function(element, duration = 400) {
            return fade.fadeIn(document.querySelector(element), duration);
        }
    },
    
    fadeOut: function(selection, duration = 400) {
        var start, begin, startime, time, effect, currentime, timediff, show;
        if(
            selection.style.getPropertyValue("display") == "block" ||
            selection.style.getPropertyValue("display") == false
        ) {
            start = 0;
            begin = parseFloat(selection.style.opacity) || 1;
            startime = Date.now();
            time = 1000 / 60;
            effect = setInterval(() => {
                currentime = Date.now();
                timediff = (currentime - startime) / duration;
                show = begin - (begin - start) * timediff;
                if(timediff >= 1) {
                    clearInterval(effect);
                    effect = 0;
                    selection.style.opacity = "0";
                    selection.style.display = "none";
                }
                if(timediff * timediff) {
                    selection.style.opacity = show.toString();
                }
                
            }, time);
        }
        else {
            return;
        }
    },
    out: {
        get: function(element, duration = 400) {
            return fade.fadeOut(element, duration);
        },
        query: function(element, duration = 400) {
            return this.get(element, duration);
        },
        selector: function(element, duration = 400) {
            return fade.fadeOut(document.querySelector(element), duration);
        }
    }
};

let popup = {
    openDialog: document.querySelectorAll("[data-popup-modal]"),
    popupDialog: document.querySelectorAll(".popup"),
    modalDialog: document.querySelectorAll(".modal"),
    modal: function() {
        this.openDialog.forEach( element => {
            element.addEventListener('click', function() {
                var dialog = document.getElementById(this.dataset.popupModal);
                dialog.style.display = "block";

                document.body.style.overflowY = "hidden";
            });
        });

        this.popupDialog.forEach( element => {
            var overlay = document.createElement("div");
            overlay.classList.add("popup_over");
            element.append(overlay);
            if( element.hasAttribute("data-popup-overlay") ) {
                var dialog = document.querySelector("#"+element.id+" .modal");
                overlay.addEventListener('click', function() {
                    dialog.classList.add("shake");
                    window.setTimeout(function () {
                        dialog.classList.remove("shake");
                    }, 450);
                    dialog.classList.add("show");
                });

                document.addEventListener('keydown', event => {
                    if(event.key == "Escape") {
                        dialog.classList.add("shake");
                        window.setTimeout(function () {
                            dialog.classList.remove("shake");
                        }, 450);
                        dialog.classList.add("show");
                    }
                });
            }
            else {
                overlay.addEventListener('click', function() {
                    fade.out.get(element, 400);
                    window.setTimeout(function () {
                        element.style.removeProperty("display");
                        element.style.removeProperty("opacity");
                        document.body.style.removeProperty("overflow-y");
                    }, 450);
                });

                document.addEventListener('keydown', event => {
                    if(event.key == "Escape") {
                        fade.out.get(element, 400);
                        window.setTimeout(function () {
                            element.style.removeProperty("display");
                            element.style.removeProperty("opacity");
                        }, 450);
                    }
                });
            }
        });

        this.modalDialog.forEach( element => {
            var close = document.createElement("button");
            close.classList.add("popup_close");
            close.setAttribute("icon", "close");
            close.setAttribute("aria-label", "Click para fechar");
            element.prepend(close);
            var closeElement = element.parentElement;
            if( element.parentElement.classList.contains("axis_xy") ) {
                closeElement = element.parentElement.parentElement;
            }
            close.addEventListener('click', function() {
                fade.out.get(closeElement, 400);
                window.setTimeout(function () {
                    closeElement.style.removeProperty("display");
                    closeElement.style.removeProperty("opacity");
                    document.body.style.removeProperty("overflow-y")
                }, 450);
                element.classList.remove("show");
            });
        });

        if( document.querySelectorAll("[data-close-element]") ) {
            var btnDiscard = document.querySelectorAll("[data-close-element]");
            btnDiscard.forEach( element => {
                element.addEventListener('click', function() {
                    var closeElement = document.getElementById(this.dataset.closeElement);
                    fade.out.get(closeElement, 400);
                    window.setTimeout(function () {
                        closeElement.style.removeProperty("display");
                        closeElement.style.removeProperty("opacity");
                        document.body.style.removeProperty("overflow-y");
                    }, 450);
                    var dialog = document.querySelector("#"+this.dataset.closeElement+" .modal");
                    dialog.classList.remove("show");
                });
            });
        }
    }
};

let form = {
    upload: document.querySelectorAll(".upload"),
    inputfile: function() {
        this.upload.forEach(element => {
            var label = element.querySelector("label");
            label.addEventListener('click', function() {
                this.classList.add("focus");
                setTimeout( function() {
                    label.classList.remove("focus");
                }, 60000);
            });
            var input = element.querySelector("input[type=file]");
            input.addEventListener('change', function() {
                label.classList.remove("focus");
            });
            if(element.hasAttribute("id")) {
                var self = document.getElementById(element.id);
                var input = self.querySelector("input[type=file]");
                var filename = document.createElement("span");
                filename.classList.add("filename");
                self.append(filename);
                input.addEventListener('change', function() {
                    filename.textContent = this.value.replace(/C:\\fakepath\\/i, "");
                });
                if(self.classList.contains("readers")) {
                    self.removeChild(self.querySelector(".filename"));
                    var output = document.createElement("div");
                    output.className = "output flexbox pack";
                    self.append(output);
                    var output = self.querySelector(".output");
                    input.addEventListener('change', function(event) {
                        var files = event.target.files;
                        for(var i = 0; i < files.length; i++) {
                            var file = files[i];
                            if(!file.type.match('image')) 
                                continue;
                            var reader = new FileReader();
                            reader.onload = event => {
                                var fileName = file.name.replace(/\.[^/.]+$/, "");
                                if(this.hasAttribute("multiple")) {
                                    var col = document.createElement("div");
                                    col.classList.add("cn_25");
                                    output.prepend(col);
                                    var innerCol = document.createElement("div");
                                    col.prepend(innerCol);
                                    var image = document.createElement("img");
                                    image.src = event.target.result;
                                    image.title = file.name;
                                    image.alt = fileName;
                                    innerCol.prepend(image);
                                } 
                                else {
                                    output.innerHTML = `
                                    <div class="cn_100">
                                        <img 
                                            src="`+event.target.result+`" 
                                            title="`+file.name+`" 
                                            alt="`+fileName+`" />
                                    </div>`;
                                }
                            }
                            reader.readAsDataURL(file);
                        }
                    });
                }
            }
        });
    }
};

packit.init();