from django.db import models

class React(models.Model):
    employee = models.CharField(max_length=30)
    department = models.CharField(max_length=200)

class Currency(models.Model):
    code = models.CharField(max_length=3, unique=True)
    name = models.CharField(max_length=100)

    def __str__(self):
         return f"{self.code} - {self.name}"
    
class ExchangeRate(models.Model):
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE)
    date = models.DateField()
    rate = models.DecimalField(max_digits=10, decimal_places=4)

    def __str__(self):
        return f"{self.currency} - {self.date}: {self.rate}"

class Country(models.Model):
    code = models.CharField(max_length=3, unique=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class RelativeExchangeRate(models.Model):
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    base_currency = models.ForeignKey(Currency, on_delete=models.CASCADE, related_name='base_currency')
    reference_date = models.DateField()
    relative_rate = models.DecimalField(max_digits=10, decimal_places=4)

    def __str__(self):
        return f"{self.country} - {self.base_currency}: {self.relative_rate}"
