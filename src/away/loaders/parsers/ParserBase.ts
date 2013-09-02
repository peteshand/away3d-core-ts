

///<reference path="../../_definitions.ts"/>

module away.loaders {

	/**
	 * <code>ParserBase</code> provides an abstract base class for objects that convert blocks of data to data structures
	 * supported by Away3D.
	 *
	 * If used by <code>AssetLoader</code> to automatically determine the parser type, two public static methods should
	 * be implemented, with the following signatures:
	 *
	 * <code>public static supportsType(extension : string) : boolean</code>
	 * Indicates whether or not a given file extension is supported by the parser.
	 *
	 * <code>public static supportsData(data : *) : boolean</code>
	 * Tests whether a data block can be parsed by the parser.
	 *
	 * Furthermore, for any concrete subtype, the method <code>initHandle</code> should be overridden to immediately
	 * create the object that will contain the parsed data. This allows <code>ResourceManager</code> to return an object
	 * handle regardless of whether the object was loaded or not.
	 *
	 * @see away3d.loading.parsers.AssetLoader
	 * @see away3d.loading.ResourceManager
	 */
	export class ParserBase extends away.events.EventDispatcher
	{
		public _iFileName       : string; // ARCANE
		private _dataFormat     : string;
		private _data           : any;
		private _frameLimit     : number;
		private _lastFrameTime  : number;

        //----------------------------------------------------------------------------------------------------------------------------------------------------------------
        // TODO: add error checking for the following ( could cause a problem if this function is not implemented )
        //----------------------------------------------------------------------------------------------------------------------------------------------------------------
        // Needs to be implemented in all Parsers (
        //<code>public static supportsType(extension : string) : boolean</code>
        //* Indicates whether or not a given file extension is supported by the parser.
        //----------------------------------------------------------------------------------------------------------------------------------------------------------------

        public static supportsType(extension:string):boolean
        {

            throw new away.errors.AbstractMethodError();
            return false;

        }

        /* TODO: Implement ParserUtil;
		public _pGetTextData():string
		{
			return ParserUtil.toString(_data);
		}
		
		public _pGetByteData():ByteArray
		{
			return ParserUtil.toByteArray(_data);
		}
		*/
		private _dependencies       : away.loaders.ResourceDependency[];//Vector.<ResourceDependency>;
        private _loaderType         : string = away.loaders.ParserLoaderType.URL_LOADER; // Default loader is URLLoader
		private _parsingPaused      : boolean;
		private _parsingComplete    : boolean;
		private _parsingFailure     : boolean;
		private _timer              : away.utils.Timer;
		private _materialMode       : number;
		
		/**
		 * Returned by <code>proceedParsing</code> to indicate no more parsing is needed.
		 */
		public static PARSING_DONE : boolean = true; /* Protected */
		
		/**
		 * Returned by <code>proceedParsing</code> to indicate more parsing is needed, allowing asynchronous parsing.
		 */
        public static MORE_TO_PARSE : boolean = false; /* Protected */
		
		
		/**
		 * Creates a new ParserBase object
		 * @param format The data format of the file data to be parsed. Can be either <code>ParserDataFormat.BINARY</code> or <code>ParserDataFormat.PLAIN_TEXT</code>, and should be provided by the concrete subtype.
         * @param loaderType The type of loader required by the parser
		 *
		 * @see away3d.loading.parsers.ParserDataFormat
		 */
		constructor(format : string , loaderType : string = null )
		{

            super();

            if ( loaderType )
            {

                this._loaderType = loaderType;

            }

			this._materialMode=0;
			this._dataFormat    = format;
			this._dependencies  = new Array<away.loaders.ResourceDependency>();
		}
		
		/**
		 * Validates a bitmapData loaded before assigning to a default BitmapMaterial 
		 */

		public isBitmapDataValid(bitmapData: away.display.BitmapData) : boolean
		{
			var isValid : boolean = away.utils.TextureUtils.isBitmapDataValid( bitmapData );

			if( ! isValid )
            {

                console.log (">> Bitmap loaded is not having power of 2 dimensions or is higher than 2048");
            }
			
			return isValid;
		}

		public set parsingFailure(b:boolean)
		{
			this._parsingFailure = b;
		}

		public get parsingFailure() : boolean
		{
			return this._parsingFailure;
		}

		public get parsingPaused() : boolean
		{
			return this._parsingPaused;
		}

		public get parsingComplete() : boolean
		{
			return this._parsingComplete;
		}
		
		public set materialMode(newMaterialMode:number)
		{
            this._materialMode=newMaterialMode;
		}
		
		public get materialMode() : number
		{
			return this._materialMode;
		}

        public get loaderType() : string
        {

            return this._loaderType;

        }

        public set loaderType( value : string )
        {

            this._loaderType = value;

        }

        public get data() : any
        {

            return this._data;

        }

