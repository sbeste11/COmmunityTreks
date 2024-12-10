"use strict";(()=>{(self.webpackChunkcommunity_treks=self.webpackChunkcommunity_treks||[]).push([[845],{845:(ie,O,T)=>{T.r(O),T.d(O,{loadGPXTracks:()=>te});function N(e){if(!e)throw new Error("coord is required");if(!Array.isArray(e)){if(e.type==="Feature"&&e.geometry!==null&&e.geometry.type==="Point")return[...e.geometry.coordinates];if(e.type==="Point")return[...e.coordinates]}if(Array.isArray(e)&&e.length>=2&&!Array.isArray(e[0])&&!Array.isArray(e[1]))return[...e];throw new Error("coord must be GeoJSON Point or an Array of numbers")}function oe(e){if(Array.isArray(e))return e;if(e.type==="Feature"){if(e.geometry!==null)return e.geometry.coordinates}else if(e.coordinates)return e.coordinates;throw new Error("coords must be GeoJSON Feature, Geometry Object or an Array")}function z(e){if(e.length>1&&isNumber(e[0])&&isNumber(e[1]))return!0;if(Array.isArray(e[0])&&e[0].length)return z(e[0]);throw new Error("coordinates must only contain numbers")}function ae(e,r,n){if(!r||!n)throw new Error("type and name required");if(!e||e.type!==r)throw new Error("Invalid input to "+n+": must be a "+r+", given "+e.type)}function se(e,r,n){if(!e)throw new Error("No feature passed");if(!n)throw new Error(".featureOf() requires a name");if(!e||e.type!=="Feature"||!e.geometry)throw new Error("Invalid input to "+n+", Feature with geometry required");if(!e.geometry||e.geometry.type!==r)throw new Error("Invalid input to "+n+": must be a "+r+", given "+e.geometry.type)}function ue(e,r,n){if(!e)throw new Error("No featureCollection passed");if(!n)throw new Error(".collectionOf() requires a name");if(!e||e.type!=="FeatureCollection")throw new Error("Invalid input to "+n+", FeatureCollection required");for(const t of e.features){if(!t||t.type!=="Feature"||!t.geometry)throw new Error("Invalid input to "+n+", Feature with geometry required");if(!t.geometry||t.geometry.type!==r)throw new Error("Invalid input to "+n+": must be a "+r+", given "+t.geometry.type)}}function le(e){return e.type==="Feature"?e.geometry:e}function ce(e,r){return e.type==="FeatureCollection"?"FeatureCollection":e.type==="GeometryCollection"?"GeometryCollection":e.type==="Feature"&&e.geometry!==null?e.geometry.type:e.type}var v=63710088e-1,q={centimeters:v*100,centimetres:v*100,degrees:360/(2*Math.PI),feet:v*3.28084,inches:v*39.37,kilometers:v/1e3,kilometres:v/1e3,meters:v,metres:v,miles:v/1609.344,millimeters:v*1e3,millimetres:v*1e3,nauticalmiles:v/1852,radians:1,yards:v*1.0936},R={acres:247105e-9,centimeters:1e4,centimetres:1e4,feet:10.763910417,hectares:1e-4,inches:1550.003100006,kilometers:1e-6,kilometres:1e-6,meters:1,metres:1,miles:386e-9,nauticalmiles:29155334959812285e-23,millimeters:1e6,millimetres:1e6,yards:1.195990046};function P(e,r,n={}){const t={type:"Feature"};return(n.id===0||n.id)&&(t.id=n.id),n.bbox&&(t.bbox=n.bbox),t.properties=r||{},t.geometry=e,t}function fe(e,r,n={}){switch(e){case"Point":return _(r).geometry;case"LineString":return L(r).geometry;case"Polygon":return B(r).geometry;case"MultiPoint":return U(r).geometry;case"MultiLineString":return J(r).geometry;case"MultiPolygon":return X(r).geometry;default:throw new Error(e+" is invalid")}}function _(e,r,n={}){if(!e)throw new Error("coordinates is required");if(!Array.isArray(e))throw new Error("coordinates must be an Array");if(e.length<2)throw new Error("coordinates must be at least 2 numbers long");if(!A(e[0])||!A(e[1]))throw new Error("coordinates must contain numbers");return P({type:"Point",coordinates:e},r,n)}function ge(e,r,n={}){return F(e.map(t=>_(t,r)),n)}function B(e,r,n={}){for(const i of e){if(i.length<4)throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");if(i[i.length-1].length!==i[0].length)throw new Error("First and last Position are not equivalent.");for(let o=0;o<i[i.length-1].length;o++)if(i[i.length-1][o]!==i[0][o])throw new Error("First and last Position are not equivalent.")}return P({type:"Polygon",coordinates:e},r,n)}function ye(e,r,n={}){return F(e.map(t=>B(t,r)),n)}function L(e,r,n={}){if(e.length<2)throw new Error("coordinates must be an array of two or more positions");return P({type:"LineString",coordinates:e},r,n)}function he(e,r,n={}){return F(e.map(t=>L(t,r)),n)}function F(e,r={}){const n={type:"FeatureCollection"};return r.id&&(n.id=r.id),r.bbox&&(n.bbox=r.bbox),n.features=e,n}function J(e,r,n={}){return P({type:"MultiLineString",coordinates:e},r,n)}function U(e,r,n={}){return P({type:"MultiPoint",coordinates:e},r,n)}function X(e,r,n={}){return P({type:"MultiPolygon",coordinates:e},r,n)}function me(e,r,n={}){return P({type:"GeometryCollection",geometries:e},r,n)}function pe(e,r=0){if(r&&!(r>=0))throw new Error("precision must be a positive number");const n=Math.pow(10,r||0);return Math.round(e*n)/n}function $(e,r="kilometers"){const n=q[r];if(!n)throw new Error(r+" units is invalid");return e*n}function I(e,r="kilometers"){const n=q[r];if(!n)throw new Error(r+" units is invalid");return e/n}function ve(e,r){return H(I(e,r))}function de(e){let r=e%360;return r<0&&(r+=360),r}function we(e){return e=e%360,e>0?e>180?e-360:e:e<-180?e+360:e}function H(e){return e%(2*Math.PI)*180/Math.PI}function k(e){return e%360*Math.PI/180}function Pe(e,r="kilometers",n="kilometers"){if(!(e>=0))throw new Error("length must be a positive number");return $(I(e,r),n)}function be(e,r="meters",n="kilometers"){if(!(e>=0))throw new Error("area must be a positive number");const t=R[r];if(!t)throw new Error("invalid original units");const i=R[n];if(!i)throw new Error("invalid final units");return e/t*i}function A(e){return!isNaN(e)&&e!==null&&!Array.isArray(e)}function Ee(e){return e!==null&&typeof e=="object"&&!Array.isArray(e)}function Me(e){if(!e)throw new Error("bbox is required");if(!Array.isArray(e))throw new Error("bbox must be an Array");if(e.length!==4&&e.length!==6)throw new Error("bbox must be an Array of 4 or 6 numbers");e.forEach(r=>{if(!A(r))throw new Error("bbox must only contain numbers")})}function Se(e){if(!e)throw new Error("id is required");if(["string","number"].indexOf(typeof e)===-1)throw new Error("id must be a number or a string")}function K(e,r,n={}){var t=N(e),i=N(r),o=k(i[1]-t[1]),s=k(i[0]-t[0]),u=k(t[1]),a=k(i[1]),l=Math.pow(Math.sin(o/2),2)+Math.pow(Math.sin(s/2),2)*Math.cos(u)*Math.cos(a);return $(2*Math.atan2(Math.sqrt(l),Math.sqrt(1-l)),n.units)}var ke=null;function C(e,r,n){if(e!==null)for(var t,i,o,s,u,a,l,y=0,c=0,m,f=e.type,h=f==="FeatureCollection",d=f==="Feature",S=h?e.features.length:1,w=0;w<S;w++){l=h?e.features[w].geometry:d?e.geometry:e,m=l?l.type==="GeometryCollection":!1,u=m?l.geometries.length:1;for(var M=0;M<u;M++){var p=0,b=0;if(s=m?l.geometries[M]:l,s!==null){a=s.coordinates;var g=s.type;switch(y=n&&(g==="Polygon"||g==="MultiPolygon")?1:0,g){case null:break;case"Point":if(r(a,c,w,p,b)===!1)return!1;c++,p++;break;case"LineString":case"MultiPoint":for(t=0;t<a.length;t++){if(r(a[t],c,w,p,b)===!1)return!1;c++,g==="MultiPoint"&&p++}g==="LineString"&&p++;break;case"Polygon":case"MultiLineString":for(t=0;t<a.length;t++){for(i=0;i<a[t].length-y;i++){if(r(a[t][i],c,w,p,b)===!1)return!1;c++}g==="MultiLineString"&&p++,g==="Polygon"&&b++}g==="Polygon"&&p++;break;case"MultiPolygon":for(t=0;t<a.length;t++){for(b=0,i=0;i<a[t].length;i++){for(o=0;o<a[t][i].length-y;o++){if(r(a[t][i][o],c,w,p,b)===!1)return!1;c++}b++}p++}break;case"GeometryCollection":for(t=0;t<s.geometries.length;t++)if(C(s.geometries[t],r,n)===!1)return!1;break;default:throw new Error("Unknown Geometry Type")}}}}}function Ce(e,r,n,t){var i=n;return C(e,function(o,s,u,a,l){s===0&&n===void 0?i=o:i=r(i,o,s,u,a,l)},t),i}function Q(e,r){var n;switch(e.type){case"FeatureCollection":for(n=0;n<e.features.length&&r(e.features[n].properties,n)!==!1;n++);break;case"Feature":r(e.properties,0);break}}function Le(e,r,n){var t=n;return Q(e,function(i,o){o===0&&n===void 0?t=i:t=r(t,i,o)}),t}function V(e,r){if(e.type==="Feature")r(e,0);else if(e.type==="FeatureCollection")for(var n=0;n<e.features.length&&r(e.features[n],n)!==!1;n++);}function Fe(e,r,n){var t=n;return V(e,function(i,o){o===0&&n===void 0?t=i:t=r(t,i,o)}),t}function Ae(e){var r=[];return C(e,function(n){r.push(n)}),r}function D(e,r){var n,t,i,o,s,u,a,l,y,c,m=0,f=e.type==="FeatureCollection",h=e.type==="Feature",d=f?e.features.length:1;for(n=0;n<d;n++){for(u=f?e.features[n].geometry:h?e.geometry:e,l=f?e.features[n].properties:h?e.properties:{},y=f?e.features[n].bbox:h?e.bbox:void 0,c=f?e.features[n].id:h?e.id:void 0,a=u?u.type==="GeometryCollection":!1,s=a?u.geometries.length:1,i=0;i<s;i++){if(o=a?u.geometries[i]:u,o===null){if(r(null,m,l,y,c)===!1)return!1;continue}switch(o.type){case"Point":case"LineString":case"MultiPoint":case"Polygon":case"MultiLineString":case"MultiPolygon":{if(r(o,m,l,y,c)===!1)return!1;break}case"GeometryCollection":{for(t=0;t<o.geometries.length;t++)if(r(o.geometries[t],m,l,y,c)===!1)return!1;break}default:throw new Error("Unknown Geometry Type")}}m++}}function Ge(e,r,n){var t=n;return D(e,function(i,o,s,u,a){o===0&&n===void 0?t=i:t=r(t,i,o,s,u,a)}),t}function G(e,r){D(e,function(n,t,i,o,s){var u=n===null?null:n.type;switch(u){case null:case"Point":case"LineString":case"Polygon":return r(P(n,i,{bbox:o,id:s}),t,0)===!1?!1:void 0}var a;switch(u){case"MultiPoint":a="Point";break;case"MultiLineString":a="LineString";break;case"MultiPolygon":a="Polygon";break}for(var l=0;l<n.coordinates.length;l++){var y=n.coordinates[l],c={type:a,coordinates:y};if(r(P(c,i),t,l)===!1)return!1}})}function Oe(e,r,n){var t=n;return G(e,function(i,o,s){o===0&&s===0&&n===void 0?t=i:t=r(t,i,o,s)}),t}function W(e,r){G(e,function(n,t,i){var o=0;if(n.geometry){var s=n.geometry.type;if(!(s==="Point"||s==="MultiPoint")){var u,a=0,l=0,y=0;if(C(n,function(c,m,f,h,d){if(u===void 0||t>a||h>l||d>y){u=c,a=t,l=h,y=d,o=0;return}var S=L([u,c],n.properties);if(r(S,t,i,d,o)===!1)return!1;o++,u=c})===!1)return!1}}})}function Y(e,r,n){var t=n,i=!1;return W(e,function(o,s,u,a,l){i===!1&&n===void 0?t=o:t=r(t,o,s,u,a,l),i=!0}),t}function Z(e,r){if(!e)throw new Error("geojson is required");G(e,function(n,t,i){if(n.geometry!==null){var o=n.geometry.type,s=n.geometry.coordinates;switch(o){case"LineString":if(r(n,t,i,0,0)===!1)return!1;break;case"Polygon":for(var u=0;u<s.length;u++)if(r(lineString(s[u],n.properties),t,i,u)===!1)return!1;break}}})}function Te(e,r,n){var t=n;return Z(e,function(i,o,s,u){o===0&&n===void 0?t=i:t=r(t,i,o,s,u)}),t}function Ne(e,r){if(r=r||{},!isObject(r))throw new Error("options is invalid");var n=r.featureIndex||0,t=r.multiFeatureIndex||0,i=r.geometryIndex||0,o=r.segmentIndex||0,s=r.properties,u;switch(e.type){case"FeatureCollection":n<0&&(n=e.features.length+n),s=s||e.features[n].properties,u=e.features[n].geometry;break;case"Feature":s=s||e.properties,u=e.geometry;break;case"Point":case"MultiPoint":return null;case"LineString":case"Polygon":case"MultiLineString":case"MultiPolygon":u=e;break;default:throw new Error("geojson is invalid")}if(u===null)return null;var a=u.coordinates;switch(u.type){case"Point":case"MultiPoint":return null;case"LineString":return o<0&&(o=a.length+o-1),lineString([a[o],a[o+1]],s,r);case"Polygon":return i<0&&(i=a.length+i),o<0&&(o=a[i].length+o-1),lineString([a[i][o],a[i][o+1]],s,r);case"MultiLineString":return t<0&&(t=a.length+t),o<0&&(o=a[t].length+o-1),lineString([a[t][o],a[t][o+1]],s,r);case"MultiPolygon":return t<0&&(t=a.length+t),i<0&&(i=a[t].length+i),o<0&&(o=a[t][i].length-o-1),lineString([a[t][i][o],a[t][i][o+1]],s,r)}throw new Error("geojson is invalid")}function qe(e,r){if(r=r||{},!isObject(r))throw new Error("options is invalid");var n=r.featureIndex||0,t=r.multiFeatureIndex||0,i=r.geometryIndex||0,o=r.coordIndex||0,s=r.properties,u;switch(e.type){case"FeatureCollection":n<0&&(n=e.features.length+n),s=s||e.features[n].properties,u=e.features[n].geometry;break;case"Feature":s=s||e.properties,u=e.geometry;break;case"Point":case"MultiPoint":return null;case"LineString":case"Polygon":case"MultiLineString":case"MultiPolygon":u=e;break;default:throw new Error("geojson is invalid")}if(u===null)return null;var a=u.coordinates;switch(u.type){case"Point":return point(a,s,r);case"MultiPoint":return t<0&&(t=a.length+t),point(a[t],s,r);case"LineString":return o<0&&(o=a.length+o),point(a[o],s,r);case"Polygon":return i<0&&(i=a.length+i),o<0&&(o=a[i].length+o),point(a[i][o],s,r);case"MultiLineString":return t<0&&(t=a.length+t),o<0&&(o=a[t].length+o),point(a[t][o],s,r);case"MultiPolygon":return t<0&&(t=a.length+t),i<0&&(i=a[t].length+i),o<0&&(o=a[t][i].length-o),point(a[t][i][o],s,r)}throw new Error("geojson is invalid")}function j(e,r={}){return Y(e,(n,t)=>{const i=t.geometry.coordinates;return n+K(i[0],i[1],r)},0)}var ee=j;function re(e,r,n){r.forEach(t=>{fetch(t.url).then(i=>i.text()).then(i=>{var o,s;const a=new DOMParser().parseFromString(i,"application/xml"),l=toGeoJSON.gpx(a),y=((s=(o=l.features[0])==null?void 0:o.properties)==null?void 0:s.name)||`Unnamed Track ${n+1}`;t.name=y;const c=l.features.filter(g=>g.geometry.type!=="Point"),m=`gpxTrack${n}`,f=`gpxTrackLine${n}`,h=`gpxTrackPOIsSource${n}`,d=`gpxTrackPOIs${n}`,S=`gpxTrackName${n}`;e.getSource(m)&&(e.removeLayer(f),e.removeSource(m)),e.getSource(h)&&(e.removeLayer(d),e.removeSource(h)),e.addSource(m,{type:"geojson",data:{type:"FeatureCollection",features:c}}),e.addLayer({id:f,type:"line",source:m,layout:{"line-join":"round","line-cap":"round"},paint:{"line-color":"#c3002f","line-width":3}});let w=ee(l,{units:"kilometers"}),M=0;const p=c[0].geometry.coordinates;for(let g=1;g<p.length;g++){const E=p[g-1][2],x=p[g][2];x>E&&(M+=x-E)}if(t.pois&&t.pois.length>0){const g=t.pois.map(E=>({type:"Feature",geometry:{type:"Point",coordinates:[E.lng,E.lat]},properties:{name:E.name,icon:E.icon,description:E.description,image:E.image}}));e.addSource(h,{type:"geojson",data:{type:"FeatureCollection",features:g}}),e.addLayer({id:d,type:"symbol",source:h,layout:{"icon-image":["get","icon"],"icon-size":.15,"icon-allow-overlap":!0,"text-field":["get","name"],"text-font":["Open Sans Bold","Arial Unicode MS Bold"],"text-offset":[0,1],"text-anchor":"top"},paint:{"text-color":"#666666","text-halo-color":"white","text-halo-width":1}})}addPOIPopupInteraction(d),t.type==="loop"?addLoopRouteInteraction(f,l,t,w,M):addOutAndBackRouteInteraction(f,l,t,w,M);const b={layerId:f,geojson:l,track:t,distance:w,totalElevationGain:M,popup:null,updateContent:function(){this.popup&&updatePopupContent(this.popup,this.geojson,this.track,this.track.selectedDirection)}};popupdata.push(b),e.on("mouseenter",f,function(){e.getCanvas().style.cursor="pointer"}),e.on("mouseenter",d,function(){e.getCanvas().style.cursor="pointer"}),e.on("mouseenter",S,function(){e.getCanvas().style.cursor="pointer"}),e.on("mouseleave",f,function(){e.getCanvas().style.cursor=""}),e.on("mouseleave",d,function(){e.getCanvas().style.cursor=""}),e.on("mouseleave",S,function(){e.getCanvas().style.cursor=""})}).catch(i=>console.log("Error loading GPX track: ",i))})}function te(e){if(!e){console.error("Map is not initialized");return}fetch("Tracks/tracks.json").then(r=>{if(!r.ok)throw new Error(`Failed to fetch tracks.json: ${r.statusText}`);return r.json()}).then(r=>Promise.all(r.map((n,t)=>ne(n.url).then(i=>(n.pois=i,{track:n,index:t}))))).then(r=>{r.forEach(({track:n,index:t})=>{re(e,[n],t)})}).catch(r=>console.error("Error loading tracks file:",r))}function ne(e){const n=`Tracks/${e.split("/").slice(-1)[0].replace(".gpx","")}/poi.txt`;return fetch(n).then(t=>t.text()).then(t=>{try{return JSON.parse(t)}catch(i){return console.error("Error parsing POI data:",i),[]}}).catch(t=>(console.error("Error loading POI file:",t),[]))}}}]);})();

//# sourceMappingURL=845.bundle.js.map