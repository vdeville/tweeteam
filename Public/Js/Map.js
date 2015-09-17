/**
 * Created by Mel on 17/09/2015.
 */
var Map =
{
    init : function(callback)
    {
        var
            width  = window.innerWidth,
            height = window.innerHeight;

        var
            projection = d3.geo.equirectangular()
                .scale(300)
                .translate([width / 2, height / 2])
                .precision(.1);

        var path      = d3.geo.path().projection(projection);
        var graticule = d3.geo.graticule();
        var svg       = d3.select('#map_svg').append('svg').attr('width', width).attr('height', height);

        svg.append('path')
            .datum(graticule)
            .attr("class", "graticule")
            .attr("d", path);

        d3.json('Js/world-50m.json', function(error, world)
        {
            if(error) throw error;

            svg.insert('path', '.graticule')
                .datum(topojson.feature(world, world.objects.land))
                .attr('class', 'land')
                .attr('d', path);

            svg.insert('path', '.graticule')
                .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
                .attr('class', 'boundary')
                .attr('d', path);
        });

        d3.select(self.frameElement).style("height", height + "px");
        callback(svg, projection);
    }
};