(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[332],{2936:(e,t,s)=>{(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return s(6988)}])},6988:(e,t,s)=>{"use strict";s.r(t),s.d(t,{__N_SSP:()=>ex,default:()=>ef});var a,r=s(7876),i=s(4232),o=s(2934),l=s(7328),n=s.n(l);let d={data:""},c=e=>"object"==typeof window?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||d,m=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,p=/\/\*[^]*?\*\/|  +/g,u=/\n+/g,x=(e,t)=>{let s="",a="",r="";for(let i in e){let o=e[i];"@"==i[0]?"i"==i[1]?s=i+" "+o+";":a+="f"==i[1]?x(o,i):i+"{"+x(o,"k"==i[1]?"":t)+"}":"object"==typeof o?a+=x(o,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=o&&(i=/^--/.test(i)?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),r+=x.p?x.p(i,o):i+":"+o+";")}return s+(t&&r?t+"{"+r+"}":r)+a},f={},h=e=>{if("object"==typeof e){let t="";for(let s in e)t+=s+h(e[s]);return t}return e},g=(e,t,s,a,r)=>{let i=h(e),o=f[i]||(f[i]=(e=>{let t=0,s=11;for(;t<e.length;)s=101*s+e.charCodeAt(t++)>>>0;return"go"+s})(i));if(!f[o]){let t=i!==e?e:(e=>{let t,s,a=[{}];for(;t=m.exec(e.replace(p,""));)t[4]?a.shift():t[3]?(s=t[3].replace(u," ").trim(),a.unshift(a[0][s]=a[0][s]||{})):a[0][t[1]]=t[2].replace(u," ").trim();return a[0]})(e);f[o]=x(r?{["@keyframes "+o]:t}:t,s?"":"."+o)}let l=s&&f.g?f.g:null;return s&&(f.g=f[o]),((e,t,s,a)=>{a?t.data=t.data.replace(a,e):-1===t.data.indexOf(e)&&(t.data=s?e+t.data:t.data+e)})(f[o],t,a,l),o},y=(e,t,s)=>e.reduce((e,a,r)=>{let i=t[r];if(i&&i.call){let e=i(s),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":x(e,""):!1===e?"":e}return e+a+(null==i?"":i)},"");function b(e){let t=this||{},s=e.call?e(t.p):e;return g(s.unshift?s.raw?y(s,[].slice.call(arguments,1),t.p):s.reduce((e,s)=>Object.assign(e,s&&s.call?s(t.p):s),{}):s,c(t.target),t.g,t.o,t.k)}b.bind({g:1});let v,w,j,N=b.bind({k:1});function k(e,t){let s=this||{};return function(){let a=arguments;function r(i,o){let l=Object.assign({},i),n=l.className||r.className;s.p=Object.assign({theme:w&&w()},l),s.o=/ *go\d+/.test(n),l.className=b.apply(s,a)+(n?" "+n:""),t&&(l.ref=o);let d=e;return e[0]&&(d=l.as||e,delete l.as),j&&d[0]&&j(l),v(d,l)}return t?t(r):r}}var E=e=>"function"==typeof e,D=(e,t)=>E(e)?e(t):e,S=(()=>{let e=0;return()=>(++e).toString()})(),$=(()=>{let e;return()=>{if(void 0===e&&"u">typeof window){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),C=(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,20)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:s}=t;return C(e,{type:+!!e.toasts.find(e=>e.id===s.id),toast:s});case 3:let{toastId:a}=t;return{...e,toasts:e.toasts.map(e=>e.id===a||void 0===a?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let r=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+r}))}}},_=[],O={toasts:[],pausedAt:void 0},F=e=>{O=C(O,e),_.forEach(e=>{e(O)})},z={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},L=(e={})=>{let[t,s]=(0,i.useState)(O),a=(0,i.useRef)(O);(0,i.useEffect)(()=>(a.current!==O&&s(O),_.push(s),()=>{let e=_.indexOf(s);e>-1&&_.splice(e,1)}),[]);let r=t.toasts.map(t=>{var s,a,r;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(s=e[t.type])?void 0:s.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(a=e[t.type])?void 0:a.duration)||(null==e?void 0:e.duration)||z[t.type],style:{...e.style,...null==(r=e[t.type])?void 0:r.style,...t.style}}});return{...t,toasts:r}},P=(e,t="blank",s)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...s,id:(null==s?void 0:s.id)||S()}),T=e=>(t,s)=>{let a=P(t,e,s);return F({type:2,toast:a}),a.id},A=(e,t)=>T("blank")(e,t);A.error=T("error"),A.success=T("success"),A.loading=T("loading"),A.custom=T("custom"),A.dismiss=e=>{F({type:3,toastId:e})},A.remove=e=>F({type:4,toastId:e}),A.promise=(e,t,s)=>{let a=A.loading(t.loading,{...s,...null==s?void 0:s.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let r=t.success?D(t.success,e):void 0;return r?A.success(r,{id:a,...s,...null==s?void 0:s.success}):A.dismiss(a),e}).catch(e=>{let r=t.error?D(t.error,e):void 0;r?A.error(r,{id:a,...s,...null==s?void 0:s.error}):A.dismiss(a)}),e};var B=(e,t)=>{F({type:1,toast:{id:e,height:t}})},I=()=>{F({type:5,time:Date.now()})},M=new Map,U=1e3,H=(e,t=U)=>{if(M.has(e))return;let s=setTimeout(()=>{M.delete(e),F({type:4,toastId:e})},t);M.set(e,s)},R=e=>{let{toasts:t,pausedAt:s}=L(e);(0,i.useEffect)(()=>{if(s)return;let e=Date.now(),a=t.map(t=>{if(t.duration===1/0)return;let s=(t.duration||0)+t.pauseDuration-(e-t.createdAt);if(s<0){t.visible&&A.dismiss(t.id);return}return setTimeout(()=>A.dismiss(t.id),s)});return()=>{a.forEach(e=>e&&clearTimeout(e))}},[t,s]);let a=(0,i.useCallback)(()=>{s&&F({type:6,time:Date.now()})},[s]),r=(0,i.useCallback)((e,s)=>{let{reverseOrder:a=!1,gutter:r=8,defaultPosition:i}=s||{},o=t.filter(t=>(t.position||i)===(e.position||i)&&t.height),l=o.findIndex(t=>t.id===e.id),n=o.filter((e,t)=>t<l&&e.visible).length;return o.filter(e=>e.visible).slice(...a?[n+1]:[0,n]).reduce((e,t)=>e+(t.height||0)+r,0)},[t]);return(0,i.useEffect)(()=>{t.forEach(e=>{if(e.dismissed)H(e.id,e.removeDelay);else{let t=M.get(e.id);t&&(clearTimeout(t),M.delete(e.id))}})},[t]),{toasts:t,handlers:{updateHeight:B,startPause:I,endPause:a,calculateOffset:r}}},G=N`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,V=N`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,W=N`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,X=k("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${G} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${V} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${W} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,Y=N`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,q=k("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${Y} 1s linear infinite;
`,Z=N`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,J=N`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,K=k("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Z} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${J} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,Q=k("div")`
  position: absolute;
`,ee=k("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,et=N`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,es=k("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${et} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,ea=({toast:e})=>{let{icon:t,type:s,iconTheme:a}=e;return void 0!==t?"string"==typeof t?i.createElement(es,null,t):t:"blank"===s?null:i.createElement(ee,null,i.createElement(q,{...a}),"loading"!==s&&i.createElement(Q,null,"error"===s?i.createElement(X,{...a}):i.createElement(K,{...a})))},er=e=>`
0% {transform: translate3d(0,${-200*e}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,ei=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*e}%,-1px) scale(.6); opacity:0;}
`,eo=k("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,el=k("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,en=(e,t)=>{let s=e.includes("top")?1:-1,[a,r]=$()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[er(s),ei(s)];return{animation:t?`${N(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${N(r)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},ed=i.memo(({toast:e,position:t,style:s,children:a})=>{let r=e.height?en(e.position||t||"top-center",e.visible):{opacity:0},o=i.createElement(ea,{toast:e}),l=i.createElement(el,{...e.ariaProps},D(e.message,e));return i.createElement(eo,{className:e.className,style:{...r,...s,...e.style}},"function"==typeof a?a({icon:o,message:l}):i.createElement(i.Fragment,null,o,l))});a=i.createElement,x.p=void 0,v=a,w=void 0,j=void 0;var ec=({id:e,className:t,style:s,onHeightUpdate:a,children:r})=>{let o=i.useCallback(t=>{if(t){let s=()=>{a(e,t.getBoundingClientRect().height)};s(),new MutationObserver(s).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,a]);return i.createElement("div",{ref:o,className:t,style:s},r)},em=(e,t)=>{let s=e.includes("top"),a=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:$()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(s?1:-1)}px)`,...s?{top:0}:{bottom:0},...a}},ep=b`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,eu=({reverseOrder:e,position:t="top-center",toastOptions:s,gutter:a,children:r,containerStyle:o,containerClassName:l})=>{let{toasts:n,handlers:d}=R(s);return i.createElement("div",{id:"_rht_toaster",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...o},className:l,onMouseEnter:d.startPause,onMouseLeave:d.endPause},n.map(s=>{let o=s.position||t,l=em(o,d.calculateOffset(s,{reverseOrder:e,gutter:a,defaultPosition:t}));return i.createElement(ec,{id:s.id,key:s.id,onHeightUpdate:d.updateHeight,className:s.visible?ep:"",style:l},"custom"===s.type?D(s.message,s):r?r(s):i.createElement(ed,{toast:s,position:o}))}))},ex=!0;function ef(){let{data:e,status:t}=(0,o.useSession)(),[s,a]=(0,i.useState)([]),[l,d]=(0,i.useState)(!1),[c,m]=(0,i.useState)(!1);(0,i.useEffect)(()=>{e&&p()},[e]);let p=async()=>{d(!0);try{let e=await fetch("/api/files/list"),t=await e.json();t.success&&a(t.files)}catch(e){A.error("Failed to load files")}finally{d(!1)}},u=async e=>{let t=e.target.files[0];if(!t)return;if(t.size>4e9)return void A.error("File size must be less than 4GB");m(!0);let s=new FormData;s.append("file",t);try{let e=await fetch("/api/files/upload",{method:"POST",body:s}),t=await e.json();t.success?(A.success("File uploaded successfully!"),p()):A.error(t.message||"Upload failed")}catch(e){A.error("Upload failed")}finally{m(!1)}},x=async(e,t)=>{try{let t=await fetch("/api/files/download?fileId=".concat(e)),s=await t.json();s.success?window.open(s.url,"_blank"):A.error("Download failed")}catch(e){A.error("Download failed")}};return"loading"===t?(0,r.jsx)("div",{className:"min-h-screen bg-gray-50 flex items-center justify-center",children:(0,r.jsx)("div",{className:"text-xl",children:"Loading..."})}):e?(0,r.jsxs)("div",{className:"min-h-screen bg-gray-50",children:[(0,r.jsxs)(n(),{children:[(0,r.jsx)("title",{children:"SkyBox Drive"}),(0,r.jsx)("link",{rel:"icon",href:"/favicon.ico"})]}),(0,r.jsx)(eu,{position:"top-right"}),(0,r.jsx)("header",{className:"bg-white shadow-sm border-b",children:(0,r.jsx)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:(0,r.jsxs)("div",{className:"flex justify-between items-center h-16",children:[(0,r.jsxs)("div",{className:"flex items-center",children:[(0,r.jsx)("h1",{className:"text-2xl font-bold text-gray-900",children:"SkyBox Drive"}),(0,r.jsx)("span",{className:"ml-2 text-sm text-green-600 font-medium",children:"FREE & Unlimited"})]}),(0,r.jsxs)("div",{className:"flex items-center space-x-4",children:[(0,r.jsxs)("span",{className:"text-sm text-gray-600",children:["Welcome, ",e.user.name]}),(0,r.jsx)("button",{onClick:()=>(0,o.signOut)(),className:"text-sm text-gray-500 hover:text-gray-700",children:"Sign out"})]})]})})}),(0,r.jsx)("main",{className:"max-w-7xl mx-auto py-6 sm:px-6 lg:px-8",children:(0,r.jsxs)("div",{className:"px-4 py-6 sm:px-0",children:[(0,r.jsxs)("div",{className:"bg-white rounded-lg shadow p-6 mb-6",children:[(0,r.jsx)("h2",{className:"text-lg font-medium text-gray-900 mb-4",children:"Upload Files"}),(0,r.jsx)("div",{className:"border-2 border-dashed border-gray-300 rounded-lg p-6",children:(0,r.jsxs)("div",{className:"text-center",children:[(0,r.jsx)("svg",{className:"mx-auto h-12 w-12 text-gray-400",stroke:"currentColor",fill:"none",viewBox:"0 0 48 48",children:(0,r.jsx)("path",{d:"M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})}),(0,r.jsxs)("div",{className:"mt-4",children:[(0,r.jsxs)("label",{htmlFor:"file-upload",className:"cursor-pointer",children:[(0,r.jsx)("span",{className:"mt-2 block text-sm font-medium text-gray-900",children:c?"Uploading...":"Click to upload or drag and drop"}),(0,r.jsx)("span",{className:"mt-1 block text-xs text-gray-500",children:"Up to 4GB per file"})]}),(0,r.jsx)("input",{id:"file-upload",name:"file-upload",type:"file",className:"sr-only",onChange:u,disabled:c})]})]})})]}),(0,r.jsxs)("div",{className:"bg-white rounded-lg shadow",children:[(0,r.jsx)("div",{className:"px-6 py-4 border-b border-gray-200",children:(0,r.jsx)("h2",{className:"text-lg font-medium text-gray-900",children:"Your Files"})}),l?(0,r.jsx)("div",{className:"p-6 text-center",children:(0,r.jsx)("div",{className:"text-gray-500",children:"Loading files..."})}):0===s.length?(0,r.jsx)("div",{className:"p-6 text-center",children:(0,r.jsx)("div",{className:"text-gray-500",children:"No files uploaded yet"})}):(0,r.jsx)("div",{className:"divide-y divide-gray-200",children:s.map(e=>(0,r.jsxs)("div",{className:"px-6 py-4 flex items-center justify-between",children:[(0,r.jsxs)("div",{className:"flex items-center",children:[(0,r.jsx)("div",{className:"flex-shrink-0",children:(0,r.jsx)("svg",{className:"h-8 w-8 text-gray-400",fill:"currentColor",viewBox:"0 0 20 20",children:(0,r.jsx)("path",{fillRule:"evenodd",d:"M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z",clipRule:"evenodd"})})}),(0,r.jsxs)("div",{className:"ml-4",children:[(0,r.jsx)("div",{className:"text-sm font-medium text-gray-900",children:e.fileName}),(0,r.jsxs)("div",{className:"text-sm text-gray-500",children:[(e.fileSize/1048576).toFixed(2)," MB • ",new Date(e.uploadDate).toLocaleDateString()]})]})]}),(0,r.jsx)("div",{className:"flex items-center space-x-2",children:(0,r.jsx)("button",{onClick:()=>x(e.$id,e.fileName),className:"text-blue-600 hover:text-blue-900 text-sm font-medium",children:"Download"})})]},e.$id))})]})]})}),(0,r.jsx)("footer",{className:"bg-white border-t mt-12",children:(0,r.jsx)("div",{className:"max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8",children:(0,r.jsxs)("div",{className:"text-center text-sm text-gray-500",children:[(0,r.jsx)("p",{children:"SkyBox Drive - FREE Unlimited Cloud Storage powered by Telegram"}),(0,r.jsx)("p",{className:"mt-1",children:"Save $72-216+ per year vs Google Drive!"})]})})})]}):(0,r.jsxs)("div",{className:"min-h-screen bg-gray-50 flex items-center justify-center",children:[(0,r.jsx)(n(),{children:(0,r.jsx)("title",{children:"SkyBox Drive - Login"})}),(0,r.jsx)("div",{className:"max-w-md w-full bg-white rounded-lg shadow-md p-6",children:(0,r.jsxs)("div",{className:"text-center",children:[(0,r.jsx)("h1",{className:"text-2xl font-bold text-gray-900 mb-4",children:"SkyBox Drive"}),(0,r.jsx)("p",{className:"text-gray-600 mb-6",children:"Unlimited cloud storage powered by Telegram"}),(0,r.jsx)("button",{onClick:()=>(0,o.signIn)("telegram"),className:"w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors",children:"Login with Telegram"})]})})]})}},7328:(e,t,s)=>{e.exports=s(9836)}},e=>{var t=t=>e(e.s=t);e.O(0,[636,593,792],()=>t(2936)),_N_E=e.O()}]);