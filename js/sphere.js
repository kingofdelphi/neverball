function Sphere(x, y, z, radius) {
    var x_rot = 0;
    var z_rot = 0;
    this.pts = [];
    this.origin = createPoint(x, y, z);
    var steps = 21;
    
    this.set = function(x, y, z, radius) {
        this.radius = radius;
        var vstp = Math.PI / (steps - 1);
        var hstp = 2.0 * Math.PI / (steps - 1);

        this.pts = [];
        var pt = createPoint(0, radius, 0);
        for (var i = 0; i < steps; ++i) {
            var row = [];
            var cur = createPoint(pt.x, pt.y, pt.z);
            for (var j = 0; j < steps; ++j) {
                row.push(cur);
                cur = rotateY(cur, hstp);
            }
            pt = rotateX(pt, vstp);
            this.pts.push(row);
        }
    }

    this.vx = 0; 
    this.vy = 0;
    this.vz = 0;

    var self = this;

    var handleKeyStrokes = function() {
        var vinc = 0.0005;
        if (KEY_STATE[KEY_LEFT]) {
            self.vx -= vinc;
        }
        if (KEY_STATE[KEY_RIGHT]) {
            self.vx += vinc;
        }

        if (KEY_STATE[KEY_UP]) {
            self.vz -= vinc;
        }

        if (KEY_STATE[KEY_DOWN]) {
            self.vz += vinc;
        }

        if (KEY_STATE[KEY_SPACE]) {
            self.vy = .03;
        }
    }

    this.set(x, y, z, radius);

    this.push = function(dinfo) {
        for (var i = 0; i < this.pts.length; ++i) {
            for (var j = 0; j < this.pts[i].length; ++j) {
                var pt = createPoint(this.pts[i][j].x, this.pts[i][j].y, this.pts[i][j].z);
                pt.x += this.origin.x;
                pt.y += this.origin.y;
                pt.z += this.origin.z;
                dinfo.points.push(pt);
            }
        }

        for (var i = 0; i + 1 < this.pts.length; ++i) {
            for (var j = 0; j + 1 < this.pts[0].length; ++j) {
                var color = (Math.floor(j / 2)) % 2 == 0 ? "rgba(255, 0, 0, 1)" : "rgba(0, 255, 0, 1)";
                var si = i * this.pts[0].length;
                var sip = si + this.pts[0].length;
                dinfo.surfaces.push([[si + j, si + j + 1, sip + j + 1, sip + j], color]);
            }
        }
    }

    this.update = function() {
        handleKeyStrokes();
        this.origin.x += this.vx;
        this.origin.y += this.vy;
        this.origin.z += this.vz;
        var mg = Math.sqrt(this.vx * this.vx + this.vz * this.vz);
        if (mg != 0) {
            var u = this.vx / mg;
            var v = this.vz / mg;
            //console.log(u, v);
            var ang = Math.atan2(u, v) + Math.PI / 2;
            //console.log((ang + Math.PI / 2) * 180 / Math.PI);
            var rot = mg / this.radius;
            for (var i = 0; i < this.pts.length; ++i) {
                for (var j = 0; j < this.pts[i].length; ++j) {
                    this.pts[i][j] = rotateY(rotateZ(rotateY(this.pts[i][j], -ang), rot), ang);
                }
            }
        }

        this.vx *= 0.98;
        this.vy *= 0.98;
        this.vz *= 0.98;

    }

}
