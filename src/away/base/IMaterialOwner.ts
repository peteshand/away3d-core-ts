///<reference path="../_definitions.ts"/>

module away.base
{
	//import away3d.animators.IAnimator;
	//import away3d.materials.MaterialBase;
	
	/**
	 * IMaterialOwner provides an interface for objects that can use materials.
	 */
	export interface IMaterialOwner
	{
		/**
		 * The material with which to render the object.
		 */
		material:away.materials.MaterialBase; // GET / SET

		/**
		 * The animation used by the material to assemble the vertex code.
		 */
		animator:away.animators.IAnimator; // GET in most cases, this will in fact be null
	}
}
