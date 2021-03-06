var express=require('express');
var path=require('path');
var mongoose=require('mongoose')
var _=require('underscore')
var Movie=require('./models/movie')
var port=process.env.PORT||3001;
var app=express();

mongoose.connect('mongodb://localhost/imooc')

app.set('views','./views/pages')
app.set('view engine','jade')

//app.use(express.bodyParser())
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))
// app.use(require('body-parser').urlencoded({extended: true}))
app.use(express.static(path.join(__dirname,'public')))
app.locals.moment=require('moment')
app.listen(port);

console.log("imooc started on port:",port);

//index page
app.get('/',function(req,res)
{
  Movie.fetch(function(err,movies){
    if(err){console.log(err)}
    res.render('index',{
      title: 'imooc 首页',
      movies: movies
    })
  })
})

//detail page
app.get('/movie/:id',function(req,res)
{
  var id=req.params.id
  Movie.findById(id,function(err,movie)
  {
      res.render('detail',{
        title: 'imooc 详情页',
        movie:movie
      })
  })
})

//admin page
app.get('/admin/movie',function(req,res)
{
  res.render('admin',
    {
      title:"imooc 后台录入页",
      movie: {
        title: '',
        doctor: '',
        country: '',
        year: '',
        poster: '',
        flash: '',
        summary: '',
        language: ''
      }
    })
})

//admin update movie
app.get('/admin/update/:id',function(req,res){
  var id=req.params.id
  if(id){
    Movie.findById(id,function(err,movie){
      res.render('admin',{
        title: 'imooc 后台更新页',
        movie:movie
      })
    })
  }
})

//admin post movie
  app.post('/admin/movie/new',function(req,res){
  //var id=req.body.movie._id
  var movieObj=req.body.movie
  var id=movieObj._id
  var _movie

  if(id!==undefined){ //电影存在，此为更新操作
    Movie.findById(id,function(err,movie){
      console.log("--------",id)
      if(err){console.log(err)}
      _movie =_.extend(movie,movieObj)//用新改的movieObj改变原来的movie
      console.log('======='+movieObj)
      _movie.save(function(err,movie){//保存更改
        if(err){console.log(err)}
        res.redirect('/movie/'+movie._id) // 
      })
    })
  }else{
    _movie=new Movie({
        doctor: movieObj.doctor,
        title: movieObj.title,
        language: movieObj.language,
        country: movieObj.country,
        year: movieObj.year,
        poster: movieObj.poster,
        summary:movieObj.summary,
        flash: movieObj.flash
    })
    _movie.save(function(err,movie){
      if(err){console.log(err)}
      res.redirect('/movie/'+movie._id)
    })
  }
})

//list page
app.get('/admin/list',function(req,res)
{
  Movie.fetch(function(err,movies){
    if(err){console.log(err)}
    res.render('list',{
      title: 'imooc 列表页',
      movies: movies
    })
  })
})

//list delete page
app.delete('/admin/list',function(req,res){
  var id=req.query.id
  console.log(id);
  if(id){
    Movie.remove({_id:id},function(err,movie){
      if(err){console.log(err)}
      else{res.json({success: 1})}
    })
  }
})
