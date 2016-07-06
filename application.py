from flask import Flask, request, render_template, session, redirect, Response, send_file, flash

from sqlalchemy import and_, __version__

import database
from models import Car, User, Dealership
import os
import json
import base64
import uuid
import boto3


application = app = Flask(__name__)
app.secret_key = os.urandom(64)
db_instance = database.init_db()

print("SQLAlchemy version: "+__version__)


def do_the_login():
    """does somethin"""
    return "POST"


def log_user_in(email):
    if 'email' in session:
        return render_template("main.html", name=email)
    else:
        return redirect('/')


def show_the_login():
    return "GET"


def valid_login(user_email, user_password):
    for instance in \
            db_instance.query(User).filter(and_(User.user_email == user_email, User.user_password == user_password)):
        session['user_district'] = instance.user_district
        session['user_type'] = instance.user_type
        session['user_id'] = instance.user_id
        session['email'] = user_email
        return True
    
    return False


def get_cars():
    all_cars = []
    for instance in db_instance.query(Car):
            all_cars.append (instance.__repr__())
            
    string = "[ " + " , ".join(all_cars) + " ]"
    print(string)
        
    return Response(string, mimetype='application/json',
                    headers={'Cache-Control': 'no-cache', 'Access-Control-Allow-Origin': '*'})

def get_cars_in_dealership():
    id_dealer = session.get('dealership_id')
    print ("DEEEAAAAALER" + id_dealer)
    dealer_cars = []
                     
    for instance in db_instance.query(Dealership).filter(Dealership.dealership_id == id_dealer):
        aux = instance.dealership_cars
        for cars in aux:
           dealer_cars.append(cars.__repr__())
    
    string =  "[ " + " , ".join(dealer_cars) + " ]"  
    print (string)
     
    return Response(string, mimetype='application/json',
                    headers={'Cache-Control': 'no-cache', 'Access-Control-Allow-Origin': '*'})


 

def get_dealerships():
    all_dealerships = []
    for instance in db_instance.query(Dealership):
            all_dealerships.append (instance.__repr__())
            
    string =  "[ " + " , ".join(all_dealerships) + " ]" 
    print (string)
        
    return Response(string, mimetype='application/json',
                    headers={'Cache-Control': 'no-cache', 'Access-Control-Allow-Origin': '*'})


def get_dealerships_in_car(car_id):
    all_dealerships = []
   
    
    for instance in db_instance.query(Car).filter(car_id==Car.car_id):
        aux = instance.dealerships
        for dealership in aux:
            all_dealerships.append(dealership.__repr__())
        
            
        
        
        string =  "[ " + " , ".join(all_dealerships) + " ]"          
        print (string)
        return Response(string, mimetype='application/json', headers={'Cache-Control': 'no-cache', 'Access-Control-Allow-Origin': '*'}) 
    return []


def compare_arrays(car_id):
    original_array=[]
    for instance in db_instance.query(Dealership):
            original_array.append (instance)
    
    filtered_array=[]
    for instance in db_instance.query(Car).filter(car_id==Car.car_id):
        aux = instance.dealerships
        for dealership in aux:    
            filtered_array.append(dealership)
    final_array=[]
    for i in original_array:
        flag = False
        for j in filtered_array:
            if (i.dealership_id == j.dealership_id):
                element = ("{\"dealership_id\" : \"%s\",\"user_id\" : \"%s\",\"dealership_name\" : \"%s\","
                " \"dealership_email\" : \"%s\", \"dealership_url\" : \"%s\" , \"dealership_phone\" : \"%s\","
                "\"dealership_picture\": \"%s\", \"dealership_district\" : \"%s\", \"selected\": \"%s\" }") %(   i.dealership_id,
                                              i.user_id,
                                              i.dealership_name,
                                              i.dealership_email,
                                              i.dealership_url,
                                              i.dealership_phone,
                                              i.dealership_picture,
                                              i.dealership_district,
                                              "selected")
                final_array.append(element)
                flag = True
                break
        if (flag == False):
            
            element = ("{\"dealership_id\" : \"%s\",\"user_id\" : \"%s\",\"dealership_name\" : \"%s\","
            " \"dealership_email\" : \"%s\", \"dealership_url\" : \"%s\" , \"dealership_phone\" : \"%s\","
            "\"dealership_picture\": \"%s\", \"dealership_district\" : \"%s\", \"selected\" : \"%s\" }") %(   i.dealership_id,
                                          i.user_id,
                                          i.dealership_name,
                                          i.dealership_email,
                                          i.dealership_url,
                                          i.dealership_phone,
                                          i.dealership_picture,
                                          i.dealership_district,
                                          "deselected")
            final_array.append(element)
                
                
                
    
    string =  "[ " + " , ".join(final_array) + " ]" 
    return Response(string, mimetype='application/json', headers={'Cache-Control': 'no-cache', 'Access-Control-Allow-Origin': '*'})
    


