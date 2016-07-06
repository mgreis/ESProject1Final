/**
 * Service Engineering
 * @author mgreis
 */



/**
 * Filters Data
 * @param data
 * @param filter
 * @returns {*}
 */
function getFiltered (data , filter){

    var filtered = data;
    filtered=filtered.filter(

        function(el){
            //window.alert(el.dealership_name+filter.dealership_name);
            return ((parseInt(el.user_id)==filter.user_id||parseInt(filter.user_id)==0))
                &&(el.dealership_name.toUpperCase().indexOf(filter.dealership_name.toUpperCase()) > -1)
                &&(el.dealership_email.toUpperCase().indexOf(filter.dealership_email.toUpperCase()) > -1)
                &&(el.dealership_url.toUpperCase().indexOf(filter.dealership_url.toUpperCase()) > -1)
                &&(el.dealership_phone.toUpperCase().indexOf(filter.dealership_phone.toUpperCase()) > -1)
                &&(el.dealership_district.toUpperCase().indexOf(filter.dealership_district.toUpperCase()) > -1)


                ;}
    );

    return filtered;
}



function getDealershipFromId (data , id){

    var filtered=data.filter(

        function(el){ return  (parseInt(el.dealership_id) ==(parseInt(id)));

        }
    );

    return filtered;
}

function sortList(dealership_array , dealership_order, search_type){

    if (search_type=="user_id"){
        if (dealership_order == 'asc') {
            return dealership_array.sort(function (a, b) {
                return parseInt(a.user_id)>=parseInt(b.user_id);
            });
        }
        else
            return dealership_array.sort(function (a, b) {
                return parseInt(a.user_id)<parseInt(b.user_id);
            });

    }

    if (search_type=="dealership_id"){
        if (dealership_order == 'asc') {
            return dealership_array.sort(function (a, b) {
                return parseInt(a.dealership_id)>=parseInt(b.dealership_id);
            });
        }
        else
            return dealership_array.sort(function (a, b) {
                return parseInt(a.dealership_id)<parseInt(b.dealership_id);
            });

    }

    if (search_type=="dealership_name"){
        if (dealership_order == 'asc') {
            return dealership_array.sort(function (a, b) {
                return a.dealership_name.toUpperCase().localeCompare(b.dealership_name.toUpperCase());
            });
        }
        else
            return dealership_array.sort(function (a, b) {
                return b.dealership_name.toUpperCase().localeCompare(a.dealership_name.toUpperCase());
            });

    }

    if (search_type=="dealership_email"){
        if (dealership_order == 'asc') {
            return dealership_array.sort(function (a, b) {
                return a.dealership_email.toUpperCase().localeCompare(b.dealership_email.toUpperCase());
            });
        }
        else
            return dealership_array.sort(function (a, b) {
                return b.dealership_email.toUpperCase().localeCompare(a.dealership_email.toUpperCase());
            });

    }


    if (search_type=="dealership_phone"){
        if (dealership_order == 'asc') {
            return dealership_array.sort(function (a, b) {
                return a.dealership_phone.toUpperCase().localeCompare(b.dealership_phone.toUpperCase());
            });
        }
        else
            return dealership_array.sort(function (a, b) {
                return b.dealership_phone.toUpperCase().localeCompare(a.dealership_phone.toUpperCase());
            });

    }

    if (search_type=="dealership_district"){
        if (dealership_order == 'asc') {
            return dealership_array.sort(function (a, b) {
                return a.dealership_district.toUpperCase().localeCompare(b.dealership_district.toUpperCase());
            });
        }
        else
            return dealership_array.sort(function (a, b) {
                return b.dealership_district.toUpperCase().localeCompare(a.dealership_district.toUpperCase());
            });

    }

}





