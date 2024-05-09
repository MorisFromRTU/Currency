from django.views.generic import View
from django.http import HttpResponse, JsonResponse
from rest_framework.views import APIView
from . models import *
from bs4 import BeautifulSoup
from rest_framework.response import Response
from . serializer import *
import requests
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

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
class FetchExchangeRates(View):
    data = {}  
    
    def post(self, request):
        print('starteed')
        start_date = request.POST.get('startDate')
        end_date = request.POST.get('endDate')
        selected_currency = request.POST.get('selectedCurrency')
        
        self.data = {
            'start_date': start_date,
            'end_date': end_date,
            'selected_currency': selected_currency,
        }

        return JsonResponse({'message': 'Data received successfully'})
    
    def get(self, request):
        print("i started")
        start_date = self.data.get('start_date')
        end_date = self.data.get('end_date')
        selected_currency = self.data.get('selected_currency')

        url = 'https://www.finmarket.ru/currency/rates/?id=10148&pv=1&cur=52170&bd=1&bm=2&by=2022&ed=1&'
        response = requests.get(url)
        
        if response.status_code == 200:
            text = response.content.decode('windows-1251')
            soup = BeautifulSoup(text, 'html.parser')
            exchange_rates = {}
            rows = soup.find('table', class_='fs11').find('tr').find('td').find('option', text=selected_currency)
            print(rows)
            return JsonResponse({"rows": rows.text})
        else:
            print("Failed to fetch currency rates")
            return JsonResponse({"error": "Failed to fetch currency rates"}, status=500)
    

    
            
    
class SynchronizeDataView(View):
    def get(self, request):
        pass
        # Ваш код для синхронизации данных в локальной базе данных
        
    
class CalculateRelativeExchangeRateView(View):
    def get(self, request):
        pass
        # Ваш код для расчета относительных изменений курса валют