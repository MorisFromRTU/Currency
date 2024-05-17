from django.db import models

class React(models.Model):
    employee = models.CharField(max_length=30)
    department = models.CharField(max_length=200)

class Currency(models.Model):
    code = models.CharField(max_length=3, unique=True)
    name = models.CharField(max_length=100)

    def __str__(self):
         return f"{self.code} - {self.name}"
    
class CurrencyRate(models.Model):
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)

    def __str__(self):
         return f"{self.code} - {self.name}"
    
class ExchangeRate(models.Model):
    currency = models.ForeignKey(CurrencyRate, on_delete=models.CASCADE)
    date = models.DateField()
    amount = models.IntegerField()
    rate = models.DecimalField(max_digits=10, decimal_places=4)

    def __str__(self):
        return f"{self.currency} - {self.date}: {self.rate}"