		/**
		 * The data format of the file data to be parsed. Can be either <code>ParserDataFormat.BINARY</code> or <code>ParserDataFormat.PLAIN_TEXT</code>.
		 */
		public get dataFormat() : string
		{
			return this._dataFormat;
		}
		
		/**
		 * Parse data (possibly containing bytearry, plain text or BitmapAsset) asynchronously, meaning that
		 * the parser will periodically stop parsing so that the AVM may proceed to the
		 * next frame.
		 *
		 * @param data The untyped data object in which the loaded data resides.
		 * @param frameLimit number of milliseconds of parsing allowed per frame. The
		 * actual time spent on a frame can exceed this number since time-checks can
		 * only be performed between logical sections of the parsing procedure.
		 */
		public parseAsync(data : any, frameLimit : number = 30) : void
		{
            this._data = data;
            this.startParsing(frameLimit);
		}
		
		/**
		 * A list of dependencies that need to be loaded and resolved for the object being parsed.
		 */
		public get dependencies() : away.loaders.ResourceDependency[]
		{
			return this._dependencies;
		}
		
		/**
		 * Resolve a dependency when it's loaded. For example, a dependency containing an ImageResource would be assigned
		 * to a Mesh instance as a BitmapMaterial, a scene graph object would be added to its intended parent. The
		 * dependency should be a member of the dependencies property.
		 *
		 * @param resourceDependency The dependency to be resolved.
		 */
		public _iResolveDependency(resourceDependency : ResourceDependency) : void
		{

            throw new away.errors.AbstractMethodError();

		}
		
		/**
		 * Resolve a dependency loading failure. Used by parser to eventually provide a default map
		 *
		 * @param resourceDependency The dependency to be resolved.
		 */
		public _iResolveDependencyFailure(resourceDependency : ResourceDependency) : void
		{
            throw new away.errors.AbstractMethodError();
		}

		/**
		 * Resolve a dependency name
		 *
		 * @param resourceDependency The dependency to be resolved.
		 */
		public _iResolveDependencyName(resourceDependency : ResourceDependency, asset:away.library.IAsset) : string
		{
			return asset.name;
		}
		
		public _iResumeParsingAfterDependencies() : void
		{
			this._parsingPaused = false;

			if (this._timer){

                this._timer.start();

            }
		}
		
		public _pFinalizeAsset( asset : away.library.IAsset, name : string=null) : void
		{
			var type_event : string;
			var type_name : string;
			
			if (name != null){

                asset.name = name;

            }

			switch (asset.assetType) {
				case away.library.AssetType.LIGHT_PICKER:
					type_name = 'lightPicker';
					type_event = away.events.AssetEvent.LIGHTPICKER_COMPLETE;
					break;
				case away.library.AssetType.LIGHT:
					type_name = 'light';
					type_event = away.events.AssetEvent.LIGHT_COMPLETE;
					break;
				case away.library.AssetType.ANIMATOR:
					type_name = 'animator';
					type_event = away.events.AssetEvent.ANIMATOR_COMPLETE;
					break;
				case away.library.AssetType.ANIMATION_SET:
					type_name = 'animationSet';
					type_event = away.events.AssetEvent.ANIMATION_SET_COMPLETE;
					break;
				case away.library.AssetType.ANIMATION_STATE:
					type_name = 'animationState';
					type_event = away.events.AssetEvent.ANIMATION_STATE_COMPLETE;
					break;
				case away.library.AssetType.ANIMATION_NODE:
					type_name = 'animationNode';
					type_event = away.events.AssetEvent.ANIMATION_NODE_COMPLETE;
					break;
				case away.library.AssetType.STATE_TRANSITION:
					type_name = 'stateTransition';
					type_event = away.events.AssetEvent.STATE_TRANSITION_COMPLETE;
					break;
				case away.library.AssetType.TEXTURE:
					type_name = 'texture';
					type_event = away.events.AssetEvent.TEXTURE_COMPLETE;
					break;
				case away.library.AssetType.TEXTURE_PROJECTOR:
					type_name = 'textureProjector';
					type_event = away.events.AssetEvent.TEXTURE_PROJECTOR_COMPLETE;
					break;
				case away.library.AssetType.CONTAINER:
					type_name = 'container';
					type_event = away.events.AssetEvent.CONTAINER_COMPLETE;
					break;
				case away.library.AssetType.GEOMETRY:
					type_name = 'geometry';
					type_event = away.events.AssetEvent.GEOMETRY_COMPLETE;
					break;
				case away.library.AssetType.MATERIAL:
					type_name = 'material';
					type_event = away.events.AssetEvent.MATERIAL_COMPLETE;
					break;
				case away.library.AssetType.MESH:
					type_name = 'mesh';
					type_event = away.events.AssetEvent.MESH_COMPLETE;
					break;
				case away.library.AssetType.SKELETON:
					type_name = 'skeleton';
					type_event = away.events.AssetEvent.SKELETON_COMPLETE;
					break;
				case away.library.AssetType.SKELETON_POSE:
					type_name = 'skelpose';
					type_event = away.events.AssetEvent.SKELETON_POSE_COMPLETE;
					break;
				case away.library.AssetType.ENTITY:
					type_name = 'entity';
					type_event = away.events.AssetEvent.ENTITY_COMPLETE;
					break;
				case away.library.AssetType.SKYBOX:
					type_name = 'skybox';
					type_event = away.events.AssetEvent.SKYBOX_COMPLETE;
					break;
				case away.library.AssetType.CAMERA:
					type_name = 'camera';
					type_event = away.events.AssetEvent.CAMERA_COMPLETE;
					break;
				case away.library.AssetType.SEGMENT_SET:
					type_name = 'segmentSet';
					type_event = away.events.AssetEvent.SEGMENT_SET_COMPLETE;
					break;
				case away.library.AssetType.EFFECTS_METHOD:
					type_name = 'effectsMethod';
					type_event = away.events.AssetEvent.EFFECTMETHOD_COMPLETE;
					break;
				case away.library.AssetType.SHADOW_MAP_METHOD:
					type_name = 'effectsMethod';
					type_event = away.events.AssetEvent.SHADOWMAPMETHOD_COMPLETE;
					break;
                default:
                    throw new away.errors.Error('Unhandled asset type '+asset.assetType+'. Report as bug!');
					break;
			};

            //console.log( 'ParserBase' , '_pFinalizeAsset.type_event: ' ,  type_event );

			// If the asset has no name, give it
			// a per-type default name.
			if (!asset.name)
				asset.name = type_name;
			
			this.dispatchEvent(new away.events.AssetEvent(away.events.AssetEvent.ASSET_COMPLETE, asset));
            this.dispatchEvent(new away.events.AssetEvent(type_event, asset));
		}
		