def decodeImage(img):
    string = img[img.find(",")+1:]
    filename = "images/"+ str(uuid.uuid4())+".jpg"
    with open(filename, 'wb') as f:
        f.write(base64.b64decode(string))   
    return filename

def decodeImageBoto3 (img):
    string = img[img.find(",")+1:]
    filename = "images/"+ str(uuid.uuid4())+".jpg"
    s3 = boto3.resource('s3')

    s3.Bucket('eu-west-1-mgreis-es-instance1').put_object(Key=filename, Body=base64.b64decode(string))


    return "https://s3-eu-west-1.amazonaws.com/eu-west-1-mgreis-es-instance1/"+filename

def deleteImageBoto3 (url):
    s3 = boto3.resource('s3')
    filename = url.replace( "https://s3-eu-west-1.amazonaws.com/eu-west-1-mgreis-es-instance1/" ,"")
    print (filename)
    s3.Object('eu-west-1-mgreis-es-instance1',filename).delete()


@app.route('/')
def main (name = None):
    return render_template ('login.html')


@app.route ('/carInfo')    
def car_info():
    if 'email' in session:    
        """mudar id do car"""
        for instance in db_instance.query(Car).filter(Car.car_id == "1"):
            temp = instance.car_brand
        return render_template ('carInfo.html', car_brand = temp, car_id = instance.car_id)
    else:
        return redirect('/')


@app.route ('/cars')
def cars():
    if 'email' in session:
        
        return render_template ('cars.html',
                                user_type = session.get('user_type'),
                                user_district = session.get('user_district'),
                                 user_id = session.get('user_id'))
    else:
        return redirect('/')
  
