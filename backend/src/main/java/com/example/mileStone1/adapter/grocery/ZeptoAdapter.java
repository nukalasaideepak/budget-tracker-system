package com.example.mileStone1.adapter.grocery;

import com.example.mileStone1.adapter.ProviderAdapter;
import com.example.mileStone1.model.PriceResult;
import com.example.mileStone1.model.SearchRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Random;

@Component
public class ZeptoAdapter implements ProviderAdapter {

    private final Random random = new Random();

    @Override
    public List<PriceResult> fetchPrice(SearchRequest request) {
        PriceResult result = new PriceResult();
        int geoHash = getGeoHashModifier(request);
        
        result.setProviderName("Zepto");
        result.setDomainName("Grocery");
        result.setPrice(38 + random.nextInt(20) + (geoHash * 3));
        result.setCurrency("INR");
        result.setEta((10 + geoHash * 2) + " mins");
        result.setRating(4.3);
        result.setLogoUrl("https://logo.clearbit.com/zeptonow.com");
        result.setBaseUrl("https://www.zeptonow.com");
        result.setTagline("Grocery delivered in minutes");
        result.setMetadata(Map.of(
            "deliveryFee", geoHash > 1 ? "₹" + (10 + geoHash * 5) : "FREE",
            "deliveryTime", (8 + geoHash * 2) + "–" + (10 + geoHash * 2) + " mins",
            "geoZone", request.getFromLat() != null ? "Active Node Zone" : "Standard Zone"
        ));
        return List.of(result);
    }

    @Override
    public String getProviderName() { return "Zepto"; }

    @Override
    public String getDomainName() { return "Grocery"; }

    private int getGeoHashModifier(SearchRequest request) {
        if (request.getFromLat() != null && request.getFromLng() != null) {
            int hash = Math.abs(String.format("%.3f,%.3f", request.getFromLat(), request.getFromLng()).hashCode());
            return (hash % 4); // 0 to 3
        }
        return random.nextInt(4);
    }
}
