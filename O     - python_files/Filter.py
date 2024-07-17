import json
import requests
import pyodbc
import time

user = "Cat_feeder"
url = '' 
       
secrets = ""
proxies = {''}

headers = {
    "Content-Type": "application/json",
}




def getSQL(filter_request, database, table):
    server = ''
    cnxn = pyodbc.connect('DRIVER={SQL Server};SERVER='+server+';DATABASE='+database+';Trusted_Connection=yes')
    cursor = cnxn.cursor()
    
    if filter_request == "":
        cursor.execute("SELECT * FROM " + table)
    else:
        cursor.execute("SELECT * FROM " + table + " WHERE MONTH(timestamp) = " + filter_request)
        
    table_mtrz = cursor.fetchall() 
    
    return table_mtrz




while True:

    days_values = [0]
    days = [_ for _ in range(1,31)]


    complement = "/filter/filter"
    json_data = requests.get(url + user + complement + ".json",proxies=proxies).content
    filter_request = json.loads(json_data)

    filtred_data = getSQL(filter_request,"catFeeder","historic_feeder") 
    
    
    print(len(filtred_data))
    

    if len(filtred_data):
        if filter_request == "":
            days_values = [0 for _ in range(32)]
            days = [_ for _ in range(1,32)]
        else:
            lastDayData = filtred_data[-1][1].day
            days_values = [0 for _ in range(lastDayData)]
            days = [_ for _ in range(1,lastDayData+1)]
        
        
        for i in range (len(filtred_data)):
            current_day = filtred_data[i][1].day - 1
            days_values[current_day]+=1

        
        
        
    data = {
        'day_data': days_values,
        'month_days' : days
    }

    body = json.dumps(data)

    print(body)

    complement = "/filter/days"
    req = requests.patch(f"{url}{user}{complement}.json?auth={secrets}", data=body, proxies=proxies, headers=headers)
    



    