@app.route ('/car_react', methods = ['GET', 'POST' , 'DELETE' ,'PUT'])
def car_react():
    error = None
    if 'email' in session:
        if request.method =='GET':
            return get_cars()
            
        if request.method == 'POST':
            for instance in db_instance.query(User).filter(and_(User.user_email == session.get('email'), User.user_type == 'Dealer')):
                img = request.form['data_uri']
                img_URL = decodeImageBoto3(img)
                car = Car (car_picture =    img_URL,
                                            car_brand = request.form ['car_brand'],
                                            car_model= request.form ['car_model'],
                                            car_price = request.form ['car_price'], 
                                            car_district = request.form ['car_district'], 
                                            car_kilometer = request.form ['car_kilometer'],
                                            car_year = request.form['car_year'],
                                            car_fuel_type = request.form['car_fuel_type']) 
                                       
            
                instance.user_cars.append(car)
                
                db_instance.commit()
            
            return get_cars()
        
        if request.method == 'DELETE':
            car_id = request.form['car_id']
            
            for instance in db_instance.query(User).filter(User.user_email == session.get('email')):
                car =db_instance.query(Car).filter(and_(Car.car_id == car_id), (instance.user_id == Car.user_id)).first()

                deleteImageBoto3(car.car_picture)

                db_instance.query(Car).filter(and_(Car.car_id == car_id), (instance.user_id == Car.user_id)).delete()
                
                db_instance.commit()
                
            return get_cars()
        
        if request.method == 'PUT':
            print("1")
            for instance in db_instance.query(User).filter(User.user_email == session.get('email')):
                print("2")
                img = request.form['data_uri']
                print (img)
                picture = request.form['car_picture']
                print(picture)
                if img == picture:
                    print("NOT")
                    car = Car (
                               car_picture = request.form ['car_picture'],
                               car_brand = request.form ['car_brand'],
                               car_model= request.form ['car_model'],
                               car_price = request.form ['car_price'], 
                               car_district = request.form ['car_district'], 
                               car_kilometer = request.form ['car_kilometer'],
                               car_year = request.form['car_year'],
                               car_fuel_type = request.form['car_fuel_type']) 
                    car_id = request.form['car_id']                   
                    db_instance.query(Car).filter(and_(Car.car_id == car_id, instance.user_id == Car.user_id)).update({
                                                                            "car_brand":        car.car_brand,
                                                                            "car_model":        car.car_model,
                                                                            "car_price" :       car.car_price,
                                                                            "car_picture":      car.car_picture,
                                                                            "car_district":     car.car_district,
                                                                            "car_kilometer":    car.car_kilometer,
                                                                            "car_year":         car.car_year,
                                                                            "car_fuel_type":    car.car_fuel_type})
                    
                else:
                    print("NEW")
                    img_URL = decodeImageBoto3(img)
                    car = Car(
                               car_picture = img_URL,
                               car_brand = request.form ['car_brand'],
                               car_model= request.form ['car_model'],
                               car_price = request.form ['car_price'], 
                               car_district = request.form ['car_district'], 
                               car_kilometer = request.form ['car_kilometer'],
                               car_year = request.form['car_year'],
                               car_fuel_type = request.form['car_fuel_type']) 
                    car_id = request.form['car_id']                   
                    db_instance.query(Car).filter(and_(Car.car_id == car_id, instance.user_id == Car.user_id)).update({
                                                                            "car_brand":        car.car_brand,
                                                                            "car_model":        car.car_model,
                                                                            "car_price" :       car.car_price,
                                                                            "car_picture":      car.car_picture,
                                                                            "car_district":     car.car_district,
                                                                            "car_kilometer":    car.car_kilometer,
                                                                            "car_year":         car.car_year,
                                                                            "car_fuel_type":    car.car_fuel_type})
            print("2")
            db_instance.commit()
            print("3")
            return get_cars();
        
        
    else: 
        error = 'Session Expired!'
        return render_template ("login.html", error = error)


@app.route ('/commit_dealership', methods = ['GET', 'POST'])
def insert_dealership_into_database():
    error = None
    print ('1')
    if 'email' in session:
        print ('2')
        if request.method == 'POST':
            print ('3')
            for instance in db_instance.query(User).filter(and_(User.user_email == session.get('email'), User.user_type == 'Dealer')):
                print ('4')
                dealer = Dealership (dealership_name = request.form['name'],
                                    dealership_email     = request.form ['email'],
                                    dealership_url       = request.form  ['uri'],
                                    dealership_phone     = request.form ['phone'],
                                    dealership_picture   = request.form ['picture'],
                                    dealership_district  = request.form['district'])
                print (dealer)
                instance.user_dealerships.append(dealer)
                db_instance.add(dealer)
            db_instance.commit() 
            return redirect ('/dealerships')
            
    else: 
        error = 'Session Expired!'
        return render_template ("login.html", error = error) 
    
        
@app.route ('/commit_register', methods = ['GET', 'POST'])
def commit_register():
    error = None
    if request.method == 'POST':
        u = User (request.form ['name'], request.form['email'], request.form['password'], request.form['district'], request.form['user_type'])
        for instance in db_instance.query(User).filter(User.user_email == request.form['email']):
            error = "Email already exists!!!"
            return render_template ('login.html', error = error)
            
        db_instance.add(u)
        db_instance.commit()
        error = "User successfully registered"
    return render_template ('login.html', error = error)