var DealershipBox = React.createClass({displayName: 'DealershipBox',
    loadDealershipsFromServer: function(){
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            method: 'GET',
            cache: false,
            success: function(data) {
                this.setState ({data: data});
            }.bind(this),
            error: function(xhr,status,err) {
                window.alert ("error loadDealershipsFromServer");
                console.error (this.props.url, status, err.toString());
            }.bind (this)
        });
    },
    handleDealershipSubmit: function(dealership){
        var dealerships = this.state.data;
        dealership.dealership_id = Date.now().toString();
        var newDealerships = dealerships.concat([dealership]);
        this.setState({data: newDealerships});
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: dealership,
            success: function (data) {

                this.setState({data:data});
            }.bind(this),
            error: function(xhr,status, err) {
                window.alert ("error handleDealershipSubmit");
                this.setState({data:dealerships});
                console.error(this.props.url,status,err.toString());
            }.bind(this)
        });
    },
    handleDealershipSearchSubmit: function(filter){
        //window.alert("EDIT! "+filter.dealership_order+' '+filter.search_type );
        this.setState({filter:filter});
        var auxData = sortList(this.state.data,filter.dealership_order,filter.search_type);
        this.setState({data:auxData});
    },
    handleDealershipDelete: function(dealership){
        var data = {dealership_id:dealership};
        var dealerships = this.state.data;
        var newDealerships = dealerships.filter(function(el){ return el.dealership_id != dealership; });
        this.setState ({edit: {dealership:-1}});
        this.setState({data: newDealerships});

        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'delete',
            data: data,
            success: function (data) {
                this.setState({data:data});
            }.bind(this),
            error: function(xhr,status, err) {
                window.alert ("error handleDealershipDelete");
                this.setState({data:dealerships});
                console.error(this.props.url,status,err.toString());
            }.bind(this)
        });
    },

    handleDealershipEditFlag: function(dealership){
        var data = dealership;
        if(data == this.state.edit.dealership) data = -1;
        this.setState ({edit: {dealership:data}});


    },

    handleDealershipEdit: function(dealership){

        var dealerships = this.state.data;
        var newDealerships = dealerships.filter(function(el){ return el.dealership_id != dealership.dealership_id; });
        newDealerships.concat(dealership);
        newDealerships=sortList(newDealerships ,this.state.filter.dealership_order,this.state.filter.search_type);

        this.setState({data: newDealerships});
        this.setState ({edit: {dealership:-1}});
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'put',
            data: dealership,
            success: function (data) {
                this.setState({data:data});
            }.bind(this),
            error: function(xhr,status, err) {
                window.alert ("error handleDealershipEdit");
                this.setState({data:dealerships});
                console.error(this.props.url,status,err.toString());
            }.bind(this)
        });
    },



    getInitialState: function (){
        return {data:[], filter:{dealership_name: '',dealership_email:'', dealership_url:'', dealership_phone : '', dealership_district : '',
             dealership_order:'asc', search_type: 'dealership_id',user_id:'0' }, order:{present:'asc'},edit:{dealership:-1}};
    },
    componentDidMount: function (){
        this.loadDealershipsFromServer();
        setInterval(this.loadDealershipsFromServer, this.props.pollInterval);

    },
    render: function() {
        var divstyle = {position: 'fixed', left : '23%', top: '10%', overflow:'auto', height: '1000px', width: '50%'};
        var filtered = getFiltered (this.state.data,this.state.filter,this.state.order);


        if (this.props.user_type == 'Dealer'){
            if (this.state.edit.dealership == -1) {
                return (
                    <div className="dealershipBox" style={divstyle}>

                        <h1>Available dealerships</h1>
                        <DealershipList data={filtered}
                                 onDealershipDelete={this.handleDealershipDelete}
                                 onDealershipFlagEdit={this.handleDealershipEditFlag}
                                 dealershipEditFlag={this.state.edit.dealership}
                                 user_type = 'Dealer'
                                 user_id   = {this.props.user_id}
                        />
                        <DealershipForm onDealershipSubmit={this.handleDealershipSubmit}/>
                        <DealershipSearchForm onDealershipSearchSubmit={this.handleDealershipSearchSubmit}
                                       user_district = {this.props.user_district}
                                       user_id = {this.props.user_id}
                        />
                    </div>
                );
            }
            else{

                var aux = getDealershipFromId(this.state.data, this.state.edit.dealership);
                return(
                    <div className="dealershipBox" style={divstyle}>

                        <h1>Available dealerships</h1>
                        <DealershipList data={filtered}
                                 onDealershipDelete={this.handleDealershipDelete}
                                 onDealershipFlagEdit={this.handleDealershipEditFlag}
                                 dealershipEditFlag={this.state.edit.dealership}
                                 user_type = 'Dealer'
                                 user_id   = {this.props.user_id}
                        />
                        <DealershipEditForm onDealershipSubmit={this.handleDealershipEdit}
                                     dealership_id={this.state.edit.dealership}
                                     onDealershipEdit = {this.handleDealershipEdit}
                                     data = {aux[0]}/>
                        <DealershipSearchForm onDealershipSearchSubmit={this.handleDealershipSearchSubmit}
                                       user_district = {this.props.user_district}
                                       user_id = {this.props.user_id}

                        />
                    </div>
                );
            }
        }
        else {


            return (
                <div className="dealershipBox" style={divstyle}>

                    <h1>Available dealerships</h1>
                    <DealershipList data={filtered}
                             onDealershipDelete={this.handleDealershipDelete}
                             onDealershipFlagEdit={this.handleDealershipEditFlag}
                             dealershipEditFlag={this.state.edit.dealership}
                             user_type = 'simple'
                             user_id   = {this.props.user_id}
                    />
                    <DealershipSearchForm onDealershipSearchSubmit={this.handleDealershipSearchSubmit}
                                   user_district = {this.props.user_district}
                                   user_id = {this.props.user_id}
                    />
                </div>
            );
        }





    }
});


