package com.example.mileStone1.adapter.transport;

import com.example.mileStone1.adapter.ProviderAdapter;
import com.example.mileStone1.model.PriceResult;
import com.example.mileStone1.model.SearchRequest;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

@Component
public class RapidoAdapter implements ProviderAdapter {

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

        double baseFare = 20.0;
        double perKmRate = 6.0;
        double surgeMultiplier = 1.0;
        double calculatedPrice = (baseFare + (distance * perKmRate)) * surgeMultiplier;

        result.setPrice(Math.round(calculatedPrice * 100.0) / 100.0);
        result.setEta(randomInt(2, 8) + " mins");
        result.setRating(4.1);
        result.setLogoUrl("https://logo.clearbit.com/rapido.bike");
        result.setBaseUrl("https://www.rapido.bike");
        result.setTagline("Bike taxi, auto & more");
        result.setMetadata(Map.of(
            "rideType", "Rapido Bike",
            "surge", "None",
            "distance", String.format("%.1f km", distance)
        ));
        return result;
    }

    @Override
    public String getProviderName() { return "Rapido"; }

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
