package com.example.mileStone1.adapter.travel;

import com.example.mileStone1.adapter.ProviderAdapter;
import com.example.mileStone1.model.PriceResult;
import com.example.mileStone1.model.SearchRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

@Component
public class GoibiboAdapter implements ProviderAdapter {

    @Override
    public List<PriceResult> fetchPrice(SearchRequest request) {
        PriceResult result = new PriceResult();
        result.setProviderName(getProviderName());
        result.setDomainName(getDomainName());
        int geoHash = getGeoHashModifier(request);

        result.setPrice(randomPrice(2200, 14000) + (geoHash * 110));
        result.setEta(randomInt(1, 4) + "h " + randomInt(10, 55) + "m");
        result.setRating(4.2);
        result.setLogoUrl("https://logo.clearbit.com/goibibo.com");
        result.setBaseUrl("https://www.goibibo.com");
        result.setTagline("Smart way to travel");

        Map<String, String> metadata = new java.util.HashMap<>();
        metadata.put("class", "Economy");
        metadata.put("stops", randomInt(0, 2) == 0 ? "Non-stop" : randomInt(1, 2) + " stop(s)");
        metadata.put("airline", randomAirline());
        
        if (request.getFromLat() != null) {
            metadata.put("originZone", "Prices synced with your GPS territory");
        }
        
        result.setMetadata(metadata);
        return List.of(result);
    }

    @Override
    public String getProviderName() { return "Goibibo"; }

    @Override
    public String getDomainName() { return "Travel"; }

    private String randomAirline() {
        String[] airlines = {"IndiGo", "Air India", "SpiceJet", "Vistara", "AirAsia"};
        return airlines[ThreadLocalRandom.current().nextInt(airlines.length)];
    }

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
