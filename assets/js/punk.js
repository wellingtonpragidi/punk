var punk = (function(config) {
	if( config.selector && document.querySelector(config.selector) ) {

		let editor = {
			init: function() {
				punk.init();
				toolbar.init();

				document.execCommand("defaultParagraphSeparator", false, "p");
				punk.content.addEventListener('paste', event => {
				    event.preventDefault();
				    var text = (event.originalEvent || event).clipboardData.getData("text/plain");
				    document.execCommand("insertHTML", false, text);
				});

				insert.init();
				extend.popup();
			}
		};

		let punk = {
			frame:    document.querySelector("#punk"),
			tollbar:  document.querySelector("#toolbar"),
			content:  document.querySelector("#pk-body"),
			footer:   document.querySelector("#foot"),
			srcode:   document.querySelector("#srcode"),
			textarea: document.querySelector(config.selector),
			width: config.width ? config.width : "850px",
			height: config.height ? config.height : "65vh",
			init: function() {
				this.textarea.style.display = "none";
				this.srcode.style.display = "none";
				this.frame.style.width = this.width;
				this.content.style.height = this.height;
				this.srcode.style.height = this.height;
			}
		};

		['keydown', 'keyup', 'change', 'input', 'mousedown', 'mouseup', 'click'].forEach(function(evt) {
		    punk.content.addEventListener(evt, function() { 
		        punk.srcode.value = punk.content.innerHTML;
		        punk.textarea.value = punk.content.innerHTML;
		    });
		    punk.srcode.addEventListener(evt, function() { 
		        punk.content.innerHTML = punk.srcode.value;
		        punk.textarea.value = punk.srcode.value;
		    });
		});
		punk.content.innerHTML = punk.textarea.value;
		punk.srcode.value = punk.textarea.value;

		let toolbar = {
			btnwrap: document.querySelectorAll("#toolbar > div"),
			buttons: document.querySelectorAll("#toolbar button"),
			btnopen: document.querySelectorAll("#toolbar .open-options"),
			options: document.querySelectorAll("#toolbar .options"),
			divider: document.querySelectorAll("#toolbar .divider"),
			inputSwitch: document.querySelector("#switch-mode"),
			navigator: function() {
				this.buttons.forEach( element => {
				    element.type = "button";
				});
				this.btnopen.forEach( element => {
				    element.addEventListener('click', function() {
				        if( this.classList.contains("active") ) {
				            this.classList.remove("active");
				        } else {
				            var current = document.getElementsByClassName("active");
				            if( current.length > 0 ) { 
				                current[0].className = current[0].className.replace(" active", "");
				            }
				            this.className += ' active';
				        }
				    });
				});
				punk.content.addEventListener('click', function() {
					toolbar.btnopen.forEach( element => {
						element.classList.remove("active");
					});
				});
				this.options.forEach( element => {
					element.addEventListener('click', function() {
						if( this.previousElementSibling.classList.contains("active") ) {
							this.previousElementSibling.classList.remove("active");
						}
					});
				});
			},
			switchmode: function() {
		        if(this.checked) {
		            punk.srcode.style.display = "block";
		            punk.content.style.display = "none";
		            this.classList.add("modecode");
		        }
		        else {
		            punk.srcode.style.display = "none";
		            punk.content.style.display = "block";
		            this.classList.remove("modecode");
		        }
		        var switchlabel = document.querySelector("#switch label");
		        if( this.classList.contains("modecode") ) {
		            switchlabel.setAttribute("title", "Retornar editor visual");

		            toolbar.buttons.forEach( element => {
		            	element.style.display = "none";
		            });
		            toolbar.divider.forEach( element => {
		            	element.style.display = "none";
		            });
		        } 
		        else {
		            switchlabel.setAttribute("title", "Ver código fonte");

		            toolbar.buttons.forEach( element => {
		            	element.removeAttribute("style");
		            });
		            toolbar.divider.forEach( element => {
		            	element.removeAttribute("style");
		            });
		        }
		    },
		    activefocus: function() {
		        if( Selection.rangeCount > 0 ) {
		            var range = Selection.getRangeAt(0);
		            var container = range.commonAncestorContainer;
		            while(container && container.nodeType !== 1) {
		                container = container.parentNode
		            }
		            if(container && container.closest("#pk-body")) {
		                return container.tagName.toLowerCase();
		            }
		        }
		    },
		    activeParentfocus: function() {
		        if( Selection.rangeCount > 0 ) {
		            var range = Selection.getRangeAt(0);
		            var container = range.commonAncestorContainer;
		            while(container && container.nodeType !== 1) {
		                container = container.parentNode.parentNode
		            }
		            if(container && container.closest("#pk-body")) {
		                return container.tagName.toLowerCase();
		            }
		        }
		    },
		    action: function() {
		    	punk.content.addEventListener('mousedown', () => {
		    		toolbar.buttons.forEach( element => {
			            if( 
			            	element.dataset.label == toolbar.activefocus() || 
			            	element.dataset.label == toolbar.activeParentfocus()
			            ) {
			                element.classList.remove('action');
			                if( element.parentElement.previousElementSibling != null ) {
			                	element.parentElement.previousElementSibling.classList.remove("action");
			                }
			            }

			        });
		        });
		        punk.content.addEventListener('mouseup', () => {
		    		toolbar.buttons.forEach( element => {
			            if( 
			            	element.dataset.label == toolbar.activefocus() || 
			            	element.dataset.label == toolbar.activeParentfocus()
			            ) {
			                element.classList.add("action");
			                if( element.parentElement.previousElementSibling != null ) {
			                	element.parentElement.previousElementSibling.classList.add("action");
			                }
			            }
			        });
		        });
		    },
		    init: function() {
		    	this.navigator();
		    	this.inputSwitch.addEventListener('change', this.switchmode);
		    	this.action();
		    }
		};

		const Selection = window.getSelection();

		let insert = {
			cmd: function(tag) {
				return "<"+tag+">"+Selection+"</"+tag+">";
			},
			inline: function() {
				let inlines = document.querySelectorAll("#inline .options button");
				inlines.forEach( element => {
					element.addEventListener('click', function() {
						document.execCommand("insertHTML", false, insert.cmd(this.dataset.label));
					});
				});
			},
			block: function() {
				let blocks = document.querySelectorAll("#block .options button");
				blocks.forEach( element => {
					element.addEventListener('click', function() {
						document.execCommand("insertHTML", false, insert.cmd(this.dataset.label));
					});
				});
			},
			grid: function(columns) {
		        function insertGrid(html) {
		            if(Selection.rangeCount) {
		                var range = Selection.getRangeAt(0);
		                if( range.commonAncestorContainer.parentNode && 
		                range.commonAncestorContainer.parentNode.closest("#pk-body") ) {
		                    var mktemp = document.createElement("div");
		                    mktemp.innerHTML = html;
		                    var frag = document.createDocumentFragment(), node, lastNode;
		                    while( (node = mktemp.firstChild) ) {
		                        if(range.commonAncestorContainer.tagName == 'P') {
		                            range.commonAncestorContainer.remove();
		                        }
		                        lastNode = frag.appendChild(node);
		                    }
		                    range.insertNode(frag);
		                }
		            }
		        }
		        var column = '<div><p><br></p></div>', gridColumns;
		        switch(columns) {
		            case '__x__':
		                gridColumns = '<div class="cn__x__">'+column+column+'</div>';
		            break;
		            case '___x_':
		                gridColumns = '<div class="cn___x_">'+column+column+'</div>';
		            break;
		            case '_x___':
		                gridColumns = '<div class="cn_x___">'+column+column+'</div>';
		            break;
		            case '_x_x_':
		                gridColumns = '<div class="cn_x_x_">'+column+column+column+'</div>';
		            break;
		        }
		        gridColumns = gridColumns + '&nbsp;';
		        insertGrid(gridColumns);
		    },
		    textalign: function() {
		    	let align = document.querySelectorAll("#textalign .options button");
				align.forEach( element => {
					element.addEventListener('click', function() {
						document.execCommand("styleWithCSS", false, null);
						document.execCommand(this.dataset.cmd, false, null);
					});
				});
		    },
		    link: function() {
		    	let link = document.querySelector("#link button");
		    	link.addEventListener('click', function() {
		    		var linkURL = prompt("Insira a URL:", "https://");
    				// document.execCommand("createLink", false, linkURL);
    				document.execCommand("insertHTML", false, '<a href="'+linkURL+'" target="_blank">'+Selection+'</a>');

    			});
		    },
		    list: function() {
		    	let orderedlist = document.querySelector("#orderedlist button");
				orderedlist.addEventListener('click', function() {
					document.execCommand("insertOrderedList", false, null);
				});
				let unorderedlist = document.querySelector("#unorderedlist button");
				unorderedlist.addEventListener('click', function() {
					document.execCommand("insertUnorderedList", false, null);
				});
		    },
		    quote: function() {
		    	let quotes = document.querySelectorAll("#quote .options button");
				quotes.forEach( element => {
					element.addEventListener('click', function() {
						document.execCommand("insertHTML", false, insert.cmd(this.dataset.label));
					});
				});
		    },
		    color: function() {
		    	let color = document.querySelectorAll("#color .options button");
				color.forEach( element => {
					element.addEventListener('click', function() {
						$value = '<span style="color: '+element.dataset.color+'">'+Selection+'</span>';
						document.execCommand("insertHTML", false, $value);
					});
				});
		    },
		    fontsize: function() {
		    	let fontsize = document.querySelectorAll("#fontsize .options button");
				fontsize.forEach( element => {
					element.addEventListener('click', function() {
						$value = '<span style="font-size: '+element.dataset.size+'">'+Selection+'</span>';
						document.execCommand("insertHTML", false, $value);
					});
				});
		    },
		    files: function() {
				let inputfile = document.querySelector("#upload");
				let callback  = document.querySelector("#callback");
				//callback.style.display = "none";
				let alttext  = document.querySelector("#alttext");
				let inputurl  = document.querySelector("#file-url");
				//let inputdir  = document.querySelector("#file-dir");
		        inputfile.addEventListener('change', function() {
		        	var file = this.files[0];
		            var upload = new FormData();
		            upload.append("filepunk", file);
		            var request = new XMLHttpRequest();
		            request.open("POST", config.upload);
		            request.addEventListener('load', function() {
		                if(this.status == 200) {
		                    var result = JSON.parse(this.response);
	                        inputurl.value = result.url;
	                        //inputdir.value = result.path;
                            // callback.style.display = "block";
		                	callback.innerHTML = '<img src="'+result.url+'" alt="" />';
		                }
		            });
		            request.send(upload);
		        });
		        let btnImage = document.querySelector("#image");
		        btnImage.addEventListener('click', function() {
		        	var setfile = '<p data-set="file" id="setfile">&nbsp</p>';
		        	document.execCommand("insertHTML", false, setfile);
		        });

		        document.querySelector(".dismiss").addEventListener('click', removeSetFile);
		        document.querySelector(".popup_over").addEventListener('click', removeSetFile);
		        function removeSetFile() {
		        	let pkfile = document.querySelector("#pk-body #setfile");
		        	window.setTimeout(function() {
			            pkfile.remove();
			        }, 1200);
		        }
		        
		        let inserfile = document.querySelector("#inserfile");
		        inserfile.addEventListener('click', function() {
                    var filename = inputurl.value;
                    // Get file extension
                    var end = inputurl.value.substr(inputurl.value.lastIndexOf('/')+1);
		            var septor = end.lastIndexOf('.');
		            var ext = ( septor <= 0 ) ? '' : end.substr(septor + 1);

                    var box = document.querySelector("#pk-body #setfile");
                    var media;
                    if(ext == "gif" || ext == "jpg" || ext == "jpeg" || ext == "png" || ext == "webp" || ext == "ico" || ext == "svg") {
                    	var media = document.createElement("img");
                    	media.src = filename;
						media.alt = alttext.value;
                    }
                    else if(ext == "mp4") {
                    	media = document.createElement("video");
			        	media.setAttribute("aria-label", alttext.value);
			        	media.setAttribute("controls", "true");
			        	source = document.createElement("source");
			        	media.appendChild(source);
			        	source.src = filename;
			        	source.type = "video/"+ext;
                    }
			        else if(ext == "mp3") {
			        	media = document.createElement("audio");
			        	media.setAttribute("aria-label", alttext.value);
			        	media.setAttribute("controls", "true");
			        	source = document.createElement("source");
			        	media.appendChild(source);
			        	source.src = filename;
			        	source.type = "audio/"+ext;
			        }
			        else {
			        	media = document.createElement("a");
			        	media.setAttribute("aria-label", alttext.value);
			        	media.setAttribute("target", "_blank");
			        	media.title = alttext.value;
			        	media.href = filename;
			        	media.textContent = filename;
			        }
                    box.appendChild(media);

                    extend.popupModal.style.removeProperty("display");
                    extend.popupModal.style.removeProperty("opacity");
                    document.body.style.removeProperty("overflow-y");

                    window.setTimeout(function() {
			            box.removeAttribute("data-set");
	                    box.removeAttribute("id");
			        }, 1200);
		        });
		    },
		    embed: function() {
		    	let video = document.querySelector("#video button");
		    	video.addEventListener('click', function() {
		    		var youtubeURL = prompt("Insira a URL de vídeo do YouTube:", "");
		    		youtubeURL = youtubeURL.indexOf("https://") ? "https://"+youtubeURL : youtubeURL;
		            if( youtubeURL && youtubeURL.indexOf("youtube.com/watch?v=") > -1 || youtubeURL.indexOf("youtube.com/embed/") > -1 ) {
		                youtubeURL = youtubeURL.replace("watch?v=", "embed/");
		                if( youtubeURL.indexOf("&") > -1 ) {
		                    youtubeURL = youtubeURL.substring(0, youtubeURL.indexOf('&'));
		                }
		                else {
		                    youtubeURL = youtubeURL;
		                }
		            }
    				document.execCommand("insertHTML", false, '<div class="embed"><iframe src="'+youtubeURL+'"></iframe></div>');

    			});
		    },
		    ruler: function() {
		    	document.querySelector("#ruler").addEventListener('click', function() {
		    		document.execCommand('insertHorizontalRule', false, null);
		    	});
		    	var contentRules = document.querySelectorAll("#pk-body hr");
		    	contentRules.forEach( element => {
		    		if(element.hasAttribute("_moz_dirty")) {
		    			element.removeAttribute("_moz_dirty");
		    		}
		    	});
		    },
		    init: function() {
		    	this.inline();
		    	this.block();
		    	let grid = document.querySelectorAll("#grid .options button");
		    	grid.forEach( element => {
		            element.addEventListener('click', function() {
		                insert.grid(this.dataset.col);
		            });
		        });
		    	this.textalign();
		    	this.link();
		    	this.list();
		    	this.quote();
		    	this.color();
		    	this.fontsize();
		    	this.files();
		    	this.embed();
		    	this.ruler();
		    }
		};

		let extend = {
			popupModal: document.querySelector(".popup"),
			dismiss: document.querySelector(".dismiss"),
			popup: function() {
				this.dismiss.addEventListener('click', function() {
                    extend.popupModal.style.removeProperty("display");
                    extend.popupModal.style.removeProperty("opacity");
                    document.body.style.removeProperty("overflow-y");
	            });
			}
		}

		var zlorem = `<p>Zombie ipsum reversus ab viral inferno, nam Rick grimes malum cerebro.</p>
			<p>De carne lumbering animata corpora quaeritis. Summus brains sit, morbo vel maleficia? De apocalypsi gorger omero undead survivor dictum mauris.</p>
			<p>Hi mindless mortuis soulless creaturas, imo evil stalking monstra adventus resident evil vultus comedat cerebella viventium. Qui animated corpse, cricket bat max brucks terribilem incessu zomby.</p>
			<p>The voodoo sacerdos flesh eater, suscitat mortuos comedere carnem virus. Zonbi tattered for solum oculi eorum defunctis go lum cerebro.</p>
			<p>Daryl Dixon nescio brains an Undead zombies. Sicut malus putrid voodoo horror. Nigh tofth eliv ingdead.</p>`;
		document.querySelector("#insertext button").onclick = function() {
			document.execCommand("insertHTML", false, zlorem);
		}



		editor.init();

	}
});


/** Se você não gosta do que existe, faça você mesmo */