package com.example.mileStone1.adapter.transport;

import com.example.mileStone1.adapter.ProviderAdapter;
import com.example.mileStone1.model.PriceResult;
import com.example.mileStone1.model.SearchRequest;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

@Component
public class OlaAdapter implements ProviderAdapter {

    @Override
    public PriceResult fetchPrice(SearchRequest request) {
        PriceResult result = new PriceResult();
        result.setProviderName(getProviderName());
        result.setDomainName(getDomainName());
        double distance = 5.0;
        double havDist = calculateHaversineDistance(request.getFromLat(), request.getFromLng(), request.getToLat(), request.getToLng());
        if (havDist > 0) {
            distance = havDist;
        } else if (request.getFrom() != null && request.getTo() != null && !request.getFrom().isBlank()) {
            int hash = Math.abs((request.getFrom().trim() + request.getTo().trim()).toLowerCase().hashCode());
            distance = 3.0 + (hash % 20) + ((hash % 10) / 10.0);
        }

        double baseFare = 40.0;
        double perKmRate = 11.0;
        double surgeMultiplier = randomInt(1, 4) > 2 ? 1.3 : 1.0;
        double calculatedPrice = (baseFare + (distance * perKmRate)) * surgeMultiplier;

        result.setPrice(Math.round(calculatedPrice * 100.0) / 100.0);
        result.setEta(randomInt(3, 10) + " mins");
        result.setRating(4.3);
        result.setLogoUrl("https://logo.clearbit.com/olacabs.com");
        result.setBaseUrl("https://www.olacabs.com");
        result.setTagline("Chalo, niklo!");
        result.setMetadata(Map.of(
            "rideType", "Ola Mini",
            "surge", surgeMultiplier > 1.0 ? "1.3x" : "None",
            "distance", String.format("%.1f km", distance)
        ));
        return result;
    }

    @Override
    public String getProviderName() { return "Ola"; }

    @Override
    public String getDomainName() { return "Transportation"; }

    private int randomInt(int min, int max) {
        return ThreadLocalRandom.current().nextInt(min, max + 1);
    }

    private double calculateHaversineDistance(Double lat1, Double lon1, Double lat2, Double lon2) {
        if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return -1;
        final int R = 6371;
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