@app.route ('/dealership_react', methods = ['GET', 'POST' , 'DELETE' ,'PUT'])
def dealership_react():
    error = None
    if 'email' in session:
        if request.method =='GET':
            return get_dealerships()
            
        if request.method == 'POST':
            for instance in db_instance.query(User).filter(and_(User.user_email == session.get('email'), User.user_type == 'Dealer')):
                img = request.form['data_uri']
                img_URL = decodeImageBoto3(img)
                exp =Dealership (
                                 dealership_name = 'dealership_name',
                                          dealership_email=     'dealership_email',
                                          dealership_url  =     'dealership_url',
                                          dealership_phone=     'dealership_phone',
                                          dealership_picture =    'dealership_img',
                                          dealership_district=  'dealership_district' )
                
                dealership = Dealership (
                                          dealership_name =     request.form ['dealership_name'],
                                          dealership_email=     request.form ['dealership_email'],
                                          dealership_url  =     request.form ['dealership_url'],
                                          dealership_phone=     request.form ['dealership_phone'],
                                          dealership_picture =    img_URL,
                                          dealership_district=  request.form ['dealership_district'] ) 

                                       
               
                instance.user_dealerships.append(dealership)
            
            db_instance.commit()
            
            return get_dealerships()
        
        if request.method == 'DELETE':
            dealership_id = request.form['dealership_id']
            
            for instance in db_instance.query(User).filter(User.user_email == session.get('email')):
                dealership = db_instance.query(Dealership).filter(and_(Dealership.dealership_id == dealership_id), (instance.user_id == Dealership.user_id)).first()

                deleteImageBoto3(dealership.car_picture)
                
                db_instance.query(Dealership).filter(and_(Dealership.dealership_id == dealership_id), (instance.user_id == Dealership.user_id)).delete()

                db_instance.commit()
                
            return get_dealerships()
        
        if request.method == 'PUT':
            print("1")
            for instance in db_instance.query(User).filter(User.user_email == session.get('email')):
                print("2")
                img = request.form['data_uri']
                
                picture = request.form['dealership_picture']
                
                if img == picture:
                    print("NOT")
                    dealership = Dealership (
                               dealership_picture =     request.form['dealership_picture'],
                               dealership_name =        request.form ['dealership_name'],
                               dealership_email=        request.form ['dealership_email'],
                               dealership_url  =        request.form ['dealership_url'],
                               dealership_phone=        request.form ['dealership_phone'],
                               dealership_district=        request.form ['dealership_district'] ) 
                    dealership_id = request.form['dealership_id']                   
                    db_instance.query(Dealership).filter(and_(Dealership.dealership_id == dealership_id, instance.user_id == Dealership.user_id)).update({
                                                                            "dealership_name":    dealership.dealership_name,
                                                                            "dealership_picture": dealership.dealership_picture,
                                                                            "dealership_email":   dealership.dealership_email,
                                                                            "dealership_url" :    dealership.dealership_url,
                                                                            "dealership_phone":   dealership.dealership_phone,
                                                                            "dealership_district":   dealership.dealership_district  })
                    
                else:
                    print ("NEW") 
                    img_URL = decodeImageBoto3(img)
                    dealership = Dealership (
                               dealership_picture =     img_URL,
                               dealership_name =        request.form ['dealership_name'],
                               dealership_email=        request.form ['dealership_email'],
                               dealership_url  =        request.form ['dealership_url'],
                               dealership_phone=        request.form ['dealership_phone'],
                               dealership_district=        request.form ['dealership_district'] ) 
                    dealership_id = request.form['dealership_id']                   
                    db_instance.query(Dealership).filter(and_(Dealership.dealership_id == dealership_id, instance.user_id == Dealership.user_id)).update({
                                                                            "dealership_name":    dealership.dealership_name,
                                                                            "dealership_picture": dealership.dealership_picture,
                                                                            "dealership_email":   dealership.dealership_email,
                                                                            "dealership_url" :    dealership.dealership_url,
                                                                            "dealership_phone":   dealership.dealership_phone,
                                                                            "dealership_district":   dealership.dealership_district  })
            print("2")
            db_instance.commit()
            print("3")
            return get_dealerships();
        
        
    else: 
        error = 'Session Expired!'
        return render_template ("login.html", error = error)





























