const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser")
const history = require('connect-history-api-fallback')
const { Octokit } = require("@octokit/rest");
const app = express()

const static = express.static(__dirname +'/build')
app.use(static)
app.use(history({
    disableDotRule:true,
    verbose:true
}))
app.use(static);
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(
  cors({
    origin: "*",
  })
);


const GetUser = async (octokit) => {
  const data = await octokit.request("/user");
};

const Createrepo = async (octokit, names) => {
  await octokit.repos.createForAuthenticatedUser({
    name: `${names}`,
  });
};

const Deleterepo = async (octokit, owners, repos) => {
  await octokit.repos.delete({
    owner: `${owners}`,
    repo: `${repos}`,
  });
};
// if (req.body.auth) {
//   const octokit = new Octokit({
//     auth: `${req.body.auth}`,
//   });
//   Createrepo(octokit, req.body.name).then((resSucsess)=>{res.send('tạo thành công')}).catch(err=>res.send('tệp đã tồn tại'));
// }
app.get("/gitApi/check/:owner/:token", async (req, res) => {
  const { owner, token } = req.params;
  const octokit = new Octokit({
    auth: `${token}`,
  });
  await octokit
    .request("GET /users")
    .then((response) => {
        if(response){
            res.send('success');
        }
    })
    .catch((err) => {
      if (err) {
        res.send('error');
      }
    });
});
app.post("/gitApi/create", (req, res) => {
  
  if (req.body.auth) {
    const octokit = new Octokit({
      auth: `${req.body.auth}`,
    });
    Createrepo(octokit, req.body.name)
      .then((resSucsess) => {
        res.send("tạo thành công");
      })
      .catch((err) => res.send("tệp đã tồn tại"));
  }
});
app.post("/gitApi/delete", (req,res) => {
    if (req.body.auth) {
        const octokit = new Octokit({
          auth: `${req.body.auth}`,
        });
        Deleterepo(octokit, req.body.owners, req.body.name)
          .then((resSucsess) => {
            console.log(resSucsess)
            res.send("tạo thành công");
          })
          .catch((err) => {
       
            res.send("owner not found")
          });
      }
   
  });

app.listen();


