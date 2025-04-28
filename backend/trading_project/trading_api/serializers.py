
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Stock, MarketIndex, HistoricalData, Portfolio, Holding, Order, Watchlist, UserProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = '__all__'

class MarketIndexSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketIndex
        fields = '__all__'

class HistoricalDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoricalData
        fields = '__all__'

class HoldingSerializer(serializers.ModelSerializer):
    symbol = serializers.CharField(source='stock.symbol', read_only=True)
    name = serializers.CharField(source='stock.name', read_only=True)
    current_price = serializers.DecimalField(source='stock.current_price', max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = Holding
        fields = ['id', 'symbol', 'name', 'quantity', 'average_price', 'current_price']

class PortfolioSerializer(serializers.ModelSerializer):
    holdings = HoldingSerializer(many=True, read_only=True)
    total_value = serializers.SerializerMethodField()
    
    class Meta:
        model = Portfolio
        fields = ['id', 'user', 'holdings', 'total_value', 'created_at', 'last_modified']
        
    def get_total_value(self, obj):
        total = 0
        for holding in obj.holdings.all():
            total += holding.quantity * holding.stock.current_price
        return total

class OrderSerializer(serializers.ModelSerializer):
    symbol = serializers.CharField(source='stock.symbol', read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'symbol', 'order_type', 'quantity', 'price', 'status', 
                  'timestamp', 'executed_at', 'stoploss', 'target']
        
class OrderCreateSerializer(serializers.ModelSerializer):
    symbol = serializers.CharField(write_only=True)
    
    class Meta:
        model = Order
        fields = ['symbol', 'order_type', 'quantity', 'price', 'stoploss', 'target']
        
    def create(self, validated_data):
        symbol = validated_data.pop('symbol')
        try:
            stock = Stock.objects.get(symbol=symbol)
        except Stock.DoesNotExist:
            raise serializers.ValidationError({"symbol": f"Stock with symbol {symbol} does not exist"})
        
        user = self.context['request'].user
        portfolio, created = Portfolio.objects.get_or_create(user=user)
        
        order = Order.objects.create(
            portfolio=portfolio,
            stock=stock,
            **validated_data
        )
        return order

class WatchlistSerializer(serializers.ModelSerializer):
    stocks = StockSerializer(many=True, read_only=True)
    stock_symbols = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Watchlist
        fields = ['id', 'name', 'stocks', 'stock_symbols', 'created_at']
        
    def create(self, validated_data):
        symbols = validated_data.pop('stock_symbols', [])
        watchlist = Watchlist.objects.create(
            user=self.context['request'].user,
            **validated_data
        )
        
        for symbol in symbols:
            try:
                stock = Stock.objects.get(symbol=symbol)
                watchlist.stocks.add(stock)
            except Stock.DoesNotExist:
                pass
                
        return watchlist
        
    def update(self, instance, validated_data):
        symbols = validated_data.pop('stock_symbols', None)
        instance.name = validated_data.get('name', instance.name)
        instance.save()
        
        if symbols is not None:
            # Clear existing stocks and add new ones
            instance.stocks.clear()
            for symbol in symbols:
                try:
                    stock = Stock.objects.get(symbol=symbol)
                    instance.stocks.add(stock)
                except Stock.DoesNotExist:
                    pass
                    
        return instance

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'email', 'initial_capital', 'risk_profile']
