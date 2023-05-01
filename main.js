const { promisify } = require('util');
const { resolve } = require('path');
const fs = require('fs');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const axios = require('axios')
const { performance } = require('perf_hooks');
const {
    glob
  } = require('glob')


async function linkCrawl() {
    var startTime = performance.now()

    async function getFiles() {
        const mdfiles = await glob('**/*.md', { ignore: 'node_modules/**' })
        return mdfiles
    }

    const targets = await getFiles()

    let links = (await Promise.all(targets.map(async (file) => {
                            // console.log(`"file ran ${file}"`)
                            const data = fs.readFileSync(file, 'utf8');
                            let regex = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9(]{1,6}\b(?:[-a-zA-Z0-9(@:%_\+.~#?&\/=]*)/g
                            all_links = Array.from(data.matchAll(regex), (m) => m[0])
                            return all_links
                        
                            })))
                 
    links = links.flat()

    const checkLink = async (link) => {
        try {
          const response = await axios.get(link);
          if (response.status === 404) {
            return link;
          }
        } catch (error) {
            if (link.includes("next-auth.js.org") || link.includes("vercel.com"))
                {console.log(error.response)}
          return link;
        }
      }

    const promises = links.map((link) => checkLink(link));
    const results = await Promise.all(promises);
      
        var endTime = performance.now()
        console.log(`Call to linkCrawl took ${endTime - startTime} milliseconds`)

        if (results.filter(result=> result !==undefined).length>0) {
            console.log(results.filter(result=> result !==undefined))
            process.exit(1)
        } else {
            console.log("No dead links found. Great!")
            process.exit(0)
        }
    
    }

       

linkCrawl()
