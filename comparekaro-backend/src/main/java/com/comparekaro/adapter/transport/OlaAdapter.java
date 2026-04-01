package com.comparekaro.adapter.transport;

import com.comparekaro.adapter.ProviderAdapter;
import com.comparekaro.model.PriceResult;
import com.comparekaro.model.SearchRequest;
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
        result.setPrice(randomPrice(120, 400));
        result.setEta(randomInt(3, 10) + " mins");
        result.setRating(4.3);
        result.setLogoUrl("https://logo.clearbit.com/olacabs.com");
        result.setBaseUrl("https://www.olacabs.com");
        result.setTagline("Chalo, niklo!");
        result.setMetadata(Map.of(
            "rideType", "Ola Mini",
            "surge", randomInt(1, 4) > 3 ? "1.3x" : "None",
            "distance", randomInt(3, 25) + " km"
        ));
        return result;
    }

    @Override
    public String getProviderName() { return "Ola"; }

    @Override
    public String getDomainName() { return "Transportation"; }

    private double randomPrice(double min, double max) {
        return Math.round(ThreadLocalRandom.current().nextDouble(min, max) * 100.0) / 100.0;
    }

    private int randomInt(int min, int max) {
        return ThreadLocalRandom.current().nextInt(min, max + 1);
    }
}
