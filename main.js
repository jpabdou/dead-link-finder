const fs = require('fs');
const simpleGit = require('simple-git');
const axios = require('axios');

const { performance } = require('perf_hooks');
const {
    glob
  } = require('glob')
  const { Octokit } = require('@octokit/rest');

require('dotenv').config();

async function linkCrawl() {
    var startTime = performance.now();

    const options = {
      binary: 'git',
      maxConcurrentProcesses: 6,
   };

   const git = simpleGit('./cloned_repos', options);
    const repos = [];

    async function getRepoFolders(repoArr) {
      for (let repo of repoArr) {
        const repoFolder = await glob(`./cloned_repos/${repo}/`, { ignore: 'node_modules/**' });

        const target = repoFolder;
        if (target.length === 0) {
          const repoEntry = `github.com/${process.env.USER}/${repo}`
          const remote = `https://${process.env.USER}:${process.env.PASS}@${repoEntry}`;
          git
          .clone(remote)
          .then(() => console.log(`cloned ${repo}`))
          .catch((err) => console.error('failed: ', err));
        };
      };
   };

   getRepoFolders(repos)

   
    async function getMarkdownFiles() {
        const mdfiles = await glob('**/*.md', { ignore: ['node_modules/**', 'README.md'] })
        return mdfiles
    }

    const targets = await getMarkdownFiles();
    
    let links = (await Promise.all(targets.map(async (file) => {
        // console.log(`"file ran ${file}"`)
        const data = fs.readFileSync(file, 'utf8');
        let regex = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9(]{1,6}\b(?:[-a-zA-Z0-9(@:%_\+.~#?&\/=]*)/g
        all_links = Array.from(data.matchAll(regex), (m) => m[0])
        return all_links    
        })));

    const promises = [];
    const promiseMap = {};
    
    const getLinkHead = async (link) => {
      try {
        const response = await axios.head(link);
        return '';
      } catch (error) {
        if (error.response.status === 404) {
          return link;
        } 
        return '';
        // return link;
      }
        }

    const octokit = new Octokit({
          auth: process.env.TOKEN,
    });

    async function getRepositoryHead(link) {
      let linkArr = link.split('/').filter(word=>!(['https:', '', 'github.com', "www"].includes(word)));
      let owner = linkArr[0];
      let repoName = linkArr[1];
      try {
        const response = await octokit.request('HEAD /repos/:owner/:repo', {
          owner: owner,
          repo: repoName,
        });
        return "";
      } catch (error) {
        if (error.status === 404) {
          return link;
        } 
        return '';
      }
    }

    for (let i=0; i<targets.length;i++) {
      let fileTarget = targets[i];
      for (let link of links[i]) {
        if (!(link in promiseMap)) {
          if (link.includes("github.com")) {
            promises.push(getRepositoryHead(link));
          } else {
            promises.push(getLinkHead(link));
          };
          promiseMap[link] = [];
        }
        promiseMap[link].push(fileTarget)
      }
    }

  // const promises = links.map((link) => checkLink(link));
    let results = await Promise.all(promises);
    results = results.filter(result=> result.length>0);
      
        var endTime = performance.now()
        console.log(`Call to linkCrawl took ${endTime - startTime} milliseconds`)

        if (results.length>0) {
            console.log(results)
            process.exit(1)
        } else {
            console.log("No dead links found. Great!")
            process.exit(0)
        }

  //  git
  //   .add('./*')
  //   .commit('first commit!')
  //   .push(['-u', 'origin', 'master'], () => console.log('done'));





  

    


    



    // for (let i=0; i<targets.length;i++) {
    //   let fileTarget = targets[i];
    //   for (let link of links[i]) {
    //     promises.push(checkLink(link));
    //     if (!(link in promiseMap)) {
    //       promiseMap[link] = [];
    //     }
    //     promiseMap[link].push(fileTarget)
    //   }
    // }
    // links = links.flat().slice(0,2)

    


    
    }

       

linkCrawl()