var DealershipList = React.createClass({
    render: function() {

        var onDealershipDelete =  this.props.onDealershipDelete;
        var onDealershipFlagEdit = this.props.onDealershipFlagEdit;
        var dealershipEditFlag = this.props.dealershipEditFlag;
        var user_type = this.props.user_type;
        var user_id = this.props.user_id;
        var dealershipNodes = this.props.data.map(function (dealership){
            var div_state = 'add';
            if (dealershipEditFlag==dealership.dealership_id)
                div_state = 'edit';
            return (
                <Dealership key = {dealership.dealership_id}
                     dealership_id = {dealership.dealership_id}
                     dealership_name = {dealership.dealership_name}
                     dealership_email = {dealership.dealership_email}
                     dealership_url =  {dealership.dealership_url}
                     dealership_phone =  {dealership.dealership_phone}
                     dealership_picture = {dealership.dealership_picture}
                	 dealership_district = {dealership.dealership_district}
                     dealership_user_id = {dealership.user_id}
                     onDealershipDelete = {onDealershipDelete}
                     onDealershipFlagEdit =   {onDealershipFlagEdit}
                     div_state = {div_state}
                     user_type = {user_type}
                     user_id = {user_id}

                />

            );
        });
        return (
            <div className="dealershipList">

                {dealershipNodes}

            </div>
        );
    }
});


