import pyodbc
import time
import requests
import json



#GET INTERNET
proxies = {''}
user = 'Cat_feeder'
url = '' + user


def insert_in_data_base(database, table, sinal = 0):

    server = ''
    cnxn = pyodbc.connect('DRIVER={SQL Server};SERVER='+server+';DATABASE='+database+';Trusted_Connection=yes')
    cursor = cnxn.cursor()
    cursor.execute(f"INSERT "+ table +" (padrao) VALUES (0)")
    cursor.commit()
    print("Inserido com sucesso!")



       
while True:
    
    complement = "/updated/updated"
    data_json = requests.get(url+complement+".json",proxies=proxies).content
    is_button_pressed = json.loads(data_json)

    if(is_button_pressed):
        insert_in_data_base('catFeeder','historic_feeder')
        time.sleep(20)
        