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
public class RedBusAdapter implements ProviderAdapter {

    @Override
    public List<PriceResult> fetchPrice(SearchRequest request) {
        List<PriceResult> results = new ArrayList<>();
        int hash = Math.abs((request.getFrom() + " " + request.getTo()).hashCode());
        
        // Return 3 bus types/options
        String[] busTypes = {"AC Sleeper", "Non-AC Seater", "Volvo Multi-Axle"};
        
        for (String type : busTypes) {
            PriceResult result = new PriceResult();
            result.setProviderName(getProviderName());
            result.setDomainName(getDomainName());
            
            double basePrice = 450.0 + (hash % 800) + (type.contains("AC") ? 300 : 0);
            result.setPrice(Math.round(basePrice * 100.0) / 100.0);
            
            result.setRating(4.0 + (hash % 10) / 10.0);
            result.setEta("Starts at " + ((8 + (hash % 12)) % 24) + ":30 PM");
            result.setLogoUrl("https://logo.clearbit.com/redbus.in");
            result.setBaseUrl("https://www.redbus.in");
            result.setTagline(type);
            
            Map<String, String> metadata = new HashMap<>();
            metadata.put("busType", type);
            metadata.put("seatsLeft", String.valueOf(randomInt(5, 35)));
            metadata.put("boardingPoint", request.getFrom() != null ? request.getFrom().split(",")[0] : "Main Office");
            metadata.put("droppingPoint", request.getTo() != null ? request.getTo().split(",")[0] : "Central Stand");
            
            if (hash % 5 > 2) {
                metadata.put("voucherCode", "RB" + (10 + (hash % 20)));
                metadata.put("voucherDiscount", (50 + (hash % 100)) + " Cashback");
            }
            
            result.setMetadata(metadata);
            results.add(result);
        }
        
        return results;
    }

    @Override
    public String getProviderName() { return "RedBus"; }

    @Override
    public String getDomainName() { return "Bus Tickets"; }

    private int randomInt(int min, int max) {
        return ThreadLocalRandom.current().nextInt(min, max + 1);
    }
}
