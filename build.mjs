#!/bin/env -S bun --install=force
import links from'./src/redirects.mjs'

await Bun.$`rm -rf dst`;
await Bun.$`cp -r src dst`;
await Bun.write(
	'dst/_redirects',
	[
		'/favicon.ico /img/favicon.png 301',
		...links.map(({name,src,dst,code})=>`${src}#${name.replace(/\s/g,'_')} ${dst} ${code}`)
	].join('\n')
);

await Bun.write(
	'dst/index.html',
	new HTMLRewriter().on('div.links',{element:e=>e.append(
		links.map(x=>decodeURIComponent(e.getAttribute('tmpl')).replace(/{{(.+?)}}/g,(_,i)=>x[i]??'')).join('\n'),
		{html:1}
	)}).transform(await Bun.file('dst/index.html').text())
);