@app.route ('/dealerships')
def dealership():
    if 'email' in session:
        
        return render_template ('dealerships.html',
                                user_type = session.get('user_type'),
                                user_district = session.get('user_district'),
                                 user_id = session.get('user_id'))
    else:
        return redirect('/') 
    
    



























        
@app.route ('/delete_user', methods=['POST'])
def deleteUser():
    error = None
    if 'email' in session:
        for instance in db_instance.query(User).filter(User.user_email == session.get('email')):    
            db_instance.query(User).filter(User.user_id == instance.user_id).delete()
            db_instance.commit() 
            session.pop('email',None)
            error = "User deleted Successfully"
            return render_template('login.html', error = error)
    else:
        error = 'Session Expired!'
        return render_template("login.html", error = error)


@app.route ('/editCarInfo', methods = ['GET', 'POST'])
def edit_car_info():
    error = None
    if 'email' in session:
        if request.method == 'POST':
            car_id = request.form['car_id']
            car_brand = request.form['car_brand']
            """car_model = request.form['car_model']
            car_price = request.form['car_price']
            car_district = request.form['car_district']
            car_kilometer = request.form['car_kilometer']
            car_year = request.form['car_year']
            car_fuel_type = request.form['fuel_type']"""
            for instance in db_instance.query(User).filter(User.user_email == session.get('email')):
                """db_instance.query(Car).filter(Car.id == car_id).update({"brand": car_brand, "model" : car_model, "price" : car_price, "district" : car_disctrict, "kilometer" : car_kilometer, "year" : car_year, "fuel_type" : car_fuel_type})"""
                db_instance.query(Car).filter(Car.user_id == car_id).update({"car_brand": car_brand})
                db_instance.commit()
            return redirect('/carInfo')
        else:
            error = 'Session Expired!'
            return render_template("login.html", error = error)    

@app.route ('/editDealerInfo', methods = ['GET', 'POST'])
def edit_dealer_info():
    error = None
    if 'email' in session:
        if request.method == 'POST':
            for instance in db_instance.query(User).filter(User.user_email == session.get('email')):
                dealer_id = request.form['dealer_id']
                dealer_name = request.form['dealership_name']
                db_instance.query(Dealership).filter(and_(Dealership.dealership_id == dealer_id, Dealership.user_id == instance.user_id)).update({"dealership_name": dealer_name})
                db_instance.commit()
            return redirect ('/main')
        else:
            error = 'Session Expired!'
            return render_template("login.html", error = error)        
    
@app.route ('/editPersonalInfo', methods = ['GET', 'POST'])
def edit_personal_info():
    error = None
    if 'email' in session:
        if request.method == 'POST':
            for instance in db_instance.query(User).filter(User.user_email == session.get('email')):
                instance.name = request.form['name']
                instance.user_district = request.form['district']
            db_instance.commit()
            flash('Personal Info Changed')
            return redirect ('/main')
        else:
            error = 'Session Expired!'
            return render_template("login.html", error = error)
        

@app.route ('/get_cars')
def get_cars_dep():
    if 'email' in session:
        all_cars = []
        for instance in db_instance.query(Car):
            all_cars.append (instance.__repr__())
            
        str =  "[ " + " , ".join(all_cars) + " ]" 
        
        return str
 
