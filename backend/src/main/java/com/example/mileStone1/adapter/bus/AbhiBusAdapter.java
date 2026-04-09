package com.example.mileStone1.adapter.bus;

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
public class AbhiBusAdapter implements ProviderAdapter {

    @Override
    public List<PriceResult> fetchPrice(SearchRequest request) {
        List<PriceResult> results = new ArrayList<>();
        int hash = Math.abs((request.getFrom() + " " + request.getTo()).hashCode() + 99);
        
        String[] busTypes = {"Super Luxury AC", "Ordinary Seater", "Sleeper Class"};
        
        for (String type : busTypes) {
            PriceResult result = new PriceResult();
            result.setProviderName(getProviderName());
            result.setDomainName(getDomainName());
            
            double basePrice = 420.0 + (hash % 700) + (type.contains("Luxury") ? 400 : 0);
            result.setPrice(Math.round(basePrice * 100.0) / 100.0);
            
            result.setRating(3.8 + (hash % 12) / 10.0);
            result.setEta("Departure: " + ((7 + (hash % 11)) % 24) + ":15 PM");
            result.setLogoUrl("https://logo.clearbit.com/abhibus.com");
            result.setBaseUrl("https://www.abhibus.com");
            result.setTagline(type);
            
            Map<String, String> metadata = new HashMap<>();
            metadata.put("busType", type);
            metadata.put("seatsLeft", String.valueOf(randomInt(2, 28)));
            metadata.put("boardingPoint", request.getFrom() != null ? request.getFrom().split(",")[0] : "AbhiBus Point");
            metadata.put("droppingPoint", request.getTo() != null ? request.getTo().split(",")[0] : "Main Terminus");
            
            if (hash % 4 > 2) {
                metadata.put("voucherCode", "ABHI" + (5 + (hash % 15)));
                metadata.put("voucherDiscount", "₹" + (100 + (hash % 200)) + " OFF");
            }
            
            result.setMetadata(metadata);
            results.add(result);
        }
        
        return results;
    }

    @Override
    public String getProviderName() { return "AbhiBus"; }

    @Override
    public String getDomainName() { return "Bus Tickets"; }

    private int randomInt(int min, int max) {
        return ThreadLocalRandom.current().nextInt(min, max + 1);
    }
}