		/**
		 * Parse the next block of data.
		 * @return Whether or not more data needs to be parsed. Can be <code>ParserBase.ParserBase.PARSING_DONE</code> or
		 * <code>ParserBase.ParserBase.MORE_TO_PARSE</code>.
		 */
		public _pProceedParsing() : boolean
		{

            throw new away.errors.AbstractMethodError();
			return true;
		}

		public _pDieWithError(message : string = 'Unknown parsing error') : void
		{
            if(this._timer)
            {
			    this._timer.removeEventListener(away.events.TimerEvent.TIMER, this._pOnInterval , this );
                this._timer.stop();
                this._timer = null;
            }

			this.dispatchEvent(new away.events.ParserEvent(away.events.ParserEvent.PARSE_ERROR, message));
		}

		public _pAddDependency(id : string, req : away.net.URLRequest, retrieveAsRawData : boolean = false, data : any = null, suppressErrorEvents : boolean = false) : void
		{

			this._dependencies.push(new away.loaders.ResourceDependency(id, req, data, this, retrieveAsRawData, suppressErrorEvents));
		}

		public _pPauseAndRetrieveDependencies() : void
		{
            if(this._timer)
            {
                this._timer.stop();
            }

			this._parsingPaused = true;
			this.dispatchEvent(new away.events.ParserEvent(away.events.ParserEvent.READY_FOR_DEPENDENCIES));
		}
		
		/**
		 * Tests whether or not there is still time left for parsing within the maximum allowed time frame per session.
		 * @return True if there is still time left, false if the maximum allotted time was exceeded and parsing should be interrupted.
		 */
		public _pHasTime() : boolean
		{

			return ((away.utils.getTimer() - this._lastFrameTime) < this._frameLimit);

		}
		
		/**
		 * Called when the parsing pause interval has passed and parsing can proceed.
		 */
		public _pOnInterval(event : away.events.TimerEvent = null) : void
		{
			this._lastFrameTime = away.utils.getTimer();

			if (this._pProceedParsing() && !this._parsingFailure){

				this._pFinishParsing();

            }
		}
		
		/**
		 * Initializes the parsing of data.
		 * @param frameLimit The maximum duration of a parsing session.
		 */
		private startParsing(frameLimit : number) : void
		{

			this._frameLimit = frameLimit;
			this._timer = new away.utils.Timer(this._frameLimit, 0);
			this._timer.addEventListener(away.events.TimerEvent.TIMER, this._pOnInterval , this );
			this._timer.start();

		}

		/**
		 * Finish parsing the data.
		 */
		public _pFinishParsing() : void
		{

            //console.log( 'ParserBase._pFinishParsing');

            if(this._timer)
            {
			    this._timer.removeEventListener(away.events.TimerEvent.TIMER, this._pOnInterval , this );
			    this._timer.stop();
            }

			this._timer = null;
			this._parsingComplete = true;

			this.dispatchEvent(new away.events.ParserEvent(away.events.ParserEvent.PARSE_COMPLETE));

		}

        /**
         *
         * @returns {string}
         * @private
         */
        public _pGetTextData():string
        {
            return away.loaders.ParserUtil.toString( this._data);
        }

	}

}