@app.route ('/get_allDealers_asc')
def get_allDealers_asc():
    if 'email' in session:
        all_dealers = []
        for instance in db_instance.query(Dealership).order_by(Dealership.dealership_id.asc()):
            """" TODO adicionar carros do concessionario (falta a tabela na BD)"""
            all_dealers.append (instance.__repr__())
        str =  "[ " + " , ".join(all_dealers) + " ]" 
        response = json.loads(str)
        return Response(json.dumps(response), mimetype='application/json', headers={'Cache-Control': 'no-cache', 'Access-Control-Allow-Origin': '*'})       
       
@app.route ('/get_allDealers_desc')
def get_allDealers_desc():
    if 'email' in session:
        all_dealers = []
        for instance in db_instance.query(Dealership).order_by(Dealership.dealership_id.desc()):
            """" TODO adicionar carros do concessionario (falta a tabela na BD)"""
            all_dealers.append (instance.__repr__())
            
        str =  "[ " + " , ".join(all_dealers) + " ]" 
        
        return str        
    
@app.route ('/get_myDealers_asc')
def get_myDealers_asc():
    if 'email' in session:
        my_dealers = []
        for instance in db_instance.query(User).filter(User.user_email == session.get('email')):
            for instance2 in db_instance.query(Dealership).filter(Dealership.user_id == instance.user_id).order_by(Dealership.dealership_id.asc()):
                my_dealers.append (instance2.__repr__())
            
        str =  "[ " + " , ".join(my_dealers) + " ]" 
        
        return str        
       
@app.route ('/get_myDealers_desc')
def get_myDealers_desc():
    if 'email' in session:
        my_dealers = []
        for instance in db_instance.query(User).filter(User.user_email == session.get('email')):
            for instance2 in db_instance.query(Dealership).filter(Dealership.user_id == instance.user_id).order_by(Dealership.dealership_id.desc()):
                my_dealers.append (instance2.__repr__())
            
        str =  "[ " + " , ".join(my_dealers) + " ]" 
        
        return str        
        
@app.route ('/getClients')
def get_clients():
    if 'email' in session:
        listClients = []
        for instance in db_instance.query(User).filter(User.user_email == session.get('email')):
            for instance2 in db_instance.query(User).filter(and_(instance.user_type == 'Dealer', User.user_type == 'User')).order_by(User.user_name.asc()):
                listClients.append (instance2.__repr__())
            
        str =  "[ " + " , ".join(listClients) + " ] }" 
        
        return str      

@app.route ('/getClientsHTML')
def get_clients2():
    if 'email' in session:
        listClients = []
        for instance in db_instance.query(User).filter(User.user_email == session.get('email')):
            for instance2 in db_instance.query(User).filter(and_(instance.user_type == 'Dealer', User.user_type == 'User')).order_by(User.user_name.asc()):
                listClients.append (instance2.__repr__())
                 
                 
        str =  "{ \"users\": [ " + " , " .join(listClients) + " ] }" 
        
        print(str);

        return render_template("clientList.html", response = str)     


