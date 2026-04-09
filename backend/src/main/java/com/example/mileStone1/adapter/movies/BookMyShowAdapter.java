package com.example.mileStone1.adapter.movies;

import com.example.mileStone1.adapter.ProviderAdapter;
import com.example.mileStone1.model.PriceResult;
import com.example.mileStone1.model.SearchRequest;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

@Component
public class BookMyShowAdapter implements ProviderAdapter {

    private final List<String> ACTIVE_MOVIES = List.of(
        "Bhooth Bangla", "The Super Mario Galaxy Movie", "MaatruBhumi", "Dacoit: A Love Story", "Michael"
    );

    @Override
    public List<PriceResult> fetchPrice(SearchRequest request) {
        String query = request.getQuery() != null ? request.getQuery().trim() : "Default";
        
        // Strict Validation for April 2026
        boolean isActive = ACTIVE_MOVIES.stream()
                .anyMatch(m -> m.equalsIgnoreCase(query));
        
        if (!isActive && !query.equals("Default")) {
            return List.of(); // Correctly return empty if movie is not currently showing
        }

        List<PriceResult> results = new ArrayList<>();
        String[] theaters = {"PVR Cinemas", "INOX Leisure", "Cinepolis", "Miraj Cinemas", "Carnival Cinemas"};
        
        for (String theater : theaters) {
            PriceResult result = new PriceResult();
            result.setProviderName(getProviderName());
            result.setDomainName(getDomainName());
            
            // Base ticket price logic based on hash of movie + theater
            double basePrice = 180.0;
            int hash = Math.abs((query + theater).trim().toLowerCase().hashCode());
            basePrice = 150.0 + (hash % 200) + ((hash % 10) / 10.0);
            
            double convenienceFee = 32.0 + (hash % 15);
            double calculatedPrice = basePrice + convenienceFee;

            result.setPrice(Math.round(calculatedPrice * 100.0) / 100.0);
            result.setEta("Instant Delivery");
            result.setRating(4.0 + (hash % 10) / 10.0);
            result.setLogoUrl("https://logo.clearbit.com/bookmyshow.com");
            result.setBaseUrl("https://in.bookmyshow.com");
            result.setTagline(theater); // Show theater name as tagline
            
            Map<String, String> metadata = new HashMap<>();
            metadata.put("theater", theater);
            metadata.put("ticketFare", "₹" + Math.round(basePrice));
            metadata.put("convenienceFee", "₹" + Math.round(convenienceFee));
            
            // Add venue distance
            if (request.getFromLat() != null) {
                double distanceMod = (hash % 10) / 2.0; // 0.0 to 4.5
                double simulatedDistance = 0.5 + (getGeoHashModifier(request) * 1.2) + distanceMod;
                metadata.put("venueDistance", String.format("%.1f km near you", simulatedDistance));
            }
            
            // Emulate voucher discount logic
            if ((hash % 10) > 4) { 
                metadata.put("voucherCode", "BMS" + (20 + (hash % 10)));
                metadata.put("voucherDiscount", (10 + (hash % 20)) + "% OFF Online");
            }
            
            result.setMetadata(metadata);
            results.add(result);
        }
        
        return results;
    }

    @Override
    public String getProviderName() { return "BookMyShow"; }

    @Override
    public String getDomainName() { return "Cinemas"; }

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
