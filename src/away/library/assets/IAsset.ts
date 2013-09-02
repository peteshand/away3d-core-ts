///<reference path="../../_definitions.ts"/>

module away.library
{
	//import flash.events.IEventDispatcher;

	export interface IAsset extends away.events.IEventDispatcher
	{

		name : string; // GET SET
		id : string; // GET SET
		assetNamespace : string; // GET
		assetType : string; // GET
		assetFullPath : Array; // GET
		
		assetPathEquals(name : string, ns : string) : boolean;
		resetAssetPath(name : string, ns : string = null, overrideOriginal : boolean = true ) : void;
		dispose() : void;

	}
}