var Dealership = React.createClass({


    getInitialState: function () {
        return {current_state: "add"};
    },


    handleEdit : function (e){
        e.preventDefault();
        this.props.onDealershipFlagEdit(this.props.dealership_id);
    },

    handleDelete : function (e){

        e.preventDefault();
        this.props.onDealershipDelete(this.props.dealership_id);
    },



    render: function(){
        var divstyle = {border: '1px solid green', height: '250px', width : '645px'};
        if (this.props.div_state == "edit")
            divstyle = {border: '2px solid red', height: '250px', width: '645px'};


        var picstyle = {position: 'relative' , left: '50%', top: '-175px', height : '200px', width: '300px', bgcolor : 'red', border: '1px solid black' }
        var picstyleUser = {position: 'relative' , left: '50%', top: '-175px', height : '200px', width: '300px', bgcolor : 'red',border: '1px solid black' }
        var buttonstyle = {width: '150px'}

        if (this.props.user_type == 'Dealer'&& this.props.user_id == this.props.dealership_user_id) {
            return (

                <div className="dealership" style={divstyle}>
                    <form className="dealershipForm" onSubmit={this.handleEdit}>
                        <br/>
                        Id: {this.props.dealership_id}<br/>
                        Name: {this.props.dealership_name}<br/>
                        Email: {this.props.dealership_email}<br/>
                        url: {this.props.dealership_url}<br/>
                        phone: {this.props.dealership_phone}<br/>
                        district: {this.props.dealership_district}<br/>
                        Owner: {this.props.dealership_user_id}<br/>

                        <input type="submit" value="Edit" style={buttonstyle}/>
                    </form>
                    <form className="dealershipForm" onSubmit={this.handleDelete}>

                        <input type="submit" value="Delete" style={buttonstyle}/>
                    </form>
                    <form className="setCars"
                          action = "/set_cars"
                          method = "post"
                    >
                        <input type ="hidden" name = "dealership_id" value = {this.props.dealership_id} />
                        <input type = "submit" value = "Available Cars" style = {buttonstyle} />
                    </form>


                    <img src={this.props.dealership_picture} style={picstyle}/>


                </div>
            );
        }
        else{
            return (

                <div className="dealership" style={divstyle}>
                    <form className="dealershipForm" onSubmit={this.handleDelete}>
                        <br/>
                        Id: {this.props.dealership_id}<br/>
                        Name: {this.props.dealership_name}<br/>
                        Email: {this.props.dealership_email}<br/>
                        url: {this.props.dealership_url}<br/>
                        phone: {this.props.dealership_phone}<br/>
                        district: {this.props.dealership_district}<br/>
                        Owner: {this.props.dealership_user_id}<br/>

                    </form>
                    <br/>
                    <br/>

                    <form className="setCars"
                          action = "/set_cars"
                          method = "post"
                    >
                        <input type ="hidden" name = "dealership_id" value = {this.props.dealership_id} />
                        <input type = "submit" value = "Available Cars" style = {buttonstyle} />
                    </form>


                    <img src={this.props.dealership_picture} style={picstyleUser}/>


                </div>
            );
        }

    }
});



