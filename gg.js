function degoo(match, p1, p2, p3, offset, string) {
  return p1 + decodeURIComponent(p2).replaceAll(' ', '+') + p3;
}

const test    = /Please click <a href="(\/search\?.+?(?=">here<\/a>))">here<\/a> if you/g;
const link    = [...document.body.textContent.matchAll(test)];
const target  = new Request("https://www.google.com" + link[0][1]);

// OG fix
const re      = /(<a href=")(?:\/url\?)(?!q=(?:http.+?(?=&amp;(?:sa|ved|usg)=)))?(?:q=)(http.+?(?=&amp;(?:sa|ved|usg)=))(?:&amp;(?:sa|ved|usg)=(?:\\"|[^"])+?(?="><))("><)/g;
// new fix
const re2 = / ?(?:data-ved|onmousedown)="[^"]+?" ?/gi;

// thank u mozilla.org
var result     = fetch(target).then(response => response.body).then(rb => {
  const reader = rb.getReader();
  return new ReadableStream({
    start(controller) {
      function push() {
        reader.read().then(  ({done,value}) => {
        if (done) {
          controller.close();
          return;
        }
        controller.enqueue(value);
        push();
        })
      }
      push();
    }
  });
})
.then(stream => {
  return new Response(stream, { headers: { "Content-Type": "text/html" } }).text();
})
.then(result => {
  let newresult = result.replaceAll(re, degoo);
  let newnewresult = newresult.replaceAll(re2, '');
  document.body.innerHTML = newnewresult;
});
