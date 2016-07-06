/**
 * Created by mgreis on 26-03-2016.
 */
var data = [ { "id" : "1" , "picture" : "20202", "brand" : "Ford", "model" : "T" , "price" : "2020.0" , "district" : "20202", "kilometer" : "20202", "fuel_type" : "Gasoline" , "year" : "1922", "user_id" : "1" , "dealer_id" : "None"} , { "id" : "2" , "picture" : "5", "brand" : "1", "model" : "2" , "price" : "4.0" , "district" : "7", "kilometer" : "6", "fuel_type" : "Gasoline" , "year" : "3", "user_id" : "1" , "dealer_id" : "None"} , { "id" : "3" , "picture" : "fsvrd ", "brand" : "gfbhygbf", "model" : "dfvfbg " , "price" : "21.0" , "district" : "rftv", "kilometer" : "342", "fuel_type" : "Gasoline" , "year" : "21", "user_id" : "1" , "dealer_id" : "None"} ];




var CommentBox = React.createClass({displayName: 'CommentBox',
  loadCommentsFromServer: function(){
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState ({data: data});
      }.bind(this),
      error: function(xhr,status,err) {
        console.error (this.props.url, status, err.toString());
      }.bind (this)
    });
  },
  getInitialState: function (){
    return {data:[]};
  },
  componentDidMount: function (){
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {

    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data = {this.state.data}/>
      </div>
    );
  }
});


var CommentList = React.createClass({
  render: function() {this.state.data
    var commentNodes = this.props.data.map(function (comment){
      return (
        <Comment author = {comment.name} key = {comment.id}>
          {comment.brand}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});



var Comment = React.createClass({
  rawMarkup: function(){
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return {__html: rawMarkup};
  },
  render: function(){
    return(
      <div className = "comment">
        <h2 className = "commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML = {this.rawMarkup()}/>
      </div>
    );
  }
});



ReactDOM.render(function(){ return(
  <CommentBox url = "/get_cars" pollInterval = {2000} /> ,
    document.getElementById('content' ))
});