var DealershipForm = React.createClass({
    getInitialState: function(){
        return {dealership_name: '',dealership_email:'', dealership_url:'', dealership_price : '',dealership_picture: '',data_uri: null};
    },

    handleFile: function(e) {
        var self = this;
        var reader = new FileReader();
        var file = e.target.files[0];

        reader.onload = function(upload) {
            self.setState({
                data_uri: upload.target.result,
            });
        }

        reader.readAsDataURL(file);
    },

    handleNameChange: function (e){
        this.setState({dealership_name: e.target.value});
    },
    handleEmailChange: function (e){
        this.setState({dealership_email: e.target.value});
    },
    handleURLChange: function (e){
        this.setState({dealership_url: e.target.value});
    },
    handlePhoneChange: function (e){
        this.setState({dealership_phone: e.target.value});
    },
    handleDistrictChange: function (e){
        this.setState({dealership_district: e.target.value});
    },
    handleSubmit: function(e){
        e.preventDefault();
        var dealership_name = 		this.state.dealership_name.trim();
        var dealership_email =			this.state.dealership_email.trim();
        var dealership_url = 			this.state.dealership_url.trim();
        var dealership_phone = 		this.state.dealership_phone.trim();
        var dealership_district = 		this.state.dealership_district.trim();
        var dealership_picture = 		this.state.dealership_picture.trim();
        if(!dealership_name
            ||!dealership_email
            ||!dealership_url
            ||!dealership_phone
            ||!dealership_district
        )

        {

            return;
        }
        this.props.onDealershipSubmit ({dealership_name: dealership_name, dealership_email: dealership_email,
            dealership_url: dealership_url, dealership_phone: dealership_phone, dealership_picture: dealership_picture, dealership_district: dealership_district,
            data_uri : this.state.data_uri});
        this.setState ({dealership_name: '',dealership_email:'', dealership_url:'', dealership_phone : '',
            dealership_picture: '', dealership_district: '', data_uri : null});
    },
    render: function(){


        var divStyle = {position: 'fixed', left : '75%', top: '10%', height: '100%' ,width: '50%'};
        var buttonStyle = {width: '150px'};

        return (
            <div className = 'dealershipForm'  style = {divStyle}>

                <form className = "dealershipForm" onSubmit = {this.handleSubmit}>
                    <h3> Add New dealership:</h3>


                    Name:<br/>
                    <input
                        type = "text"
                        placeholder = "Name"
                        value = {this.state.dealership_name}
                        onChange = {this.handleNameChange}
                    /><br/>
                    Email:<br/>
                    <input
                        type = "text"
                        placeholder = "Email"
                        value = {this.state.dealership_email}
                        onChange = {this.handleEmailChange}
                    /><br/>
                    URL:<br/>
                    <input
                        type = "text"
                        placeholder = "URL"
                        value = {this.state.dealership_url}
                        onChange = {this.handleURLChange}
                    /><br/>
                    Phone:<br/>
                    <input
                        type = "text"
                        placeholder = "Phone"
                        value = {this.state.dealership_phone}
                        onChange = {this.handlePhoneChange}
                    /><br/>
                    District:<br/>
                    <input
                        type = "text"
                        placeholder = "District"
                        value = {this.state.dealership_district}
                        onChange = {this.handleDistrictChange}
                    /><br/>
                    <br/>




                    <input type = "submit" value="Post" style =  {buttonStyle}/>
                </form><br/><br/>


                <form onSubmit={this.handlePictureSubmit} encType="multipart/form-data">
                    <input type="file" onChange={this.handleFile} />
                </form>




            </div>
        );
    }
});




