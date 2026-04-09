package com.example.mileStone1.adapter.grocery;

import com.example.mileStone1.adapter.ProviderAdapter;
import com.example.mileStone1.model.PriceResult;
import com.example.mileStone1.model.SearchRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Random;

@Component
public class BlinkitAdapter implements ProviderAdapter {

    private final Random random = new Random();

    @Override
    public List<PriceResult> fetchPrice(SearchRequest request) {
        PriceResult result = new PriceResult();
        int geoHash = getGeoHashModifier(request);

        result.setProviderName("Blinkit");
        result.setDomainName("Grocery");
        result.setPrice(40 + random.nextInt(25) + (geoHash * 4));
        result.setCurrency("INR");
        result.setEta((15 + geoHash * 3) + " mins");
        result.setRating(4.2);
        result.setLogoUrl("https://logo.clearbit.com/blinkit.com");
        result.setBaseUrl("https://www.blinkit.com");
        result.setTagline("Everything delivered in minutes");
        result.setMetadata(Map.of(
            "deliveryFee", "₹" + (25 + geoHash * 5),
            "deliveryTime", (10 + geoHash * 3) + "–" + (15 + geoHash * 3) + " mins",
            "geoZone", request.getFromLat() != null ? "Active Node Zone" : "Standard Zone"
        ));
        return List.of(result);
    }

    @Override
    public String getProviderName() { return "Blinkit"; }

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
