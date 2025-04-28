
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    StockViewSet, MarketIndexViewSet, PortfolioViewSet,
    OrderViewSet, WatchlistViewSet, UserProfileViewSet
)

router = DefaultRouter()
router.register(r'stocks', StockViewSet)
router.register(r'indices', MarketIndexViewSet)
router.register(r'portfolio', PortfolioViewSet, basename='portfolio')
router.register(r'orders', OrderViewSet, basename='orders')
router.register(r'watchlists', WatchlistViewSet, basename='watchlists')
router.register(r'profile', UserProfileViewSet, basename='profile')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('rest_framework.urls')),
]