var DealershipEditForm = React.createClass({
    getInitialState: function(){
        return {
            dealership_id:         this.props.data.dealership_id,
            dealership_name:       this.props.data.dealership_name,
            dealership_email:      this.props.data.dealership_email,
            dealership_url:        this.props.data.dealership_url,
            dealership_phone:      this.props.data.dealership_phone,
            dealership_picture:    this.props.data.dealership_picture,
            dealership_district:   this.props.data.dealership_district,
            data_uri:       null
        }
    },
    handleNameChange: function (e){
        this.setState({dealership_name: e.target.value});
    },
    handleEmailChange: function (e){
        this.setState({dealership_email: e.target.value});
    },
    handleURLChange: function (e){
        this.setState({dealership_url: e.target.value});
    },
    handlePhoneChange: function (e){
        this.setState({dealership_phone: e.target.value});
    },
    handleFile: function(e) {

        var self = this;
        var reader = new FileReader();
        var file = e.target.files[0];

        reader.onload = function(upload) {
            self.setState({
                data_uri: upload.target.result,
            });
        }

        reader.readAsDataURL(file);
    },
    handleDistrictChange: function (e) {
        this.setState({dealership_district: e.target.value});
    },
    handleSubmit: function(e){
        //window.alert(this.state.dealership_picture);
        e.preventDefault();
        var dealership_id=              this.state.dealership_id.trim();
        var dealership_name = 		    this.state.dealership_name.trim();
        var dealership_email =			this.state.dealership_email.trim();
        var dealership_url = 			this.state.dealership_url.trim();
        var dealership_phone = 		    this.state.dealership_phone.trim();
        var dealership_picture = 		this.state.dealership_picture.trim();
        var dealership_district = 		this.state.dealership_district.trim();
        if(!dealership_name
            ||!dealership_email
            ||!dealership_url
            ||!dealership_phone
            ||!dealership_district

        ){

            return;
        }
        if(this.state.data_uri!=null) {

            this.props.onDealershipSubmit({
                dealership_id: dealership_id,
                dealership_name: dealership_name,
                dealership_email: dealership_email,
                dealership_url: dealership_url,
                dealership_phone: dealership_phone,
                dealership_picture: dealership_picture,
                dealership_district: dealership_district,
                data_uri: this.state.data_uri
            });}
        else{
            //window.alert("this.props.dealership_picture")

            this.props.onDealershipSubmit({
                dealership_id: dealership_id,
                dealership_name: dealership_name,
                dealership_email: dealership_email,
                dealership_url: dealership_url,
                dealership_phone: dealership_phone,
                dealership_picture: dealership_picture,
                dealership_district: dealership_district,
                data_uri: dealership_picture
            });
        }

        this.setState ({    dealership_id:         this.props.data.dealership_id,
            dealership_name:       this.props.data.dealership_name,
            dealership_email:      this.props.data.dealership_email,
            dealership_url:        this.props.data.dealership_url,
            dealership_phone:      this.props.data.dealership_phone,
            dealership_picture:    this.props.data.dealership_picture,
            dealership_district:   this.props.data.dealership_district,
            data_uri :      null});
    },
    render: function(){


        var divStyle = {position: 'fixed', left : '75%', top: '10%', height: '100%' ,width: '50%'};
        var buttonStyle = {width: '150px'};

        return (
            <div className = 'dealershipEditForm' style = {divStyle}>

                <form className = "dealershipForm" onSubmit = {this.handleSubmit} >
                    <h3> Edit dealership with ID: {this.props.dealership_id} </h3>


                    Name:<br/>
                    <input
                        type = "text"
                        placeholder = "Name"
                        value = {this.state.dealership_name}
                        onChange = {this.handleNameChange}
                    /><br/>
                    Email:<br/>
                    <input
                        type = "text"
                        placeholder = "Email"
                        value = {this.state.dealership_email}
                        onChange = {this.handleEmailChange}
                    /><br/>
                    URL:<br/>
                    <input
                        type = "text"
                        placeholder = "URL"
                        value = {this.state.dealership_url}
                        onChange = {this.handleURLChange}
                    /><br/>
                    Phone:<br/>
                    <input
                        type = "text"
                        placeholder = "Phone"
                        value = {this.state.dealership_phone}
                        onChange = {this.handlePhoneChange}
                    /><br/>
                    District:<br/>
                    <input
                        type = "text"
                        placeholder = "District"
                        value = {this.state.dealership_district}
                        onChange = {this.handleDistrictChange}
                    /><br/>
                    <br/>

                    <input type = "submit" value="Edit" style =  {buttonStyle}/>
                </form>
                <br/><br/>


                <form onSubmit={this.handlePictureSubmit} encType="multipart/form-data">
                    <input type="file" onChange={this.handleFile} />
                </form>

            </div>
        );
    }
});



