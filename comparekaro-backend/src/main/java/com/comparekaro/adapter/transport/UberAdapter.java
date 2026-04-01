package com.comparekaro.adapter.transport;

import com.comparekaro.adapter.ProviderAdapter;
import com.comparekaro.model.PriceResult;
import com.comparekaro.model.SearchRequest;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

@Component
public class UberAdapter implements ProviderAdapter {

    @Override
    public PriceResult fetchPrice(SearchRequest request) {
        PriceResult result = new PriceResult();
        result.setProviderName(getProviderName());
        result.setDomainName(getDomainName());
        result.setPrice(randomPrice(150, 450));
        result.setEta(randomInt(4, 12) + " mins");
        result.setRating(4.5);
        result.setLogoUrl("https://logo.clearbit.com/uber.com");
        result.setBaseUrl("https://www.uber.com");
        result.setTagline("Your ride, on demand");
        result.setMetadata(Map.of(
            "rideType", "UberGo",
            "surge", randomInt(1, 3) > 2 ? "1.2x" : "None",
            "distance", randomInt(3, 25) + " km"
        ));
        return result;
    }

    @Override
    public String getProviderName() { return "Uber"; }

    @Override
    public String getDomainName() { return "Transportation"; }

    private double randomPrice(double min, double max) {
        return Math.round(ThreadLocalRandom.current().nextDouble(min, max) * 100.0) / 100.0;
    }

    private int randomInt(int min, int max) {
        return ThreadLocalRandom.current().nextInt(min, max + 1);
    }
}
