const mongoose=require("mongoose");
const express=require("express");
const ejs =require("ejs")
const bodyparser=require("body-parser");

const app=express();
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));


const articleshema={ title:String,content:String };


const articles = mongoose.model('articles', articleshema);
// arr=[{
//     "title" : "API",
//     "content" : "API stands for Application Programming Interface. It is a set of subroutine definitions, communication protocols, and tools for building software. In general terms, it is a set of clearly defined methods of communication among various components. A good API makes it easier to develop a computer program by providing all the building blocks, which are then put together by the programmer."
// },
// {
//     "title" : "Bootstrap",
//     "content" : "This is a framework developed by Twitter that contains pre-made front-end templates for web design"
// },
// {
//     "title" : "DOM",
//     "content" : "The Document Object Model is like an API for interacting with our HTML"
// }]
// articles.insertMany(arr, function(error, docs) {});

/////////////////////////////////////////////////////////////////////////////
app.route("/article")
.get(function(req,res){
    articles.find(function(err,founditem){
    if(err)
    {
        console.log(err);
    }
    else
    {
     res.send(founditem);   
    }
    })
    
})
.post(function(req,res){

    const newitem= new articles({
        title:req.body.title,
        content:req.body.content
    })
    newitem.save();
})
.delete(function(req,res){
    articles.deleteMany({},function(err){
        if (!err)
        {
            console.log("deleted everything");
        }
    })
});
//////////////////////////////////////////////////////////////
app.route("/article/:articletitle")
.get(function(req,res){
    
    articles.findOne({title:req.params.articletitle},function(err,founditem){
        if(founditem){
            res.send(founditem);
        }
        else{
            res.send("couldn't find the article");
        }
    })
})
.put(function(req,res){
    articles.update({title:req.params.articletitle},{title:req.body.title,content:req.body.content},{overwrite:true},function(err,founditem){
        if(founditem){
            res.send(founditem)
        }
        else{
            res.send("error")
        }
    })
})
.delete(function(req,res){
    articles.deleteOne({title:req.params.articletitle},function(err,founditem){
        if(founditem){
            res.send(founditem+" deleted");
        }
        else{
            res.send("item not found")
        }
    })
})
.patch(function(req,res){
    articles.update({title:req.params.articletitle},
        {$set:req.body},
        function(err,founditem){
            if(founditem){
                res.send(founditem)
            }
            else{
                res.send(err);
            }
        })
})
////////////////////////////////////////////////////////////
mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});

app.listen(3000,function()
{
    console.log("server started!");
});