var DealershipSearchForm = React.createClass({
    getInitialState: function(){
        return {dealership_name: '',dealership_email:'', dealership_url:'', dealership_phone : '',
            dealership_district: '' ,user_id:'0' ,dealership_order:'asc', search_type:'dealership_id'};
    },
    handleUserIdChange: function (e){
        this.setState({user_id: e.target.value});
    },
    handleNameChange: function (e){
        this.setState({dealership_name: e.target.value});
    },
    handleEmailChange: function (e){
        this.setState({dealership_email: e.target.value});
    },
    handleURLChange: function (e){
        this.setState({dealership_url: e.target.value});
    },
    handlePhoneChange: function (e){
        this.setState({dealership_phone: e.target.value});
    },
    handleDistrictChange: function (e){
        this.setState({dealership_district: e.target.value});
    },
    handleOrderChange: function (e){
        this.setState({dealership_order: e.target.value});
    },
    handleSearchTypeChange: function (e){
        this.setState({search_type: e.target.value});
    },
    handleSubmit: function(e){
        e.preventDefault();
        var dealership_name = 		this.state.dealership_name.trim();
        var dealership_email =			this.state.dealership_email.trim();
        var dealership_url = 	this.state.dealership_url.trim();
        var dealership_phone = 	this.state.dealership_phone.trim();
        var dealership_district = 		this.state.dealership_district.trim();
        var dealership_order=          this.state.dealership_order.trim();
        var search_type=        this.state.search_type.trim();
        var user_id=            this.state.user_id.trim();
        if(!dealership_name)dealership_name ='';
        if(!dealership_email)dealership_email='';
        if(!dealership_url)dealership_url='';
        if(!dealership_phone)dealership_phone='';
        if(!dealership_district)dealership_district='';
        if(!dealership_order)dealership_order = 'asc';
        if(!search_type)search_type = 'dealership_id';
        if(!user_id)user_id = '0';
        //window.alert(dealership_order);


        this.props.onDealershipSearchSubmit ({dealership_name: dealership_name, dealership_email: dealership_email,
            dealership_url: dealership_url, dealership_phone: dealership_phone,
            dealership_district: dealership_district,user_id:user_id ,dealership_order:dealership_order, search_type:search_type});
    },
    handleNearMeSubmit: function(e){
        //window.alert(this.props.user_district);
        e.preventDefault();
        var dealership_name = 		this.state.dealership_name.trim();
        var dealership_email =			this.state.dealership_email.trim();
        var dealership_url = 	this.state.dealership_url.trim();
        var dealership_phone = 	this.state.dealership_phone.trim();
        var dealership_district = 		this.props.user_district.trim();
        var dealership_order=          this.state.dealership_order.trim();
        var search_type=        this.state.search_type.trim();
        var user_id=            this.state.user_id.trim();
        if(!dealership_name)dealership_name ='';
        if(!dealership_email)dealership_email='';
        if(!dealership_url)dealership_url='';
        if(!dealership_phone)dealership_phone='';
        if(!dealership_district)dealership_district='';
        if(!dealership_order)dealership_order = 'asc';
        if(!search_type)search_type = 'dealership_id';
        if(!user_id)user_id = '0';
        //window.alert(dealership_order);


        this.props.onDealershipSearchSubmit ({dealership_name: dealership_name, dealership_email: dealership_email,
            dealership_url: dealership_url, dealership_phone: dealership_phone,
            dealership_district: dealership_district,user_id:user_id ,dealership_order:dealership_order, search_type:search_type});
    },

    handleMyDealershipsSubmit: function(e){
        e.preventDefault();
        var dealership_name = 		this.state.dealership_name.trim();
        var dealership_email =			this.state.dealership_email.trim();
        var dealership_url = 	this.state.dealership_url.trim();
        var dealership_phone = 	this.state.dealership_phone.trim();
        var dealership_district = 		this.state.dealership_district.trim();
        var dealership_order=          this.state.dealership_order.trim();
        var search_type=        this.state.search_type.trim();
        var user_id=            this.props.user_id.trim();
        if(!dealership_name)dealership_name ='';
        if(!dealership_email)dealership_email='';
        if(!dealership_url)dealership_url='';
        if(!dealership_phone)dealership_phone='';
        if(!dealership_district)dealership_district='';
        if(!dealership_order)dealership_order = 'asc';
        if(!search_type)search_type = 'dealership_id';
        if(!user_id)user_id = '0';
        //window.alert(dealership_order);


        this.props.onDealershipSearchSubmit ({dealership_name: dealership_name, dealership_email: dealership_email,
            dealership_url: dealership_url, dealership_phone: dealership_phone,
            dealership_district: dealership_district,user_id:user_id ,dealership_order:dealership_order, search_type:search_type});
    },







    handleResetFilter: function (e){
        e.preventDefault();
        //window.alert("Alert");
        this.props.onDealershipSearchSubmit ({dealership_name: '',dealership_email:'', dealership_url:'', dealership_phone : '',
            dealership_district: '' ,user_id:'0' ,dealership_order:'asc', search_type:'dealership_id'});
        this.setState ({dealership_name: '',dealership_email:'', dealership_url:'', dealership_phone : '',
            dealership_district: '' ,user_id:'0' ,dealership_order:'asc', search_type:'dealership_id'});
    },
    render: function(){


        var divStyle = {position: 'fixed', left : '1%', top: '10%', height: '1000px' ,width: '21%'};
        var buttonStyle = {width: '150px'};

        return (
            <div className = 'dealershipSearchForm' style = {divStyle}>

                <form className = "dealershipSearchForm" onSubmit = {this.handleSubmit} >
                    <h3> Search Criteria:</h3>
                    Owner:<br/>
                    <input
                        type = "text"
                        placeholder = "Owner"
                        value = {this.state.user_id}
                        onChange = {this.handleUserIdChange}
                    /><br/>
                    Name:<br/>
                    <input
                        type = "text"
                        placeholder = "Name"
                        value = {this.state.dealership_name}
                        onChange = {this.handleNameChange}
                    /><br/>
                    Email:<br/>
                    <input
                        type = "text"
                        placeholder = "Email"
                        value = {this.state.dealership_email}
                        onChange = {this.handleEmailsChange}
                    /><br/>
                    URL:<br/>
                    <input
                        type = "text"
                        placeholder = "URL"
                        value = {this.state.dealership_url}
                        onChange = {this.handleURLChange}
                    /><br/>
                   Phone:<br/>
                    <input
                        type = "text"
                        placeholder = ""
                        value = {this.state.dealership_phone}
                        onChange = {this.handlePhoneChange}
                    /><br/>
                    District:<br/>
                    <input
                        type = "text"
                        placeholder = "District"
                        value = {this.state.dealership_district}
                        onChange = {this.handleDistrictChange}
                    /><br/>
                    Order:<br/>
                    <select name="order_type" value = {this.state.dealership_order}
                            onChange = {this.handleOrderChange} style =  {buttonStyle}>
                        <option value="asc" >Ascending</option>
                        <option value="des">Descending</option>


                    </select><br/>
                    Ordering Criteria:<br/>
                    <select name="fuel_type" value = {this.state.search_type}
                            onChange = {this.handleSearchTypeChange} style =  {buttonStyle}>

                        <option value="dealership_id" >id</option>
                        <option value="dealership_name">Name</option>
                        <option value="dealership_email">Email</option>
                        <option value="dealership_url">URL</option>
                        <option value="dealership_phone">Phone</option>
                        <option value="dealership_district">District</option>
                        <option value="user_id">Owner</option>

                    </select><br/><br/>
                    <input type = "submit" value="Execute" style =  {buttonStyle}/>
                </form>
                <br/>

                <form className = "dealershipSearchNearMeForm" onSubmit = {this.handleNearMeSubmit} >
                    <input type = "submit" value="Search Near Me" style =  {buttonStyle}/>
                </form>
                <br/>

                <form className = "dealershipSearchMineForm" onSubmit = {this.handleMyDealershipsSubmit} >
                    <input type = "submit" value="My Dealerships" style =  {buttonStyle}/>
                </form>
                <br/>



                <form className = "dealershipSearchResetForm" onSubmit = {this.handleResetFilter} >
                    <input type = "submit" value="Reset" style =  {buttonStyle}/>
                </form>
                <br/>

                <form action="/main">
                    <input type="submit" value="Back" style =  {buttonStyle} />
                </form>


                <br/>


                <form action="/logout">
                    <input type="submit" value="Logout" style =  {buttonStyle} />
                </form>


            </div>
        );
    }
});



ReactDOM.render(

    <DealershipBox url="/dealership_react"
            pollInterval = {10000000}
            user_district = {document.getElementById('content').getAttribute('user_district')}
            user_type =     {document.getElementById('content').getAttribute('user_type')}
            user_id =       {document.getElementById('content').getAttribute('user_id')
            }/>,

    document.getElementById('content')
)
