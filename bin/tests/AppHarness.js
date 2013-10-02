var away;
(function (away) {
    //---------------------------------------------------
    // Application Harness
    var AppHarness = (function () {
        //------------------------------------------------------------------------------
        function AppHarness() {
            var _this = this;
            //------------------------------------------------------------------------------
            this.iframeContent = "<!DOCTYPE html>" + "<html><head><title></title>" + "<style>html{height: 100%;border: 0px;padding: 0px;}</style>" + "<script type='text/javascript' language='javascript' src='js/AppHarness.js'></script>" + "<script type='text/javascript' language='javascript' src='../lib/Away3D.next.min.js'></script>" + "<script type='text/javascript'>window.onload = function (){new away.AppFrame();}</script>" + "</head><body></body></html>";
            this.tests = new Array();
            this.counter = 0;
            this.initFrameSet();
            this.initInterface();

            /*
            this.dropDown           = <HTMLSelectElement> this.getId('selectTest');
            
            this.previous           = <HTMLButtonElement> this.getId('previous');
            this.next               = <HTMLButtonElement> this.getId('next');
            */
            this.previous.onclick = function () {
                return _this.nagigateBy(-1);
            };
            this.next.onclick = function () {
                return _this.nagigateBy(1);
            };

            this.dropDown.onchange = function (e) {
                return _this.dropDownChange(e);
            };
        }
        //------------------------------------------------------------------------------
        /**
        *
        * Load a test
        *
        * @param classPath - Module and Class path of test
        * @param js Path to JavaScript file
        * @param ts Path to Typescript file ( not yet used - reserved for future show source )
        */
        AppHarness.prototype.load = function (classPath, js, ts) {
            this.testIframe.src = 'frame.html?name=' + classPath + '&js=' + js;
            this.srcIframe.src = ts;
        };

        /**
        *
        * Add a test to the AppHarness
        *
        * @param name Name of test
        * @param classPath - Module and Class path of test
        * @param js Path to JavaScript file
        * @param ts Path to Typescript file ( not yet used - reserved for future show source )
        */
        AppHarness.prototype.addTest = function (name, classpath, js, ts) {
            this.tests.push(new TestData(name, classpath, js, ts));
        };

        /**
        *
        * Add a separator to the menu
        *
        * @param name
        */
        AppHarness.prototype.addSeperator = function (name) {
            if (typeof name === "undefined") { name = ''; }
            this.tests.push(new TestData('-- ' + name, '', '', ''));
        };

        /**
        *
        * Start the application harness
        *
        */
        AppHarness.prototype.start = function () {
            for (var c = 0; c < this.tests.length; c++) {
                var option = new Option(this.tests[c].name, String(c));
                this.dropDown.add(option);
            }
        };

        //------------------------------------------------------------------------------
        /**
        *
        */
        AppHarness.prototype.initInterface = function () {
            var testSelector = document.createElement('div');
            testSelector.style.cssFloat = 'none';
            testSelector.style.position = 'absolute';
            testSelector.style.bottom = '15px';
            testSelector.style.width = '600px';
            testSelector.style.left = '50%';
            testSelector.style.marginLeft = '-300px';
            testSelector.style.textAlign = 'center';

            this.dropDown = document.createElement('select');
            this.dropDown.name = "selectTestDropDown";
            this.dropDown.id = "selectTest";

            this.previous = document.createElement('button');
            this.previous.innerHTML = '<<';
            this.previous.id = 'previous';

            this.next = document.createElement('button');
            this.next.innerHTML = '>>';
            this.next.id = 'next';

            testSelector.appendChild(this.previous);
            testSelector.appendChild(this.dropDown);
            testSelector.appendChild(this.next);
            document.body.appendChild(testSelector);
        };

        /**
        *
        */
        AppHarness.prototype.initFrameSet = function () {
            console.log('initFrameSet');

            var iframeContainer = document.createElement('div');
            iframeContainer.style.width = '100%';
            iframeContainer.style.height = '100%';

            this.testIframe = document.createElement('iframe');
            this.testIframe.id = 'testContainer';
            this.testIframe.style.backgroundColor = '#9e9e9e';
            this.testIframe.style.cssFloat = 'none';
            this.testIframe.style.position = 'absolute';
            this.testIframe.style.top = '0px';
            this.testIframe.style.left = '0px';
            this.testIframe.style.border = '0px';
            this.testIframe.style.width = '100%';
            this.testIframe.style.height = '100%';

            //bottom: 120px;
            this.srcIframe = document.createElement('iframe');
            this.srcIframe.id = 'testSourceContainer';
            this.srcIframe.style.backgroundColor = '#9e9e9e';
            this.srcIframe.style.cssFloat = 'none';
            this.srcIframe.style.position = 'absolute';
            this.srcIframe.style.right = '0px';
            this.srcIframe.style.top = '0px';
            this.srcIframe.style.bottom = '0px';
            this.srcIframe.style.border = '0px';
            this.srcIframe.style.width = '0%';
            this.srcIframe.style.height = '100%';

            iframeContainer.appendChild(this.testIframe);
            iframeContainer.appendChild(this.srcIframe);

            document.body.appendChild(iframeContainer);
        };

        /**
        *
        * Selectnext / previous menu item
        *
        * @param direction
        */
        AppHarness.prototype.nagigateBy = function (direction) {
            if (typeof direction === "undefined") { direction = 1; }
            var l = this.tests.length;
            var nextCounter = this.counter + direction;

            if (nextCounter < 0) {
                nextCounter = this.tests.length - 1;
            } else if (nextCounter > this.tests.length - 1) {
                nextCounter = 0;
            }

            var testData = this.tests[nextCounter];

            if (testData.name.indexOf('--') != -1) {
                this.counter = nextCounter;
                this.nagigateBy(direction);
            } else {
                this.navigateToSection(testData);
                this.dropDown.selectedIndex = nextCounter;
                this.counter = nextCounter;
            }
        };

        /**
        *
        * Navigate to a section
        *
        * @param testData
        */
        AppHarness.prototype.navigateToSection = function (testData) {
            this.srcIframe.src = testData.src;
            this.testIframe.src = 'frame.html?name=' + testData.classpath + '&js=' + testData.js;
        };

        //------------------------------------------------------------------------------
        // Utils
        /**
        *
        * Util function - get Element by ID
        *
        * @param id
        * @returns {HTMLElement}
        */
        AppHarness.prototype.getId = function (id) {
            return document.getElementById(id);
        };

        //------------------------------------------------------------------------------
        // Events
        /**
        *
        * Dropbox event handler
        *
        * @param e
        */
        AppHarness.prototype.dropDownChange = function (e) {
            this.dropDown.options[this.dropDown.selectedIndex].value;

            this.counter = this.dropDown.selectedIndex;

            var dataIndex = parseInt(this.dropDown.options[this.dropDown.selectedIndex].value);

            if (!isNaN(dataIndex)) {
                this.navigateToSection(this.tests[dataIndex]);
            }
        };
        return AppHarness;
    })();
    away.AppHarness = AppHarness;

    //---------------------------------------------------
    // Application Frame
    var AppFrame = (function () {
        function AppFrame() {
            this.classPath = '';
            this.jsPath = '';
            var queryParams = AppFrame.getQueryParams(document.location.search);

            if (queryParams.js != undefined && queryParams.name != undefined) {
                this.jsPath = queryParams.js;
                this.classPath = queryParams.name;
                this.loadJS(this.jsPath);
            }
        }
        /**
        *
        * Load a JavaScript file
        *
        * @param url - URL of JavaScript file
        */
        AppFrame.prototype.loadJS = function (url) {
            var _this = this;
            var head = document.getElementsByTagName("head")[0];
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = url;
            script.onload = function () {
                return _this.jsLoaded();
            };

            head.appendChild(script);
        };

        /**
        *
        * Event Handler for loaded JavaScript files
        *
        */
        AppFrame.prototype.jsLoaded = function () {
            var createPath = this.classPath.split('.');
            var obj;

            for (var c = 0; c < createPath.length; c++) {
                if (obj == null) {
                    obj = window[createPath[c]];
                } else {
                    obj = obj[createPath[c]];
                }
            }

            if (obj != null) {
                new obj();
            }
        };

        AppFrame.getQueryParams = /**
        *
        * Utility function - Parse a Query formatted string
        *
        * @param qs
        * @returns {{}}
        */
        function (qs) {
            qs = qs.split("+").join(" ");

            var params = {}, tokens, re = /[?&]?([^=]+)=([^&]*)/g;

            while (tokens = re.exec(qs)) {
                params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
            }

            return params;
        };
        return AppFrame;
    })();
    away.AppFrame = AppFrame;

    //---------------------------------------------------
    // Data
    var TestData = (function () {
        function TestData(name, classpath, js, src) {
            this.js = js;
            this.classpath = classpath;
            this.src = src;
            this.name = name;
        }
        return TestData;
    })();
})(away || (away = {}));
//# sourceMappingURL=AppHarness.js.map
