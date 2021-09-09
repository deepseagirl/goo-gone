function degoo(match, p1, p2, p3, offset, string) {
  return p1 + decodeURIComponent(p2).replaceAll(' ', '+') + p3;
}

const test    = /Please click <a href="(\/search\?.+?(?=">here<\/a>))">here<\/a> if you/g;
const link    = document.body.textContent.match(test);
const target  = new Request("https://www.google.com" + link);
const re      = /(<a href=")(?:\/url\?)(?!q=(?:http.+?(?=&amp;(?:sa|ved|usg)=)))?(?:q=)(http.+?(?=&amp;(?:sa|ved|usg)=))(?:&amp;(?:sa|ved|usg)=.+?(?="><))("><)/g;

// replace with $1$2$3



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
  document.body.innerHTML = result.replaceAll(re, degoo);
  //document.body.innerHTML = newresult; // accidentally discards some parts of the dom that we want to keep ;-; fix next time
});