function calculateVisibility(stopat)
{
	// clear the current visibility mask
    visibilityMask.clear();
	visibilityMask.lineStyle(0, 0xFFFF00, 1);

	for (var g = 0; g < level.guards.length; g++) 
	{
		var o = new PIXI.Point(parseInt(level.guards[g].position.x), parseInt(level.guards[g].position.y));
		//var o = level.guards[g].position;
		debugGraphics.lineStyle(1, 0xFFFFFF);

	    var endpoints = [];
	    var polygons = [];

	    polygons.push(level.gallery);
	    for (var i = 0; i < level.holes.length; i++) {
	     	polygons.push(level.holes[i]);
	    }; 

	    // Initialize event structure
	    for (var p = 0; p < polygons.length; p++) {
		    for (var i = 0;  i < polygons[p].points.length; i+=2) {
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

		    	endpoints.push(endpoint);
		    }
	    };

	    endpoints.sort(function(a,b){

	    	if(a.angle - b.angle == 0)
	    	{
	    		 var l1 = Math.sqrt(Math.pow(o.x - a.x, 2) + Math.pow(o.y - a.y, 2));
	    		 var l2 = Math.sqrt(Math.pow(o.x - b.x, 2) + Math.pow(o.y - b.y, 2));

	    		 if(a.angle > Math.PI && a.angle < Math.PI * 2.0)
					return l2 - l1;
				else
				{
					return 0;	
					 var angle1 = Math.atan2(a.e1.y, a.e1.x) + Math.PI;
					 var angle2 = Math.atan2(a.e2.y, a.e2.x) + Math.PI;
					// console.log("original" + a.angle + "1: " + angle1 + " 2: " + angle2);
					if(a.angle == Math.PI && angle1 <= a.angle && angle2 <= a.angle)
					{
						return l2 - l1;
					}
					return l1 - l2;
				}
	    	}
	    	return a.angle - b.angle;

	    });

	    var status = [];
	    var lastVertex;
		// var ray = new Ray(x, y, endpoints[0].x, endpoints[0].y);


		if(stopat > endpoints.length) stopat = endpoints.length;
		var visPoints = [];
		for (var pass = 0; pass < 2; pass++) 
		{
			//console.debug(status.length);
			var steps = (pass > 0 && debug) ? stopat : endpoints.length;
		    for (var i = 0; i < steps; i++) 
		    {
		    	var p = endpoints[i];

		    	var nearestwall = status[0];

				var neighbours = [p.neighbour1, p.neighbour2];

				// Add walls if p is the first endpoint of this wall
		    	for (var j = 0; j < neighbours.length; j++)
		    	{

		    		var n = neighbours[j];
					var dir = { 
						x: n.x - o.x, 
						y: n.y - o.y
					};

					var exists = false;
					// check whether the wall is already in the status structure
		    		for (var z = status.length - 1; z >= 0; z--) 
		    		{
		    			exists = status[z].isendpoint(p.x, p.y);
		    			if(exists)
		    				break;
		    		}

					//var difference = Math.atan2(dir.y, dir.x) - p.angle;
					var neighbourangle = Math.atan2(dir.y, dir.x) + Math.PI;
					//console.log("Add : ? " + difference);
					//if(difference < -Math.PI || difference > 0)
					if((neighbourangle < Math.PI && 
						p.angle > Math.PI && 
						neighbourangle + Math.PI * 2 > p.angle && 
						neighbourangle + Math.PI * 2 - p.angle < Math.PI) || 
						(neighbourangle > p.angle &&  neighbourangle - p.angle < Math.PI))
					{
						//console.log("wall added");
						//if(exists)
						//	console.log("wall added twice");

			    		var wall = new LineSegment(n.x, n.y, p.x, p.y);
			    		if(!exists)
			    		{
			    			wall.age = 0;			
						}
						status.push(wall);
					}

		    	};
				
				// Remove walls with p as second endpoint
		    	for (var j = status.length - 1; j >= 0; j--) 
		    	{
		    		if(status[j].isendpoint(p.x, p.y) && status[j].age > 0)
		    		{
		    			// remove this wall from the array
						//console.log("wall removed");
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

		    	// TODO: Create this function in another location since we have to reuse it
		    	status.sort(function(a,b)
		    	{
		    		var diff = a.dist - b.dist;
		    		if(diff > 0) return 1;
		    		if(diff < 0) return -1;
		    		if(diff == 0)
		    		{
		    			// Check which line is closer by taking a point slightly further on the line
		    			var p1 = a.interpolate(p.x, p.y, 0.01);
		    			var p2 = b.interpolate(p.x, p.y, 0.01);

		    			var dist1 = Math.sqrt(Math.pow(o.x - p1.x, 2) + Math.pow(o.y - p1.y, 2));
		    			var dist2 = Math.sqrt(Math.pow(o.x - p2.x, 2) + Math.pow(o.y - p2.y, 2));

		    			if(dist1 > dist2) return 1;
		    			if(dist1 < dist2) return -1;
		    		}

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
	    level.guards[g].visibility = new PIXI.Polygon(visPoints);

    	visibilityMask.beginFill(0x000000, 0);
		visibilityMask.drawPolygon(level.guards[g].visibility);
		visibilityMask.endFill();
	};
}