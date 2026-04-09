package com.example.mileStone1.adapter.food;

import com.example.mileStone1.adapter.ProviderAdapter;
import com.example.mileStone1.model.PriceResult;
import com.example.mileStone1.model.SearchRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

@Component
public class SwiggyAdapter implements ProviderAdapter {

    @Override
    public List<PriceResult> fetchPrice(SearchRequest request) {
        PriceResult result = new PriceResult();
        result.setProviderName(getProviderName());
        result.setDomainName(getDomainName());
        int geoHash = getGeoHashModifier(request);
        
        result.setPrice(randomPrice(150, 600) + (geoHash * 10));
        result.setEta((20 + geoHash * 5) + " mins");
        result.setRating(4.4);
        result.setLogoUrl("https://logo.clearbit.com/swiggy.com");
        result.setBaseUrl("https://www.swiggy.com");
        result.setTagline("What's on your mind?");
        result.setMetadata(Map.of(
            "deliveryFee", "₹" + (15 + geoHash * 8),
            "discount", randomInt(1, 5) > 3 ? "20% OFF up to ₹100" : "Free Delivery",
            "restaurant", request.getQuery() != null ? request.getQuery() : "Popular Restaurant"
        ));
        return List.of(result);
    }

    @Override
    public String getProviderName() { return "Swiggy"; }

    @Override
    public String getDomainName() { return "Food Delivery"; }

    private double randomPrice(double min, double max) {
        return Math.round(ThreadLocalRandom.current().nextDouble(min, max) * 100.0) / 100.0;
    }

    private int randomInt(int min, int max) {
        return ThreadLocalRandom.current().nextInt(min, max + 1);
    }

    private int getGeoHashModifier(SearchRequest request) {
        if (request.getFromLat() != null && request.getFromLng() != null) {
            int hash = Math.abs(String.format("%.3f,%.3f", request.getFromLat(), request.getFromLng()).hashCode());
            return (hash % 5); // 0 to 4
        }
        return randomInt(0, 4);
    }
}
