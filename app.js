const express = require('express')
const app = express();
const fs = require('fs');
const path = require('path');
const mongooseconnection = require('./config/mongoose');
const userInfo = require('./models/userModel');

require('dotenv').config();
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({extended : true}));


// app.get('/',(req,res)=>{
//   fs.readdir('./files',function(err,files) {
//     res.render('index', {files});
//   })
// });

app.get('/' ,async (req,res)=>{
  // const users = await userInfo.find({}, { projection: { name: 1, _id: 0 } });
  const users = await userInfo.find();
  // console.log(users);
  const files = users.map(user => user.name);
  // console.log(files);
  res.render('index',{userName : files});
})


app.get('/create',async (req,res)=>{
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; 
  const year = currentDate.getFullYear();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();
  const fn = `${day}-${month}-${year}_${hours}.${minutes}.${seconds}`;
  // const fn = `${day}-${month}-${year}_${hours}.${minutes}.${seconds}`;
  // fs.writeFile(`./files/${fn}`,'',(err)=>{
  //   if(err) {
  //     return res.send("Something went wrong");
  //   }
  //   else {
  //     fs.readFile(`./files/${fn}`,'utf-8',(err,fileData)=>{
  //       if(err) return res.send(err);
  //       else res.render('create',{fileData , fileName : fn});
  //     })
  //   }
  // })
    // let user = await userInfo.findOneAndUpdate();
    let createdUser = await userInfo.create({
      name:fn,
      description:''
    });
    const user = await userInfo.findOne({ _id: createdUser._id });
    res.render('create',{fileName: user.name ,fileData: user.description});
});

// app.get('/edit/:fileName',(req,res)=>{
//   fs.readFile(`./files/${req.params.fileName}`,'utf-8',(err,data)=>{
//     if(err) return res.send(err)
//     res.render('edit',{data,fileName : req.params.fileName});
//   })
//   let user = userInfo.findOne();
// })


app.get('/edit/:fileName',async (req,res)=>{
  let user = await userInfo.findOne({name: req.params.fileName});
  res.render('edit',{fileName: req.params.fileName , data : user.description});
});


// app.post('/update/:fileName',(req,res)=>{
//   fs.writeFile(`./files/${req.params.fileName}`,req.body.fileData,(err)=>{
//     if(err) return res.send(err)
//     res.redirect('/');
//   })
// })

app.post('/update/:fileName',async (req,res)=>{
  const updatedUser = await userInfo.findOneAndUpdate(
    { name: req.params.fileName }, 
    { description: req.body.fileData }, // Correct key and data source
    { new: true } // Returns the updated document
  );
  // console.log(updatedUser);
  res.redirect('/');
});


// app.get('/delete/:fileName',(req,res)=>{
//   fs.unlink(`./files/${req.params.fileName}`,(err)=>{
//     if(err) res.send(err);
//     res.redirect('/');
//   })
// });

app.get('/delete/:fileName',async (req,res)=>{
  let user = await userInfo.findOneAndDelete({name : req.params.fileName});
  // console.log(user);
  res.redirect('/');
});


// app.get('/view/:fileName',(req,res)=>{
//   fs.readFile(`./files/${req.params.fileName}`,'utf-8',(err,data)=>{
//     if(err) return res.send(err)
//     res.render('view',{data,fileName : req.params.fileName});
//   })
// });


app.get('/view/:fileName',async (req,res)=>{
  let user = await userInfo.findOne({name: req.params.fileName});
  res.render('view',{fileName: req.params.fileName , data : user.description});
});


app.listen(3000);