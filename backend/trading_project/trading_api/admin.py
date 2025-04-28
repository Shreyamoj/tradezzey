
from django.contrib import admin
from .models import Stock, MarketIndex, HistoricalData, Portfolio, Holding, Order, Watchlist, UserProfile

@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = ['symbol', 'name', 'current_price', 'previous_close', 'last_updated']
    search_fields = ['symbol', 'name']

@admin.register(MarketIndex)
class MarketIndexAdmin(admin.ModelAdmin):
    list_display = ['name', 'value', 'change', 'percent_change', 'last_updated']

@admin.register(HistoricalData)
class HistoricalDataAdmin(admin.ModelAdmin):
    list_display = ['stock', 'date', 'open_price', 'high_price', 'low_price', 'close_price']
    list_filter = ['stock', 'date']

@admin.register(Portfolio)
class PortfolioAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_at', 'last_modified']

@admin.register(Holding)
class HoldingAdmin(admin.ModelAdmin):
    list_display = ['portfolio', 'stock', 'quantity', 'average_price']
    list_filter = ['portfolio__user', 'stock']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['portfolio', 'stock', 'order_type', 'quantity', 'price', 'status', 'timestamp']
    list_filter = ['portfolio__user', 'order_type', 'status']

@admin.register(Watchlist)
class WatchlistAdmin(admin.ModelAdmin):
    list_display = ['user', 'name', 'created_at']
    filter_horizontal = ['stocks']

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'initial_capital', 'risk_profile']
