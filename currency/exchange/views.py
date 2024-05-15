from django.views.generic import View
from django.http import HttpResponse, JsonResponse
from rest_framework.views import APIView
from . models import *
from bs4 import BeautifulSoup
from rest_framework.response import Response
from . serializer import *
import json
import requests
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime

class ReactView(APIView):
    def get(self, request):
        output = [{"employee": item.employee,
                   "department": item.department}
            for item in React.objects.all()]
        return Response(output)
    
    def post(self, request):
        serializer = ReactSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return Response(serializer.data)





class GetCurrencies(View):
    def get(self, request):
        url = 'https://www.iban.ru/currency-codes'
        response = requests.get(url)
        
        if response.status_code == 200:
            currencies = dict(Currency.objects.values_list('code', 'name'))

            soup = BeautifulSoup(response.text, 'html.parser')
            rows = soup.find('tbody').find_all('tr')
            for row in rows:
                name = row.find_all('td')[1].text
                code = row.find_all('td')[2].text
                if code and code not in currencies:
                    currencies[code] = name
                    Currency.objects.create(code=code, name=name)
            return JsonResponse(dict(currencies), safe=False)
        else:
            return HttpResponse("Ошибка при получении списка валют.", status=500)
        
@method_decorator(csrf_exempt, name='dispatch')        
class GetCurrenciesCodes(View):
    data = {}  
    def post(self, request):
        body = request.body.decode('utf-8')
        data = json.loads(body)

        start_date = data.get('startDate')
        end_date = data.get('endDate')
        selected_currency = data.get('selectedCurrency')

        start_object = datetime.strptime(start_date, "%Y-%m-%d")
        end_object = datetime.strptime(end_date, "%Y-%m-%d")

        start_year = start_object.year
        start_month = start_object.month
        start_day = start_object.day 

        end_year = end_object.year
        end_month = end_object.month
        end_day = end_object.day 
        url = f'https://www.finmarket.ru/currency/rates/?id=10148&pv=1&cur={selected_currency}&bd={start_day}&bm={start_month}&by={start_year}&ed={end_day}&em={end_month}&ey={end_year}&x=15&y=11#archive'
        response = requests.get(url)
        

        if response.status_code == 200:
            text = response.content.decode('windows-1251')
            soup = BeautifulSoup(text, 'html.parser')
            rows = soup.find('table', class_='karramba').find_all('tr')
            result = []
            for row in rows:
                elements = row.find_all('td')
                temp = []
                for element in elements:
                    temp.append(element.text)
                result.append(temp)
            
            
        return JsonResponse(result[1:], safe=False)

        

    def get(self, request):
        print("get started")
        
        url = 'https://www.finmarket.ru/currency/rates/?id=10148&pv=1&cur=52170&bd=1&bm=2&by=2022&ed=1&'
        response = requests.get(url)
        
        if response.status_code == 200:
            text = response.content.decode('windows-1251')
            soup = BeautifulSoup(text, 'html.parser')
            rows = soup.find('table', class_='fs11').find('tr').find('td').find('select', class_='fs11')

            options = rows.find_all('option')
            

            options_dict = {}

            for option in options:
                value = option['value']
                text = option.text.strip()
                options_dict[value] = text
            return JsonResponse({"data": options_dict})
        else:
            print("Failed to fetch currency rates")
            return JsonResponse({"error": "Failed to fetch currency rates"}, status=500)
    
@method_decorator(csrf_exempt, name='dispatch')        
class GetCurrencyData(View):

    data = {}  
    
    def get(self, request):
        print("i started")
    
            
    
class SynchronizeDataView(View):
    def get(self, request):
        pass
        
    
class CalculateRelativeExchangeRateView(View):
    def get(self, request):
        pass