/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../_definitions.ts"/>


module away.entities
{
	
	export class SubSet
	{
		public vertices:number[];
		public numVertices:number;
		
		public indices:number[];
		public numIndices:number;
		
		public vertexBufferDirty:boolean;
		public indexBufferDirty:boolean;
		
		public vertexContext3D:away.display3D.Context3D;
		public indexContext3D:away.display3D.Context3D;
		
		public vertexBuffer:away.display3D.VertexBuffer3D;
		public indexBuffer:away.display3D.IndexBuffer3D;
		public lineCount:number;
		
		public dispose()
		{
			this.vertices = null;
			if( this.vertexBuffer )
			{
				this.vertexBuffer.dispose();
			}
			if( this.indexBuffer )
			{
				this.indexBuffer.dispose();
			}
		}
	}
}
