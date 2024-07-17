from machine import Pin, PWM, ADC
import time
from utime import localtime
import network
import urequests
import ujson
import distance_sensor


#Credenciais do WIFI
nome = ''
senha = ''

# Endereço do firebase
FIREBASE_URL = ''
SECRET_KEY = ''

headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + SECRET_KEY
}
url = FIREBASE_URL + "/Cat_feeder"


#--------------INTERNET
def conectarWifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        print("Conectando no WiFi...")
        wlan.connect(nome, senha)
        while not wlan.isconnected():
            pass
    print("Wifi conectado... IP: {}".format(wlan.ifconfig()[0]))

def enviarFire(data, complement = ''):
    response = urequests.put(url + complement + '.json', data=ujson.dumps(data), headers=headers)
    print("Firebase Response:", response.text)
    response.close()
    
    
def getData():
    response = urequests.get(url + '.json', headers=headers)

    if response.status_code == 200:
        data = ujson.loads(response.text)
        print("Firebase Response:", data)
    else:
        print("Failed to retrieve data. Status code:", response.status_code)
    
    response.close()
    return data



def filter_data(data, max_angle, min_angle):
    if data > max_angle or data < min_angle:
        return 0
    return data


def get_fire_data(data, filter_1, filter_2):
    return data[filter_1][filter_2]

 
p23 = Pin(25, Pin.OUT)
pwm = PWM(p23)
pwm.freq(50)

distance_sensor = distance_sensor.HCSR04(trigger_pin= 32, echo_pin=33, echo_timeout_us=1000000)

total_angle = 115
min_distance = 0
max_distance = 17.5
                                                   

conectarWifi()
while True:
    day = str(localtime()[6])
    hour = [localtime()[3], localtime()[4]]
       
    firebase_data = getData()
    
    is_button_pressed = get_fire_data(firebase_data, 'updated', 'updated')
    programmed_days = get_fire_data(firebase_data, 'programmed', 'days')
    hour_and_minute = get_fire_data(firebase_data, 'programmed', 'hour').split(":")
    
    
    programmed_hour = int(hour_and_minute[0])
    programmed_minute = int(hour_and_minute[1])    
    
    print(distance_sensor.distance_cm())
    
    
    if (day in programmed_days and hour[0] == programmed_hour and hour[1] == programmed_minute) or is_button_pressed:
        
        print(is_button_pressed)
        for cont in range(3):
            
            for i  in range (0, total_angle+1, 1):
                pwm.duty(i)
                time.sleep(0.01)
                
            time.sleep(2)
            
            for i  in range (total_angle, -1, -1):
                pwm.duty(i)
                time.sleep(0.01)
        

        checked = filter_data(distance_sensor.distance_cm(), max_distance, min_distance)

        while not checked:
            print(checked)
            checked = filter_data(distance_sensor.distance_cm(), max_distance, min_distance)
        
        
        quantity = int(100 - ((checked/max_distance) * 100))
        is_button_pressed = 0 
        
        data = {'quantity': quantity, 'updated': is_button_pressed}
        
        enviarFire(data, '/updated')
        