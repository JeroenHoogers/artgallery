function calculateVisibility(stopat)
{
	// clear the current visibility mask
    visibilityMask.clear();
	visibilityMask.lineStyle(0, 0xFFFF00, 1);


	var nrOfGuards = level.guards.length;

	// If debugging is on, only draw the vision for 1 guard
	if(debug)
		nrOfGuards = 1;

	for (var g = 0; g < nrOfGuards; g++) 
	{
		var o = new PIXI.Point(parseInt(level.guards[g].position.x), parseInt(level.guards[g].position.y));
		//var o = level.guards[g].position;
		debugGraphics.lineStyle(1, 0xFFFFFF);

	    var endpoints = [];
	    var polygons = [];

	    polygons.push(level.gallery);
	    for (var i = 0; i < level.holes.length; i++) 
	    {
	     	polygons.push(level.holes[i]);
	    }; 

	    // Initialize event structure
	    for (var p = 0; p < polygons.length; p++) 
	    {
		    for (var i = 0;  i < polygons[p].points.length; i+=2) 
		    {
		    	var endpoint = {};
		    	endpoint.x = polygons[p].points[i];
				endpoint.y = polygons[p].points[i+1];
				var dir = { 
					x: endpoint.x - o.x, 
					y: endpoint.y - o.y
				};
				var len = polygons[p].points.length;
				var e1 = {
		    		x: polygons[p].points[(len + i-2) % len],
		    		y: polygons[p].points[(len + i-1) % len]
		    	}
		    	var e2 = {
		    		x: polygons[p].points[(i+2) % len],
		    		y: polygons[p].points[(i+3) % len]
		    	}

				endpoint.angle = Math.atan2(dir.y, dir.x) + Math.PI;
				endpoint.polygon = p;
				endpoint.index = i;
				endpoint.neighbour1 = e1; 
				endpoint.neighbour2 = e2;
				endpoint.beginsSegment = false;

				//var neighbourangle = Math.atan2(dir.y, dir.x) + Math.PI;

				// Determine whether this endpoint begins a new segment
				e1angle = Math.atan2(e1.y - o.y, e1.x - o.x ) + Math.PI;
				e2angle = Math.atan2(e2.y - o.y, e2.x - o.x ) + Math.PI;

				var angle1Diff =  e1angle - endpoint.angle;
				if (angle1Diff <= -Math.PI) angle1Diff += 2 * Math.PI;
				if (angle1Diff >   Math.PI) angle1Diff -= 2 * Math.PI;

				endpoint.neighbour1.beginsSegment = (angle1Diff > 0) ? false : true;

				var angle2Diff = e2angle - endpoint.angle;
				if (angle2Diff <= -Math.PI) angle2Diff += 2 * Math.PI;
				if (angle2Diff >   Math.PI) angle2Diff -= 2 * Math.PI;

				endpoint.neighbour2.beginsSegment = (angle2Diff > 0) ? false : true;

	  // segment.p1.beginsSegment = dAngle > 0;
	  // segment.p2.beginsSegment = !segment.p1.beginsSegment;

		// 				if((neighbourangle < Math.PI && 
		// 					p.angle > Math.PI && 
		// 					neighbourangle + Math.PI * 2 > p.angle && 
		// 					neighbourangle + Math.PI * 2 - p.angle < Math.PI) || 
		// 					(neighbourangle > p.angle &&  neighbourangle - p.angle < Math.PI))
		// 				{


				if(angle1Diff > 0 || angle2Diff > 0)
					endpoint.beginsSegment = true;

		    	endpoints.push(endpoint);
		    }
	    };

	    // Sort the endpoints on angle, if the angle is the same check which endpoint begins a new segment
	    endpoints.sort(function(a,b)
	    {
	    	if(a.angle > b.angle) return 1;
	    	if(a.angle < b.angle) return -1;

	    	if(!a.beginsSegment && b.beginsSegment) return 1;
	    	if(a.beginsSegment && !b.beginsSegment) return -1;

	    	return 0;
	    });

	    var status = [];
	    var lastVertex;
		// var ray = new Ray(x, y, endpoints[0].x, endpoints[0].y);

		// Used for the debug animation, make sure the number of steps does not exceed the number of endpoints
		if(stopat > endpoints.length) stopat = endpoints.length;

		var visPoints = [];

		// Do 2 passes, the first pass is to prepare the status structure for the "real" pass
		for (var pass = 0; pass < 2; pass++) 
		{
			var steps = (pass > 0 && debug) ? stopat : endpoints.length;
		    
		    for (var i = 0; i < steps; i++) 
		    {
		    	var p = endpoints[i];

		    	var nearestwall = status[0];

				// Add walls if p is the first endpoint of this wall
				if(p.beginsSegment)
				{
					var neighbours = [p.neighbour1, p.neighbour2];

			    	for (var j = 0; j < neighbours.length; j++)
			    	{
			    		var n = neighbours[j];
						var exists = false;

						// check whether the wall is already in the status structure
			    		for (var z = status.length - 1; z >= 0; z--) 
			    		{
			    			exists = status[z].isendpoint(p.x, p.y);
			    			if(exists)
			    				break;
			    		}

						// Check whether the wall should be added to the status structure (when p is the first endpoint of this wall)
						if(!n.beginsSegment)
						{
				    		var wall = new LineSegment(n.x, n.y, p.x, p.y);
				    		if(!exists)
				    		{
				    			wall.age = 0;			
							}
							status.push(wall);
						}

			    	};
				}
				// Remove walls with p as second endpoint
		    	for (var j = status.length - 1; j >= 0; j--) 
		    	{
		    		if(status[j].isendpoint(p.x, p.y) && status[j].age > 0)
		    		{
		    			// Remove this wall from the status structure
		    			status.splice(j, 1);
		    		}
		    	};


		    	// Sort walls in the status structure on distance to the origin
		    	var ray = new Ray(o.x, o.y, p.x, p.y);

		    	for (var j = status.length - 1; j >= 0; j--) 
		    	{
		    		var hit = status[j].intersects(ray);

		    		// calculate the distance from the origin to this wall
		    		status[j].dist = Math.sqrt(Math.pow(o.x - hit.x, 2) + Math.pow(o.y - hit.y, 2));
		    	};

		    	
		    	status.sort(function(a,b)
		    	{
		    		var diff = a.dist - b.dist;
		    		if(diff > 0) return 1;
		    		if(diff < 0) return -1;

	    			// Check which line is closer by taking a point slightly further on the line
	    			var p1 = a.interpolate(p.x, p.y, 0.01);
	    			var p2 = b.interpolate(p.x, p.y, 0.01);

	    			var dist1 = Math.sqrt(Math.pow(o.x - p1.x, 2) + Math.pow(o.y - p1.y, 2));
	    			var dist2 = Math.sqrt(Math.pow(o.x - p2.x, 2) + Math.pow(o.y - p2.y, 2));

	    			if(dist1 > dist2) return 1;
	    			if(dist1 < dist2) return -1;

		    		return 0;
		    	});

		      	// debugGraphics.lineStyle(i+1, 0x000000, 1);
		      	// debugGraphics.moveTo(x,y);
		      	// debugGraphics.lineTo(p.x,p.y);



		    	// Debug draws
		    	if(status.length > 0 && pass == 1 && debug)
		    	{
			     	var hit = status[0].intersects(ray);

					debugGraphics.lineStyle(1, 0xff0000, 1);
					debugGraphics.moveTo(o.x,o.y);
					debugGraphics.lineTo(hit.x, hit.y);


			     	debugGraphics.lineStyle(1, 0xFFFF00, 1);
					debugGraphics.beginFill(0x000000, 1);
					debugGraphics.drawCircle(p.x, p.y, 5);
					debugGraphics.endFill();


					if(nearestwall != "undefined" && i == stopat - 1)
					{
						for (var z = 0; z < status.length; z++) {
							if(status[z].age > 0)
								debugGraphics.lineStyle(6, 0x00ff00, 1);
							else
								debugGraphics.lineStyle(6, 0xff0000, 1);
							debugGraphics.moveTo(status[z].x1, status[z].y1);
							debugGraphics.lineTo(status[z].x2, status[z].y2);			
						}

						debugGraphics.lineStyle(3, 0x0000ff, 1);
						debugGraphics.moveTo(nearestwall.x1, nearestwall.y1);
						debugGraphics.lineTo(nearestwall.x2, nearestwall.y2);
					}
				}

				for (var j = 0; j < status.length; j++) {
					status[j].age = 1;
				};

		    	// Check whether the nearest wall has changed, if so construct a visibility triangle
		    	if(typeof nearestwall != 'undefined' && status.length > 0 && !nearestwall.equals(status[0]))
		    	{
		    		if(pass == 1)
			    	{
			    		var ray1 = new Ray(o.x, o.y, p.x, p.y);
			    		var hit1 = nearestwall.intersects(ray1);
			    		
			    		// DEBUG lines
			    		if(debug)
			    		{
				     		debugGraphics.lineStyle(1, 0x000000, 1);
					     	debugGraphics.moveTo(o.x,o.y);
					     	debugGraphics.lineTo(p.x, p.y);
					    }
			    		
			    		if (typeof lastVertex != 'undefined')
			    		{
			    			var ray2 = new Ray(o.x, o.y, lastVertex.x, lastVertex.y);
			    			var hit2 = nearestwall.intersects(ray2);
				    		var triangle = new PIXI.Polygon([
								new PIXI.Point(o.x, o.y),
								new PIXI.Point(hit1.x, hit1.y),
								new PIXI.Point(hit2.x, hit2.y)
							]);

							visPoints.push(new PIXI.Point(hit2.x, hit2.y));
							visPoints.push(new PIXI.Point(hit1.x, hit1.y));

							// Draw debug triangles
							if(debug)
							{
					    		debugGraphics.lineStyle(1, 0xFFFF00, 1);
								debugGraphics.beginFill(0x0000ff, 0.5);
								debugGraphics.drawPolygon(triangle);
								debugGraphics.endFill();
							}
						}
					}
			    	// Save the new vertex
		    		lastVertex = p;
		    	}
		    };
	    };

	    //visibilityPolygon = new PIXI.Polygon(visPoints);

	    if(!debug)
	    {
		   	level.guards[g].visibility = new PIXI.Polygon(visPoints);

		    // Draw the entire visibility polygon to the visibility mask
	    	visibilityMask.beginFill(0x000000, 0);
			visibilityMask.drawPolygon(level.guards[g].visibility);
			visibilityMask.endFill();

			// Draw the entire visibility polygon to the guards' visibility mask
			level.guards[g].visibilityMask.clear();
	    	level.guards[g].visibilityMask.beginFill(0x000000, 0);
			level.guards[g].visibilityMask.drawPolygon(level.guards[g].visibility);
			level.guards[g].visibilityMask.endFill();
		}
	};
}