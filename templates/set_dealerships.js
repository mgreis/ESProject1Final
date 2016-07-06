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

    return data.filter(

        function(el){ return  (parseInt(el.dealership_id) ==(parseInt(id)));

        }
    );
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
    handleDealershipSelect: function(dealership){
        var data = {car_id:this.props.car_id,dealership_id:dealership.dealership_id};
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: data,
            success: function (data) {
                this.setState({data:data});
            }.bind(this),
            error: function(xhr,status, err) {
                window.alert ("error handleDealershipSubmit");
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
    handleDealershipDeselect: function(dealership){
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'delete',
            data: dealership,
            success: function (data) {
                this.setState({data:data});
            }.bind(this),
            error: function(xhr,status, err) {
                window.alert ("error handleDealershipDelete");
                this.setState({data:data});
                console.error(this.props.url,status,err.toString());
            }.bind(this)
        });
    },



    getInitialState: function (){
        return {data:[], filter:{dealership_name: '',dealership_email:'', dealership_url:'', dealership_phone : '', dealership_district : '',
             dealership_order:'asc', search_type: 'dealership_id',user_id:'0' }, order:{present:'asc'}};
    },
    componentDidMount: function (){
        this.loadDealershipsFromServer();
        setInterval(this.loadDealershipsFromServer, this.props.pollInterval);

    },
    render: function() {
        var divstyle = {position: 'fixed', left : '23%', top: '10%', overflow:'scroll', height: '1000px', width: '50%'};
        var filtered = getFiltered (this.state.data,this.state.filter,this.state.order);

            return (
                <div className="dealershipBox" style={divstyle}>

                    <h1>Available dealerships</h1>
                    <DealershipList data={filtered}
                                    onDealershipDeselect={this.handleDealershipDeselect}
                                    onDealershipSelect={this.handleDealershipSelect}

                    />
                    <DealershipSearchForm onDealershipSearchSubmit={this.handleDealershipSearchSubmit}
                                   user_district = {this.props.user_district}
                                   user_id = {this.props.user_id}
                    />
                </div>
            );
        }

});


var DealershipList = React.createClass({
    render: function() {

        var onDealershipDeselect =  this.props.onDealershipDeselect;
        var onDealershipSelect = this.props.onDealershipSelect;
        var dealershipNodes = this.props.data.map(function (dealership){
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
                     dealership_selected = {dealership.selected}
                     onDealershipDeselect = {onDealershipDeselect}
                     onDealershipSelect =   {onDealershipSelect}
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

    getInitialState: function(){
        return{selected: "false" };
    },


    handleSelect : function (e) {

        e.preventDefault();
        if (this.props.dealership_selected == "selected"){
            this.props.onDealershipDeselect({dealership_id:this.props.dealership_id});
        }
        else {
            this.props.onDealershipSelect({dealership_id:this.props.dealership_id});
        }
    },



    render: function(){



        var divstyle = {border: '1px solid green', height: '250px', width : '645px'};
        var buttonValue = "Select";
        if (this.props.dealership_selected == "selected") {
            divstyle = {border: '2px solid red', height: '250px', width: '645px'};
            buttonValue = "Unselect";
        }

        var picstyle = {position: 'relative' , left: '50%', top: '-138px', height : '200px', width: '300px', bgcolor : 'red', border: '1px solid black' }
        var buttonstyle = {width: '150px'}


        return (

            <div className="dealership" style={divstyle}>
                <form className="dealershipForm" onSubmit={this.handleSelect}>
                    <br/>
                    Id: {this.props.dealership_id}<br/>
                    Name: {this.props.dealership_name}<br/>
                    Email: {this.props.dealership_email}<br/>
                    url: {this.props.dealership_url}<br/>
                    phone: {this.props.dealership_phone}<br/>
                    district: {this.props.dealership_district}<br/>
                    Owner: {this.props.dealership_user_id}<br/>

                    <input type="submit" value={buttonValue} style={buttonstyle}/>
                </form>


                <img src={this.props.dealership_picture} style={picstyle}/>


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

                <form action="/cars">
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

    <DealershipBox url="/set_dealerships_react"
            pollInterval = {10000000}
            user_district = {document.getElementById('content').getAttribute('user_district')}
            user_type =     {document.getElementById('content').getAttribute('user_type')}
            user_id =       {document.getElementById('content').getAttribute('user_id')}
            car_id =        {document.getElementById('content').getAttribute('car_id')}
             />,

    document.getElementById('content')
)
