"""from sqlalchemy import Column, Integer, String, Float"""
from sqlalchemy.orm import relationship
from sqlalchemy import *
from database import Base
"""from sqlalchemy.sql.schema import ForeignKey"""

"""
class Car_Dealership (Base):
    __tablename__ = 'association'
    
    dealer_id = Column (Integer, ForeignKey('dealership.id'))
    car_id = Column (Integer, ForeignKey('car.id'))
    
        def __init__ (self, dealer_id = None, car_id = None):
        self.dealer_id = dealer_id
        self.car_id = car_id
"""

Car_Dealership = Table('association', Base.metadata,
    Column('dealership_id', Integer, ForeignKey('dealership.dealership_id', ondelete='CASCADE')),
    Column('car_id', Integer, ForeignKey('car.car_id', ondelete='CASCADE'))
)



class User (Base):
    __tablename__ = 'user'
    
    user_id          = Column (Integer, primary_key = True)
    user_name        = Column (String   (200))
    user_email       = Column (String   (200), unique = True, nullable = False)
    user_password    = Column (String   (200), nullable = False)
    user_district    = Column (String   (200), nullable = False)
    user_type   = Column (String   (200), nullable = False)
    user_cars = relationship("Car")
    user_dealerships = relationship("Dealership")
    
    def __init__ (self, user_name = None, user_email = None, user_password = None, user_district = None, user_type = None):
        self.user_name= user_name
        self.user_email = user_email
        self.user_password = user_password
        self.user_district = user_district
        self.user_type = user_type
        
    def __repr__(self):
        return "{\"user_id\" : \"%s\", \"user_name\" : \"%s\", \"user_email\" : \"%s\", \"user_district\" : \"%s\", \"user_type\" : \"%s\"}" %(self.user_id,
                                                                                                  self.user_name,
                                                                                                  self.user_email,
                                                                                                  self.user_district,
                                                                                                  self.user_type)
        
"""
class Car_Dealership (Base):
    __tablename__ = "car_dealership"
    
    
    dealer_id   = Column ( Integer, ForeignKey ("dealership.dealership_id"), primary_key = True)
    car_id      = Column ( Integer, ForeignKey ("car.car_id"), primary_key = True)
"""    

class Car (Base):
    __tablename__ = 'car'
    
    car_id       = Column ( Integer, primary_key = True)
    car_picture     = Column ( String (200))
    car_brand       = Column ( String (200), nullable = False)
    car_model       = Column ( String (200), nullable = False)
    car_price       = Column ( Float, nullable = False)
    car_district    = Column ( String (200))
    car_kilometer   = Column ( Integer)
    car_year        = Column ( Integer)
    car_fuel_type   = Column ( String (200), nullable = False)
    user_id     = Column ( Integer, ForeignKey ("user.user_id", ondelete='CASCADE'))
    dealerships = relationship('Dealership', secondary= Car_Dealership)
    
    
    #user = relationship ("user", back_populates = "Car")
    
    def __init__ (self, car_picture = None, car_brand = None, car_model = None,
                  car_price = None, car_district = None, car_kilometer = None, car_year = None,
                  car_fuel_type = None):
        self.car_picture = car_picture
        self.car_brand = car_brand
        self.car_model = car_model
        self.car_price = car_price
        self.car_district = car_district
        self.car_kilometer = car_kilometer
        self.car_fuel_type = car_fuel_type
        self.car_year = car_year
        
    def __repr__ (self):
        return (" { \"car_id\" : \"%s\" , \"car_picture\" : \"%s\", \"car_brand\" : \"%s\","
                " \"car_model\" : \"%s\" , \"car_price\" : \"%s\" , \"car_district\" : \"%s\","
                " \"car_kilometer\" : \"%s\", \"car_fuel_type\" : \"%s\" , \"car_year\" : \"%s\","
                " \"user_id\" : \"%s\" }")  %(self.car_id,
                                                                      self.car_picture,
                                                                      self.car_brand,
                                                                      self.car_model,
                                                                      self.car_price,
                                                                      self.car_district,
                                                                      self.car_kilometer,
                                                                      self.car_fuel_type,
                                                                      self.car_year,
                                                                      self.user_id)
        
        
class Dealership(Base):
    
    __tablename__ = "dealership"
    dealership_id        = Column ( Integer, primary_key = True)
    user_id             = Column ( Integer, ForeignKey ("user.user_id", ondelete='CASCADE'))
    dealership_name     = Column ( String (200), nullable = False)
    dealership_email               = Column ( String (200))
    dealership_url                 = Column ( String (200))
    dealership_phone               = Column ( String (200))
    dealership_picture = Column ( String (200))
    dealership_district = Column (String (200))
    dealership_cars = relationship('Car', secondary= Car_Dealership)

    
    def __init__ (self, dealership_name = None, dealership_email = None , dealership_url = None, dealership_phone= None, dealership_picture = None, dealership_district = None):
        self.dealership_name = dealership_name
        self.dealership_email = dealership_email
        self.dealership_url = dealership_url
        self.dealership_phone = dealership_phone
        self.dealership_picture =dealership_picture
        self.dealership_district = dealership_district
        
    def __repr__(self):
        return ("{\"dealership_id\" : \"%s\",\"user_id\" : \"%s\",\"dealership_name\" : \"%s\","
                " \"dealership_email\" : \"%s\", \"dealership_url\" : \"%s\" , \"dealership_phone\" : \"%s\","
                "\"dealership_picture\": \"%s\", \"dealership_district\" : \"%s\" }") %(   self.dealership_id,
                                              self.user_id,
                                              self.dealership_name,
                                              self.dealership_email,
                                              self.dealership_url,
                                              self.dealership_phone,
                                              self.dealership_picture,
                                              self.dealership_district)
    
 
    
