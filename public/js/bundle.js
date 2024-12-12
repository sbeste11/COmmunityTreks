(()=>{(()=>{"use strict";var T={};T.d=(e,t)=>{for(var n in t)T.o(t,n)&&!T.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},T.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t);var de={};T.d(de,{ow:()=>G,dN:()=>Y,iM:()=>Z,Es:()=>f,nF:()=>x});function O(e){if(!e)throw new Error("coord is required");if(!Array.isArray(e)){if(e.type==="Feature"&&e.geometry!==null&&e.geometry.type==="Point")return[...e.geometry.coordinates];if(e.type==="Point")return[...e.coordinates]}if(Array.isArray(e)&&e.length>=2&&!Array.isArray(e[0])&&!Array.isArray(e[1]))return[...e];throw new Error("coord must be GeoJSON Point or an Array of numbers")}function me(e){if(Array.isArray(e))return e;if(e.type==="Feature"){if(e.geometry!==null)return e.geometry.coordinates}else if(e.coordinates)return e.coordinates;throw new Error("coords must be GeoJSON Feature, Geometry Object or an Array")}function ye(e){if(e.length>1&&isNumber(e[0])&&isNumber(e[1]))return!0;if(Array.isArray(e[0])&&e[0].length)return ye(e[0]);throw new Error("coordinates must only contain numbers")}function je(e,t,n){if(!t||!n)throw new Error("type and name required");if(!e||e.type!==t)throw new Error("Invalid input to "+n+": must be a "+t+", given "+e.type)}function et(e,t,n){if(!e)throw new Error("No feature passed");if(!n)throw new Error(".featureOf() requires a name");if(!e||e.type!=="Feature"||!e.geometry)throw new Error("Invalid input to "+n+", Feature with geometry required");if(!e.geometry||e.geometry.type!==t)throw new Error("Invalid input to "+n+": must be a "+t+", given "+e.geometry.type)}function tt(e,t,n){if(!e)throw new Error("No featureCollection passed");if(!n)throw new Error(".collectionOf() requires a name");if(!e||e.type!=="FeatureCollection")throw new Error("Invalid input to "+n+", FeatureCollection required");for(const r of e.features){if(!r||r.type!=="Feature"||!r.geometry)throw new Error("Invalid input to "+n+", Feature with geometry required");if(!r.geometry||r.geometry.type!==t)throw new Error("Invalid input to "+n+": must be a "+t+", given "+r.geometry.type)}}function nt(e){return e.type==="Feature"?e.geometry:e}function rt(e,t){return e.type==="FeatureCollection"?"FeatureCollection":e.type==="GeometryCollection"?"GeometryCollection":e.type==="Feature"&&e.geometry!==null?e.geometry.type:e.type}var S=63710088e-1,j={centimeters:S*100,centimetres:S*100,degrees:360/(2*Math.PI),feet:S*3.28084,inches:S*39.37,kilometers:S/1e3,kilometres:S/1e3,meters:S,metres:S,miles:S/1609.344,millimeters:S*1e3,millimetres:S*1e3,nauticalmiles:S/1852,radians:1,yards:S*1.0936},ee={acres:247105e-9,centimeters:1e4,centimetres:1e4,feet:10.763910417,hectares:1e-4,inches:1550.003100006,kilometers:1e-6,kilometres:1e-6,meters:1,metres:1,miles:386e-9,nauticalmiles:29155334959812285e-23,millimeters:1e6,millimetres:1e6,yards:1.195990046};function k(e,t,n={}){const r={type:"Feature"};return(n.id===0||n.id)&&(r.id=n.id),n.bbox&&(r.bbox=n.bbox),r.properties=t||{},r.geometry=e,r}function ot(e,t,n={}){switch(e){case"Point":return b(t).geometry;case"LineString":return A(t).geometry;case"Polygon":return te(t).geometry;case"MultiPoint":return we(t).geometry;case"MultiLineString":return ve(t).geometry;case"MultiPolygon":return Ee(t).geometry;default:throw new Error(e+" is invalid")}}function b(e,t,n={}){if(!e)throw new Error("coordinates is required");if(!Array.isArray(e))throw new Error("coordinates must be an Array");if(e.length<2)throw new Error("coordinates must be at least 2 numbers long");if(!X(e[0])||!X(e[1]))throw new Error("coordinates must contain numbers");return k({type:"Point",coordinates:e},t,n)}function it(e,t,n={}){return D(e.map(r=>b(r,t)),n)}function te(e,t,n={}){for(const o of e){if(o.length<4)throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");if(o[o.length-1].length!==o[0].length)throw new Error("First and last Position are not equivalent.");for(let i=0;i<o[o.length-1].length;i++)if(o[o.length-1][i]!==o[0][i])throw new Error("First and last Position are not equivalent.")}return k({type:"Polygon",coordinates:e},t,n)}function at(e,t,n={}){return D(e.map(r=>te(r,t)),n)}function A(e,t,n={}){if(e.length<2)throw new Error("coordinates must be an array of two or more positions");return k({type:"LineString",coordinates:e},t,n)}function st(e,t,n={}){return D(e.map(r=>A(r,t)),n)}function D(e,t={}){const n={type:"FeatureCollection"};return t.id&&(n.id=t.id),t.bbox&&(n.bbox=t.bbox),n.features=e,n}function ve(e,t,n={}){return k({type:"MultiLineString",coordinates:e},t,n)}function we(e,t,n={}){return k({type:"MultiPoint",coordinates:e},t,n)}function Ee(e,t,n={}){return k({type:"MultiPolygon",coordinates:e},t,n)}function lt(e,t,n={}){return k({type:"GeometryCollection",geometries:e},t,n)}function ct(e,t=0){if(t&&!(t>=0))throw new Error("precision must be a positive number");const n=Math.pow(10,t||0);return Math.round(e*n)/n}function ne(e,t="kilometers"){const n=j[t];if(!n)throw new Error(t+" units is invalid");return e*n}function K(e,t="kilometers"){const n=j[t];if(!n)throw new Error(t+" units is invalid");return e/n}function ut(e,t){return $(K(e,t))}function ft(e){let t=e%360;return t<0&&(t+=360),t}function pt(e){return e=e%360,e>0?e>180?e-360:e:e<-180?e+360:e}function $(e){return e%(2*Math.PI)*180/Math.PI}function I(e){return e%360*Math.PI/180}function ht(e,t="kilometers",n="kilometers"){if(!(e>=0))throw new Error("length must be a positive number");return ne(K(e,t),n)}function gt(e,t="meters",n="kilometers"){if(!(e>=0))throw new Error("area must be a positive number");const r=ee[t];if(!r)throw new Error("invalid original units");const o=ee[n];if(!o)throw new Error("invalid final units");return e/r*o}function X(e){return!isNaN(e)&&e!==null&&!Array.isArray(e)}function dt(e){return e!==null&&typeof e=="object"&&!Array.isArray(e)}function mt(e){if(!e)throw new Error("bbox is required");if(!Array.isArray(e))throw new Error("bbox must be an Array");if(e.length!==4&&e.length!==6)throw new Error("bbox must be an Array of 4 or 6 numbers");e.forEach(t=>{if(!X(t))throw new Error("bbox must only contain numbers")})}function yt(e){if(!e)throw new Error("id is required");if(["string","number"].indexOf(typeof e)===-1)throw new Error("id must be a number or a string")}function _(e,t,n={}){var r=O(e),o=O(t),i=I(o[1]-r[1]),l=I(o[0]-r[0]),s=I(r[1]),a=I(o[1]),c=Math.pow(Math.sin(i/2),2)+Math.pow(Math.sin(l/2),2)*Math.cos(s)*Math.cos(a);return ne(2*Math.atan2(Math.sqrt(c),Math.sqrt(1-c)),n.units)}var N=_;function B(e,t,n){if(e!==null)for(var r,o,i,l,s,a,c,u=0,p=0,h,g=e.type,d=g==="FeatureCollection",m=g==="Feature",P=d?e.features.length:1,v=0;v<P;v++){c=d?e.features[v].geometry:m?e.geometry:e,h=c?c.type==="GeometryCollection":!1,s=h?c.geometries.length:1;for(var E=0;E<s;E++){var y=0,M=0;if(l=h?c.geometries[E]:c,l!==null){a=l.coordinates;var w=l.type;switch(u=n&&(w==="Polygon"||w==="MultiPolygon")?1:0,w){case null:break;case"Point":if(t(a,p,v,y,M)===!1)return!1;p++,y++;break;case"LineString":case"MultiPoint":for(r=0;r<a.length;r++){if(t(a[r],p,v,y,M)===!1)return!1;p++,w==="MultiPoint"&&y++}w==="LineString"&&y++;break;case"Polygon":case"MultiLineString":for(r=0;r<a.length;r++){for(o=0;o<a[r].length-u;o++){if(t(a[r][o],p,v,y,M)===!1)return!1;p++}w==="MultiLineString"&&y++,w==="Polygon"&&M++}w==="Polygon"&&y++;break;case"MultiPolygon":for(r=0;r<a.length;r++){for(M=0,o=0;o<a[r].length;o++){for(i=0;i<a[r][o].length-u;i++){if(t(a[r][o][i],p,v,y,M)===!1)return!1;p++}M++}y++}break;case"GeometryCollection":for(r=0;r<l.geometries.length;r++)if(B(l.geometries[r],t,n)===!1)return!1;break;default:throw new Error("Unknown Geometry Type")}}}}}function vt(e,t,n,r){var o=n;return B(e,function(i,l,s,a,c){l===0&&n===void 0?o=i:o=t(o,i,l,s,a,c)},r),o}function be(e,t){var n;switch(e.type){case"FeatureCollection":for(n=0;n<e.features.length&&t(e.features[n].properties,n)!==!1;n++);break;case"Feature":t(e.properties,0);break}}function wt(e,t,n){var r=n;return be(e,function(o,i){i===0&&n===void 0?r=o:r=t(r,o,i)}),r}function Pe(e,t){if(e.type==="Feature")t(e,0);else if(e.type==="FeatureCollection")for(var n=0;n<e.features.length&&t(e.features[n],n)!==!1;n++);}function Et(e,t,n){var r=n;return Pe(e,function(o,i){i===0&&n===void 0?r=o:r=t(r,o,i)}),r}function bt(e){var t=[];return B(e,function(n){t.push(n)}),t}function re(e,t){var n,r,o,i,l,s,a,c,u,p,h=0,g=e.type==="FeatureCollection",d=e.type==="Feature",m=g?e.features.length:1;for(n=0;n<m;n++){for(s=g?e.features[n].geometry:d?e.geometry:e,c=g?e.features[n].properties:d?e.properties:{},u=g?e.features[n].bbox:d?e.bbox:void 0,p=g?e.features[n].id:d?e.id:void 0,a=s?s.type==="GeometryCollection":!1,l=a?s.geometries.length:1,o=0;o<l;o++){if(i=a?s.geometries[o]:s,i===null){if(t(null,h,c,u,p)===!1)return!1;continue}switch(i.type){case"Point":case"LineString":case"MultiPoint":case"Polygon":case"MultiLineString":case"MultiPolygon":{if(t(i,h,c,u,p)===!1)return!1;break}case"GeometryCollection":{for(r=0;r<i.geometries.length;r++)if(t(i.geometries[r],h,c,u,p)===!1)return!1;break}default:throw new Error("Unknown Geometry Type")}}h++}}function Pt(e,t,n){var r=n;return re(e,function(o,i,l,s,a){i===0&&n===void 0?r=o:r=t(r,o,i,l,s,a)}),r}function q(e,t){re(e,function(n,r,o,i,l){var s=n===null?null:n.type;switch(s){case null:case"Point":case"LineString":case"Polygon":return t(k(n,o,{bbox:i,id:l}),r,0)===!1?!1:void 0}var a;switch(s){case"MultiPoint":a="Point";break;case"MultiLineString":a="LineString";break;case"MultiPolygon":a="Polygon";break}for(var c=0;c<n.coordinates.length;c++){var u=n.coordinates[c],p={type:a,coordinates:u};if(t(k(p,o),r,c)===!1)return!1}})}function St(e,t,n){var r=n;return q(e,function(o,i,l){i===0&&l===0&&n===void 0?r=o:r=t(r,o,i,l)}),r}function Se(e,t){q(e,function(n,r,o){var i=0;if(n.geometry){var l=n.geometry.type;if(!(l==="Point"||l==="MultiPoint")){var s,a=0,c=0,u=0;if(B(n,function(p,h,g,d,m){if(s===void 0||r>a||d>c||m>u){s=p,a=r,c=d,u=m,i=0;return}var P=A([s,p],n.properties);if(t(P,r,o,m,i)===!1)return!1;i++,s=p})===!1)return!1}}})}function Me(e,t,n){var r=n,o=!1;return Se(e,function(i,l,s,a,c){o===!1&&n===void 0?r=i:r=t(r,i,l,s,a,c),o=!0}),r}function ke(e,t){if(!e)throw new Error("geojson is required");q(e,function(n,r,o){if(n.geometry!==null){var i=n.geometry.type,l=n.geometry.coordinates;switch(i){case"LineString":if(t(n,r,o,0,0)===!1)return!1;break;case"Polygon":for(var s=0;s<l.length;s++)if(t(lineString(l[s],n.properties),r,o,s)===!1)return!1;break}}})}function Mt(e,t,n){var r=n;return ke(e,function(o,i,l,s){i===0&&n===void 0?r=o:r=t(r,o,i,l,s)}),r}function kt(e,t){if(t=t||{},!isObject(t))throw new Error("options is invalid");var n=t.featureIndex||0,r=t.multiFeatureIndex||0,o=t.geometryIndex||0,i=t.segmentIndex||0,l=t.properties,s;switch(e.type){case"FeatureCollection":n<0&&(n=e.features.length+n),l=l||e.features[n].properties,s=e.features[n].geometry;break;case"Feature":l=l||e.properties,s=e.geometry;break;case"Point":case"MultiPoint":return null;case"LineString":case"Polygon":case"MultiLineString":case"MultiPolygon":s=e;break;default:throw new Error("geojson is invalid")}if(s===null)return null;var a=s.coordinates;switch(s.type){case"Point":case"MultiPoint":return null;case"LineString":return i<0&&(i=a.length+i-1),lineString([a[i],a[i+1]],l,t);case"Polygon":return o<0&&(o=a.length+o),i<0&&(i=a[o].length+i-1),lineString([a[o][i],a[o][i+1]],l,t);case"MultiLineString":return r<0&&(r=a.length+r),i<0&&(i=a[r].length+i-1),lineString([a[r][i],a[r][i+1]],l,t);case"MultiPolygon":return r<0&&(r=a.length+r),o<0&&(o=a[r].length+o),i<0&&(i=a[r][o].length-i-1),lineString([a[r][o][i],a[r][o][i+1]],l,t)}throw new Error("geojson is invalid")}function It(e,t){if(t=t||{},!isObject(t))throw new Error("options is invalid");var n=t.featureIndex||0,r=t.multiFeatureIndex||0,o=t.geometryIndex||0,i=t.coordIndex||0,l=t.properties,s;switch(e.type){case"FeatureCollection":n<0&&(n=e.features.length+n),l=l||e.features[n].properties,s=e.features[n].geometry;break;case"Feature":l=l||e.properties,s=e.geometry;break;case"Point":case"MultiPoint":return null;case"LineString":case"Polygon":case"MultiLineString":case"MultiPolygon":s=e;break;default:throw new Error("geojson is invalid")}if(s===null)return null;var a=s.coordinates;switch(s.type){case"Point":return point(a,l,t);case"MultiPoint":return r<0&&(r=a.length+r),point(a[r],l,t);case"LineString":return i<0&&(i=a.length+i),point(a[i],l,t);case"Polygon":return o<0&&(o=a.length+o),i<0&&(i=a[o].length+i),point(a[o][i],l,t);case"MultiLineString":return r<0&&(r=a.length+r),i<0&&(i=a[r].length+i),point(a[r][i],l,t);case"MultiPolygon":return r<0&&(r=a.length+r),o<0&&(o=a[r].length+o),i<0&&(i=a[r][o].length-i),point(a[r][o][i],l,t)}throw new Error("geojson is invalid")}function Ie(e,t={}){return Me(e,(n,r)=>{const o=r.geometry.coordinates;return n+_(o[0],o[1],t)},0)}var Le=Ie;function oe(e,t,n={}){if(n.final===!0)return xe(e,t);const r=O(e),o=O(t),i=I(r[0]),l=I(o[0]),s=I(r[1]),a=I(o[1]),c=Math.sin(l-i)*Math.cos(a),u=Math.cos(s)*Math.sin(a)-Math.sin(s)*Math.cos(a)*Math.cos(l-i);return $(Math.atan2(c,u))}function xe(e,t){let n=oe(t,e);return n=(n+180)%360,n}var Lt=null;function ie(e,t,n,r={}){const o=O(e),i=I(o[0]),l=I(o[1]),s=I(n),a=K(t,r.units),c=Math.asin(Math.sin(l)*Math.cos(a)+Math.cos(l)*Math.sin(a)*Math.cos(s)),u=i+Math.atan2(Math.sin(s)*Math.sin(a)*Math.cos(l),Math.cos(a)-Math.sin(l)*Math.sin(c)),p=$(u),h=$(c);return b([p,h],r.properties)}var xt=null;class ae{constructor(t=[],n=_e){if(this.data=t,this.length=this.data.length,this.compare=n,this.length>0)for(let r=(this.length>>1)-1;r>=0;r--)this._down(r)}push(t){this.data.push(t),this.length++,this._up(this.length-1)}pop(){if(this.length===0)return;const t=this.data[0],n=this.data.pop();return this.length--,this.length>0&&(this.data[0]=n,this._down(0)),t}peek(){return this.data[0]}_up(t){const{data:n,compare:r}=this,o=n[t];for(;t>0;){const i=t-1>>1,l=n[i];if(r(o,l)>=0)break;n[t]=l,t=i}n[t]=o}_down(t){const{data:n,compare:r}=this,o=this.length>>1,i=n[t];for(;t<o;){let l=(t<<1)+1,s=n[l];const a=l+1;if(a<this.length&&r(n[a],s)<0&&(l=a,s=n[a]),r(s,i)>=0)break;n[t]=s,t=l}n[t]=i}}function _e(e,t){return e<t?-1:e>t?1:0}function se(e,t){return e.p.x>t.p.x?1:e.p.x<t.p.x?-1:e.p.y!==t.p.y?e.p.y>t.p.y?1:-1:1}function Ce(e,t){return e.rightSweepEvent.p.x>t.rightSweepEvent.p.x?1:e.rightSweepEvent.p.x<t.rightSweepEvent.p.x?-1:e.rightSweepEvent.p.y!==t.rightSweepEvent.p.y?e.rightSweepEvent.p.y<t.rightSweepEvent.p.y?1:-1:1}class le{constructor(t,n,r,o){this.p={x:t[0],y:t[1]},this.featureId=n,this.ringId=r,this.eventId=o,this.otherEvent=null,this.isLeftEndpoint=null}isSamePoint(t){return this.p.x===t.p.x&&this.p.y===t.p.y}}function Fe(e,t){if(e.type==="FeatureCollection"){const n=e.features;for(let r=0;r<n.length;r++)ce(n[r],t)}else ce(e,t)}let R=0,z=0,H=0;function ce(e,t){const n=e.type==="Feature"?e.geometry:e;let r=n.coordinates;(n.type==="Polygon"||n.type==="MultiLineString")&&(r=[r]),n.type==="LineString"&&(r=[[r]]);for(let o=0;o<r.length;o++)for(let i=0;i<r[o].length;i++){let l=r[o][i][0],s=null;z=z+1;for(let a=0;a<r[o][i].length-1;a++){s=r[o][i][a+1];const c=new le(l,R,z,H),u=new le(s,R,z,H+1);c.otherEvent=u,u.otherEvent=c,se(c,u)>0?(u.isLeftEndpoint=!0,c.isLeftEndpoint=!1):(c.isLeftEndpoint=!0,u.isLeftEndpoint=!1),t.push(c),t.push(u),l=s,H=H+1}}R=R+1}class Te{constructor(t){this.leftSweepEvent=t,this.rightSweepEvent=t.otherEvent}}function Oe(e,t){if(e===null||t===null||e.leftSweepEvent.ringId===t.leftSweepEvent.ringId&&(e.rightSweepEvent.isSamePoint(t.leftSweepEvent)||e.rightSweepEvent.isSamePoint(t.leftSweepEvent)||e.rightSweepEvent.isSamePoint(t.rightSweepEvent)||e.leftSweepEvent.isSamePoint(t.leftSweepEvent)||e.leftSweepEvent.isSamePoint(t.rightSweepEvent)))return!1;const n=e.leftSweepEvent.p.x,r=e.leftSweepEvent.p.y,o=e.rightSweepEvent.p.x,i=e.rightSweepEvent.p.y,l=t.leftSweepEvent.p.x,s=t.leftSweepEvent.p.y,a=t.rightSweepEvent.p.x,c=t.rightSweepEvent.p.y,u=(c-s)*(o-n)-(a-l)*(i-r),p=(a-l)*(r-s)-(c-s)*(n-l),h=(o-n)*(r-s)-(i-r)*(n-l);if(u===0)return!1;const g=p/u,d=h/u;if(g>=0&&g<=1&&d>=0&&d<=1){const m=n+g*(o-n),P=r+g*(i-r);return[m,P]}return!1}function Ae(e,t){t=t||!1;const n=[],r=new ae([],Ce);for(;e.length;){const o=e.pop();if(o.isLeftEndpoint){const i=new Te(o);for(let l=0;l<r.data.length;l++){const s=r.data[l];if(t&&s.leftSweepEvent.featureId===o.featureId)continue;const a=Oe(i,s);a!==!1&&n.push(a)}r.push(i)}else o.isLeftEndpoint===!1&&r.pop()}return n}function De(e,t){const n=new ae([],se);return Fe(e,n),Ae(n,t)}var Ge=De;function $e(e,t,n={}){const{removeDuplicates:r=!0,ignoreSelfIntersections:o=!1}=n;let i=[];e.type==="FeatureCollection"?i=i.concat(e.features):e.type==="Feature"?i.push(e):(e.type==="LineString"||e.type==="Polygon"||e.type==="MultiLineString"||e.type==="MultiPolygon")&&i.push(k(e)),t.type==="FeatureCollection"?i=i.concat(t.features):t.type==="Feature"?i.push(t):(t.type==="LineString"||t.type==="Polygon"||t.type==="MultiLineString"||t.type==="MultiPolygon")&&i.push(k(t));const l=Ge(D(i),o);let s=[];if(r){const a={};l.forEach(c=>{const u=c.join(",");a[u]||(a[u]=!0,s.push(c))})}else s=l;return D(s.map(a=>b(a)))}var Ct=null,Ne=Object.defineProperty,Be=Object.defineProperties,qe=Object.getOwnPropertyDescriptors,ue=Object.getOwnPropertySymbols,Re=Object.prototype.hasOwnProperty,ze=Object.prototype.propertyIsEnumerable,fe=(e,t,n)=>t in e?Ne(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,C=(e,t)=>{for(var n in t||(t={}))Re.call(t,n)&&fe(e,n,t[n]);if(ue)for(var n of ue(t))ze.call(t,n)&&fe(e,n,t[n]);return e},F=(e,t)=>Be(e,qe(t));function He(e,t,n={}){if(!e||!t)throw new Error("lines and pt are required arguments");let r=b([1/0,1/0],{dist:1/0,index:-1,multiFeatureIndex:-1,location:-1}),o=0;return q(e,function(i,l,s){const a=me(i);for(let c=0;c<a.length-1;c++){const u=b(a[c]);u.properties.dist=_(t,u,n);const p=b(a[c+1]);p.properties.dist=_(t,p,n);const h=_(u,p,n),g=Math.max(u.properties.dist,p.properties.dist),d=oe(u,p),m=ie(t,g,d+90,n),P=ie(t,g,d-90,n),v=$e(A([m.geometry.coordinates,P.geometry.coordinates]),A([u.geometry.coordinates,p.geometry.coordinates]));let E;v.features.length>0&&v.features[0]&&(E=F(C({},v.features[0]),{properties:{dist:_(t,v.features[0],n),multiFeatureIndex:s,location:o+_(u,v.features[0],n)}})),u.properties.dist<r.properties.dist&&(r=F(C({},u),{properties:F(C({},u.properties),{index:c,multiFeatureIndex:s,location:o})})),p.properties.dist<r.properties.dist&&(r=F(C({},p),{properties:F(C({},p.properties),{index:c+1,multiFeatureIndex:s,location:o+h})})),E&&E.properties.dist<r.properties.dist&&(r=F(C({},E),{properties:F(C({},E.properties),{index:c})})),o+=h}}),r}var pe=He;function Je(){f.loadImage("./Images/wilderness.png",function(e,t){if(e)throw e;f.hasImage("boundary")||f.addImage("boundary",t)}),f.loadImage("./Images/pass.png",function(e,t){if(e)throw e;f.hasImage("pass")||f.addImage("pass",t)}),f.loadImage("./Images/pass.png",function(e,t){if(e)throw e;f.hasImage("summit")||f.addImage("summit",t)}),f.loadImage("./Images/flag.png",function(e,t){if(e)throw e;f.hasImage("flag")||f.addImage("flag",t)}),f.loadImage("./Images/junction.png",function(e,t){if(e)throw e;f.hasImage("junction")||f.addImage("junction",t)})}function V(e){return G?e.toFixed(2)+" km":(e*.621371).toFixed(2)+" miles"}function W(e){return G?e.toFixed(2)+" m":(e*3.28084).toFixed(2)+" ft"}function Ue(e,t,n){const r=e.features[0].geometry.coordinates;if(!t||!t.properties||typeof t.properties.index=="undefined")return console.error("Invalid nearestPoint data:",t),{distanceToPoint:0,elevationToPoint:0};const o=t.properties.index;let i=0,l=0;if(n==="counterclockwise"){for(let s=0;s<=o;s++)if(s>0){const a=N(b(r[s-1]),b(r[s]),{units:"kilometers"});i+=a;const c=r[s][2]-r[s-1][2];c>0&&(l+=c)}}else for(let s=r.length-1;s>=o;s--)if(s<r.length-1){const a=N(b(r[s]),b(r[s+1]),{units:"kilometers"});i+=a;const c=r[s-1][2]-r[s][2];c>0&&(l+=c)}return{distanceToPoint:i,elevationToPoint:l}}document.addEventListener("DOMContentLoaded",function(){const e=document.getElementById("unitSwitch"),t=document.getElementById("unitLabel"),n=document.getElementById("mapStyleSelect"),r=30*60*1e3,o=setInterval(()=>{window.mainMap&&(clearInterval(o),l())},100);e.addEventListener("change",function(){G=!e.checked;const c=e.checked?"miles":"km";i("unit",c),t.textContent=e.checked?"Miles":"Km",a()}),n.addEventListener("change",function(){const c=n.value;i("mapStyle",c),Q(c)});function i(c,u){const p=new Date().getTime(),h={value:u,timestamp:p};localStorage.setItem(c,JSON.stringify(h))}function l(){const c=JSON.parse(localStorage.getItem("unit"));c&&s(c.timestamp)&&(e.checked=c.value==="miles",G=c.value!=="miles",t.textContent=e.checked?"Miles":"Km");const u=JSON.parse(localStorage.getItem("mapStyle"));u&&s(u.timestamp)?(n.value=u.value,Q(u.value)):Q("default")}function s(c){return new Date().getTime()-c<r}function a(){x.forEach(c=>{if(c&&c.track&&c.geojson){const{popup:u,geojson:p,track:h,nearestPoint:g}=c,d=h.selectedDirection||"clockwise";u&&U(u,p,g,d,h)}else console.error("Invalid popupEntry found in popupdata:",c)})}});function J(e,t){const n=document.getElementById("toggles-bar");n.style.backgroundColor=e==="black"?"rgba(0, 0, 0, 0.8)":"rgba(255, 255, 255, 0.8)",n.style.color=t,n.querySelectorAll("label, span, select").forEach(o=>{o.style.color=t})}function Q(e){if(!f){console.error("Map is not initialized");return}switch(e){case"light":f.setStyle("mapbox://styles/mapbox/light-v10"),J("black","white");break;case"dark":f.setStyle("mapbox://styles/mapbox/dark-v10"),J("white","black");break;case"satellite":f.setStyle("mapbox://styles/mapbox/satellite-v9"),J("white","black");break;default:f.setStyle("mapbox://styles/mapbox/outdoors-v12"),J("black","white")}f.once("style.load",function(){Ke()})}function Ke(){Je(),fetch("Tracks/tracks.json").then(e=>e.json()).then(e=>Promise.all(e.map((t,n)=>Z(t.url).then(r=>(t.pois=r,{track:t,index:n}))))).then(e=>{e.forEach(({track:t,index:n})=>{Y([t],n)})}).catch(e=>console.error("Error loading tracks file:",e))}function Xe(e,t,n,r,o,i,l){e.off("click",n),e.off("touchstart",n);function s(a){const c=b([a.lngLat.lng,a.lngLat.lat]),p=pe(r.features[0],c,{units:"kilometers"}).properties.index,h=r.features[0].geometry.coordinates;let g=0,d=0;for(let y=0;y<=p;y++)if(y>0){const M=N(b(h[y-1]),b(h[y]),{units:"kilometers"});g+=M;const w=h[y][2]-h[y-1][2];w>0&&(d+=w)}const m=g,P=d,v=`
            <strong>${o.name}</strong><br>
            Distance to Point: ${V(m)}<br>
            Elevation Gain: ${W(P)}
        `,E=new mapboxgl.Popup().setLngLat(a.lngLat).setHTML(v).addTo(e);x.push({popup:E,geojson:r,track:o,outAndBackDistance:m,outAndBackElevationGain:P}),E.on("close",function(){const y=x.findIndex(M=>M.popup===E);y!==-1&&x.splice(y,1)})}e.on("click",n,s),e.on("touchstart",n,s)}function U(e,t,n,r,o){if(o.type==="loop"){const{distanceToPoint:i,elevationToPoint:l}=Ue(t,n,r),s=V(i),a=W(l),c=`
            <strong>${o.name}</strong><br>
            Distance to Point: ${s}<br>
            Elevation Gain to Point: ${a}<br>
            <label>Direction: 
                <select id="directionToggle">
                    <option value="clockwise" ${r==="clockwise"?"selected":""}>Clockwise</option>
                    <option value="counterclockwise" ${r==="counterclockwise"?"selected":""}>Counterclockwise</option>
                </select>
            </label>
        `;e.setHTML(c);const u=document.getElementById("directionToggle");u&&u.addEventListener("change",function(){o.selectedDirection=this.value,U(e,t,n,o.selectedDirection,o)})}else if(o.type==="direct"){const i=t.features[0].geometry.coordinates;let l=0,s=0;for(let g=1;g<i.length;g++){const d=N(b(i[g-1]),b(i[g]),{units:"kilometers"});l+=d;const m=i[g][2]-i[g-1][2];m>0&&(s+=m)}const a=l,c=s,u=V(a),p=W(c),h=`
            <strong>${o.name}</strong><br>
            Distance to point: ${u}<br>
            Elevation Gain to point: ${p}
        `;e.setHTML(h)}}function Ve(e,t,n,r,o,i,l){e.off("click",n),e.off("touchstart",n);function s(a){if(e.queryRenderedFeatures(a.point,{layers:[n]}).length===0)return;const u=b([a.lngLat.lng,a.lngLat.lat]),p=pe(r.features[0],u,{units:"kilometers"}),h=p.properties.index,g=r.features[0].geometry.coordinates[h][2],d=new mapboxgl.Popup().setLngLat(a.lngLat).setHTML("").addTo(e);U(d,r,p,o.selectedDirection,o);const m={layerId:t,interactionLayerId:n,popup:d,geojson:r,nearestPoint:p,updateContent:function(){U(d,r,p,o.selectedDirection,o)}};x.push(m),d.on("close",function(){const P=x.findIndex(v=>v.popup===d);P!==-1&&x.splice(P,1)})}e.on("click",n,s),e.on("touchstart",n,s)}function We(e,t){e.on("click",t,function(n){const r=n.features[0],o=r.geometry.coordinates.slice(),i=r.properties.name,l=r.properties.description||"No description available",s=r.properties.image||"";let a=`
            <strong>${i}</strong><br>
            ${l}
        `;s&&(a+=`<br><img src="${s}" alt="${i}" id="poi-img">`);const c=new mapboxgl.Popup().setLngLat(o).setHTML(a).addTo(e)}),e.on("mouseenter",t,function(){e.getCanvas().style.cursor="pointer"}),e.on("mouseleave",t,function(){e.getCanvas().style.cursor=""})}var he=(e,t,n)=>new Promise((r,o)=>{var i=a=>{try{s(n.next(a))}catch(c){o(c)}},l=a=>{try{s(n.throw(a))}catch(c){o(c)}},s=a=>a.done?r(a.value):Promise.resolve(a.value).then(i,l);s((n=n.apply(e,t)).next())});let G=!0,x=[],f=null;function Ft(){fetch("/google-tag").then(e=>{if(!e.ok)throw new Error("Failed to fetch Google Tag snippet");return e.text()}).then(e=>{const t=document.createElement("div");t.innerHTML=e,document.head.appendChild(t.querySelector("script"))}).catch(e=>console.error("Error loading Google Tag:",e))}fetch("/mapbox-token").then(e=>e.json()).then(e=>{mapboxgl.accessToken=e.accessToken,f=new mapboxgl.Map({container:"map",center:[-105.6129,39.99366],zoom:10,style:"mapbox://styles/mapbox/outdoors-v12"}),f.on("load",()=>he(void 0,null,function*(){try{yield Qe(),Ye()}catch(t){console.error("Error during map initialization:",t)}}))}).catch(e=>{console.error("Error fetching Mapbox access token:",e)});function Qe(){return he(this,null,function*(){const e=[{url:"./Images/wilderness.png",name:"boundary"},{url:"./Images/pass.png",name:"pass"},{url:"./Images/pass.png",name:"summit"},{url:"./Images/flag.png",name:"flag"},{url:"./Images/junction.png",name:"junction"}];for(const t of e)yield new Promise((n,r)=>{f.loadImage(t.url,(o,i)=>{o?(console.error(`Error loading image: ${t.url}`,o),r(o)):(f.addImage(t.name,i),n())})})})}function Y(e,t){e.forEach(n=>{fetch(n.url).then(r=>r.text()).then(r=>{var o,i;const s=new DOMParser().parseFromString(r,"application/xml"),a=toGeoJSON.gpx(s),c=((i=(o=a.features[0])==null?void 0:o.properties)==null?void 0:i.name)||`Unnamed Track ${t+1}`;n.name=c;const u=a.features.filter(w=>w.geometry.type!=="Point"),p=`gpxTrack${t}`,h=`gpxTrackLine${t}`,g=`gpxTrackInteraction${t}`,d=`gpxTrackPOIsSource${t}`,m=`gpxTrackPOIs${t}`,P=`gpxTrackName${t}`;f.getSource(p)&&(f.removeLayer(h),f.removeSource(g),f.removeSource(p)),f.getSource(d)&&(f.removeLayer(m),f.removeSource(d)),f.addSource(p,{type:"geojson",data:{type:"FeatureCollection",features:u}}),f.addLayer({id:h,type:"line",source:p,layout:{"line-join":"round","line-cap":"round"},paint:{"line-color":n.color||"#c3002f","line-width":3}}),f.addLayer({id:g,type:"line",source:p,layout:{"line-join":"round","line-cap":"round",visibility:"visible"},paint:{"line-color":"#000000","line-width":25,"line-opacity":0}});let v=Le(a,{units:"kilometers"}),E=0;const y=u[0].geometry.coordinates;for(let w=1;w<y.length;w++){const L=y[w-1][2],ge=y[w][2];ge>L&&(E+=ge-L)}if(n.pois&&n.pois.length>0){const w=n.pois.map(L=>({type:"Feature",geometry:{type:"Point",coordinates:[L.lng,L.lat]},properties:{name:L.name,icon:L.icon,description:L.description,image:L.image,weight:Ze(L.icon)}}));f.addSource(d,{type:"geojson",data:{type:"FeatureCollection",features:w}}),f.addLayer({id:m,type:"symbol",source:d,layout:{"icon-image":["get","icon"],"icon-size":.15,"icon-allow-overlap":!0,"text-field":["get","name"],"text-font":["Open Sans Bold","Arial Unicode MS Bold"],"text-offset":[0,1],"text-anchor":"top","symbol-sort-key":["get","weight"]},paint:{"text-color":"#666666","text-halo-color":"white","text-halo-width":1}})}We(f,m),n.type==="loop"?Ve(f,h,g,a,n,v,E):Xe(f,h,g,a,n,v,E);const M={layerId:h,geojson:a,track:n,distance:v,totalElevationGain:E,popup:null,updateContent:function(){this.popup&&updatePopupContent(this.popup,this.geojson,this.track,this.track.selectedDirection)}};x.push(M),f.on("mouseenter",g,function(){f.getCanvas().style.cursor="pointer"}),f.on("mouseenter",m,function(){f.getCanvas().style.cursor="pointer"}),f.on("mouseenter",P,function(){f.getCanvas().style.cursor="pointer"}),f.on("mouseleave",g,function(){f.getCanvas().style.cursor=""}),f.on("mouseleave",m,function(){f.getCanvas().style.cursor=""}),f.on("mouseleave",P,function(){f.getCanvas().style.cursor=""})}).catch(r=>console.log("Error loading GPX track: ",r))})}function Ye(){if(!f){console.error("Map is not initialized");return}fetch("Tracks/tracks.json").then(e=>{if(!e.ok)throw new Error(`Failed to fetch tracks.json: ${e.statusText}`);return e.json()}).then(e=>Promise.all(e.map((t,n)=>Z(t.url).then(r=>(t.pois=r,{track:t,index:n}))))).then(e=>{e.forEach(({track:t,index:n})=>{Y([t],n)})}).catch(e=>console.error("Error loading tracks file:",e))}function Z(e){const n=`Tracks/${e.split("/").slice(-1)[0].replace(".gpx","")}/poi.txt`;return fetch(n).then(r=>r.text()).then(r=>{try{return JSON.parse(r)}catch(o){return console.error("Error parsing POI data:",o),[]}}).catch(r=>(console.error("Error loading POI file:",r),[]))}function Ze(e){return{flag:100,summit:100,boundary:50,pass:40,junction:10}[e]||0}})();})();
