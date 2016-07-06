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
            //window.alert(filter.user_id);
            return  (parseInt(el.car_kilometer) <=(parseInt(filter.car_max_kilometer)))
                    &&(parseInt(el.car_kilometer) >=(parseInt(filter.car_min_kilometer)))
                    &&(parseInt(el.car_price)     >=(parseInt(filter.car_min_price)))
                    &&(parseInt(el.car_price)     <=(parseInt(filter.car_max_price)))
                    &&(el.car_brand.toUpperCase().indexOf(filter.car_brand.toUpperCase()) > -1)
                    &&(el.car_model.toUpperCase().indexOf(filter.car_model.toUpperCase()) > -1)
                    &&(el.car_fuel_type.toUpperCase().indexOf(filter.car_fuel_type.toUpperCase()) > -1)
                    &&(el.car_district.toUpperCase().indexOf(filter.car_district.toUpperCase()) > -1)
                    &&(parseInt(el.user_id)==filter.user_id||parseInt(filter.user_id)==0)
                    ;}
);

    return filtered;
}



function getCarFromId (data , id){

    return data.filter(

        function(el){ return  (parseInt(el.car_id) ==(parseInt(id)));

        }
    );
}

function sortList(car_array , car_order, search_type){

    if (search_type=="user_id"){
        if (car_order == 'asc') {
            return car_array.sort(function (a, b) {
                return parseInt(a.user_id)>=parseInt(b.user_id);
            });
        }
        else
            return car_array.sort(function (a, b) {
                return parseInt(a.user_id)<parseInt(b.user_id);
            });

    }

    if (search_type=="car_id"){
        if (car_order == 'asc') {
            return car_array.sort(function (a, b) {
                return parseInt(a.car_id) - parseInt(b.car_id);
            });
        }
        else
            return car_array.sort(function (a, b) {
                return parseInt(-a.car_id) + parseInt(b.car_id);
            });

    }
    if (search_type=="car_brand"){
        if (car_order == 'asc') {
            return car_array.sort(function (a, b) {
                return a.car_brand.toUpperCase().localeCompare(b.car_brand.toUpperCase());
            });
        }
        else
            return car_array.sort(function (a, b) {
                return b.car_brand.toUpperCase().localeCompare(a.car_brand.toUpperCase());
            });

    }

    if (search_type=="car_model"){
        if (car_order == 'asc') {
            return car_array.sort(function (a, b) {
                return a.car_model.toUpperCase().localeCompare(b.car_model.toUpperCase());
            });
        }
        else
            return car_array.sort(function (a, b) {
                return b.car_model.toUpperCase().localeCompare(a.car_model.toUpperCase());
            });

    }

    if (search_type=="car_year"){
        if (car_order == 'asc') {
            return car_array.sort(function (a, b) {
                return parseInt(a.car_year) - parseInt(b.car_year);
            });
        }
        else
            return car_array.sort(function (a, b) {
                return parseInt(-a.car_year) + parseInt(b.car_year);
            });


    }

    if (search_type=="car_kilometer"){
        if (car_order == 'asc') {
            return car_array.sort(function (a, b) {
                return parseInt(a.car_kilometer) - parseInt(b.car_kilometer);
            });
        }
        else
            return car_array.sort(function (a, b) {
                return parseInt(-a.car_kilometer) + parseInt(b.car_kilometer);
            });


    }


    if (search_type=="car_district"){
        if (car_order == 'asc') {
            return car_array.sort(function (a, b) {
                return a.car_district.toUpperCase().localeCompare(b.car_district.toUpperCase());
            });
        }
        else
            return car_array.sort(function (a, b) {
                return b.car_district.toUpperCase().localeCompare(a.car_district.toUpperCase());
            });

    }


    if (search_type=="car_fuel_type"){
        if (car_order == 'asc') {
            return car_array.sort(function (a, b) {
                return a.car_fuel_type.toUpperCase().localeCompare(b.car_fuel_type.toUpperCase());
            });
        }
        else
            return car_array.sort(function (a, b) {
                return b.car_fuel_type.toUpperCase().localeCompare(a.car_fuel_type.toUpperCase());
            });

    }


    if (search_type=="car_price"){
        if (car_order == 'asc') {
            return car_array.sort(function (a, b) {
                return parseFloat(a.car_price) - parseFloat(b.car_price);
            });
        }
        else
            return car_array.sort(function (a, b) {
                return parseFloat(-a.car_price) + parseFloat(b.car_price);
            });

    }






}





