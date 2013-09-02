module away.events 
{
	export interface IEventDispatcher
	{
		addEventListener ( type : string , listener : Function , target : Object ):void;
        removeEventListener ( type : string , listener : Function , target : Object ):void;
        dispatchEvent ( event : Event ):void;
        hasEventListener( type : string , listener : Function = null , target : Object = null ):boolean;
    }
}