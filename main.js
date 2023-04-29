const { promisify } = require('util');
const { resolve } = require('path');
const fs = require('fs');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const axios = require('axios')
const { performance } = require('perf_hooks');
const glob = require("glob")

console.log("start")
async function linkCrawl(dir) {
    const subdirs = await readdir(dir);
    var startTime = performance.now()


// async function getFiles(dir) {

//   const subdirs = await readdir(dir);
//   const files = await Promise.all(subdirs.map(async (subdir) => {
//     const res = resolve(dir, subdir);
//     return (await stat(res)).isDirectory() ? getFiles(res) : res;

    
//   }));
// //   console.log(files)
// //   console.log(files.reduce((a, f) => {
// //     if (f.includes(".md")) {
// //         return [...a, f];
// //       }
// //       return a;
// //     }, []))
//     const markdowns = files.reduce((a, f) => {
//         if (f.includes(".md")) {
//             return [...a, f];
//         }
//         return a;
//         }, []);
//     return markdowns;
// }

let links = [];
    for (directory of subdirs) {
        const res = resolve(dir, directory);
        const directoryStatus = (await stat(res)).isDirectory()
        if (directoryStatus && !(directory === "node_modules")) {
            let queue = [directory]
            let fileList = []
            while (queue.length >0) {
                const target = queue.pop()
                console.log(target)
                const subdirs = await readdir(target);
                console.log(subdirs)
                const files = await Promise.all(subdirs.map(async (subdir) => {
                    const res = resolve(dir, subdir);
                    return (await stat(res)).isDirectory() ? queue.push(res) : res;
                
                    
                  }))
                for (unit in files) {
                    if (unit.includes(".md")) {
                        fileList.push(unit)
                    }
                }

            }
            console.log(fileList)
            //         for (unit of files){
            //             links.push(await Promise.all(files.map(async (file) => {
            //                 console.log(`"file ran ${file}"`)
            //                 if (file){
            //                 const data = fs.readFileSync(file, 'utf8');
            //                 let regex = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9(]{1,6}\b(?:[-a-zA-Z0-9(@:%_\+.~#?&\/=]*)/g
            //                 all_links = Array.from(data.matchAll(regex), (m) => m[0])
            //                 const bad_links = await Promise.all(all_links.map(async link=>{
            //                         await axios.get(link)
            //                             .catch(err=> {
            //                                 console.log(`caught ${link}`)
            //                                 return link}
            //                                 )
            //                             }
            //                 ))
                        
            //             //     console.log(bad_links.filter(( element ) =>
            //             //     {return element !== undefined;}
            //             //  ))
            //                 return bad_links.filter(( element ) =>
            //                 {return element !== undefined;}
            //              )
            //                         } else {
            //                             return
            //                         }
            //                     }
            //                 ))
            //             )
            //         }
            //         return (links.filter(( element ) =>
            //         {return element !== undefined;}
            //      ))
            //     } 
            // )

        }
        console.log(links)
        var endTime = performance.now()
        console.log(`Call to linkCrawl took ${endTime - startTime} milliseconds`)

        if (links.length>0) {
            process.exit(1)
        } else {
            process.exit(0)
        }
    }

}



                        // const res = resolve(dir, subdir);
                        // return (await stat(res)).isDirectory() ? getFiles(res) : res.includes("md") && res;
                    
                //     for (let unit of files){
                //         if (unit) {
                //             const data = fs.readFileSync(unit, 'utf8')
                    
                //             let regex = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9(]{1,6}\b(?:[-a-zA-Z0-9(@:%_\+.~#?&\/=]*)/g

                //             for (let finding of Array.from(data.matchAll(regex), (m) => m[0])) {
                //                 console.log(finding)
                //                 await axios.get(finding)
                //                     .catch(err=> links.push(finding))
                //             }
                                
                //         }
                    
                // }
                

linkCrawl(process.cwd())