var CarBox = React.createClass({
    displayName: 'CarBox',
    loadCarsFromServer: function () {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            method: 'GET',
            cache: false,
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function (xhr, status, err) {
                window.alert("error loadCarsFromServer");
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleCarSubmit: function (car) {
        var cars = this.state.data;
        car.car_id = Date.now().toString();
        var newCars = cars.concat([car]);
        this.setState({data: newCars});
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: car,
            success: function (data) {

                this.setState({data: data});
            }.bind(this),
            error: function (xhr, status, err) {
                window.alert("error handleCarSubmit");
                this.setState({data: cars});
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleCarSearchSubmit: function (filter) {
        //window.alert("EDIT! "+filter.car_order+' '+filter.search_type );
        this.setState({filter: filter});
        var auxData = sortList(this.state.data, filter.car_order, filter.search_type);
        this.setState({data: auxData});
    },
    handleCarDelete: function (car) {
        var data = {car_id: car};
        var cars = this.state.data;
        var newCars = cars.filter(function (el) {
            return el.car_id != car;
        });
        this.setState({edit: {car: -1}});
        this.setState({data: newCars});

        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'delete',
            data: data,
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function (xhr, status, err) {
                window.alert("error handleCarDelete");
                this.setState({data: cars});
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    handleCarEditFlag: function (car) {
        var data = car;
        if (data == this.state.edit.car) data = -1;
        this.setState({edit: {car: data}});


    },

    handleCarEdit: function (car) {

        var cars = this.state.data;
        var newCars = cars.filter(function (el) {
            return el.car_id != car.car_id;
        });
        newCars.concat(car);
        newCars = sortList(newCars, this.state.filter.car_order, this.state.filter.search_type);

        this.setState({data: newCars});
        this.setState({edit: {car: -1}});
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'put',
            data: car,
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function (xhr, status, err) {
                window.alert("error handleCarEdit");
                this.setState({data: cars});
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },


    getInitialState: function () {
        return {
            data: [], filter: {
                car_brand: '',
                car_model: '',
                car_min_price: '0',
                car_max_price: '1000000000',
                car_min_kilometer: '0',
                car_max_kilometer: '10000000',
                car_district: '',
                car_fuel_type: '',
                car_order: 'asc',
                search_type: 'car_id',
                user_id: '0'
            }, order: {present: 'asc'}, edit: {car: -1}
        };
    },
    componentDidMount: function () {
        this.loadCarsFromServer();
        setInterval(this.loadCarsFromServer, this.props.pollInterval);

    },
    render: function () {
        var divstyle = {position: 'fixed', left: '23%', top: '10%', overflow: 'auto', height: '1000px', width: '50%'};
        var filtered = getFiltered(this.state.data, this.state.filter, this.state.order);
        //window.alert(this.props.user_id


        return (
            <div className="commentBox" style={divstyle}>

                <h1>Available Cars</h1>
                <CarList data={filtered}
                         onCarDelete={this.handleCarDelete}
                         onCarFlagEdit={this.handleCarEditFlag}
                         carEditFlag={this.state.edit.car}
                         user_type='simple'
                         user_id={this.props.user_id}
                />
                <CarSearchForm onCarSearchSubmit={this.handleCarSearchSubmit}
                               user_district={this.props.user_district}
                               user_id={this.props.user_id}
                />
            </div>
        );
    }






});


var CarList = React.createClass({
    render: function() {
        var onCarDelete =  this.props.onCarDelete;
        var onCarFlagEdit = this.props.onCarFlagEdit;
        var carEditFlag = this.props.carEditFlag;
        var user_type = this.props.user_type;
        var user_id = this.props.user_id;
        var carNodes = this.props.data.map(function (car){
            var div_state = 'add'
            if (carEditFlag==car.car_id) div_state = 'edit'
            return (

                <Car key = {car.car_id}
                     car_id = {car.car_id}
                     car_brand = {car.car_brand}
                     car_model = {car.car_model}
                     car_year =  {car.car_year}
                     car_fuel_type =  {car.car_fuel_type}
                     car_price = {car.car_price}
                     car_district = {car.car_district}
                     car_picture = {car.car_picture}
                     car_kilometer = {car.car_kilometer}
                     car_user_id = {car.user_id}
                     onCarDelete = {onCarDelete}
                     onCarFlagEdit =   {onCarFlagEdit}
                     div_state = {div_state}
                     user_type = {user_type}
                     user_id = {user_id}

                />

            );
        });
        return (
            <div className="carList">

                {carNodes}

            </div>
        );
    }
});


var Car = React.createClass({


    getInitialState: function () {
        return {current_state: "add"};
    },


    handleEdit : function (e){
        e.preventDefault();
        this.props.onCarFlagEdit(this.props.car_id);
    },

    handleDelete : function (e){

        e.preventDefault();
        this.props.onCarDelete(this.props.car_id);
    },



render: function(){

    var divstyle = {border: '1px solid green', height: '250px', width : '645px'};
    if (this.props.div_state == "edit")
        divstyle = {border: '2px solid red', height: '250px', width: '645px'};


    var picstyle = {position: 'relative' , left: '50%', top: '-210px', height : '200px', width: '300px', bgcolor : 'red', border: '1px solid black' }
    var picstyleUser = {position: 'relative' , left: '50%', top: '-155px', height : '200px', width: '300px', bgcolor : 'red',border: '1px solid black' }
    var buttonstyle = {width: '150px'}

    if (this.props.user_type == 'Dealer'&& this.props.user_id == this.props.car_user_id) {
        return (

            <div className="car" style={divstyle}>
                <form className="carForm" onSubmit={this.handleEdit}>
                    <br/>
                    Id: {this.props.car_id}<br/>
                    Brand: {this.props.car_brand}<br/>
                    Model: {this.props.car_model}<br/>
                    Year: {this.props.car_year}<br/>
                    Fuel type: {this.props.car_fuel_type}<br/>
                    Km: {this.props.car_kilometer}<br/>
                    Price: {this.props.car_price}<br/>
                    Location: {this.props.car_district}<br/>
                    Owner: {this.props.car_user_id}<br/>

                    <input type="submit" value="Edit" style={buttonstyle}/>
                </form>
                <form className="carForm" onSubmit={this.handleDelete}>

                    <input type="submit" value="Delete" style={buttonstyle}/>
                </form>
                <form className="setDealership"
                      action = "/set_dealerships"
                      method = "post"
                      >
                    <input type ="hidden" name = "car_id" value = {this.props.car_id} />
                    <input type = "submit" value = "Insert Dealership" style = {buttonstyle} />
                </form>



                <img src={this.props.car_picture} style={picstyle}/>


            </div>
        );
    }
    else{
        return (

            <div className="car" style={divstyle}>
                <form className="carForm" onSubmit={this.handleDelete}>
                    <br/>
                    Id: {this.props.car_id}<br/>
                    Brand: {this.props.car_brand}<br/>
                    Model: {this.props.car_model}<br/>
                    Year: {this.props.car_year}<br/>
                    Fuel type: {this.props.car_fuel_type}<br/>
                    Km: {this.props.car_kilometer}<br/>
                    Price: {this.props.car_price}<br/>
                    Location: {this.props.car_district}<br/>
                    Owner: {this.props.car_user_id}<br/>

                </form>



                <img src={this.props.car_picture} style={picstyleUser}/>


            </div>
        );
    }

}
});




var CarSearchForm = React.createClass({
    getInitialState: function(){
        return {car_brand: '',car_model:'', car_min_price:'0', car_max_price : '10000000000000000',
            car_min_kilometer: '0',car_max_kilometer: '10000000000000000',car_district: '' ,car_fuel_type:'',user_id:'0' ,car_order:'asc', search_type:'car_id'};
    },
    handleUserIdChange: function (e){
        this.setState({user_id: e.target.value});
    },
    handleBrandChange: function (e){
        this.setState({car_brand: e.target.value});
    },
    handleModelChange: function (e){
        this.setState({car_model: e.target.value});
    },
    handleMinPriceChange: function (e){
        this.setState({car_min_price: e.target.value});
    },
    handleMaxPriceChange: function (e){
        this.setState({car_max_price: e.target.value});
    },
    handleMinKilometerChange: function (e){
        this.setState({car_min_kilometer: e.target.value});
    },
    handleMaxKilometerChange: function (e){
        this.setState({car_max_kilometer: e.target.value});
    },
    handleDistrictChange: function (e){
        this.setState({car_district: e.target.value});
    },
    handleFuel_typeChange: function (e){
        this.setState({car_fuel_type: e.target.value});
    },
    handleOrderChange: function (e){
        this.setState({car_order: e.target.value});
    },
    handleSearchTypeChange: function (e){
        this.setState({search_type: e.target.value});
    },
    handleSubmit: function(e){
        e.preventDefault();
        var car_brand = 		this.state.car_brand.trim();
        var car_model =			this.state.car_model.trim();
        var car_min_price = 	this.state.car_min_price.trim();
        var car_max_price = 	this.state.car_max_price.trim();
        var car_min_kilometer = this.state.car_min_kilometer.trim();
        var car_max_kilometer = this.state.car_max_kilometer.trim();
        var car_district = 		this.state.car_district.trim();
        var car_fuel_type = 	this.state.car_fuel_type.trim();
        var car_order=          this.state.car_order.trim();
        var search_type=        this.state.search_type.trim();
        var user_id=            this.state.user_id.trim();
        if(!car_brand)car_brand ='';
        if(!car_model)car_model='';
        if(!car_min_price)car_min_price='0';
        if(!car_max_price)car_max_price='10000000000000000';
        if(!car_min_kilometer)car_min_kilometer='0';
        if(!car_max_kilometer)car_max_kilometer='10000000000000000';
        if(!car_district)car_district='';
        if(!car_fuel_type)car_fuel_type='';
        if(car_min_price<0)car_min_price =0;
        if(car_max_price<0)car_max_price=0;
        if(car_min_kilometer<0)car_min_kilometer=0;
        if(car_max_kilometer<0)car_max_kilometer=0;
        if(!car_order)car_order = 'asc';
        if(!search_type)search_type = 'car_id';
        if(!user_id)user_id = '0';
        //window.alert(car_order);


        this.props.onCarSearchSubmit ({car_brand: car_brand, car_model: car_model,
            car_min_price: car_min_price, car_max_price: car_max_price, car_min_kilometer: car_min_kilometer,
            car_max_kilometer: car_max_kilometer, car_district: car_district, car_fuel_type: car_fuel_type,user_id:user_id ,car_order:car_order, search_type:search_type});
        /*this.setState ({car_brand: '',car_model:'', car_min_price:'0', car_max_price : '10000000000000000',
            car_min_kilometer: '0',car_max_kilometer: '10000000000000000',car_district: '' ,car_fuel_type:'', car_order: car_order,search_type: search_type});*/
    },
    handleNearMeSubmit: function(e){
        //window.alert(this.props.user_district);
        e.preventDefault();
        var car_brand = 		this.state.car_brand.trim();
        var car_model =			this.state.car_model.trim();
        var car_min_price = 	this.state.car_min_price.trim();
        var car_max_price = 	this.state.car_max_price.trim();
        var car_min_kilometer = this.state.car_min_kilometer.trim();
        var car_max_kilometer = this.state.car_max_kilometer.trim();
        var car_district = 		this.props.user_district.trim();
        var car_fuel_type = 	this.state.car_fuel_type.trim();
        var car_order=          this.state.car_order.trim();
        var search_type=        this.state.search_type.trim();
        var user_id=            this.state.user_id.trim();
        if(!car_brand)car_brand ='';
        if(!car_model)car_model='';
        if(!car_min_price)car_min_price='0';
        if(!car_max_price)car_max_price='10000000000000000';
        if(!car_min_kilometer)car_min_kilometer='0';
        if(!car_max_kilometer)car_max_kilometer='10000000000000000';
        if(!car_district)car_district='';
        if(!car_fuel_type)car_fuel_type='';
        if(car_min_price<0)car_min_price =0;
        if(car_max_price<0)car_max_price=0;
        if(car_min_kilometer<0)car_min_kilometer=0;
        if(car_max_kilometer<0)car_max_kilometer=0;
        if(!car_order)car_order = 'asc';
        if(!search_type)search_type = 'car_id';
        if(!user_id) user_id = '0';
        //window.alert(car_order);


        this.props.onCarSearchSubmit ({car_brand: car_brand, car_model: car_model,
            car_min_price: car_min_price, car_max_price: car_max_price, car_min_kilometer: car_min_kilometer,
            car_max_kilometer: car_max_kilometer, car_district: car_district, car_fuel_type: car_fuel_type,user_id:user_id , car_order:car_order, search_type:search_type});
        /*this.setState ({car_brand: '',car_model:'', car_min_price:'0', car_max_price : '10000000000000000',
         car_min_kilometer: '0',car_max_kilometer: '10000000000000000',car_district: '' ,car_fuel_type:'', car_order: car_order,search_type: search_type});*/
    },

    handleMyCarsSubmit: function(e){
        //window.alert(this.props.user_district);
        e.preventDefault();
        var car_brand = 		this.state.car_brand.trim();
        var car_model =			this.state.car_model.trim();
        var car_min_price = 	this.state.car_min_price.trim();
        var car_max_price = 	this.state.car_max_price.trim();
        var car_min_kilometer = this.state.car_min_kilometer.trim();
        var car_max_kilometer = this.state.car_max_kilometer.trim();
        var car_district = 		this.state.car_district.trim();
        var car_fuel_type = 	this.state.car_fuel_type.trim();
        var car_order=          this.state.car_order.trim();
        var search_type=        this.state.search_type.trim();
        var user_id=            this.props.user_id.trim();
        if(!car_brand)car_brand ='';
        if(!car_model)car_model='';
        if(!car_min_price)car_min_price='0';
        if(!car_max_price)car_max_price='10000000000000000';
        if(!car_min_kilometer)car_min_kilometer='0';
        if(!car_max_kilometer)car_max_kilometer='10000000000000000';
        if(!car_district)car_district='';
        if(!car_fuel_type)car_fuel_type='';
        if(car_min_price<0)car_min_price =0;
        if(car_max_price<0)car_max_price=0;
        if(car_min_kilometer<0)car_min_kilometer=0;
        if(car_max_kilometer<0)car_max_kilometer=0;
        if(!car_order)car_order = 'asc';
        if(!search_type)search_type = 'car_id';
        if(!user_id) user_id = '0';
        this.setState({user_id: this.props.user_id.trim()})


        this.props.onCarSearchSubmit ({car_brand: car_brand, car_model: car_model,
            car_min_price: car_min_price, car_max_price: car_max_price, car_min_kilometer: car_min_kilometer,
            car_max_kilometer: car_max_kilometer, car_district: car_district, car_fuel_type: car_fuel_type,user_id:user_id , car_order:car_order, search_type:search_type});
        /*this.setState ({car_brand: '',car_model:'', car_min_price:'0', car_max_price : '10000000000000000',
         car_min_kilometer: '0',car_max_kilometer: '10000000000000000',car_district: '' ,car_fuel_type:'', car_order: car_order,search_type: search_type});*/
    },







    handleResetFilter: function (e){
        e.preventDefault();
        //window.alert("Alert");
        this.props.onCarSearchSubmit ({car_brand: '',car_model:'', car_min_price:'0', car_max_price : '10000000000000000',
            car_min_kilometer: '0',car_max_kilometer: '10000000000000000',car_district: '' ,car_fuel_type:'',user_id:'0' , car_order:'asc', search_type:'car_id'});
        this.setState ({car_brand: '',car_model:'', car_min_price:'0', car_max_price : '10000000000000000',
          car_min_kilometer: '0',car_max_kilometer: '10000000000000000',car_district: '' ,car_fuel_type:'',user_id:'0' , car_order:'asc', search_type:'car_id'});
    },
    render: function(){


        var divStyle = {position: 'fixed', left : '1%', top: '10%', overflow:'auto', height: '1000px' ,width: '21%'};
        var buttonStyle = {width: '150px'};

        return (
            <div className = 'carSearchForm' style = {divStyle}>

                <form className = "carSearchForm" onSubmit = {this.handleSubmit} >
                    <h3> Search Criteria:</h3>
                    Owner:<br/>
                    <input
                        type = "text"
                        placeholder = "Owner"
                        value = {this.state.user_id}
                        onChange = {this.handleUserIdChange}
                    /><br/>
                    Brand:<br/>
                    <input
                        type = "text"
                        placeholder = "Brand"
                        value = {this.state.car_brand}
                        onChange = {this.handleBrandChange}
                    /><br/>
                    Model:<br/>
                    <input
                        type = "text"
                        placeholder = "Model"
                        value = {this.state.car_model}
                        onChange = {this.handleModelChange}
                    /><br/>
                    Minimum Price:<br/>
                    <input
                        type = "text"
                        placeholder = "0"
                        value = {this.state.car_min_price}
                        onChange = {this.handleMinPriceChange}
                    /><br/>
                    Maximum Price:<br/>
                    <input
                        type = "text"
                        placeholder = "1000000000"
                        value = {this.state.car_max_price}
                        onChange = {this.handleMaxPriceChange}
                    /><br/>
                    Minimum Kilometers:<br/>
                    <input
                        type = "text"
                        placeholder = "0"
                        value = {this.state.car_min_kilometer}
                        onChange = {this.handleMinKilometerChange}
                    /><br/>
                    Maximum Kilometers:<br/>
                    <input
                        type = "text"
                        placeholder = "10000000000"
                        value = {this.state.car_max_kilometer}
                        onChange = {this.handleMaxKilometerChange}
                    /><br/>
                    District:<br/>
                    <input
                        type = "text"
                        placeholder = "District"
                        value = {this.state.car_district}
                        onChange = {this.handleDistrictChange}
                    /><br/>
                    Fuel type:<br/>
                    <select name="fuel_type" value = {this.state.car_fuel_type}
                            onChange = {this.handleFuel_typeChange} style =  {buttonStyle}>
                        <option value=" ">Any</option>
                        <option value="Gasoline" >Gasoline</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electric">Electric</option>
                        <option value="Other">Other</option>

                    </select><br/>
                    Order:<br/>
                    <select name="order_type" value = {this.state.car_order}
                            onChange = {this.handleOrderChange} style =  {buttonStyle}>
                        <option value="asc" >Ascending</option>
                        <option value="des">Descending</option>


                    </select><br/>
                    Search Criteria:<br/>
                    <select name="fuel_type" value = {this.state.search_type}
                            onChange = {this.handleSearchTypeChange} style =  {buttonStyle}>

                        <option value="car_id" >id</option>
                        <option value="car_brand">Brand</option>
                        <option value="car_model">Model</option>
                        <option value="car_year">Year</option>
                        <option value="car_price">Price</option>
                        <option value="car_kilometer">Kilometer</option>
                        <option value="car_district">District</option>
                        <option value="car_fuel_type">Fuel Type</option>
                        <option value="user_id">User Id</option>

                    </select><br/><br/>
                    <input type = "submit" value="Search and Destroy" style =  {buttonStyle}/>
                </form>
                <br/>

                <form className = "carSearchNearMeForm" onSubmit = {this.handleNearMeSubmit} >
                    <input type = "submit" value="Search Near Me" style =  {buttonStyle}/>
                </form>
                <br/>

                <form className = "carSearchMineForm" onSubmit = {this.handleMyCarsSubmit} >
                    <input type = "submit" value="My Cars" style =  {buttonStyle}/>
                </form>
                <br/>



                <form className = "carSearhcResetForm" onSubmit = {this.handleResetFilter} >
                    <input type = "submit" value="Reset" style =  {buttonStyle}/>
                </form>
                <br/>

                <form action="/dealerships">
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
    <CarBox url="/set_cars_react"
            pollInterval = {10000}
            user_district = {document.getElementById('content').getAttribute('user_district')}
            user_type =     {document.getElementById('content').getAttribute('user_type')}
            user_id =       {document.getElementById('content').getAttribute('user_id')}
    		dealership_id=  {document.getElementById('content').getAttribute('dealership_id')}
              />,

    document.getElementById('content')
);
