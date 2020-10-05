var express = require("express");
var app = express();
methodOverride = require("method-override");
var mongoose = require("mongoose");
// Map global promises
mongoose.Promise = global.Promise;
// Mongoose Connect
mongoose.connect('mongodb://localhost:27017/blog', {useNewUrlParser: true})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));mongoose.set("useCreateIndex", true);
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  mongoose.set('useUnifiedTopology', true);
  var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
})
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
var expressSanitizer = require("express-sanitizer");
app.use(expressSanitizer());
var blogSchema = new mongoose.Schema({
    title:String,
    image: String,
    body: String,
    created: 
            {type:Date , default: Date.now}
});
var Blog = mongoose.model("Blog",blogSchema);
// Blog.create({
// title: "this is blog title",
// image: "https://images.unsplash.com/photo-1517824806704-9040b037703b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
// body: "wala wala"
// });
//routes
app.get("/",function(req , res){
res.redirect("/blogs");
});
app.get("/blogs", function(req , res){
    Blog.find({},function(err , blogs){
        if(err){
            console.log(err);
        }
        else{
            res.render("index",{blogs:blogs});
        }
    });

});
app.get("/blogs/new", function(req , res){
res.render("new");
});
app.post("/blogs",function(req , res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
Blog.create(req.body.blog,function(err,newBlog){
if(err){
    res.render("new");
}
else{res.redirect("/blogs");

}
});
});
app.get("/blogs/:id", function(req , res){
Blog.findById(req.params.id,function(err , found){
    if(err){
        res.redirect("/blogs");
    }
    else{
        res.render("show",{blog: found});
    }

});
});
app.get("/blogs/:id/edit",function(req , res){
    Blog.findById(req.params.id,function(err, found){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog: found});
        }
    });

});
app.put("/blogs/:id",function(req , res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
Blog.findByIdAndUpdateOne(req.params.id , req.body.blog,function(err, update){
if(err){
    res.redirect("/blogs");
}else{
    res.redirect("/blogs/"+req.params.id);
}
});
});
app.delete("/blogs/:id",function(req , res){
   
    Blog.findOneAndRemove({_id:req.params.id},function(err){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/blogs");

        }
    });
});
app.listen(3000,function(){
    console.log("server has started at 3000");
})
