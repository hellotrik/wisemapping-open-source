/*
 *    Copyright [2011] [wisemapping]
 *
 *   Licensed under WiseMapping Public License, Version 1.0 (the "License").
 *   It is basically the Apache License, Version 2.0 (the "License") plus the
 *   "powered by wisemapping" text requirement on every single page;
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the license at
 *
 *       http://www.wisemapping.org/license
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

var designer = null;

// CSS helper functions
CSS = {
    // Adds a class to an element.
    AddClass: function (e, c) {
        if (!e.className.match(new RegExp("\\b" + c + "\\b", "i")))
            e.className += (e.className ? " " : "") + c;
    },

    // Removes a class from an element.
    RemoveClass: function (e, c) {
        e.className = e.className.replace(new RegExp(" \\b" + c + "\\b|\\b" + c + "\\b ?", "gi"), "");
    }
};

// Functions for handling tabs.
Tabs = {
    // Changes to the tab with the specified ID.
    GoTo: function (contentId, skipReplace) {
        // This variable will be true if a tab for the specified
        // content ID was found.
        var foundTab = false;

        // Get the TOC element.
        var toc = $("toc");
        if (toc) {
            var lis = toc.getElementsByTagName("li");
            for (var j = 0; j < lis.length; j++) {
                var li = lis[j];

                // Give the current tab link the class "current" and
                // remove the class from any other TOC links.
                var anchors = li.getElementsByTagName("a");
                var anchors = li.getElementsByTagName("a");
                for (var k = 0; k < anchors.length; k++) {
                    if (anchors[k].hash == "#" + contentId) {
                        CSS.AddClass(li, "current");
                        foundTab = true;
                        break;
                    } else {
                        CSS.RemoveClass(li, "current");
                    }
                }
            }
        }

        // Show the content with the specified ID.
        var divsToHide = [];
        var divs = document.getElementsByTagName("div");
        for (var i = 0; i < divs.length; i++) {
            var div = divs[i];

            if (div.className.match(/\btabContent\b/i)) {
                if (div.id == "_" + contentId)
                    div.style.display = "block";
                else {
                    divsToHide.push(div);
                }
            }
        }

        // Hide the other content boxes.
        for (var i = 0; i < divsToHide.length; i++)
            divsToHide[i].style.display = "none";

        // Change the address bar.
        if (!skipReplace) window.location.replace("#" + contentId);
    },

    OnClickHandler: function (e) {
        // Stop the event (to stop it from scrolling or
        // making an entry in the history).
        if (!e) e = window.event;
        if (e.preventDefault) e.preventDefault(); else e.returnValue = false;

        // Get the name of the anchor of the link that was clicked.
        Tabs.GoTo(this.hash.substring(1));
    },

    Init: function () {
        if (!document.getElementsByTagName) {
            return;
        }

        // Attach an onclick event to all the anchor links on the page.
        var anchors = document.getElementsByTagName("a");
        for (var i = 0; i < anchors.length; i++) {
            var a = anchors[i];
            if (a.hash) {
                a.onclick = Tabs.OnClickHandler;
            }
        }

        var contentId;
        if (window.location.hash)
            contentId = window.location.hash.substring(1);

        var divs = document.getElementsByTagName("div");
        for (var i = 0; i < divs.length; i++) {
            var div = divs[i];

            if (div.className.match(/\btabContent\b/i)) {
                if (!contentId) contentId = div.id;
                div.id = "_" + div.id;
            }
        }

        if (contentId)
            Tabs.GoTo(contentId, true);
    }
};

if (document.createStyleSheet) {
    var style = document.createStyleSheet();
    style.addRule("div.tabContent", "display: none;");
    style.addRule("div" + contentId, "display: block;");
} else {
    var head = document.getElementsByTagName("head")[0];
    if (head) {
        var style = document.createElement("style");
        style.setAttribute("type", "text/css");
        style.appendChild(document.createTextNode("div.tabContent { display: none; }"));
        style.appendChild(document.createTextNode("div" + contentId + " { display: block; }"));
        head.appendChild(style);
    }
}

// Hook up the OnLoad event to the tab initialization function.
Tabs.Init();

// Hide the content while waiting for the onload event to trigger.
var contentId = window.location.hash || "#Introduction";

var iconPanel = null;

function afterMindpotLibraryLoading() {
    buildMindmapDesigner();

    if ($('helpButton') != null) {
        var helpPanel = new Panel({panelButton:$('helpButton'), backgroundColor:'black'});
        helpPanel.setContent(Help.buildHelp(helpPanel));
    }

    if ($('helpButtonFirstSteps') != null) {
        var firstStepsPanel = $('helpButtonFirstSteps')
        firstStepsPanel.addEvent('click', function(event) {
            var firstStepWindow = window.open("firststeps.htm", "WiseMapping", "width=100px, height=100px");
            firstStepWindow.focus();
            firstStepWindow.moveTo(0, 0);
            firstStepWindow.resizeTo(screen.availWidth, screen.availHeight);
        });
    }

    if ($('helpButtonKeyboard') != null) {
        var keyboardPanel = $('helpButtonKeyboard')
        keyboardPanel.addEvent('click', function(event) {
            MOOdalBox.open('keyboard.htm', 'KeyBoard Shortcuts', '500px 400px', false)
        });
    }

    var iconChooser = buildIconChooser();
    iconPanel = new IconPanel({button:$('topicIcon'), onStart:cleanScreenEvent, content:iconChooser});

    // Register Events ...
    $(document).addEvent('keydown', designer.keyEventHandler.bindWithEvent(designer));
    $("ffoxWorkarroundInput").addEvent('keydown', designer.keyEventHandler.bindWithEvent(designer));


    $('zoomIn').addEvent('click', function(event) {
        designer.zoomIn();
    });

    $('zoomOut').addEvent('click', function(event) {
        designer.zoomOut();
    });

    $('undoEdition').addEvent('click', function(event) {
        designer.undo();
    });

    $('redoEdition').addEvent('click', function(event) {
        designer.redo();
    });

    designer.addEventListener("modelUpdate", function(event) {
        if (event.undoSteps > 0) {
            $("undoEdition").setStyle("background-image", "url(../images/file_undo.png)");
        } else {
            $("undoEdition").setStyle("background-image", "url(../images/file_undo_dis.png)");
        }

        if (event.redoSteps > 0) {
            $("redoEdition").setStyle("background-image", "url(../images/file_redo.png)");
        } else {
            $("redoEdition").setStyle("background-image", "url(../images/file_redo_dis.png)");
        }

    });

    $('addTopic').addEvent('click', function(event) {
        designer.createSiblingForSelectedNode();
    });

    $('deleteTopic').addEvent('click', function(event) {
        designer.deleteCurrentNode();
    });

    var context = this;
    var colorPicker1 = new MooRainbow('topicColor', {
        id: 'topicColor',
        imgPath: '../images/',
        startColor: [255, 255, 255],
        onInit: function(color) {
            cleanScreenEvent.bind(context).attempt();
            setCurrentColorPicker.attempt(colorPicker1, context);
        },
        onChange: function(color) {
            designer.setBackColor2SelectedNode(color.hex);
        },
        onComplete: function(color) {
            removeCurrentColorPicker.attempt(colorPicker1, context);
        }
    });
    var colorPicker2 = new MooRainbow('topicBorder', {
        id: 'topicBorder',
        imgPath: '../images/',
        startColor: [255, 255, 255],
        onInit: function(color) {
            cleanScreenEvent.bind(context).attempt();
            setCurrentColorPicker.attempt(colorPicker2, context);
        },
        onChange: function(color) {
            designer.setBorderColor2SelectedNode(color.hex);
        },
        onComplete: function(color) {
            removeCurrentColorPicker.attempt(colorPicker2, context);
        }
    });

    $('topicLink').addEvent('click', function() {
        designer.addLink2SelectedNode();

    });

    $('topicRelation').addEvent('click', function(event) {
        designer.addRelationShip2SelectedNode(event);
    });

    $('topicNote').addEvent('click', function() {
        designer.addNote2SelectedNode();

    });

    $('fontBold').addEvent('click', function() {
        designer.setWeight2SelectedNode();
    });

    $('fontItalic').addEvent('click', function() {
        designer.setStyle2SelectedNode();
    });

    var colorPicker3 = new MooRainbow('fontColor', {
        id: 'fontColor',
        imgPath: '../images/',
        startColor: [255, 255, 255],
        onInit: function(color) {
            cleanScreenEvent.bind(context).attempt();
            setCurrentColorPicker.attempt(colorPicker3, context);
        },
        onChange: function(color) {
            designer.setFontColor2SelectedNode(color.hex);
        },
        onComplete: function(color) {
            removeCurrentColorPicker.attempt(colorPicker3, context);
        }
    });

    // To prevent the user from leaving the page with changes ...
    window.onbeforeunload = function () {
        if (designer.needsSave()) {
            designer.save(null, false)
        }
    };

    // Build panels ...
    fontFamilyPanel();
    shapeTypePanel();
    fontSizePanel();

    // If not problem has arisen, close the dialog ...
    var closeDialog = function() {

        if (!window.hasUnexpectedErrors) {
            waitDialog.deactivate();
        }
    }.delay(500);
}

function buildIconChooser() {
    var content = new Element('div').setStyles({width:253,height:200,padding:5});
    var count = 0;
    for (var i = 0; i < mindplot.ImageIcon.prototype.ICON_FAMILIES.length; i = i + 1) {
        var familyIcons = mindplot.ImageIcon.prototype.ICON_FAMILIES[i].icons;
        for (var j = 0; j < familyIcons.length; j = j + 1) {
            // Separate icons by line ...
            var familyContent;
            if ((count % 12) == 0) {
                familyContent = new Element('div').inject(content);
            }


            var iconId = familyIcons[j];
            var img = new Element('img').setStyles({width:16,height:16,padding:"0px 2px"}).inject(familyContent);
            img.id = iconId;
            img.src = mindplot.ImageIcon.prototype._getImageUrl(iconId);
            img.addEvent('click', function(event, id) {
                designer.addImage2SelectedNode(this.id);
            }.bindWithEvent(img));
            count = count + 1;
        }

    }

    return content;
}


function setCurrentColorPicker(colorPicker) {
    this.currentColorPicker = colorPicker;
}

function removeCurrentColorPicker(colorPicker) {
    $clear(this.currentColorPicker);
}

function buildMindmapDesigner() {

    // Initialize message logger ...
//    var monitor = new core.Monitor($('msgLoggerContainer'), $('msgLogger'));
//    core.Monitor.setInstance(monitor);

    var container = $('mindplot');

    // Initialize Editor ...
    var screenWidth = window.getWidth();
    var screenHeight = window.getHeight();

    // header - footer
    screenHeight = screenHeight-115;

    // body margin ...
    editorProperties.width = screenWidth;
    editorProperties.height = screenHeight;

    designer = new mindplot.MindmapDesigner(editorProperties, container);
    designer.loadFromXML(mapId, mapXml);

    // If a node has focus, focus can be move to another node using the keys.
    designer._cleanScreen = cleanScreenEvent.bind(this);
}

function createColorPalette(container, onSelectFunction, event) {
    cleanScreenEvent();
    _colorPalette = new core.ColorPicker();
    _colorPalette.onSelect = function(color) {
        onSelectFunction.call(this, color);
        cleanScreenEvent();
    };

    //    dojo.event.kwConnect({srcObj: this._colorPalette,srcFunc:"onColorSelect",targetObj:this._colorPalette, targetFunc:"onSelect", once:true});
    var mouseCoords = core.Utils.getMousePosition(event);
    var colorPaletteElement = $("colorPalette");
    colorPaletteElement.setStyle('left', (mouseCoords.x - 80) + "px");
    colorPaletteElement.setStyle('display', "block");
}
;

function cleanScreenEvent() {
    if (this.currentColorPicker) {
        this.currentColorPicker.hide();
    }
    $("fontFamilyPanel").setStyle('display', "none");
    $("fontSizePanel").setStyle('display', "none");
    $("topicShapePanel").setStyle('display', "none");
    iconPanel.close();
}

function fontFamilyPanel() {
    var supportedFonts = ['times','arial','tahoma','verdana'];
    var updateFunction = function(value) {
        value = value.charAt(0).toUpperCase() + value.substring(1, value.length);
        designer.setFont2SelectedNode(value);
    };

    var onFocusValue = function(selectedNode) {
        return selectedNode.getFontFamily();
    };

    buildPanel('fontFamily', 'fontFamilyPanel', supportedFonts, updateFunction, onFocusValue);
}

function shapeTypePanel() {
    var shapeTypePanel = ['rectagle','rounded_rectagle','line','elipse'];
    var updateFunction = function(value) {
        designer.setShape2SelectedNode(value.replace('_', ' '));
    };

    var onFocusValue = function(selectedNode) {

        return selectedNode.getShapeType().replace(' ', '_');
    };

    buildPanel('topicShape', 'topicShapePanel', shapeTypePanel, updateFunction, onFocusValue);
}

function fontSizePanel() {
    var shapeTypePanel = ['small','normal','large','huge'];
    var map = {small:'6',normal:'8',large:'10',huge:'15'};
    var updateFunction = function(value) {
        var nodes = designer.getSelectedNodes();
        var value = map[value];
        designer.setFontSize2SelectedNode(value);
    };

    var onFocusValue = function(selectedNode) {
        var fontSize = selectedNode.getFontSize();
        var result = "";
        if (fontSize <= 6) {
            result = 'small';
        } else if (fontSize <= 8) {
            result = 'normal';
        } else if (fontSize <= 10) {
            result = 'large';
        } else if (fontSize >= 15) {
            result = 'huge';
        }
        return result;
    };
    buildPanel('fontSize', 'fontSizePanel', shapeTypePanel, updateFunction, onFocusValue);
}

function buildPanel(buttonElemId, elemLinksContainer, elemLinkIds, updateFunction, onFocusValue) {
    // Font family event handling ....
    $(buttonElemId).addEvent('click', function(event) {
        var container = $(elemLinksContainer);
        var isRendered = container.getStyle('display') == 'block';
        cleanScreenEvent();

        // Restore default css.
        for (var i = 0; i < elemLinkIds.length; i++) {
            var elementId = elemLinkIds[i];
            $(elementId).className = 'toolbarPanelLink';
        }

        // Select current element ...
        var nodes = designer.getSelectedNodes();
        var lenght = nodes.length;
        if (lenght == 1) {
            var selectedNode = nodes[0];
            var selectedElementId = onFocusValue(selectedNode);
            selectedElementId = selectedElementId.toLowerCase();
            var selectedElement = $(selectedElementId);
            selectedElement.className = 'toolbarPanelLinkSelectedLink';
        }

        container.setStyle('display', 'block');

        var mouseCoords = core.Utils.getMousePosition(event);
        if (!isRendered) {
            container.setStyle('left', (mouseCoords.x - 10) + "px");
        }

    });

    var fontOnClick = function(event) {
        var value = this.getAttribute('id');
        updateFunction(value);
        cleanScreenEvent();
    };

    // Register event listeners on elements ...
    for (var i = 0; i < elemLinkIds.length; i++) {
        var elementId = elemLinkIds[i];
        $(elementId).addEvent('click', fontOnClick.bind($(elementId)));
    }
}

//######################### Libraries Loading ##################################
function JSPomLoader(pomUrl, callback) {
    console.log("POM Load URL:" + pomUrl);
    var jsUrls;
    var request = new Request({
        url: pomUrl,
        method: 'get',
        onRequest: function() {
            console.log("loading ...");
        },
        onSuccess: function(responseText, responseXML) {

            // Collect JS Urls ...
            var concatRoot = responseXML.getElementsByTagName('concat');
            var fileSetArray = Array.filter(concatRoot[0].childNodes, function(elem) {
                return elem.nodeType == Node.ELEMENT_NODE
            });

            jsUrls = new Array();
            Array.each(fileSetArray, function(elem) {
                    var jsUrl = elem.getAttribute("dir") + elem.getAttribute("files");
                    jsUrls.push(jsUrl.replace("${basedir}", pomUrl.substring(0, pomUrl.lastIndexOf('/'))));
                }
            );

            // Load all JS dynamically ....
            jsUrls = jsUrls.reverse();

            function jsRecLoad(urls) {
                if (urls.length == 0) {
                    if ($defined(callback))
                        callback();
                } else {
                    var url = urls.pop();
//                    console.log("load url:" + url);
                    Asset.javascript(url, {
                        onLoad: function() {
                            jsRecLoad(urls)
                        }
                    });
                }
            }

            jsRecLoad(jsUrls);
        },
        onFailure: function() {
            console.log('Sorry, your request failed :(');
        }
    });
    request.send();

}

var localEnv = true;
if (localEnv) {
    Asset.javascript("../../../../../web2d/target/classes/web2d.svg-min.js", {
        onLoad: function() {
            JSPomLoader('../../../../../mindplot/pom.xml', afterMindpotLibraryLoading)
        }
    });
} else {
    Asset.javascript("../js/mindplot.svg.js", {
        onLoad: function() {
            afterMindpotLibraryLoading();
        }
    });
}