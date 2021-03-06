///<reference path="../../../../build/Away3D.next.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var parsers;
(function (parsers) {
    /**
    * ImageParser provides a "parser" for natively supported image types (jpg, png). While it simply loads bytes into
    * a loader object, it wraps it in a BitmapDataResource so resource management can happen consistently without
    * exception cases.
    */
    var JSONTextureParser = (function (_super) {
        __extends(JSONTextureParser, _super);
        //private var _loader           : Loader;
        /**
        * Creates a new ImageParser object.
        * @param uri The url or id of the data or file to be parsed.
        * @param extra The holder for extra contextual data that the parser might need.
        */
        function JSONTextureParser() {
            _super.call(this, away.loaders.ParserDataFormat.PLAIN_TEXT, away.loaders.ParserLoaderType.URL_LOADER);
            //private var _byteData         : ByteArray;
            this.STATE_PARSE_DATA = 0;
            this.STATE_LOAD_IMAGES = 1;
            this.STATE_COMPLETE = 2;
            this._state = -1;
            this._dependencyCount = 0;

            this._loadedTextures = new Array();
            this._state = this.STATE_PARSE_DATA;
        }
        JSONTextureParser.supportsType = /**
        * Indicates whether or not a given file extension is supported by the parser.
        * @param extension The file extension of a potential file to be parsed.
        * @return Whether or not the given file type is supported.
        */
        function (extension) {
            extension = extension.toLowerCase();
            return extension == "json";
        };

        JSONTextureParser.supportsData = /**
        * Tests whether a data block can be parsed by the parser.
        * @param data The data block to potentially be parsed.
        * @return Whether or not the given data is supported.
        */
        function (data) {
            try  {
                var obj = JSON.parse(data);

                if (obj) {
                    return true;
                }

                return false;
            } catch (e) {
                return false;
            }

            return false;
        };

        /**
        * @inheritDoc
        */
        JSONTextureParser.prototype._iResolveDependency = function (resourceDependency) {
            var resource = resourceDependency.assets[0];

            this._pFinalizeAsset(resource, resourceDependency._iLoader.url);

            this._loadedTextures.push(resource);

            //console.log( 'JSONTextureParser._iResolveDependency' , resourceDependency );
            //console.log( 'JSONTextureParser._iResolveDependency resource: ' , resource );
            this._dependencyCount--;

            if (this._dependencyCount == 0) {
                this._state = this.STATE_COMPLETE;
            }
        };

        /**
        * @inheritDoc
        */
        JSONTextureParser.prototype._iResolveDependencyFailure = function (resourceDependency) {
            //console.log( '-----------------------------------------------------------');
            //console.log( 'JSONTextureParser._iResolveDependencyFailure', 'x' , resourceDependency );
            this._dependencyCount--;

            if (this._dependencyCount == 0) {
                this._state = this.STATE_COMPLETE;
                //console.log( 'JSONTextureParser._iResolveDependencyFailure.complete' );
            }
            /*
            
            
            if (_dependencyCount == 0)
            _parseState = DAEParserState.PARSE_MATERIALS;
            */
        };

        JSONTextureParser.prototype.parseJson = function () {
            if (JSONTextureParser.supportsData(this.data)) {
                try  {
                    var json = JSON.parse(this.data);
                    var data = json.data;

                    var rec;
                    var rq;

                    for (var c = 0; c < data.length; c++) {
                        rec = data[c];

                        var uri = rec.image;
                        var id = rec.id;

                        rq = new away.net.URLRequest(uri);

                        //console.log( 'JSONTextureParser.parseJson' , id , uri  );
                        //console.log( 'JSONTextureParser.parseJson' , id , uri  );
                        this._pAddDependency('JSON_ID_' + id, rq, false, null, true);
                    }

                    this._dependencyCount = data.length;
                    this._state = this.STATE_LOAD_IMAGES;

                    this._pPauseAndRetrieveDependencies();
                } catch (e) {
                    this._state = this.STATE_COMPLETE;
                }
            }
        };

        /**
        * @inheritDoc
        */
        JSONTextureParser.prototype._pProceedParsing = function () {
            console.log('JSONTextureParser._pProceedParsing', this._state);

            switch (this._state) {
                case this.STATE_PARSE_DATA:
                    this.parseJson();
                    return away.loaders.ParserBase.MORE_TO_PARSE;

                    break;

                case this.STATE_LOAD_IMAGES:
                    break;

                case this.STATE_COMPLETE:
                    //console.log( 'JSONTextureParser._pProceedParsing: WE ARE DONE' ); // YAY;
                    return away.loaders.ParserBase.PARSING_DONE;

                    break;
            }
            //return away.loaders.ParserBase.MORE_TO_PARSE;
            /*
            var asset : away.textures.Texture2DBase;
            
            if ( this.data instanceof HTMLImageElement )
            {
            
            asset = <away.textures.Texture2DBase> new away.textures.HTMLImageElementTexture( <HTMLImageElement> this.data );
            
            if ( away.utils.TextureUtils.isHTMLImageElementValid( <HTMLImageElement> this.data ) )
            {
            
            
            this._pFinalizeAsset( <away.library.IAsset> asset , this._iFileName );
            
            
            }
            else
            {
            
            this.dispatchEvent( new away.events.AssetEvent( away.events.AssetEvent.TEXTURE_SIZE_ERROR , <away.library.IAsset> asset ) );
            
            }
            
            return away.loaders.ParserBase.PARSING_DONE;
            
            }
            
            return away.loaders.ParserBase.PARSING_DONE;
            */
        };
        return JSONTextureParser;
    })(away.loaders.ParserBase);
    parsers.JSONTextureParser = JSONTextureParser;
})(parsers || (parsers = {}));
var tests;
(function (tests) {
    ///<reference path="../../../build/Away3D.next.d.ts" />
    ///<reference path="parsers/JSONTextureParser.ts" />
    //<reference path="../../../src/Away3D.ts" />
    (function (loaders) {
        var AssetLoaderTest = (function () {
            function AssetLoaderTest() {
                //---------------------------------------------------------------------------------------------------------------------
                // Enable Custom Parser ( JSON file format with multiple texture dependencies )
                away.loaders.AssetLoader.enableParser(parsers.JSONTextureParser);

                var token;
                var urlRq;

                //---------------------------------------------------------------------------------------------------------------------
                // LOAD A SINGLE IMAGE
                this.alImage = new away.loaders.AssetLoader();
                urlRq = new away.net.URLRequest('assets/1024x1024.png');
                token = this.alImage.load(urlRq);

                token.addEventListener(away.events.AssetEvent.ASSET_COMPLETE, this.onAssetComplete, this);
                token.addEventListener(away.events.AssetEvent.TEXTURE_SIZE_ERROR, this.onTextureSizeError, this);

                //---------------------------------------------------------------------------------------------------------------------
                // LOAD A SINGLE IMAGE - With wrong dimensions
                this.alErrorImage = new away.loaders.AssetLoader();
                urlRq = new away.net.URLRequest('assets/2.png');
                token = this.alErrorImage.load(urlRq);

                token.addEventListener(away.events.AssetEvent.ASSET_COMPLETE, this.onAssetComplete, this);
                token.addEventListener(away.events.AssetEvent.TEXTURE_SIZE_ERROR, this.onTextureSizeError, this);

                //---------------------------------------------------------------------------------------------------------------------
                // LOAD WITH A JSON PARSER
                this.alJson = new away.loaders.AssetLoader();
                urlRq = new away.net.URLRequest('assets/JSNParserTest.json');
                token = this.alJson.load(urlRq);

                token.addEventListener(away.events.AssetEvent.ASSET_COMPLETE, this.onAssetComplete, this);
                token.addEventListener(away.events.AssetEvent.TEXTURE_SIZE_ERROR, this.onTextureSizeError, this);
                token.addEventListener(away.events.ParserEvent.PARSE_COMPLETE, this.onParseComplete, this);

                token.addEventListener(away.events.LoaderEvent.DEPENDENCY_COMPLETE, this.onDependencyComplete, this);
            }
            AssetLoaderTest.prototype.onDependencyComplete = function (e) {
                console.log('--------------------------------------------------------------------------------');
                console.log('AssetLoaderTest.onDependencyComplete', e);
                console.log('--------------------------------------------------------------------------------');
            };

            AssetLoaderTest.prototype.onParseComplete = function (e) {
                console.log('--------------------------------------------------------------------------------');
                console.log('AssetLoaderTest.onParseComplete', e);
                console.log('--------------------------------------------------------------------------------');
            };

            AssetLoaderTest.prototype.onTextureSizeError = function (e) {
                var assetLoader = e.target;

                console.log('--------------------------------------------------------------------------------');
                console.log('AssetLoaderTest.onTextureSizeError', assetLoader.baseDependency._iLoader.url, e);
                console.log('--------------------------------------------------------------------------------');
            };

            AssetLoaderTest.prototype.onAssetComplete = function (e) {
                var assetLoader = e.target;

                console.log('--------------------------------------------------------------------------------');
                console.log('AssetLoaderTest.onAssetComplete', assetLoader.baseDependency._iLoader.url, e);
                console.log('--------------------------------------------------------------------------------');
            };
            return AssetLoaderTest;
        })();
        loaders.AssetLoaderTest = AssetLoaderTest;
    })(tests.loaders || (tests.loaders = {}));
    var loaders = tests.loaders;
})(tests || (tests = {}));
//# sourceMappingURL=AssetLoaderTest.js.map
