
///<reference path="../../_definitions.ts"/>

module away.loaders
{
    /**
     * Interface between SingleFileLoader, and a TypeScript / JavaScript system. JS Does not gracefully convert loaded ByteArrays, BufferArrays, or Blobs to
     * Bitmaps. ]
     *
     * So we have two Types of loaders which need a common interface :
     *
     *      IMGLoader ( for images )
     *      URLLoader ( for data - XMLHttpRequest: text / variables / blobs / Array Buffers / binary data )
     *
     * Which kind of loader a Parser is going to require will need to be specified in ParserBase.
     *
     */
    export interface ISingleFileTSLoader extends away.events.IEventDispatcher {

        data : any; // GET
        dataFormat : string;
        load( rep : away.net.URLRequest ) : void ;
        dispose() : void ;


    }

}
