/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../../away/_definitions.ts" />

module aglsl.assembler
{
	
	export class Reg
	{
		
		public code:number;
		public desc:string;
		
		constructor( code:number, desc:string )
		{
			this.code = code;
			this.desc = desc;
		}
	}
}