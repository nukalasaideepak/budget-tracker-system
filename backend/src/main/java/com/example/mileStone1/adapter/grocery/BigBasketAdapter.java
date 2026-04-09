package com.example.mileStone1.adapter.grocery;

import com.example.mileStone1.adapter.ProviderAdapter;
import com.example.mileStone1.model.PriceResult;
import com.example.mileStone1.model.SearchRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Random;

@Component
public class BigBasketAdapter implements ProviderAdapter {

    private final Random random = new Random();

    @Override
    public List<PriceResult> fetchPrice(SearchRequest request) {
        PriceResult result = new PriceResult();
        int geoHash = getGeoHashModifier(request);

        result.setProviderName("BigBasket");
        result.setDomainName("Grocery");
        result.setPrice(45 + random.nextInt(30) + (geoHash * 6));
        result.setCurrency("INR");
        result.setEta((30 + geoHash * 10) + " mins");
        result.setRating(4.4);
        result.setLogoUrl("https://logo.clearbit.com/bigbasket.com");
        result.setBaseUrl("https://www.bigbasket.com");
        result.setTagline("India's largest online grocery store");
        result.setMetadata(Map.of(
            "deliveryFee", geoHash > 2 ? "₹" + (25 + geoHash * 10) : "FREE",
            "deliveryTime", (30 + geoHash * 10) + " mins",
            "geoZone", request.getFromLat() != null ? "Active Node Zone" : "Standard Zone"
        ));
        return List.of(result);
    }

    @Override
    public String getProviderName() { return "BigBasket"; }

    @Override
    public String getDomainName() { return "Grocery"; }

    private int getGeoHashModifier(SearchRequest request) {
        if (request.getFromLat() != null && request.getFromLng() != null) {
            int hash = Math.abs(String.format("%.3f,%.3f", request.getFromLat(), request.getFromLng()).hashCode());
            return (hash % 5); // 0 to 4
        }
        return random.nextInt(5);
    }
}