@app.route ("/login", methods = ['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        if valid_login(request.form['email'], request.form['password']):
            return log_user_in ( request.form['email'])
        else: 
            error = 'Invalid Email/password'
            return render_template ("login.html", error = error)        
    return redirect('/')


@app.route ('/logout')
def logout():
    session.pop('email',None)
    return redirect('/')


@app.route ('/main', methods=['GET', 'POST'])
def main_menu():
    if 'email' in session:
        return render_template ("main.html", name = session.get('email'),user_type = session.get('type'))
    else:
        return redirect ('/')


@app.route ('/personalInfo', methods = ['GET', 'POST', 'PUT', 'DELETE'])
def personalinfo():
    if 'email' in session:    
        for instance in db_instance.query(User).filter(User.user_email == session.get('email')):
            temp = instance.user_name
            temp2 = instance.user_district
        return render_template ('personalinfo.html', name = temp, district = temp2)
    else:
        return redirect('/')


@app.route('/react')
def react (name = None):
    return render_template ('react.html')
 

@app.route ('/register', methods = ['GET', 'POST'])
def register():
    return render_template ('register.html')


@app.route ('/set_cars', methods = ['POST'])
def set_cars():
    print(1)
    if 'email' in session:
        if request.method == 'POST':
            print(2)
            dealership_id=request.form ['dealership_id']
            session['dealership_id'] = dealership_id
            print (dealership_id)
            print (3)
            return render_template ('set_cars.html',
                                    user_type = session.get('user_type'),
                                    user_district = session.get('user_district'),
                                    user_id = session.get('user_id'),
                                    dealership_id = dealership_id)
                                
    else:
        return redirect('/') 


@app.route ('/set_cars_react', methods = ['GET', 'POST' , 'DELETE' ,'PUT'])
def set_casr_react():
    error = None
    if 'email' in session:
        if request.method =='GET':
            
            return get_cars_in_dealership()
            
        if request.method == 'POST':
            for instance in db_instance.query(User).filter(and_(User.user_email == session.get('email'), User.user_type == 'Dealer')):
                img = request.form['data_uri']
                img_URL = decodeImageBoto3(img)
                car = Car (car_picture =    img_URL,
                                            car_brand = request.form ['car_brand'],
                                            car_model= request.form ['car_model'],
                                            car_price = request.form ['car_price'], 
                                            car_district = request.form ['car_district'], 
                                            car_kilometer = request.form ['car_kilometer'],
                                            car_year = request.form['car_year'],
                                            car_fuel_type = request.form['car_fuel_type']) 
                                       
            
                instance.user_cars.append(car)
                
                db_instance.commit()
            
            return get_cars()
        
        if request.method == 'DELETE':
            car_id = request.form['car_id']
            
            for instance in db_instance.query(User).filter(User.user_email == session.get('email')):
                
                db_instance.query(Car).filter(and_(Car.car_id == car_id), (instance.user_id == Car.user_id)).delete()
                
                db_instance.commit()
                
            return get_cars()
        
        if request.method == 'PUT':
            print("1")
            for instance in db_instance.query(User).filter(User.user_email == session.get('email')):
                print("2")
                img = request.form['data_uri']
                print (img)
                picture = request.form['car_picture']
                print(picture)
                if img == picture:
                    print("NOT")
                    car = Car (
                               car_picture = request.form ['car_picture'],
                               car_brand = request.form ['car_brand'],
                               car_model= request.form ['car_model'],
                               car_price = request.form ['car_price'], 
                               car_district = request.form ['car_district'], 
                               car_kilometer = request.form ['car_kilometer'],
                               car_year = request.form['car_year'],
                               car_fuel_type = request.form['car_fuel_type']) 
                    car_id = request.form['car_id']                   
                    db_instance.query(Car).filter(and_(Car.car_id == car_id, instance.user_id == Car.user_id)).update({
                                                                            "car_brand":        car.car_brand,
                                                                            "car_model":        car.car_model,
                                                                            "car_price" :       car.car_price,
                                                                            "car_picture":      car.car_picture,
                                                                            "car_district":     car.car_district,
                                                                            "car_kilometer":    car.car_kilometer,
                                                                            "car_year":         car.car_year,
                                                                            "car_fuel_type":    car.car_fuel_type})
                    
                else:
                    print ("NEW")    
                    img_URL = decodeImageBoto3(img)
                    car = Car (
                               car_picture = img_URL,
                               car_brand = request.form ['car_brand'],
                               car_model= request.form ['car_model'],
                               car_price = request.form ['car_price'], 
                               car_district = request.form ['car_district'], 
                               car_kilometer = request.form ['car_kilometer'],
                               car_year = request.form['car_year'],
                               car_fuel_type = request.form['car_fuel_type']) 
                    car_id = request.form['car_id']                   
                    db_instance.query(Car).filter(and_(Car.car_id == car_id, instance.user_id == Car.user_id)).update({
                                                                            "car_brand":        car.car_brand,
                                                                            "car_model":        car.car_model,
                                                                            "car_price" :       car.car_price,
                                                                            "car_picture":      car.car_picture,
                                                                            "car_district":     car.car_district,
                                                                            "car_kilometer":    car.car_kilometer,
                                                                            "car_year":         car.car_year,
                                                                            "car_fuel_type":    car.car_fuel_type})
            print("2")
            db_instance.commit()
            print("3")
            return get_cars();
        
        
    else: 
        error = 'Session Expired!'
        return render_template ("login.html", error = error)



@app.route ('/set_dealerships', methods = ['POST'])
def set_dealerships():
    
    if 'email' in session:
        if request.method == 'POST':
        
            car_id=request.form ['car_id']
            session['car_id'] = car_id
            

            return render_template ('set_dealerships.html',
                                    user_type = session.get('user_type'),
                                    user_district = session.get('user_district'),
                                    user_id = session.get('user_id'),
                                    car_id = car_id)
                                
    else:
        return redirect('/') 
    


@app.route ('/set_dealerships_react', methods = ['GET', 'POST' , 'DELETE' ,'PUT'])
def set_dealerships_react():
    error = None
    if 'email' in session:
        
        if request.method =='GET':
            car_id = session.get('car_id')
            return compare_arrays(car_id)
            
        if request.method == 'POST':
            for instance in db_instance.query(User).filter(and_(User.user_email == session.get('email'), User.user_type == 'Dealer')):
               
                dealership_id = request.form ['dealership_id']
                
                car_id=session.get('car_id')
                
                
                
                car= None
                dealership = None 
                for instance in db_instance.query(Car).filter(car_id==Car.car_id):
                        car = instance
                for instance in db_instance.query(Dealership).filter(dealership_id==Dealership.dealership_id):
                        dealership = instance
                
                
                car.dealerships.append(dealership)
                
            db_instance.commit()
            
            return compare_arrays(car_id)
        
        if request.method == 'DELETE':
            for instance in db_instance.query(User).filter(and_(User.user_email == session.get('email'), User.user_type == 'Dealer')):
               
                dealership_id = request.form ['dealership_id']
                
                car_id=session.get('car_id')
                
                
                
                car= None
                dealership = None 
                for instance in db_instance.query(Car).filter(car_id==Car.car_id):
                        car = instance
                for instance in db_instance.query(Dealership).filter(dealership_id==Dealership.dealership_id):
                        dealership = instance
                
                
                car.dealerships.remove(dealership)
            db_instance.commit()
            
            return compare_arrays(car_id)
            
        
        
    else: 
        error = 'Session Expired!'
        return render_template ("login.html", error = error)
















 



@app.route('/scripts/<path:filename>', methods = ['GET', 'POST'])
def return_files_tut(filename):
    try:
        print (filename)
        return send_file('templates/'+filename, attachment_filename=filename)
    except Exception as e:
        return str(e)
    
@app.route('/styles/<path:filename>', methods = ['GET', 'POST'])
def return_files_tut2(filename):
    try:
        print (filename)
        return send_file('css/'+filename, attachment_filename=filename)
    except Exception as e:
        return str(e)
    
    
@app.route('/images/<path:filename>', methods = ['GET', 'POST'])
def return_files_tut3(filename):
    try:
        print (filename)
        return send_file('images/'+filename, attachment_filename=filename)
    except Exception as e:
        return str(e)

def fibonacci(n):
    if n <= 2:
    return 1
    return fibonacci(n - 1) + fibonacci(n - 2)

@app.route('/computefibonacci')
def httpfibonacci():
    try:
        n = int(request.args['n'])
    except:
        return 'Wrong arugments', 404
    return 'Fibonacci(' + str(n) + ') = ' + str(fibonacci(n))

 
if __name__=="__main__":
    application.debug = True
    application.run(host= "0.0.0.0")
    

