/**
 * Created by mgreis on 30-03-2016.
 */





var CarBox =  React.createClass({
    render: function(){

        return (
            <CarSearchForm data = {this.props.data} />
        );


    }


});




var CarSearchForm = React.createClass({
    getInitialState: function(){
        return {car_id:         this.props.data.car_id,
                car_brand:      this.props.data.car_brand,
                car_model:      this.props.data.car_model,
                car_year:       this.props.data.car_year,
                car_kilometer:  this.props.data.kilometer,
                car_fuel_type:  this.props.data.car_fuel_type,
                car_price:      this.props.data.car_price,
                car_district:   this.props.data.car_district,
                car_picture:    this.props.data.car_picture}

    },
    handleBrandChange: function (e){
        this.setState({car_brand: e.target.value});
    },
    handleModelChange: function (e){
        this.setState({car_model: e.target.value});
    },
    handleYearChange: function (e){
        this.setState({car_year: e.target.value});
    },
    handlePriceChange: function (e){
        this.setState({car_price: e.target.value});
    },
    handlePictureChange: function (e){
        this.setState({car_picture: e.target.value});
    },
    handleKilometerChange: function (e){
        this.setState({car_kilometer: e.target.value});
    },
    handleDistrictChange: function (e){
        this.setState({car_district: e.target.value});
    },
    handleFuel_typeChange: function (e){
        this.setState({car_fuel_type: e.target.value});
    },
    handleSubmit: function(e){
        e.preventDefault();
        e.preventDefault();
        var car_brand = 		this.state.car_brand.trim();
        var car_model =			this.state.car_model.trim();
        var car_year = 			this.state.car_year.trim();
        var car_price = 		this.state.car_price.trim();
        var car_picture = 		this.state.car_picture.trim();
        var car_kilometer = 	this.state.car_kilometer.trim();
        var car_district = 		this.state.car_district.trim();
        var car_fuel_type = 	this.state.car_fuel_type.trim();
        if(!car_brand)car_brand         = this.props.data.car_brand;
        if(!car_model)car_model         = this.props.data.car_model;
        if(!car_price)car_price         = this.props.data.car_price;
        if(!car_year)car_year           = this.props.data.car_year;
        if(!car_picture)car_picture     = this.props.data.car_picture;
        if(!car_kilometer)car_kilometer = this.props.data.car_kilometer;
        if(!car_district)car_district   = this.props.data.car_district;
        if(!car_fuel_type)car_fuel_type = this.props.data.car_fuel_type;
        if(isNaN(parseint(car_kilometer)))  car_kilometer       = this.props.data.car_kilometer;
        if(isNaN(parseint(car_price)))      car_price           = this.props.data.car_price;
        if(isNaN(parseint(car_year)))       car_year            = this.props.data.car_year;
        if(car_price<0)car_price        = this.props.data.car_price;
        if(car_year<1900)car_year  = this.props.data.car_year;
        if(car_kilometer<0)car_kilometer= this.props.data.car_kilometer;

        this.props.onCarSearchSubmit ({car_brand: car_brand, car_model: car_model,
            car_min_price: car_min_price, car_max_price: car_max_price, car_min_kilometer: car_min_kilometer,
            car_max_kilometer: car_max_kilometer, car_district: car_district, car_fuel_type: car_fuel_type, car_order:car_order});
        this.setState ({car_brand: '',car_model:'', car_min_price:'0', car_max_price : '10000000000000000',
            car_min_kilometer: '0',car_max_kilometer: '10000000000000000',car_district: '' ,car_fuel_type:'', car_order: 'asc'});
    },
    handleResetFilter: function (e){
        e.preventDefault();
        this.props.onCarSearchSubmit ({car_brand: '',car_model:'', car_min_price:'0', car_max_price : '10000000000000000',
            car_min_kilometer: '0',car_max_kilometer: '10000000000000000',car_district: '' ,car_fuel_type:'',car_order:'asc'});
        this.setState ({car_brand: '',car_model:'', car_min_price:'0', car_max_price : '10000000000000000',
            car_min_kilometer: '0',car_max_kilometer: '10000000000000000',car_district: '' ,car_fuel_type:'',car_order:'asc'});
    },
    render: function(){


        var divStyle = {position: 'fixed', left : '1%', top: '10%', overflow:'scroll', height: '1000px' ,width: '21%'};
        var buttonStyle = {width: '150px'};

        return (
            <div className = 'carForm' style = {divStyle}>

                <form className = "carSearchForm" onSubmit = {this.handleSubmit} >
                    <h3> Search Criteria:</h3>


                    Brand:<br/>
                    <input
                        type = "text"
                        placeholder = {this.props.data.car_brand}
                        value = {this.state.car_brand}
                        onChange = {this.handleBrandChange}
                    /><br/>
                    Model:<br/>
                    <input
                        type = "text"
                        placeholder = {this.props.data.car_model}
                        value = {this.state.car_model}
                        onChange = {this.handleModelChange}
                    /><br/>
                    Minimum Price:<br/>
                    <input
                        type = "text"
                        placeholder = {this.props.data.car_price}
                        value = {this.state.car_min_price}
                        onChange = {this.handleMinPriceChange}
                    /><br/>
                    Maximum Price:<br/>
                    <input
                        type = "text"
                        placeholder = {this.props.data.car_brand}
                        value = {this.state.car_max_price}
                        onChange = {this.handleMaxPriceChange}
                    /><br/>
                    Minimum Kilometers:<br/>
                    <input
                        type = "text"
                        placeholder = {this.props.data.car_brand}
                        value = {this.state.car_min_kilometer}
                        onChange = {this.handleMinKilometerChange}
                    /><br/>
                    Maximum Kilometers:<br/>
                    <input
                        type = "text"
                        placeholder = {this.props.data.car_brand}
                        value = {this.state.car_max_kilometer}
                        onChange = {this.handleMaxKilometerChange}
                    /><br/>
                    District:<br/>
                    <input
                        type = "text"
                        placeholder = {this.props.data.car_brand}
                        value = {this.state.car_district}
                        onChange = {this.handleDistrictChange}
                    /><br/>
                    Fuel type:<br/>
                    <select name="fuel_type" value = {this.state.car_fuel_type}
                            onChange = {this.handleFuel_typeChange} style =  {buttonStyle} >
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


                    </select><br/><br/>

                    <input type = "submit" value="Search and Destroy" style =  {buttonStyle}/>
                </form>
                <br/>
                <form className = "carSearchForm" onSubmit = {this.handleResetFilter} >
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
    <CarBox url="/editCarInfo" data = {data} />,

    document.getElementById('content')
)