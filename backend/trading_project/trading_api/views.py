
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import F, Sum, Value, DecimalField
from django.db.models.functions import Coalesce

from .models import Stock, MarketIndex, HistoricalData, Portfolio, Holding, Order, Watchlist, UserProfile
from .serializers import (
    StockSerializer, MarketIndexSerializer, HistoricalDataSerializer,
    PortfolioSerializer, HoldingSerializer, OrderSerializer, OrderCreateSerializer,
    WatchlistSerializer, UserProfileSerializer, UserSerializer
)

class StockViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def top_gainers(self, request):
        gainers = Stock.objects.filter(previous_close__gt=0).order_by('-current_price')[:10]
        serializer = self.get_serializer(gainers, many=True)
        return Response(serializer.data)
        
    @action(detail=False, methods=['get'])
    def top_losers(self, request):
        losers = Stock.objects.filter(previous_close__gt=0).order_by('current_price')[:10]
        serializer = self.get_serializer(losers, many=True)
        return Response(serializer.data)
        
    @action(detail=True, methods=['get'])
    def historical_data(self, request, pk=None):
        stock = self.get_object()
        timeframe = request.query_params.get('timeframe', '1D')
        
        # Logic to filter historical data based on timeframe
        if timeframe == '1D':
            # Get today's data at 5-minute intervals
            data = HistoricalData.objects.filter(stock=stock).order_by('-date')[:24]
        elif timeframe == '1W':
            # Get last week's data
            data = HistoricalData.objects.filter(stock=stock).order_by('-date')[:7]
        else:
            # Default to 1 month
            data = HistoricalData.objects.filter(stock=stock).order_by('-date')[:30]
            
        serializer = HistoricalDataSerializer(data, many=True)
        return Response(serializer.data)

class MarketIndexViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MarketIndex.objects.all()
    serializer_class = MarketIndexSerializer
    permission_classes = [permissions.IsAuthenticated]

class PortfolioViewSet(viewsets.ModelViewSet):
    serializer_class = PortfolioSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Portfolio.objects.filter(user=self.request.user)
    
    @action(detail=True, methods=['get'])
    def summary(self, request, pk=None):
        portfolio = self.get_object()
        holdings = portfolio.holdings.all()
        
        total_value = 0
        total_investment = 0
        day_change = 0
        
        for holding in holdings:
            current_value = holding.quantity * holding.stock.current_price
            investment = holding.quantity * holding.average_price
            day_change += (holding.stock.current_price - holding.stock.previous_close) * holding.quantity
            
            total_value += current_value
            total_investment += investment
        
        # Calculate percentages
        overall_pnl = total_value - total_investment
        overall_pnl_percent = 0
        if total_investment > 0:
            overall_pnl_percent = (overall_pnl / total_investment) * 100
            
        day_change_percent = 0
        if total_investment > 0:
            day_change_percent = (day_change / total_investment) * 100
        
        # Calculate allocation by sector
        sector_allocation = []
        if total_value > 0:
            sector_data = {}
            for holding in holdings:
                sector = holding.stock.sector or 'Other'
                sector_value = holding.quantity * holding.stock.current_price
                
                if sector in sector_data:
                    sector_data[sector] += sector_value
                else:
                    sector_data[sector] = sector_value
                    
            for sector, value in sector_data.items():
                percentage = (value / total_value) * 100
                sector_allocation.append({
                    'category': sector,
                    'value': round(percentage, 2)
                })
        
        # Serialize holdings for response
        holdings_data = HoldingSerializer(holdings, many=True).data
        
        response_data = {
            'totalValue': total_value,
            'totalInvestment': total_investment,
            'dayChange': day_change,
            'dayChangePercent': day_change_percent,
            'overallPnl': overall_pnl,
            'overallPnlPercent': overall_pnl_percent,
            'allocation': sector_allocation,
            'holdings': holdings_data
        }
        
        return Response(response_data)

class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action in ['create']:
            return OrderCreateSerializer
        return OrderSerializer
    
    def get_queryset(self):
        user = self.request.user
        try:
            portfolio = Portfolio.objects.get(user=user)
            return Order.objects.filter(portfolio=portfolio).order_by('-timestamp')
        except Portfolio.DoesNotExist:
            return Order.objects.none()
            
    def perform_create(self, serializer):
        serializer.save()
        
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        order = self.get_object()
        if order.status == 'PENDING':
            order.status = 'CANCELLED'
            order.save()
            return Response({'status': 'Order cancelled'})
        return Response({'error': 'Only pending orders can be cancelled'}, 
                       status=status.HTTP_400_BAD_REQUEST)

class WatchlistViewSet(viewsets.ModelViewSet):
    serializer_class = WatchlistSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Watchlist.objects.filter(user=self.request.user)
        
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)
        
    @action(detail=False, methods=['get'])
    def current(self, request):
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(profile)
        return Response(serializer.data)
