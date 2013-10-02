///<reference path="../../_definitions.ts"/>
module away.math
{
	
	/**
	 * MathConsts provides some commonly used mathematical constants
	 */
	export class MathConsts
	{
		/**
		 * The amount to multiply with when converting radians to degrees.
		 */
		public static RADIANS_TO_DEGREES:number = 180/Math.PI;
		
		/**
		 * The amount to multiply with when converting degrees to radians.
		 */
		public static DEGREES_TO_RADIANS:number = Math.PI/180;
	}
}
